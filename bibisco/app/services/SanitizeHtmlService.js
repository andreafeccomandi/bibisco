/*
 * Copyright (C) 2014-2017 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.gnu.org/licenses/gpl-2.0.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY.
 * See the GNU General Public License for more details.
 *
 */

angular.module('bibiscoApp').service('SanitizeHtmlService', function() {
  'use strict';

  var remote = require('electron').remote;
  //var sanitizeHtml = remote.getGlobal('sanitizeHtml');
  var sanitizeHtml = require('sanitize-html');

  return {
    sanitize: function(html) {
      console.log('sanitize - html: ' + html);
      let result = sanitizeHtml(html, {
        allowedTags: ['p', 'ul', 'ol', 'li', 'b', 'i', 'u', 'strike',
          'span'
        ],
        allowedAttributes: {
          span: ['style']
        },
        parser: {
          lowerCaseTags: true
        },
        transformTags: {
          'em': 'i',
          'strong': 'b',
          'span': function(tagName, attribs) {
            let result;
            if (attribs.style && attribs.style.indexOf(
                'background-color: rgb(255, 255, 0)') > -1) {
              result = {
                tagName: 'span',
                attribs: {
                  style: 'background-color: rgb(255, 255, 0)'
                }
              }
            } else {
              result = {
                tagName: ''
              }
            }
            return result;
          }
        }
      });
      console.log('sanitize - result: ' + result);
      return result;
    }
  }
});
