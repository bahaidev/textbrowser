const nbsp = '\u00a0';
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const $e = (el, descendentsSel) => {
    el = typeof el === 'string' ? $(el) : el;
    return el.querySelector(descendentsSel);
};

export {nbsp, $, $$, $e};
