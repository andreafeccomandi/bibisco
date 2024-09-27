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

angular.module('bibiscoApp').service('PdfExporterService', function (FileSystemService, ImageService, LoggerService) {
  'use strict';

  let htmlparser = require('htmlparser2');

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

      const DEFAULT_FONT_SIZE = 12;
      const SMALL_FONT_SIZE = 10;
      const A4_PAGE_WIDTH = 595.35;
      const A4_PAGE_HEIGHT = 841.995;
      const A4_PAGE_HORIZONTAL_MARGIN = 60;
      const A4_PAGE_VERTICAL_MARGIN = 100;
      const MAX_IMAGE_WIDTH = A4_PAGE_WIDTH - 2*A4_PAGE_HORIZONTAL_MARGIN;
      const MAX_IMAGE_HEIGHT = Math.floor(A4_PAGE_HEIGHT - 2*A4_PAGE_VERTICAL_MARGIN);
      const HEADER_MARGIN_TOP = 30;
      const FOOTER_MARGIN_TOP = 50;
      const PAGE_MARGINS = [A4_PAGE_HORIZONTAL_MARGIN, A4_PAGE_VERTICAL_MARGIN, A4_PAGE_HORIZONTAL_MARGIN, A4_PAGE_VERTICAL_MARGIN];
      const HEADER_MARGINS = [A4_PAGE_HORIZONTAL_MARGIN, HEADER_MARGIN_TOP, A4_PAGE_HORIZONTAL_MARGIN, 0];
      const FOOTER_MARGINS = [A4_PAGE_HORIZONTAL_MARGIN, FOOTER_MARGIN_TOP, A4_PAGE_HORIZONTAL_MARGIN, 0];
      const COMMENT_HIGHLIGHT_COLOR = '#f1e4bd';
      
      let content = [];
      let currentList = [];
      let currentText;
      let boldActive = false;
      let italicsActive = false;
      let underlineActive = false;
      let strikeActive = false;
      let smallActive = false;
      let subActive = false;
      let supActive = false;
      let highlightColor = null;
      let linkUrl = null;
      let lineHeight = this.calculateLineHeight(params.exportconfig.linespacing);
      let alignment;
      let h1counter = 0;
      let h2counter = 0;
      let h3counter = 0;
      let leadingIndent = params.exportconfig.indent ? 30 : 0;
      let leadingIndentEnabled = true;
      let exporthighlightedtext = params.exportconfig.exporthighlightedtext;
      let footnotesCounter = 0;
      let exportcomments = params.exportconfig.exportcomments;
      let closeComment = false;
      let comment = null;

      let regularFontSize = parseInt(params.exportconfig.fontsize);
      let smallFontSize = this.calculateSmallFontSize(regularFontSize);
      let paragraphMarginBottom = this.calculateParagraphMarginBottom(params.exportconfig.paragraphspacing);
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
            leadingIndentEnabled = false;
          } else if (name === 'exportauthor') {
            currentText = [];
            boldActive = false;
            leadingIndentEnabled = false;
          } else if (name === 'exportsubtitle') {
            currentText = [];
            boldActive = false;
          } else if (name === 'parttitle') {
            currentText = [];
            boldActive = true;
            leadingIndentEnabled = false;
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
            alignment = this.calculateAlignment(attribs);
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
          } else if (name === 'toc') {
            let toctitle = attribs.toctitle ? attribs.toctitle : '';
            content.push({
              toc: {
                title: {
                  text: toctitle, 
                  pageBreak: 'before',
                  margin: h1Margins
                }
              }
            });
          } else if (name === 'question') {
            currentText = [];
            boldActive = true;
            italicsActive = true;
          } else if (name === 'ul' || name === 'ol') {
            currentList = [];
          } else if (name === 'p' || name === 'li') {
            currentText = [];
            alignment = this.calculateAlignment(attribs);
            if (alignment === 'center'|| name === 'li') {
              leadingIndentEnabled = false;
            } else {
              leadingIndentEnabled = true;
            }
          } else if (name === 'note') {
            leadingIndentEnabled = false;     
            alignment = 'justify';     
          } else if (name === 'span') {
            this.manageFootendnote(attribs);
            this.manageComment(attribs);
            this.manageHighlightColor(attribs);
          } else if (name === 'b') {
            boldActive = true;
          } else if (name === 'i') {
            italicsActive = true;
          } else if (name === 'u') {
            underlineActive = true;
          } else if (name === 'strike') {
            strikeActive = true;
          } else if (name === 'small') {
            smallActive = true;
          } else if (name === 'sub') {
            subActive = true;
            smallActive = true;
          } else if (name === 'sup') {
            supActive = true;
            smallActive = true;
          } else if (name === 'a') {
            linkUrl = attribs.href;
          } else if (name === 'img') {
            try {
              let img = images[attribs.filename];
              
              let resizedWidth = MAX_IMAGE_WIDTH * img.widthpercent / 100;
              let resizedHeight = resizedWidth / img.widthheightratio;
              let resizedHeightRatio= img.img.height / resizedHeight;
              let resizedHeightPart = MAX_IMAGE_HEIGHT * resizedHeightRatio;
              let remainingHeight = img.img.height;
              let initialY = 0;
                            
              while (remainingHeight > 0) {

                let height = remainingHeight > resizedHeightPart ? resizedHeightPart : remainingHeight;

                let canvas = document.createElement('canvas');;
                canvas.width = img.img.width;
                canvas.height = height;
                let ctx = canvas.getContext('2d');

                //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
                ctx.drawImage(img.img, 0, initialY, img.img.width, height, 0, 0, img.img.width, height);

                // push image to content
                content.push({
                  image: canvas.toDataURL('image/png', 1),
                  width: resizedWidth,
                  alignment: img.alignment,
                  margin: paragraphMargins
                });

                remainingHeight -= height; 
                initialY += resizedHeightPart;
              }

            } catch (error) {
              LoggerService.error('Error reading image file: ' + error);
            }
          }
        },

        ontext: function (text) {
          let decoration = [];
          let fontSize = regularFontSize;

          if (underlineActive || linkUrl) {
            decoration.push('underline');
          }
          if (strikeActive) {
            decoration.push('lineThrough');
          }
          if (smallActive) {
            fontSize = smallFontSize;
          }

          let textElement = {
            text: text,
            bold: boldActive,
            italics: italicsActive,
            decoration: decoration,
            preserveLeadingSpaces: true,
            lineHeight: lineHeight,
            leadingIndent: leadingIndentEnabled ? leadingIndent : 0,
            sup: supActive,
            sub: subActive,
            fontSize: fontSize
          };

          if (highlightColor) {
            textElement.background = highlightColor;
          }
        
          if (linkUrl) {
            textElement.link = linkUrl;
            textElement.color = 'blue';
          }

          currentText.push(textElement);
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
              pageBreak: 'before',
              tocItem: true
            });
            currentText = [];
            boldActive = false;
            leadingIndentEnabled = true;
          } else if (name === 'prologue' || name === 'epilogue') {
            let pageBreak = params.exportconfig.pagebreakonh1 ? 'before' : null;
            content.push({
              text: currentText,
              alignment: alignment,
              margin: h1Margins,
              pageBreak: pageBreak,
              tocItem: currentText && currentText.length > 0 ? true : false
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
              pageBreak: pageBreak,
              tocItem: currentText && currentText.length > 0 ? true : false
            });
            currentText = [];
            leadingIndentEnabled = true;
            boldActive = false;
            h2counter = 0;
          } else if (name === 'h2') {
            content.push({
              text: currentText,
              alignment: alignment,
              margin: h2counter === 1 ? h2Margins1st : h2Margins,
              tocItem: currentText && currentText.length > 0 ? true : false
            });
            currentText = [];
            leadingIndentEnabled = true;
            italicsActive = false;
            h3counter = 0;
          } else if (name === 'h3') {
            content.push({
              text: currentText,
              margin: h3counter === 1 ? h3Margins1st : h3Margins,
              tocItem: currentText && currentText.length > 0 ? true : false
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
          } else if (name === 'p' || name === 'note') {
            content.push({
              text: currentText,
              alignment: alignment,
              margin: paragraphMargins
            });
            currentText = [];
          } else if (name === 'span') {
            if (closeComment) {
              currentText.push({
                text: '[['+comment+']]',
                italics: true,
                background: COMMENT_HIGHLIGHT_COLOR
              });
              closeComment = false;
              comment = null;
            }
            highlightColor = null;
          } else if (name === 'b') {
            boldActive = false;
          } else if (name === 'i') {
            italicsActive = false;
          } else if (name === 'u') {
            underlineActive = false;
          } else if (name === 'strike') {
            strikeActive = false;
          } else if (name === 'small') {
            smallActive = false;
          } else if (name === 'sub') {
            subActive = false;
            smallActive = false;
          } else if (name === 'sup') {
            supActive = false;
            smallActive = false;
          } else if (name === 'a') {
            linkUrl = null;
          }
        },

        onend: function() {
          let docDefinition = {
            content: content,
            defaultStyle: {
              font: params.exportconfig.font
            },
            pageMargins: PAGE_MARGINS,
          };

          if(params.exportconfig.pagenumberposition === ('header') || params.exportconfig.pagenumberposition === ('footer')) {
            
            let margin;
            switch (params.exportconfig.pagenumberposition) {
            case 'header':
              margin = HEADER_MARGINS;
              break;
            case 'footer':
              margin = FOOTER_MARGINS;
              break;
            }

            let paginationFunction = function(currentPage, pageCount) { 
              let text;
              if (currentPage === 1 && params.exportconfig.showfirstpagenumber === 'false') {
                text = '';
              } else {
                switch (params.exportconfig.pagenumberformat) {
                case 'number':
                  text = currentPage;
                  break;
                case 'numberandcount':
                  text = currentPage + ' ' + params.exportconfig.commonoftranslation + ' ' + pageCount;
                  break;
                case 'pageandnumberandcount':
                  text = params.exportconfig.commonpagetranslation + ' ' + currentPage + ' ' + params.exportconfig.commonoftranslation + ' ' + pageCount;
                  break;
                }
              }

              let alignment;
              switch (params.exportconfig.pagenumberalignment) {
              case 'left':
                alignment = 'left';
                break;
              case 'center':
                alignment = 'center';
                break;
              case 'right':
                alignment = 'right';
                break;
              case 'even_odd':
                alignment = (currentPage % 2) ? 'left' : 'right';
                break;
              }
              
              return {
                margin: margin,
                columns: [{alignment: alignment, text: text}]
              };
            };

            if (params.exportconfig.pagenumberposition === ('header')) {
              docDefinition.header = paginationFunction;
            } else if (params.exportconfig.pagenumberposition === ('footer')) {
              docDefinition.footer = paginationFunction;
            }
          };
          
          let document = pdfMake.createPdf(docDefinition);
          document.getBuffer(function (buffer) {
            FileSystemService.writeFileSync(params.filepath + '.pdf', buffer);
            if (callback) {
              callback();
            }
          });
        },

        manageFootendnote: function(attribs) {

          const footendnotemode = params.exportconfig.footendnotemode;
          if (attribs.class && attribs.class.indexOf('footendnote') > -1) {
            footnotesCounter++;
            if (footendnotemode === 'chapterend' || footendnotemode === 'bookend') {
              let textElement = {
                text: footnotesCounter.toString(),
                bold: boldActive,
                italics: italicsActive,
                decoration: [],
                preserveLeadingSpaces: true,
                lineHeight: lineHeight,
                leadingIndent: leadingIndentEnabled ? leadingIndent : 0,
                sup: true,
                fontSize: SMALL_FONT_SIZE
              };      
              currentText.push(textElement);
            }
          }
        },

        manageComment: function(attribs) {

          if (exportcomments === 'true' && attribs['data-iscomment'] && attribs['data-iscomment'] === 'true') {
            highlightColor = COMMENT_HIGHLIGHT_COLOR;
            if (attribs.class.indexOf('comment-end') > -1) {
              comment = attribs['data-comment'];
              closeComment = true;
            }
          }
        },

        calculateAlignment: function(attribs) {

          let alignment;
          let style = attribs.style;
          if (!style) {
            return 'left';
          }
          style = style.replace(/\s/g, '');
          if (style.indexOf('text-align:left') > -1) {
            alignment = 'left';
          } else if (style.indexOf('text-align:center') > -1) {
            alignment = 'center';
          } else if (style.indexOf('text-align:right') > -1) {
            alignment = 'right';
          } else if (style.indexOf('text-align:justify') > -1) {
            alignment = 'justify';
          }
          return alignment;
        },

        manageHighlightColor: function(attribs) {

          let style = attribs.style;
          if (!exporthighlightedtext || !style) {
            return;
          }
          style = style.replace(/\s/g, '');
          if (style.indexOf('background-color:rgb(0,255,255)') > -1) { // aqua
            highlightColor='#00FFFF';
          } else if (style.indexOf('background-color:rgb(0,255,0)') > -1) { // lime
            highlightColor='#00FF00';
          } else if (style.indexOf('background-color:rgb(255,165,0)') > -1) { // orange
            highlightColor='#FFA500';      
          } else if (style.indexOf('background-color:rgb(255,133,250)') > -1) { // pink
            highlightColor='#FF85FA';
          } else if (style.indexOf('background-color:rgb(255,0,0)') > -1) { // red
            highlightColor='#FF0000';
          } else if (style.indexOf('background-color:rgb(255,255,0)') > -1) { // yellow
            highlightColor='#FFFF00';
          }
        },

      }, { decodeEntities: true });

      let images = [];
      ImageService.getImagesFromHtml(params.html, function(result) {
        images = result;
        parser.write(params.html);
        parser.end();
      });
    },

    calculateSmallFontSize: function(regularFontSize) {
      let smallFontSize;
      switch(regularFontSize) {
      case 8:
        smallFontSize = 6.7;
        break;
      case 10:
        smallFontSize = 8.3;
        break;
      case 12:
        smallFontSize = 10;
        break;
      case 14:
        smallFontSize = 11.7;
        break;
      case 16:
        smallFontSize = 13.3;
        break;
      }
      return smallFontSize;
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
    }, 
  };
});
