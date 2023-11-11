const escapeHTML = (s) => {
  return !s
    ? ''
    : s.replaceAll('&', '&amp;').
      replaceAll('<', '&lt;').
      replaceAll('>', '&gt;');
};
export {escapeHTML};
