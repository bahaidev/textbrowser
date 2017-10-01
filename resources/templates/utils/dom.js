const nbsp = '\u00a0';
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

export {nbsp, $, $$};
