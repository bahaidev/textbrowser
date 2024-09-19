import {jml, nbsp, $} from 'jamilih';
import {$e} from '../templates/utils/dom.js';

/**
 * @typedef {{
 *   submit: string,
 *   cancel: string,
 *   ok: string
 * }} LocaleObject
 */

/**
 * @typedef {{[locale: string]: LocaleObject}} Locales
 */

const defaultLocale = 'en';

/** @type {Locales} */
const localeStrings = {
  en: {
    submit: 'Submit',
    cancel: 'Cancel',
    ok: 'Ok'
  }
};

class Dialog {
  /**
   * @param {{
   *  locale?: string,
   *  localeObject?: LocaleObject
   * }} [cfg]
   */
  constructor ({locale, localeObject} = {}) {
    this.localeStrings = localeStrings.en; // For types
    this.setLocale({locale, localeObject});
  }
  /**
   * @param {{
   *  locale?: string,
   *  localeObject?: Partial<LocaleObject>
   * }} cfg
   * @returns {void}
   */
  setLocale ({locale, localeObject = {}}) {
    this.localeStrings = {
      ...localeStrings[defaultLocale],
      ...(locale ? localeStrings[locale] : {}),
      ...localeObject
    };
  }

  /**
   * @typedef {{
   *   atts?: import('jamilih').JamilihAttributes,
   *   children?: import('jamilih').JamilihChildren,
   *   close?: () => void,
   *   remove?: boolean
   * }} MakeDialogCfg
   */

  /**
   * @typedef {MakeDialogCfg & {
   *   submit?: (
   *     this: HTMLElement, args: {e: Event, dialog: HTMLDialogElement}
   *   ) => void,
   *   cancel: (
   *     this: HTMLElement,
   *     args: {
   *       e: Event,
   *       dialog: HTMLDialogElement
   *     }
   *   ) => boolean|void,
   *   cancelClass?: string,
   *   submitClass?: string
   * }} CancelDialogCfg
   */

  /**
   * @param {MakeDialogCfg} cfg
   * @returns {HTMLDialogElement}
   */
  makeDialog ({atts = {
    $on: null
  }, children = [], close, remove = true}) {
    if (close) {
      if (!atts.$on) {
        atts.$on = {};
      }
      if (!atts.$on.close) {
        atts.$on.close = close;
      }
    }
    const dialog = /** @type {HTMLDialogElement} */ (
      jml('dialog', atts, children, $('#main'))
    );
    dialog.showModal();
    if (remove) {
      dialog.addEventListener('close', () => {
        dialog.remove();
      });
    }
    return dialog;
  }
  /**
   * @param {CancelDialogCfg} cfg
   * @returns {HTMLDialogElement}
   */
  makeSubmitDialog ({
    submit, // Don't pass this on to `args` if present
    submitClass = 'submit',
    ...args
  }) {
    const dialog = this.makeCancelDialog(args);
    /** @type {HTMLDialogElement} */ (
      $e(dialog, `button.${args.cancelClass || 'cancel'}`)
    ).before(
      jml('button', {
        class: submitClass,
        $on: {
          click (e) {
            if (submit) {
              submit.call(this, {e, dialog});
            }
          }
        }
      }, [this.localeStrings.submit]),
      nbsp.repeat(2)
    );
    return dialog;
  }

  /**
   * @param {CancelDialogCfg} cfg
   * @returns {HTMLDialogElement}
   */
  makeCancelDialog ({
    // eslint-disable-next-line no-unused-vars -- Discarding
    submit, // Don't pass this on to `args` if present
    cancel,
    cancelClass = 'cancel', submitClass = 'submit',
    ...args
  }) {
    const dialog = this.makeDialog(args);
    jml('div', {class: submitClass}, [
      ['br'], ['br'],
      ['button', {class: cancelClass, $on: {
        click (e) {
          e.preventDefault();
          if (cancel) {
            if (cancel.call(this, {e, dialog}) === false) {
              return;
            }
          }
          dialog.close();
        }
      }}, [this.localeStrings.cancel]]
    ], dialog);
    return dialog;
  }

  /**
   * @param {string|{message: string, ok?: boolean, submitClass?: string}} message
   * @param {boolean|{ok: boolean}} [ok]
   * @returns {Promise<void>}
   */
  alert (message, ok) {
    message = typeof message === 'string' ? {message} : message;
    const {
      ok: includeOk = typeof ok === 'object'
        ? ok.ok !== false
        : ok !== false,
      message: msg,
      submitClass = 'submit'
    } = message;
    return new Promise((resolve) => {
      const dialog = /** @type {HTMLDialogElement} */ (jml('dialog', [
        msg,
        ...(includeOk
          ? /** @type {import('jamilih').JamilihChildren} */ ([
            ['br'], ['br'],
            ['div', {class: submitClass}, [
              ['button', {$on: {click () {
                dialog.close();
                resolve();
              }}}, [this.localeStrings.ok]]
            ]]
          ])
          : [])
      ], $('#main')));
      dialog.showModal();
    });
  }
  /**
   * @param {string|Partial<CancelDialogCfg> & {
   *   message: string
   * }} message
   * @returns {Promise<string>}
   */
  prompt (message) {
    message = typeof message === 'string' ? {message} : message;
    const {message: msg, submit: userSubmit, ...submitArgs} = message;
    return new Promise((resolve, reject) => {
      /**
       * @param {{
       *   e: Event,
       *   dialog: HTMLDialogElement
       * }} args
       */
      const submit = function ({e, dialog}) {
        if (userSubmit) {
          userSubmit.call(
            // @ts-expect-error Ok
            /** @type {HTMLElement} */ (this),
            {e, dialog}
          );
        }
        dialog.close();
        resolve(/** @type {HTMLInputElement} */ ($e(dialog, 'input')).value);
      };
      /* const dialog = */ this.makeSubmitDialog({
        ...submitArgs,
        submit,
        cancel () {
          reject(new Error('cancelled'));
        },
        children: [
          ['label', [
            msg,
            nbsp.repeat(3),
            ['input']
          ]]
        ]
      });
    });
  }
  /**
   * @param {string|{message: string, submitClass?: string}} message
   * @returns {Promise<void>}
   */
  confirm (message) {
    message = typeof message === 'string' ? {message} : message;
    const {message: msg, submitClass = 'submit'} = message;
    return new Promise((resolve, reject) => {
      const dialog = /** @type {HTMLDialogElement} */ (jml('dialog', [
        msg,
        ['br'], ['br'],
        ['div', {class: submitClass}, [
          ['button', {$on: {click () {
            dialog.close();
            resolve();
          }}}, [this.localeStrings.ok]],
          nbsp.repeat(2),
          ['button', {$on: {click () {
            dialog.close();
            reject(new Error('cancelled'));
          }}}, [this.localeStrings.cancel]]
        ]]
      ], $('#main')));
      dialog.showModal();
    });
  }
}

const dialogs = new Dialog();

export {
  Dialog, dialogs
};
