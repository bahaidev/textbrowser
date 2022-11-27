const $e = (el, descendentsSel) => {
  // el = typeof el === 'string' ? $(el) : el;
  return el.querySelector(descendentsSel);
};

export {$e};
