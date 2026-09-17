export default {
  reject: [
    // Versions past 12 have some apparent node-sqlite3 issues,
    //   interacting with rollup, so we can't run server script;
    //   try again now that undid that dependency
    'indexeddbshim'
  ]
};
