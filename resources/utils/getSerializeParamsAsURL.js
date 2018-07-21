/* eslint-env browser */
// Todo: Reimplement this with `formSerialize.deserialize` as possible
import {serialize as formSerialize} from 'form-serialize';
export default function ({l, il, $p}) {
    return function serializeParamsAsURL ({form, random, checkboxes}, type) {
        const paramsCopy = new URLSearchParams($p.params);
        const formParamsHash = formSerialize(form, {hash: true});

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
            paramsCopy.set(checkbox.name, checkbox.checked ? l('yes') : l('no'));
        });

        switch (type) {
        case 'saveSettings': {
            // In case it was added previously on
            //    this page, let's remove it.
            paramsCopy.delete(il('rand'));
            break;
        }
        case 'randomResult':
        case 'result': {
            // In case it was added previously on this page,
            //    let's put random again toward the end.
            if (type === 'randomResult' || random.checked) {
                paramsCopy.delete(il('rand'));
                paramsCopy.set(il('rand'), l('yes'));
            }
            paramsCopy.set(il('result'), l('yes'));
            break;
        }
        }
        return location.href.replace(/#.*$/, '') + '#' + paramsCopy.toString();
    };
};
