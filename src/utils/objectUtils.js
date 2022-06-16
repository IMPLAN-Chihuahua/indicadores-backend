const isUndefined = (obj) => typeof obj === 'undefined';

const toggleStatus = (status) => status === 'SI' ? 'NO' : 'SI';

const isObjEmpty = (obj) => Object.keys(obj).length === 0;

module.exports = { isUndefined, toggleStatus, isObjEmpty }