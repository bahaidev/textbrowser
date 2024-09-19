/**
 * Prevent XSS attacks.
 * @param {string} s - The string to sanitize
 */
const escapeHTML = (s) => {
  return !s
    ? ''
    : s.replaceAll('&', '&amp;').
      replaceAll('<', '&lt;').
      replaceAll('>', '&gt;');
};
export {escapeHTML};
