export default Templates;
declare namespace Templates {
    export { languageSelect };
    export { workSelect };
    export { workDisplay };
    export { resultsDisplayServerOrClient };
    export { resultsDisplayClient };
    export function defaultBody(): HTMLDivElement;
    export namespace permissions {
        function versionChange(): void;
        /**
         * @param {{text: string}} cfg
         */
        function addLogEntry({ text }: {
            text: string;
        }): void;
        function exitDialogs(): void;
        /**
         * @param {{
         *   type: string,
         *   escapedErrorMessage: string
         * }} cfg
         */
        function dbError({ type, escapedErrorMessage }: {
            type: string;
            escapedErrorMessage: string;
        }): void;
        /**
         * @param {string} escapedErrorMessage
         */
        function errorRegistering(escapedErrorMessage: string): void;
        function browserNotGrantingPersistence(): void;
        /**
         * @param {object} cfg
         * @param {import('intl-dom').I18NCallback} cfg.siteI18n
         * @param {() => Promise<void>} [cfg.ok]
         * @param {() => void} [cfg.refuse]
         * @param {() => Promise<void>} [cfg.close]
         * @param {() => void} [cfg.closeBrowserNotGranting]
         * @returns {[
         *   HTMLDialogElement, HTMLDialogElement|"", HTMLDialogElement|"",
         *   HTMLDialogElement, HTMLDialogElement, HTMLDialogElement
         * ]}
         */
        function main({ siteI18n, ok, refuse, close, closeBrowserNotGranting }: {
            siteI18n: import("intl-dom").I18NCallback;
            ok?: (() => Promise<void>) | undefined;
            refuse?: (() => void) | undefined;
            close?: (() => Promise<void>) | undefined;
            closeBrowserNotGranting?: (() => void) | undefined;
        }): [HTMLDialogElement, HTMLDialogElement | "", HTMLDialogElement | "", HTMLDialogElement, HTMLDialogElement, HTMLDialogElement];
    }
}
import languageSelect from './languageSelect.js';
import workSelect from './workSelect.js';
import workDisplay from './workDisplay.js';
import resultsDisplayServerOrClient from './resultsDisplayServerOrClient.js';
import resultsDisplayClient from './resultsDisplayClient.js';
//# sourceMappingURL=index.d.ts.map