/*
 * Copyright (C) 2014-2023 Andrea Feccomandi
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

angular.module('bibiscoApp').service('DocxExporterService', function (FileSystemService) {
  'use strict';

  var htmlparser = require('htmlparser2');
  var docx = require('docx');

  let fontSize = 24; // font size, measured in half-points
  
  return {
  
    export: function (params, callback) {

      let currentParagraphOptions = null;
      let boldActive = false;
      let italicsActive = false;
      let underlineActive = false;
      let strikeActive = false;
      let orderedListActive = false;
      let unorderedListActive = false;
      let h1counter = 0;
      let h2counter = 0;
      let h3counter = 0;
      let spacingconfig = this.calculateSpacingconfig(params.exportconfig);
    
      // Create document children
      let docChildren = [];

      var parser = new htmlparser.Parser({

        onopentag: function (name, attribs) {

          if (name === 'exporttitle') {
            currentParagraphOptions = {
              children: [],
              alignment: docx.AlignmentType.CENTER,
              spacing: spacingconfig.exportitlespacing,
            };
            boldActive = true;

          } else if (name === 'exportauthor') {
            currentParagraphOptions = {
              children: [],
              alignment: docx.AlignmentType.CENTER,
            };
            boldActive = false;

          } else if (name === 'exportsubtitle') {
            currentParagraphOptions = {
              children: [],
              alignment: docx.AlignmentType.CENTER,
            };
            boldActive = false;

          } else if (name === 'parttitle') {
            currentParagraphOptions = {
              children: [],
              alignment: docx.AlignmentType.CENTER,
              spacing: spacingconfig.partitlespacing,
              pageBreakBefore: true
            };
            boldActive = true;

          } else if (name === 'prologue' || name === 'epilogue') {
            currentParagraphOptions = {
              children: [],
              spacing: spacingconfig.h1marginspacing,
            };
            if (params.exportconfig.pagebreakonh1) {
              currentParagraphOptions.pageBreakBefore = true;
            }

            boldActive = true;
            currentParagraphOptions.alignment = this.getAlignment(attribs);

          } else if (name === 'h1') {
            h1counter += 1;
            currentParagraphOptions = {
              children: [],
              spacing: spacingconfig.h1marginspacing,
            };
            if (params.exportconfig.pagebreakonh1) {
              currentParagraphOptions.pageBreakBefore = true;
            }
            boldActive = true;
            if (params.exportconfig.hcountingactive) {
              let currentText = new docx.TextRun({
                text: h1counter + ' ',
                bold: true,
                font: params.exportconfig.font,
                size: fontSize
              });
              currentParagraphOptions.children.push(currentText);
            }
            currentParagraphOptions.alignment = this.getAlignment(attribs);

          } else if (name === 'h2') {
            h2counter += 1;
            let spacing = h2counter ===1 ? spacingconfig.h2marginspacing1st : spacingconfig.h2marginspacing;
            currentParagraphOptions = {
              children: [],
              spacing: spacing,
            };
            italicsActive = true;
            if (params.exportconfig.hcountingactive) {
              let currentText =  new docx.TextRun({
                text: h1counter + '.' + h2counter + ' ',
                italics: true,
                font: params.exportconfig.font,
                size: fontSize
              });

              currentParagraphOptions.children.push(currentText);
            } 

          } else if (name === 'h3') {
            h3counter += 1;
            let spacing = h3counter === 1 ? spacingconfig.h3marginspacing1st : spacingconfig.h3marginspacing;
            currentParagraphOptions = {
              children: [],
              spacing: spacing,
            };
            if (params.exportconfig.hcountingactive) {
              let currentText = new docx.TextRun({
                text: h1counter + '.' + h2counter + '.' + h3counter + ' ',
                font: params.exportconfig.font,
                size: fontSize
              });
              currentParagraphOptions.children.push(currentText);
            }

          } else if (name === 'question') {
            currentParagraphOptions = {
              children: [],
              spacing: spacingconfig.paragraphspacing,
            };
            boldActive = true;
            italicsActive = true;
        
          } else if (name === 'ul') {
            unorderedListActive = true;
          } else if (name === 'ol') {
            orderedListActive = true;
          } else if (name === 'p' || name === 'li') {
            currentParagraphOptions = {
              children: [],
              spacing: spacingconfig.paragraphspacing,
            };

            // alignment
            currentParagraphOptions.alignment = this.getAlignment(attribs);

            // indent
            if (params.exportconfig.indent) {
              currentParagraphOptions.indent = { firstLine: 600 };
            }

            if (name === 'li') {
              if (unorderedListActive) {
                currentParagraphOptions.bullet = { level: 0 };
              } else if (orderedListActive) {
                currentParagraphOptions.numbering = { reference: 'letterNumbering', level: 0};
              }
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

          const NOT_SAFE_IN_XML_1_0 = /[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm;
          let sanitizedText = text.replace(NOT_SAFE_IN_XML_1_0, '');
          if (currentParagraphOptions) {
            
            let currentTextOptions = {
              text: sanitizedText,
              font: params.exportconfig.font,
              size: fontSize
            };
 
            if (boldActive) {
              currentTextOptions.bold = true;
            }
            if(italicsActive) {
              currentTextOptions.italics = true;
            }
            if (underlineActive) {
              currentTextOptions.underline = {};
            }
            if (strikeActive) {
              currentTextOptions.strike = true;
            }

            currentParagraphOptions.children.push(new docx.TextRun(currentTextOptions));
          }
        },

        onclosetag: function (name) {

          if (name === 'exporttitle' || name === 'exportauthor' || name === 'exportsubtitle' || name === 'parttitle') {
            docChildren.push(new docx.Paragraph(currentParagraphOptions));
            currentParagraphOptions = null;
            boldActive = false;

          } else if (name === 'prologue' || name === 'epilogue') {
            docChildren.push(new docx.Paragraph(currentParagraphOptions));
            currentParagraphOptions = null;
            boldActive = false;

          } else if (name === 'h1') {
            docChildren.push(new docx.Paragraph(currentParagraphOptions));
            currentParagraphOptions = null;
            boldActive = false;
            h2counter = 0;

          } else if (name === 'h2') {
            docChildren.push(new docx.Paragraph(currentParagraphOptions));
            currentParagraphOptions = null;;
            italicsActive = false;
            h3counter = 0;

          } else if (name === 'h3') {
            docChildren.push(new docx.Paragraph(currentParagraphOptions));
            currentParagraphOptions = null;

          } else if (name === 'question') {
            docChildren.push(new docx.Paragraph(currentParagraphOptions));
            currentParagraphOptions = null;
            boldActive = false;
            italicsActive = false;

          } else if (name === 'ul') {
            unorderedListActive = false;
          } else if (name === 'ol') {
            orderedListActive = false;
          } else if ( name === 'p' || name === 'li') {
            if (currentParagraphOptions) {
              docChildren.push(new docx.Paragraph(currentParagraphOptions));
            }
            currentParagraphOptions = null;
          } else if (name === 'b') {
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
          let doc = new docx.Document({
            creator: params.exportconfig.author,
            title: params.exportconfig.title,
            numbering: {
              config: [{
                levels: [
                  {
                    level: 0,
                    format: 'decimal',
                    text: '%1. ',
                    alignment: docx.AlignmentType.LEFT,
                    style: {
                      paragraph: {
                        indent: { left: 720, hanging: 260 },
                      },
                      run: {
                        font: params.exportconfig.font,
                        size: fontSize
                      }
                    },
                  }],
                reference: 'letterNumbering'
              }]
            },
            sections: [{
              properties: {},
              children: docChildren
            }]});

          docx.Packer.toBuffer(doc).then((buffer) => {
            FileSystemService.writeFileSync(params.filepath + '.docx', buffer);
            if (callback) {
              callback();
            }
          });
        },

        getAlignment: function(attribs) {
          if (!attribs.style || attribs.style.indexOf('text-align: left') > -1) {
            return docx.AlignmentType.LEFT;
          } else if (attribs.style.indexOf('text-align: center') > -1) {
            return docx.AlignmentType.CENTER;
          } else if (attribs.style.indexOf('text-align: right') > -1) {
            return docx.AlignmentType.RIGHT;
          } else if (attribs.style.indexOf('text-align: justify') > -1) {
            return docx.AlignmentType.JUSTIFIED;
          }
        }

      }, { decodeEntities: true });

      // replace all &nbsp; with white spaces
      let html = params.html.replace(/&nbsp;/g, ' ');
      parser.write(html);
      parser.end();
    },

    calculateSpacingconfig: function(exportconfig) {

      let linespacing;
      switch(exportconfig.linespacing) {
      case 10:
        linespacing = 250;
        break;
      case 13:
        linespacing = 325;
        break;
      case 14:
        linespacing = 350;
        break;
      case 15:
        linespacing = 375;
        break;
      case 20:
        linespacing = 500;
        break;
      }

      let paragraphspacing;
      switch(exportconfig.paragraphspacing) {
      case 'none':
        paragraphspacing = 0;
        break;
      case 'small':
        paragraphspacing = 125;
        break;
      case 'medium':
        paragraphspacing = 250;
        break;
      case 'large':
        paragraphspacing = 375;
        break;
      case 'double':
        paragraphspacing = 500;
        break;
      }

      return {
        exportitlespacing: { before: 5500, after: 200, line: linespacing },
        partitlespacing: { before: 5500, after: 200, line: linespacing },
        h1marginspacing: { after: 400, before: 0, line: linespacing },
        h2marginspacing1st: { after: paragraphspacing, before: 0, line: linespacing },
        h2marginspacing: { after: paragraphspacing, before: paragraphspacing, line: linespacing },
        h3marginspacing1st: { after: paragraphspacing, line: linespacing },
        h3marginspacing: { after: paragraphspacing, before: paragraphspacing, line: linespacing },
        paragraphspacing: { after: paragraphspacing, line: linespacing }
      };
    }
  };
});
