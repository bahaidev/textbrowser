const escapeHTML = (s) => {
    return !s
        ? ''
        : s.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/, '&gt;');
};
export {escapeHTML};
