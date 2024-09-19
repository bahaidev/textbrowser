const nbsp = '\u00A0';

/**
 * @param {string} sel
 */
const $ = (sel) => document.querySelector(sel);
/**
 * @param {string} sel
 */
const $$ = (sel) => [...document.querySelectorAll(sel)];

/**
 * @param {string|HTMLElement} el
 * @param {string} descendentsSel
 */
const $e = (el, descendentsSel) => {
  const elem = typeof el === 'string' ? $(el) : el;
  return elem?.querySelector(descendentsSel);
};

export {nbsp, $, $$, $e};
