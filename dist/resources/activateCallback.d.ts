/**
* @callback Logger
* @param {...any} args
* @returns {void}
*/
/**
 * @param {object} cfg
 * @param {string} cfg.namespace
 * @param {string} cfg.files The files.json path
 * @param {Logger} cfg.log
 * @param {string} [cfg.basePath]
 * @returns {Promise<void>}
 */
export default function activateCallback({ namespace, files, log, basePath }: {
    namespace: string;
    files: string;
    log: Logger;
    basePath?: string | undefined;
}): Promise<void>;
export type Logger = (...args: any[]) => void;
export type MetadataFile = typeof import("./utils/Metadata.js");
export type Integer = number;
//# sourceMappingURL=activateCallback.d.ts.map