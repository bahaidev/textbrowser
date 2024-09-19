export const escapePluginComponent = (pluginName) => {
  return pluginName.replaceAll('^', '^^'). // Escape our escape
    replaceAll('-', '^0');
};

export const unescapePluginComponent = (pluginName) => {
  if (!pluginName) {
    return pluginName;
  }
  return pluginName.replaceAll(
    /(\^+)0/g,
    (n0, esc) => {
      return esc.length % 2
        ? esc.slice(1) + '-'
        : n0;
    }
  ).replaceAll('^^', '^');
};

export const escapePlugin = ({pluginName, applicableField, targetLanguage}) => {
  return escapePluginComponent(pluginName) +
        (applicableField ? '-' + escapePluginComponent(applicableField) : '-') +
        (targetLanguage ? '-' + escapePluginComponent(targetLanguage) : '');
};

export class PluginsForWork {
  constructor ({pluginsInWork, pluginFieldMappings, pluginObjects}) {
    this.pluginsInWork = pluginsInWork;
    this.pluginFieldMappings = pluginFieldMappings;
    this.pluginObjects = pluginObjects;
  }
  getPluginObject (pluginName) {
    const idx = this.pluginsInWork.findIndex(([name]) => {
      return name === pluginName;
    });
    const plugin = this.pluginObjects[idx];
    return plugin;
  }
  iterateMappings (cb) {
    this.pluginFieldMappings.forEach(({
      placement,
      /*
            {fieldXYZ: {
                targetLanguage: "en"|["en"], // E.g., translating from Persian to English
                onByDefault: true // Overrides plugin default
            }}
            */
      'applicable-fields': applicableFields
    }, i) => {
      const [pluginName, {
        onByDefault: onByDefaultDefault, lang: pluginLang, meta
      }] = this.pluginsInWork[i];
      const plugin = this.getPluginObject(pluginName);
      cb({
        plugin,
        placement,
        applicableFields,
        pluginName,
        pluginLang,
        onByDefaultDefault,
        meta
      });
    });
  }
  processTargetLanguages (applicableFields, cb) {
    if (!applicableFields) {
      return false;
    }
    Object.entries(applicableFields).forEach(([applicableField, {
      targetLanguage, onByDefault, meta: metaApplicableField
    }]) => {
      if (Array.isArray(targetLanguage)) {
        targetLanguage.forEach((targetLanguage) => {
          cb({applicableField, targetLanguage, onByDefault, metaApplicableField});
        });
      } else {
        cb({applicableField, targetLanguage, onByDefault, metaApplicableField});
      }
    });
    return true;
  }
  isPluginField ({namespace, field}) {
    return field.startsWith(`${namespace}-plugin-`);
  }
  getPluginFieldParts ({namespace, field}) {
    field = field.replace(`${namespace}-plugin-`, '');
    let pluginName, applicableField, targetLanguage;
    if (field.includes('-')) {
      ([pluginName, applicableField, targetLanguage] = field.split('-'));
    } else {
      pluginName = field;
    }
    return [pluginName, applicableField, targetLanguage].map(unescapePluginComponent);
  }
}
