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

      // nella regexp aggiungere i per riceche case insensitive
      // nella regexp aggiungere g per sostituire tutte le occorrenze
      let regexp = new RegExp(text2search, 'gi');
      // findandreplacedomtext(dom, {
      //   find: regexp,
      //   replace: text2replace
      // });
      let matches = findandreplacedomtext(dom, {
        find: regexp
      }).search();

      if (matches && matches.length >0) {
        for (let index = 0; index < matches.length; index++) {
          console.log('*' + index + ' ' + matches[index].startIndex);
        }
      }

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
