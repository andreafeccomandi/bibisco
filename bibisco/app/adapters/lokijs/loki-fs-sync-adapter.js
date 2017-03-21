/**
 * Created by user on 2016/10/13.
 */

"use strict";

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.LokiIndexedAdapter = factory();
  }
}(this, function() {
  return (function() {

    var Loki = require('lokijs');

    function LokiFsSyncAdapter() {
      this.fs = require('fs');
    }

    Object.assign(LokiFsSyncAdapter.prototype, Loki.persistenceAdapters
      .fs.prototype, {
        loadDatabase: function(dbname, callback) {
          var err = null;
          var stats;
          stats = this.fs.statSync(dbname);
          if (!err && stats && stats.isFile()) {
            // readFileSync() is the synchronous alternative to async readFile() which loki normally uses
            var data = this.fs.readFileSync(dbname, {
              encoding: 'utf8'
            });
            callback(data);
          } else if (!stats.isFile()) {
            throw new Error(dbname + ' is not a file!');
          } else {
            throw new Error('Error loading db');
          }
        },

        saveDatabase: function(dbname, dbstring, callback) {
          this.fs.writeFileSync(dbname, dbstring);
          callback(null);
        },
      }
    );

    return LokiFsSyncAdapter;

  }());
}));
