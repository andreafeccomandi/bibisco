/*
 * Copyright (C) 2014-2022 Andrea Feccomandi
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
    Baskerville: {
      normal: 'Baskerville.ttf',
      bold: 'Baskerville-Bold.ttf',
      italics: 'Baskerville-Italic.ttf',
      bolditalics: 'Baskerville-BoldItalic.ttf'
    },
    Courier: {
      normal: 'cour.ttf',
      bold: 'courbd.ttf',
      italics: 'couri.ttf',
      bolditalics: 'courbi.ttf'
    },
    Garamond: {
      normal: 'EBGaramond-Regular.ttf',
      bold: 'EBGaramond-Bold.ttf',
      italics: 'EBGaramond-Italic.ttf',
      bolditalics: 'EBGaramond-BoldItalic.ttf'
    },
    Georgia: {
      normal: 'georgia.ttf',
      bold: 'georgiab.ttf',
      italics: 'georgiai.ttf',
      bolditalics: 'georgiaz.ttf'
    },
    Palatino: {
      normal: 'PalatinoLinotype-Roman.ttf',
      bold: 'PalatinoLinotype-Bold.ttf',
      italics: 'PalatinoLinotype-Italic.ttf',
      bolditalics: 'PalatinoLinotype-BoldItalic.ttf'
    },
    'Times New Roman': {
      normal: 'times.ttf',
      bold: 'timesbd.ttf',
      italics: 'timesi.ttf',
      bolditalics: 'timesbi.ttf'
    }
  };


  return {

    export: function (params, callback) {

      let content = [];
      let currentList = [];
      let currentText;
      let boldActive = false;
      let italicsActive = false;
      let underlineActive = false;
      let strikeActive = false;
      let lineHeight = this.calculateLineHeight(params.exportconfig.linespacing);
      let alignment;
      let h1counter = 0;
      let h2counter = 0;
      let h3counter = 0;
      let leadingIndent = params.exportconfig.indent ? 30 : 0;
      let leadingIndentEnabled = true;

      // margins order: [left, top, right, bottom]
      let paragraphMarginBottom = this.calculateParagraphMarginBottom(params.exportconfig.paragraphspacing);
      let pageMargins = [60, 100, 60, 100];
      let exportitleMargins = [0, 280, 0, paragraphMarginBottom];
      let parttitleMargins = [0, 280, 0, paragraphMarginBottom];
      let h1Margins = [0, 0, 0, 10+paragraphMarginBottom];
      let h2Margins1st = [0, 0, 0, paragraphMarginBottom];
      let h2Margins = [0, 15, 0, paragraphMarginBottom];
      let h3Margins1st = [0, 0, 0, paragraphMarginBottom];
      let h3Margins = [0, 10, 0, paragraphMarginBottom];
      let paragraphMargins = [0, 0, 0, paragraphMarginBottom];
      let lihMargins = [30, 0, 0, paragraphMarginBottom];

      let parser = new htmlparser.Parser({

        onopentag: function (name, attribs) {

          if (name === 'exporttitle') {
            currentText = [];
            boldActive = true;
          } else if (name === 'exportauthor') {
            currentText = [];
            boldActive = false;
          } else if (name === 'exportsubtitle') {
            currentText = [];
            boldActive = false;
          } else if (name === 'parttitle') {
            currentText = [];
            boldActive = true;
          } else if (name === 'prologue' || name === 'epilogue') {
            currentText = [];
            boldActive = true;
            leadingIndentEnabled = false;
            alignment = this.calculateAlignment(attribs);

          } else if (name === 'h1') {
            h1counter += 1;
            currentText = [];
            boldActive = true;
            leadingIndentEnabled = false;
            if (params.exportconfig.hcountingactive) {
              currentText.push({
                text: h1counter+' ',
                bold: true,
                preserveLeadingSpaces: true
              });
            }
            alignment = this.calculateAlignment(attribs);
          } else if (name === 'h2') {
            h2counter += 1;
            currentText = [];
            italicsActive = true;
            leadingIndentEnabled = false;
            if (params.exportconfig.hcountingactive) {
              currentText.push({
                text: h1counter + '.' + h2counter + ' ',
                italics: true,
                preserveLeadingSpaces: true
              });
            }
          } else if (name === 'h3') {
            h3counter += 1;
            currentText = [];
            leadingIndentEnabled = false;
            if (params.exportconfig.hcountingactive) {
              currentText.push({
                text: h1counter + '.' + h2counter + '.' + h3counter + ' ',
                preserveLeadingSpaces: true
              });
            }
          } else if (name === 'question') {
            currentText = [];
            boldActive = true;
            italicsActive = true;
          } else if (name === 'ul' || name === 'ol') {
            currentList = [];
          } else if (name === 'p' || name === 'li') {
            currentText = [];
            alignment = this.calculateAlignment(attribs);
            if (name === 'li') {
              leadingIndentEnabled = false;
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
            lineHeight: lineHeight,
            leadingIndent: leadingIndentEnabled ? leadingIndent : 0
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
          } else if (name === 'exportauthor') {
            content.push({
              text: currentText,
              alignment: 'center',
              margin: paragraphMargins
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
          } else if (name === 'parttitle') {
            content.push({
              text: currentText,
              alignment: 'center',
              margin: parttitleMargins,
              pageBreak: 'before'
            });
            currentText = [];
            boldActive = false;
          } else if (name === 'prologue' || name === 'epilogue') {
            let pageBreak = params.exportconfig.pagebreakonh1 ? 'before' : null;
            content.push({
              text: currentText,
              alignment: alignment,
              margin: h1Margins,
              pageBreak: pageBreak
            });
            currentText = [];
            boldActive = false;
            leadingIndentEnabled = true;
          } else if (name === 'h1') {
            let pageBreak = params.exportconfig.pagebreakonh1 ? 'before' : null;
            content.push({
              text: currentText,
              alignment: alignment,
              margin: h1Margins,
              pageBreak: pageBreak
            });
            currentText = [];
            leadingIndentEnabled = true;
            boldActive = false;
            h2counter = 0;
          } else if (name === 'h2') {
            content.push({
              text: currentText,
              margin: h2counter === 1 ? h2Margins1st : h2Margins
            });
            currentText = [];
            leadingIndentEnabled = true;
            italicsActive = false;
            h3counter = 0;
          } else if (name === 'h3') {
            content.push({
              text: currentText,
              margin: h3counter === 1 ? h3Margins1st : h3Margins,
            });
            currentText = [];
            leadingIndentEnabled = true;
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
              margin: lihMargins
            });
            currentText = [];
            leadingIndentEnabled = true;
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
              font: params.exportconfig.font
            },
            pageMargins: pageMargins,
          };
          
          let document = pdfMake.createPdf(docDefinition);
          document.getBuffer(function (buffer) {
            FileSystemService.writeFileSync(params.filepath + '.pdf', buffer);
            if (callback) {
              callback();
            }
          });
        },

        calculateAlignment: function(attribs) {

          let alignment;
          if (!attribs.style || attribs.style.indexOf('text-align: left') > -1) {
            alignment = 'left';
          } else if (attribs.style.indexOf('text-align: center') > -1) {
            alignment = 'center';
          } else if (attribs.style.indexOf('text-align: right') > -1) {
            alignment = 'right';
          } else if (attribs.style.indexOf('text-align: justify') > -1) {
            alignment = 'justify';
          }
          return alignment;
        }

      }, { decodeEntities: true });

      parser.write(params.html);

      parser.end();
    },

    calculateLineHeight: function(linespacing) {
      let lineHeight;
      switch(linespacing) {
      case 10:
        lineHeight = 1;
        break;
      case 13:
        lineHeight = 1.3;
        break;
      case 14:
        lineHeight = 1.4;
        break;
      case 15:
        lineHeight = 1.5;
        break;
      case 20:
        lineHeight = 2;
        break;
      }
      return lineHeight;
    },

    calculateParagraphMarginBottom: function(paragraphspacing) {
      let paragraphMarginBottom;
      switch(paragraphspacing) {
      case 'none':
        paragraphMarginBottom = 0;
        break;
      case 'small':
        paragraphMarginBottom = 5;
        break;
      case 'medium':
        paragraphMarginBottom = 10;
        break;
      case 'large':
        paragraphMarginBottom = 15;
        break;
      case 'double':
        paragraphMarginBottom = 20;
        break;
      }
      return paragraphMarginBottom;
    }
  };
});
