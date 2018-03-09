/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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

angular.module('bibiscoApp').service('PdfExporterService', function (FileSystemService) {
  'use strict';

  var htmlparser = require('htmlparser2');

  pdfMake.fonts = {
    Arial: {
      normal: 'arial.ttf',
      bold: 'arialbd.ttf',
      italics: 'ariali.ttf',
      bolditalics: 'arialbi.ttf'
    },
    Courier: {
      normal: 'cour.ttf',
      bold: 'courbd.ttf',
      italics: 'couri.ttf',
      bolditalics: 'courbi.ttf'
    },
    'Times New Roman': {
      normal: 'times.ttf',
      bold: 'timesbd.ttf',
      italics: 'timesi.ttf',
      bolditalics: 'timesbi.ttf'
    }
  };

  let pageMargins = [60, 100, 60, 100];
  let exportitleMargins = [0, 280, 0, 10];
  let h1Margins = [0, 0, 0, 20];
  let h2Margins1st = [0, 0, 0, 10];
  let h2Margins = [0, 15, 0, 10];
  let h3Margins1st = [0, 0, 0, 10];
  let h3Margins = [0, 10, 0, 10];
  let paragraphMargins = [0, 0, 0, 10];

  return {

    export: function (path, html, font, indent, callback) {

      let content = [];
      let currentList = [];
      let currentText;
      let boldActive = false;
      let italicsActive = false;
      let underlineActive = false;
      let strikeActive = false;
      let alignment;
      let h1counter = 0;
      let h2counter = 0;
      let h3counter = 0;
      let leadingIndent = indent ? 30 : 0;

      var parser = new htmlparser.Parser({

        onopentag: function (name, attribs) {

          if (name === 'exporttitle') {
            currentText = [];
            boldActive = true;
          } else if (name === 'exportsubtitle') {
            currentText = [];
            boldActive = true;
          } else if (name === 'h1') {
            h1counter += 1;
            currentText = [];
            boldActive = true;
            currentText.push({
              text: h1counter+' ',
              bold: true,
              preserveLeadingSpaces: true
            });
          } else if (name === 'h2') {
            h2counter += 1;
            currentText = [];
            italicsActive = true;
            currentText.push({
              text: h1counter + '.' + h2counter + ' ',
              italics: true,
              preserveLeadingSpaces: true
            });
          } else if (name === 'h3') {
            h3counter += 1;
            currentText = [];
            currentText.push({
              text: h1counter + '.' + h2counter + '.' + h3counter + ' ',
              preserveLeadingSpaces: true
            });
          } else if (name === 'question') {
            currentText = [];
            boldActive = true;
            italicsActive = true;
          } else if (name === 'ul' || name === 'ol') {
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
            preserveLeadingSpaces: true,
            lineHeight: 1.5,
            leadingIndent: leadingIndent
          });
        },

        onclosetag: function (name) {
          if (name === 'exporttitle') {
            content.push({
              text: currentText,
              alignment: 'center',
              margin: exportitleMargins
            });
            currentText = [];
            boldActive = false;
          } else if (name === 'exportsubtitle') {
            content.push({
              text: currentText,
              alignment: 'center',
              margin: paragraphMargins
            });
            currentText = [];
            boldActive = false;
          } else if (name === 'h1') {
            content.push({
              text: currentText,
              margin: h1Margins,
              pageBreak: 'before'
            });
            currentText = [];
            boldActive = false;
            h2counter = 0;
          } else if (name === 'h2') {
            content.push({
              text: currentText,
              margin: h2counter === 1 ? h2Margins1st : h2Margins
            });
            currentText = [];
            italicsActive = false;
            h3counter = 0;
          } else if (name === 'h3') {
            content.push({
              text: currentText,
              margin: h3counter === 1 ? h3Margins1st : h3Margins,
            });
            currentText = [];
          } else if (name === 'question') {
            content.push({
              text: currentText,
              margin: paragraphMargins
            });
            currentText = [];
            boldActive = false;
            italicsActive = false;
          } else if (name === 'ul') {
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
              margin: paragraphMargins
            });
            currentText = [];
          } else if (name === 'p') {
            content.push({
              text: currentText,
              alignment: alignment,
              margin: paragraphMargins
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
              font: font
            },
            pageMargins: pageMargins,
          };
          
          let document = pdfMake.createPdf(docDefinition);
          document.getBuffer(function (buffer) {
            FileSystemService.writeFileSync(path + '.pdf', buffer);
            if (callback) {
              callback();
            }
          });
        }
      }, { decodeEntities: true });

      parser.write(html);

      parser.end();
    }
  };
});
