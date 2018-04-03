const nbsp = '\u00a0';
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

export {nbsp, $, $$};
