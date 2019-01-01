/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY.
 * See the GNU General Public License for more details.
 *
 */

angular.module('bibiscoApp').service('SearchService', function(ChapterService) {
  'use strict';

  var findandreplacedomtext = require('findandreplacedomtext');

  return {
    search: function (dom, text2search, text2replace) {


      // nella regexp aggiungere i per ricerche case insensitive
      // nella regexp aggiungere /\b($word)\b per parole intere
      // nella regexp aggiungere g per sostituire tutte le occorrenze
      //let regexp = new RegExp('\\b'+text2search+'\\b', 'giu');
      //let regexp = new RegExp('(^\|[ \n\r\t.,\'"\+!?-]+)(' + text2search +')([ \n\r\t.,\'"\+!?-]+\|$)', 'i');
      let regexp = new RegExp('((?<![\wèéÀ-ÖØ-öø-ſ])|(?:^))(' + text2search +')(?![\\wèéÀ-ÖØ-öø-ſ])', 'gi');
      //let regexp = new RegExp('(?:^|[^\\wèéÀ-ÖØ-öø-ſ])(' + text2search +')(?![\\wèéÀ-ÖØ-öø-ſ])', 'gi');
      //let regexp = new RegExp('(^|$|\s+|[^a-zA-Z0-9_\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u017f\u0180-\u024f\u0370-\u0373\u0376-\u0376\u037b-\u037d\u0388-\u03ff\u0400-\u04FF]+)' + text2search + '(^|$|\s+|[^a-zA-Z0-9_\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u017f\u0180-\u024f\u0370-\u0373\u0376-\u0376\u037b-\u037d\u0388-\u03ff\u0400-\u04FF]+)');
      //let regexp = new XRegExp('(?=^|$|\\s+|[\\P{L}])' + text2search + '(?=^|$|\\s+|[\\P{L}])', 'gi');
      //let regexp = new RegExp('([\s,:;.\$\\<>‘’“”()\u0021-\u0027\u00A0\u2000-\u200A\u2028\u2029\u202F]|^)' + text2search + '(?=[\s,:;.\$\\?<>‘’“”()\u0021-\u0027\u00A0\u2000-\u200A\u2028\u2029\u202F]|$)', 'gi');
      //let regexp = new RegExp(text2search, 'gi');
      // findandreplacedomtext(dom, {
      //   find: regexp,
      //   replace: text2replace
      // });
      let matches = findandreplacedomtext(dom, {
        preset: 'prose',
        find: regexp,
        replace: 'alù'
      }).search();

      return matches;
    },

    getIndicesOf: function(searchStr, str, caseSensitive) {
      var searchStrLen = searchStr.length;
      if (searchStrLen === 0) {
        return [];
      }
      var startIndex = 0, index, indices = [];
      if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
      }
      while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
      }
      return indices;
    }
  };;
});
