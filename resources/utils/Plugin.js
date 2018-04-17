export const escapePluginComponent = (pluginName) => {
    return pluginName.replace(/\^/g, '^^') // Escape our escape
        .replace(/-/g, '^0');
};

export const unescapePluginComponent = (pluginName) => {
    if (!pluginName) {
        return pluginName;
    }
    return pluginName.replace(
        /(\^+)0/g,
        (n0, esc) => esc.length % 2
            ? esc.slice(1) + '-'
            : n0
    ).replace(/\^\^/g, '^');
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
            const [pluginName, onByDefaultDefault] = this.pluginsInWork[i];
            const plugin = this.getPluginObject(pluginName);
            cb({ // eslint-disable-line standard/no-callback-literal
                plugin,
                placement,
                applicableFields,
                pluginName,
                onByDefaultDefault
            });
        });
    }
    processTargetLanguages (applicableFields, cb) {
        if (!applicableFields) {
            return false;
        }
        Object.entries(applicableFields).forEach(([applicableField, {
            targetLanguage, onByDefault
        }]) => {
            if (Array.isArray(targetLanguage)) {
                targetLanguage.forEach((targetLanguage) => {
                    cb({applicableField, targetLanguage, onByDefault}); // eslint-disable-line standard/no-callback-literal
                });
            } else {
                cb({applicableField, targetLanguage, onByDefault}); // eslint-disable-line standard/no-callback-literal
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
};
