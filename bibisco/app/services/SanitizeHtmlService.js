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

angular.module('bibiscoApp').service('SanitizeHtmlService', function() {
  'use strict';

  var sanitizeHtml = require('sanitize-html');

  return {
    sanitize: function(html) {

      let result = sanitizeHtml(html, {
        allowedTags: ['p', 'ul', 'ol', 'li', 'b', 'i', 'u', 'strike',
          'span'
        ],
        allowedAttributes: {
          p: ['style'],
          span: ['style']
        },
        parser: {
          lowerCaseTags: true
        },
        transformTags: {
          'em': 'i',
          'strong': 'b',
          'p': function(tagName, attribs) {
            let result;
            if (attribs.style && attribs.style.indexOf(
              'text-align: justify') > -1) {
              result = {
                tagName: 'p',
                attribs: {
                  style: 'text-align: justify'
                }
              };
            } else if (attribs.style && attribs.style.indexOf(
              'text-align: center') > -1) {
              result = {
                tagName: 'p',
                attribs: {
                  style: 'text-align: center'
                }
              };
            } else if (attribs.style && attribs.style.indexOf(
              'text-align: left') > -1) {
              result = {
                tagName: 'p',
                attribs: {
                  style: 'text-align: left'
                }
              };
            } else if (attribs.style && attribs.style.indexOf(
              'text-align: right') > -1) {
              result = {
                tagName: 'p',
                attribs: {
                  style: 'text-align: right'
                }
              };
            } else {
              result = {
                tagName: 'p'
              };
            }
            return result;
          },
          'span': function(tagName, attribs) {
            let result;
            if (attribs.style && attribs.style.indexOf(
              'background-color: rgb(255, 255, 0)') > -1) {
              result = {
                tagName: 'span',
                attribs: {
                  style: 'background-color: rgb(255, 255, 0)'
                }
              };
            } else {
              result = {
                tagName: ''
              };
            }
            return result;
          }
        }
      });

      return result;
    }
  };
});
