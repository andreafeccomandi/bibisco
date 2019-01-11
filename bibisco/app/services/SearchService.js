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

  var findandreplacedomtext = require('./custom_node_modules/findandreplacedomtext');
  const extraAsciiCharacters = '\\u00c0-\\u00d6\\u00d8-\\u00f6\\u00f8-\\u00ff\\u0100-\\u017f\\u0180-\\u024f\\u0370-\\u0373\\u0376-\\u0376\\u037b-\\u037d\\u0388-\\u03ff\\u0400-\\u04FF\\u4E00-\\u9FFF\\u3400-\\u4dbf\\uf900-\\ufaff\\u3040-\\u309f\\uac00-\\ud7af\\u0400-\\u04FF\\u00E4\\u00C4\\u00E5\\u00C5\\u00F6\\u00D6';
  const findWholeWordPrefix = '((?<![\\w' + extraAsciiCharacters + '])|(?:^))(';
  const findWholeWordSuffix = ')(?![\\w' + extraAsciiCharacters + '])';

  return {
    search: function (dom, text2search, casesensitive, wholeword) {

      let matches = findandreplacedomtext(dom, {
        preset: 'prose',
        find: new RegExp(this.calculateRegexp(text2search, wholeword), 
          this.calculateMode(casesensitive))
      }).search();

      return matches;
    },

    replace: function (dom, text2search, text2replace, casesensitive, wholeword, 
      occurrence) {

      let matches = findandreplacedomtext(dom, {
        preset: 'prose',
        find: new RegExp(this.calculateRegexp(text2search, wholeword), 
          this.calculateMode(casesensitive)),
        replace: text2replace,
        filterOccurrence: occurrence
      }).search();

      return matches;
    },

    calculateMode: function (casesensitive) {
      let mode = 'g';
      if (!casesensitive) {
        mode = mode + 'i';
      }
      return mode;
    },

    calculateRegexp: function (text2search, wholeword) {
      let regexp;
      if (wholeword) {
        regexp = findWholeWordPrefix + text2search + findWholeWordSuffix;
      } else {
        regexp = text2search;
      }

      return regexp;
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
  };
});
