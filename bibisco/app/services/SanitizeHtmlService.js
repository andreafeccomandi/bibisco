/*
 * Copyright (C) 2014-2024 Andrea Feccomandi
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

angular.module('bibiscoApp').service('SanitizeHtmlService', function(ImageService) {
  'use strict';

  var sanitizeHtml = require('sanitize-html');

  return {
    sanitize: function(html) {
      html = html.replace(/\r?\n|\r/g, ' ');
      html = html.replace(/&nbsp;/g, ' ');
      html = html.replace(/\u200B/g,'');
      let result = sanitizeHtml(html, {
        allowedTags: ['p', 'br', 'ul', 'ol', 'li', 'b', 'i', 'u', 'strike', 'span', 'img', 'a', 'small', 'sub', 'sup'],
        allowedAttributes: {
          a: ['href', 'target'],
          img: ['filename','position','src','style','widthheightratio','widthperc'],
          p: ['style'],
          span: ['class', 'contenteditable', 'data-comment', 'data-commentid', 'data-iscomment', 'data-isnote',
            'data-note', 'data-noteid', 'style']
        },
        exclusiveFilter: function (frame) {
          return (((frame.tag === 'p' 
            || frame.tag === 'ul'
            || frame.tag === 'ol'
            || frame.tag === 'li'
            || frame.tag === 'b'
            || frame.tag === 'i'
            || frame.tag === 'u'
            || frame.tag === 'strike'
            || frame.tag === 'span'
            || frame.tag === 'small'
            || frame.tag === 'sub'
            || frame.tag === 'sup') 
            && !frame.text.trim() && !frame.mediaChildren) || 
            (frame.tag === 'img' && !frame.attribs.filename));
        },
        parser: {
          lowerCaseTags: true
        },
        transformTags: {
          'em': 'i',
          'strong': 'b',
          'p': function(tagName, attribs) {
            let result = {
              tagName: 'p'
            };

            if (attribs.style) {
              result.attribs = {};
              attribs.style = attribs.style.replace(/\s/g, '');
              if (attribs.style.indexOf('text-align:justify') > -1) {
                result.attribs.style = 'text-align: justify';
              } else if (attribs.style.indexOf('text-align:center') > -1) {
                result.attribs.style = 'text-align: center';
              } else if (attribs.style.indexOf('text-align:left') > -1) {
                result.attribs.style = 'text-align: left';
              } else if (attribs.style.indexOf('text-align:right') > -1) {
                result.attribs.style = 'text-align: right';
              }
            }

            return result;
          },
          'span': function(tagName, attribs) {
            let result;

            if (!attribs.style && !attribs['data-commentid'] && !attribs['data-iscomment'] 
              && !attribs['data-noteid'] && !attribs['data-isnote']
            ) {
              result = {
                tagName: ''
              };
            } else {
              result = {
                tagName: 'span',
                attribs: {}
              };

              if (attribs.style) {
                attribs.style = attribs.style.replace(/\s/g, '');
                if (attribs.style.indexOf('background-color:rgb(0,255,255)') > -1) { // aqua
                  result.attribs.style = 'background-color: rgb(0, 255, 255)';
                } else if (attribs.style.indexOf('background-color:rgb(0,255,0)') > -1) { // lime
                  result.attribs.style = 'background-color: rgb(0, 255, 0)';
                } else if (attribs.style.indexOf('background-color:rgb(255,165,0)') > -1) { // orange
                  result.attribs.style = 'background-color: rgb(255, 165, 0)';
                } else if (attribs.style.indexOf('background-color:rgb(255,133,250)') > -1) { // pink
                  result.attribs.style = 'background-color: rgb(255, 133, 250)';
                } else if (attribs.style.indexOf('background-color:rgb(255,0,0)') > -1) { // red
                  result.attribs.style = 'background-color: rgb(255, 0, 0)';
                } else if (attribs.style.indexOf('background-color:rgb(255,255,0)') > -1) { // yellow
                  result.attribs.style = 'background-color: rgb(255, 255, 0)';
                }
              }
            }

            // comment
            if (attribs['data-commentid'] && attribs['data-iscomment']) {
              result.attribs['data-comment'] = attribs['data-comment'];
              result.attribs['data-commentid'] = attribs['data-commentid'];
              result.attribs['data-iscomment'] = attribs['data-iscomment'];
              result.attribs.class = '';
              if (attribs.class.indexOf('comment-beginning') > -1) {
                result.attribs.class += 'comment-beginning ';
              }
              result.attribs.class += 'comment-enabled comment-'+attribs['data-commentid'];
              if (attribs.class.indexOf('comment-end') > -1) {
                result.attribs.class += ' comment-end';
              }
            }

            // note
            if (attribs['data-noteid'] && attribs['data-isnote']) {
              result.attribs['class'] = attribs['class'];
              result.attribs['contenteditable'] = attribs['contenteditable'];
              result.attribs['data-note'] = attribs['data-note'];
              result.attribs['data-noteid'] = attribs['data-noteid'];
              result.attribs['data-isnote'] = attribs['data-isnote'];
            }
            
            return result;
          },
          'img': function(tagName, attribs) {
            return {
              tagName: 'img',
              attribs: {
                filename: attribs.filename,
                position: attribs.position,
                widthheightratio: attribs.widthheightratio,
                widthperc: attribs.widthperc,
                src: attribs.src,
                style: ImageService.calculateImageStyle(attribs.position, attribs.widthperc)
              }
            };
          }
        }
      });

      return result;
    }
  };
});
