/* eslint-env browser */
// Todo: Reimplement this with `formSerialize.deserialize` as possible
import {serialize as formSerialize} from 'form-serialization';

export const replaceHash = (paramsCopy) => {
    return location.href.replace(/#.*$/, '') + '#' + paramsCopy.toString();
};

export const getSerializeParamsAsURL = function (...args) {
    const setter = getParamsSetter(...args);
    return function (...innerArgs) {
        const paramsCopy = setter(...innerArgs);
        return replaceHash(paramsCopy);
    };
};

export const getParamsSetter = function ({l, il, $p}) {
    return function ({form, random = {}, checkboxes, type, fieldAliasOrNames = [], workName}) {
        const paramsCopy = new URLSearchParams($p.params);
        const formParamsHash = formSerialize(form, {hash: true, empty: true});

        Object.keys(formParamsHash).forEach((key) => {
            paramsCopy.set(key, formParamsHash[key]);
        });

        // Follow the same style (and order) for checkboxes
        paramsCopy.delete(il('rand'));
        paramsCopy.set(il('rand'), random.checked ? l('yes') : l('no'));

        // We want checkboxes to typically show by default, so we cannot use the
        //    standard serialization
        checkboxes.forEach((checkbox) => {
            // Let's ensure the checked items are all together (at the end)
            paramsCopy.delete(checkbox.name);
            if (checkbox.name) { // We don't want, e.g., preference controls added to URL
                paramsCopy.set(checkbox.name, checkbox.checked ? l('yes') : l('no'));
            }
        });

        /**
         *
         * @returns {void}
         */
        function removeStartsEndsAndAnchors () {
            let num = 1;
            let num2 = 1;
            while (paramsCopy.has(`${workName}-start${num}-${num2}`, true)) {
                while (paramsCopy.has(`${workName}-start${num}-${num2}`, true)) {
                    paramsCopy.delete(`${workName}-start${num}-${num2}`, true);
                    paramsCopy.delete(`${workName}-end${num}-${num2}`, true);
                    paramsCopy.delete(`${workName}-anchor${num}-${num2}`, true);
                    num2++;
                }
                num2 = 1;
                num++;
            }
        }

        switch (type) {
        case 'saveSettings': {
            // In case it was added previously on
            //    this page, let's remove it.
            paramsCopy.delete(il('rand'));
            break;
        }
        case 'shortcutResult': {
            paramsCopy.delete(il('rand'));
            let num = 1;
            while (paramsCopy.has(`anchorfield${num}`, true)) {
                paramsCopy.delete(`anchorfield${num}`, true);
                num++;
            }
            removeStartsEndsAndAnchors();

            num = 1;
            // Delete field-specific so we can add our own
            while (paramsCopy.has(`field${num}`, true)) {
                paramsCopy.delete(`field${num}`, true);
                paramsCopy.delete(`checked${num}`, true);
                paramsCopy.delete(`interlin${num}`, true);
                paramsCopy.delete(`css${num}`, true);
                num++;
            }
            fieldAliasOrNames.forEach((fieldAliasOrName, i) => {
                paramsCopy.set(`field${i + 1}`, fieldAliasOrName, true);
                // Todo: Restrict by content locale?
                paramsCopy.set(`checked${i + 1}`, l('yes'), true);
                paramsCopy.set(`interlin${i + 1}`, '');
                paramsCopy.set(`css${i + 1}`, '');
            });
            paramsCopy.delete('work', true);
        }
        // Fallthrough
        case 'startEndResult':
        case 'randomResult':
        case 'result': {
            if (type === 'startEndResult') {
                removeStartsEndsAndAnchors();
            }
            // In case it was added previously on this page,
            //    let's put random again toward the end.
            if (type === 'randomResult' || random.checked) {
                paramsCopy.delete(il('rand'));
                paramsCopy.set(il('rand'), l('yes'));
            }
            paramsCopy.set(il('result'), l('yes'));
            break;
        }
        default: {
            console.error('Unexpected type', type);
        }
        }
        return paramsCopy;
    };
};
