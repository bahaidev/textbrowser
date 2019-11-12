const escapeHTML = (s) => {
  return !s
    ? ''
    : s.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
};
export {escapeHTML};
