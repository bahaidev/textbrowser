export { activateCallback as default };
export type Logger = (...args: any[]) => void;
/**
* @callback Logger
* @param {...any} args
* @returns {void}
*/
/**
 * @param {PlainObject} cfg
 * @param {string} cfg.namespace
 * @param {string[]} cfg.files
 * @param {Logger} cfg.log
 * @param {string} [cfg.basePath]
 * @returns {Promise<void>}
 */
declare function activateCallback({ namespace, files, log, basePath }: PlainObject): Promise<void>;
//# sourceMappingURL=activateCallback-es.d.ts.map