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

angular.module('bibiscoApp').service('PdfService', function (FileSystemService) {
  'use strict';

  var remote = require('electron').remote;
  var htmlparser = remote.getGlobal('htmlparser');

  pdfMake.fonts = {
    Courier: {
      normal: 'cour.ttf',
      bold: 'courbd.ttf',
      italics: 'couri.ttf',
      bolditalics: 'courbi.ttf'
    }
  };

  let paragraphmargin = [0, 0, 0, 10];

  return {

    export: function (options) {

      let content = [];
      let currentList = [];
      let currentText;
      let boldActive = false;
      let italicsActive = false;
      let underlineActive = false;
      let strikeActive = false;
      let alignment;

      var parser = new htmlparser.Parser({

        onopentag: function (name, attribs) {

          if (name === 'ul' || name === 'ol') {
            currentList = [];
          } else if (name === 'p' || name === 'li') {
            currentText = [];
            
            // alignment
            if (!attribs.style || attribs.style.indexOf('text-align: left') > -1) {
              alignment = 'left';
            } else if (attribs.style.indexOf('text-align: center') > -1) {
              alignment = 'center';
            } else if (attribs.style.indexOf('text-align: right') > -1) {
              alignment = 'right';
            } else if (attribs.style.indexOf('text-align: justify') > -1) {
              alignment = 'justify';
            }

            // indent
            currentText.push({
              text: '   ',
              bold: boldActive,
              italics: italicsActive,
              preserveLeadingSpaces: true
            });
            
          } else if (name === 'b') {
            boldActive = true;
          } else if (name === 'i') {
            italicsActive = true;
          } else if (name === 'u') {
            underlineActive = true;
          } else if (name === 'strike') {
            strikeActive = true;
          }
        },

        ontext: function (text) {
          let decoration = null;
          // Is not possible to have more than one decoration at the same time
          if (underlineActive) {
            decoration = 'underline';
          }
          if (strikeActive) {
            decoration = 'lineThrough';
          }

          currentText.push({
            text: text,
            bold: boldActive,
            italics: italicsActive,
            decoration: decoration,
            preserveLeadingSpaces: true
          });
        },

        onclosetag: function (name) {
          if (name === 'ul') {
            content.push({
              ul: currentList
            });
            currentList = [];
          } else if (name === 'ol') {
            content.push({
              ol: currentList
            });
            currentList = [];
          } else if (name === 'li') {
            currentList.push({
              text: currentText,
              alignment: alignment,
              margin: paragraphmargin
            });
            currentText = [];
          } else if (name === 'p') {
            content.push({
              text: currentText,
              alignment: alignment,
              margin: paragraphmargin
            });
            currentText = [];
          }  else if (name === 'b') {
            boldActive = false;
          } else if (name === 'i') {
            italicsActive = false;
          } else if (name === 'u') {
            underlineActive = false;
          } else if (name === 'strike') {
            strikeActive = false;
          }
        },

        onend: function() {
          var docDefinition = {
            content: content,
            defaultStyle: {
              font: options.font
            }
          };
          
          let document = pdfMake.createPdf(docDefinition);
          document.getBuffer(function (buffer) {
            FileSystemService.writeFileSync(options.novelfilepath + '.pdf', buffer);
            options.callback();
          });
        }
      }, { decodeEntities: true });

      parser.write(options.novelhtml);
      parser.end();
    }
  };
});
