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

angular.module('bibiscoApp').service('DocxExporterService', function (FileSystemService, ImageService, LoggerService) {
  'use strict';

  const htmlparser = require('htmlparser2');
  const docx = require('docx');

  const DEFAULT_FONT_SIZE = 24; // default font size, measured in half-points
  const SMALL_FONT_SIZE = 20; // small font size, measured in half-points
  
  return {
  
    export: function (params, callback) {

      // In OOXML specifications, page dimensions and margins are measured in dxa, while images are measured in emu (https://startbigthinksmall.wordpress.com/2010/01/04/points-inches-and-emus-measuring-units-in-office-open-xml/).
      // However, docx.js accept image dimensions in pixel and internally convert them in emu.
      // Converter: https://unit-converter-bcmmybn3dq-ez.a.run.app/
      // dxa = 1/20 pt
      // emu = 12700 pt
      // pixel = 9525 emu
      const A4_PAGE_WIDTH = 11906; // dxa
      const A4_PAGE_HEIGHT = 16838; // dxa
      const A4_PAGE_HORIZONTAL_MARGIN = 1440; // dxa
      const A4_PAGE_VERTICAL_MARGIN = 1440; // dxa
      const MAX_IMAGE_WIDTH = (A4_PAGE_WIDTH-(A4_PAGE_HORIZONTAL_MARGIN*2)) / 20 * 12700 / 9525; // pixel;
      const MAX_IMAGE_HEIGHT = (A4_PAGE_HEIGHT-(A4_PAGE_VERTICAL_MARGIN*2)) / 20 * 12700 / 9525; // pixel;

      let currentParagraphOptions = null;
      let boldActive = false;
      let italicsActive = false;
      let underlineActive = false;
      let strikeActive = false;
      let subscriptActive = false;
      let superscriptActive = false;
      let smallActive = false;
      let highlightColor = null;
      let linkUrl = null;
      let orderedListActive = false;
      let unorderedListActive = false;
      let h1counter = 0;
      let h2counter = 0;
      let h3counter = 0;
      let regularfontsize = this.calculateRegularFontSize(params.exportconfig.fontsize);
      let smallfontsize = this.calculateSmallFontSize(params.exportconfig.fontsize);
      let spacingconfig = this.calculateSpacingconfig(params.exportconfig);
      let exporthighlightedtext = params.exportconfig.exporthighlightedtext;
      let noteActive = false;
      let footnotesCounter = 0;
      let closeComment = false;
      let commentsCounter = 0;
      let exportcomments = params.exportconfig.exportcomments;

      // Create document children
      let docChildren = [];
      let footnotes = {};
      let comments = {children: []};

      
      let parser = new htmlparser.Parser({

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
              heading: docx.HeadingLevel.HEADING_1,
              outlineLevel: 1,
              alignment: docx.AlignmentType.CENTER,
              spacing: spacingconfig.partitlespacing,
              pageBreakBefore: true
            };
            boldActive = true;

          } else if (name === 'prologue' || name === 'epilogue') {
            currentParagraphOptions = {
              children: [],
              heading: docx.HeadingLevel.HEADING_1,
              outlineLevel: 1,
              spacing: spacingconfig.h1marginspacing,
            };
            if (params.exportconfig.pagebreakonh1) {
              currentParagraphOptions.pageBreakBefore = true;
            }

            boldActive = true;
            currentParagraphOptions.alignment = this.calculateAlignment(attribs);

          } else if (name === 'h1') {
            h1counter += 1;
            currentParagraphOptions = {
              children: [],
              heading: docx.HeadingLevel.HEADING_1,
              outlineLevel: 1,
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
                size: regularfontsize
              });
              currentParagraphOptions.children.push(currentText);
            }
            currentParagraphOptions.alignment = this.calculateAlignment(attribs);

          } else if (name === 'h2') {
            h2counter += 1;
            let spacing = h2counter ===1 ? spacingconfig.h2marginspacing1st : spacingconfig.h2marginspacing;
            currentParagraphOptions = {
              children: [],
              heading: docx.HeadingLevel.HEADING_2,
              spacing: spacing,
            };
            italicsActive = true;
            if (params.exportconfig.hcountingactive) {
              let currentText =  new docx.TextRun({
                text: h1counter + '.' + h2counter + ' ',
                italics: true,
                font: params.exportconfig.font,
                size: regularfontsize
              });

              currentParagraphOptions.children.push(currentText);
            } 
            currentParagraphOptions.alignment = this.calculateAlignment(attribs);

          } else if (name === 'h3') {
            h3counter += 1;
            let spacing = h3counter === 1 ? spacingconfig.h3marginspacing1st : spacingconfig.h3marginspacing;
            currentParagraphOptions = {
              children: [],
              heading: docx.HeadingLevel.HEADING_3,
              spacing: spacing,
            };
            if (params.exportconfig.hcountingactive) {
              let currentText = new docx.TextRun({
                text: h1counter + '.' + h2counter + '.' + h3counter + ' ',
                font: params.exportconfig.font,
                size: regularfontsize
              });
              currentParagraphOptions.children.push(currentText);
            }

          } else if (name === 'toc') {
            currentParagraphOptions = {
              children: [],
              pageBreakBefore: true,
              spacing: spacingconfig.h1marginspacing,
            };
            if (attribs.toctitle) {
              currentParagraphOptions.children.push(new docx.TextRun({
                text: attribs.toctitle,
                font: params.exportconfig.font,
                size: regularfontsize
              }));
            }
            
          } else if (name === 'img') {

            // manage image inside a paragraph: it happens for images added in the text editor
            if (currentParagraphOptions) {
              if (currentParagraphOptions.children.length > 0) {
                // push the content before image in a new paragraph
                docChildren.push(new docx.Paragraph(currentParagraphOptions));
                currentParagraphOptions = this.initParagraphOptionsForParagraph(attribs);
              }
              currentParagraphOptions.imageContainer = true;
              currentParagraphOptions.indent = null; //force indent to null in case of img 
            } 

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

                // push image to a new paragraph
                docChildren.push(new docx.Paragraph({
                  alignment: img.alignment,
                  children: [new docx.ImageRun({
                    data: canvas.toDataURL('image/png', 1),
                    transformation: {
                      width: resizedWidth,
                      height: height / resizedHeightRatio,
                    },
                  })]
                }));

                remainingHeight -= height; 
                initialY += resizedHeightPart;
              }

            } catch (error) {
              LoggerService.error('Error reading image file: ' + error);
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
            currentParagraphOptions = this.initParagraphOptionsForParagraph(attribs);

            if (name === 'li') {
              if (unorderedListActive) {
                currentParagraphOptions.bullet = { level: 0 };
              } else if (orderedListActive) {
                currentParagraphOptions.numbering = { reference: 'letterNumbering', level: 0};
              }
            }
            
          } else if (name === 'note') {
            currentParagraphOptions = this.initParagraphOptionsForNote();            
          } else if (name === 'span') {
            highlightColor = this.getTextBackgroundFromStyleAttribute(attribs.style);
            this.manageFootendnote(attribs);
            this.manageComment(attribs);
          } else if (name === 'b') {
            boldActive = true;
          } else if (name === 'i') {
            italicsActive = true;
          } else if (name === 'u') {
            underlineActive = true;
          } else if (name === 'strike') {
            strikeActive = true;
          } else if (name === 'sub') {
            subscriptActive = true;
          } else if (name === 'sup') {
            superscriptActive = true;
          } else if (name === 'small') {
            smallActive = true;
          } else if (name === 'a') {
            linkUrl = attribs.href;
          }
        },

        ontext: function (text) {

          const NOT_SAFE_IN_XML_1_0 = /[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm;
          let sanitizedText = text.replace(NOT_SAFE_IN_XML_1_0, '');
          if (currentParagraphOptions) {
            
            let currentTextOptions = {
              text: sanitizedText,
              font: params.exportconfig.font,
              size: regularfontsize
            };
 
            if (boldActive) {
              currentTextOptions.bold = true;
            }
            if (italicsActive) {
              currentTextOptions.italics = true;
            }
            if (underlineActive) {
              currentTextOptions.underline = {};
            }
            if (strikeActive) {
              currentTextOptions.strike = true;
            }
            if (subscriptActive) {
              currentTextOptions.subScript = true;
            }
            if (superscriptActive) {
              currentTextOptions.superScript = true;
            }
            if (smallActive) {
              currentTextOptions.size = smallfontsize;
            }
            if (highlightColor) {
              currentTextOptions.shading = {
                type: docx.ShadingType.SOLID,
                color: highlightColor
              };
            }
            if (linkUrl) {
              currentTextOptions.style = 'Hyperlink';
            }

            let textRun = new docx.TextRun(currentTextOptions);
            if (linkUrl) {
              currentParagraphOptions.children.push(new docx.ExternalHyperlink({
                children: [textRun], link: linkUrl
              }),);
            } else {
              currentParagraphOptions.children.push(textRun);
            }

          }
        },

        onclosetag: function (name) {

          if (name === 'exporttitle' || name === 'exportauthor' || name === 'exportsubtitle' || name === 'parttitle') {
            docChildren.push(new docx.Paragraph(currentParagraphOptions));
            currentParagraphOptions = null;
            boldActive = false;

          } else if (name === 'toc') {
            docChildren.push(new docx.Paragraph(currentParagraphOptions));
            docChildren.push(new docx.TableOfContents(params.exportconfig.toctranslation, {
              hyperlink: true
            }));
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
          } else if ( name === 'p' || name === 'li' || name === 'note') {
            if (currentParagraphOptions && !(currentParagraphOptions.imageContainer && currentParagraphOptions.children.length===0)) {
              docChildren.push(new docx.Paragraph(currentParagraphOptions));
            }
            currentParagraphOptions = null;
          } else if (name === 'span') {
            highlightColor = null;
            if (noteActive) {
              currentParagraphOptions.children.push(new docx.FootnoteReferenceRun(footnotesCounter)); 
              noteActive = false;
            }
            if (closeComment) {
              currentParagraphOptions.children.push(new docx.CommentRangeEnd(commentsCounter));
              currentParagraphOptions.children.push(new docx.TextRun({
                children: [new docx.CommentReference(commentsCounter)],
              }));
              closeComment = false;
            }
          } else if (name === 'b') {
            boldActive = false;
          } else if (name === 'i') {
            italicsActive = false;
          } else if (name === 'u') {
            underlineActive = false;
          } else if (name === 'strike') {
            strikeActive = false;
          } else if (name === 'sub') {
            subscriptActive = false;
          } else if (name === 'sup') {
            superscriptActive = false;
          } else if (name === 'small') {
            smallActive = false;
          } else if (name === 'a') {
            linkUrl = null;
          }
        },

        onend: function() {

          let evenPageNumberAlignment = docx.AlignmentType.CENTER;
          let oddPageNumberAlignment = docx.AlignmentType.CENTER;
          let headerPageNumberText;
          let headerFirstPageNumberText;
          let footerPageNumberText;
          let footerFirstPageNumberText;
          if(params.exportconfig.pagenumberposition === ('header') || params.exportconfig.pagenumberposition === ('footer')) {
              
            switch (params.exportconfig.pagenumberalignment) {
            case 'left':
              evenPageNumberAlignment = docx.AlignmentType.LEFT;
              oddPageNumberAlignment = docx.AlignmentType.LEFT;
              break;
            case 'center':
              evenPageNumberAlignment = docx.AlignmentType.CENTER;
              oddPageNumberAlignment = docx.AlignmentType.CENTER;
              break;
            case 'right':
              evenPageNumberAlignment = docx.AlignmentType.RIGHT;
              oddPageNumberAlignment = docx.AlignmentType.RIGHT;
              break;
            case 'even_odd':
              evenPageNumberAlignment = docx.AlignmentType.RIGHT;
              oddPageNumberAlignment = docx.AlignmentType.LEFT;
              break;
            }

            let pageNumberText;
            switch (params.exportconfig.pagenumberformat) {
            case 'number':
              pageNumberText = [docx.PageNumber.CURRENT];
              break;
            case 'numberandcount':
              pageNumberText = [docx.PageNumber.CURRENT, ' ' + params.exportconfig.commonoftranslation + ' ', docx.PageNumber.TOTAL_PAGES];
              break;
            case 'pageandnumberandcount':
              pageNumberText = [params.exportconfig.commonpagetranslation + ' ', docx.PageNumber.CURRENT, ' ' + params.exportconfig.commonoftranslation + ' ', docx.PageNumber.TOTAL_PAGES];
              break;
            }
            let firstPageNumberText = params.exportconfig.showfirstpagenumber === 'true' ? pageNumberText : '';

            if(params.exportconfig.pagenumberposition === ('header')) {
              headerPageNumberText = pageNumberText;
              headerFirstPageNumberText = firstPageNumberText;
            } else if(params.exportconfig.pagenumberposition === ('footer')) {
              footerPageNumberText = pageNumberText;
              footerFirstPageNumberText = firstPageNumberText;
            }
          }

          let doc = new docx.Document({
            footnotes: footnotes,
            comments: comments,
            evenAndOddHeaderAndFooters: true,
            creator: params.exportconfig.author,
            title: params.exportconfig.title,
            features: {
              updateFields: true,
            },
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
                        size: regularfontsize
                      }
                    },
                  }],
                reference: 'letterNumbering'
              }]
            },
            sections: [{
              properties: {
                titlePage: true,
                page: {
                  margin: {
                    top: A4_PAGE_VERTICAL_MARGIN,
                    right: A4_PAGE_HORIZONTAL_MARGIN,
                    bottom: A4_PAGE_VERTICAL_MARGIN,
                    left: A4_PAGE_HORIZONTAL_MARGIN,
                  },
                }
              },
              headers: {
                default: new docx.Header({
                  children: [
                    new docx.Paragraph({
                      alignment: oddPageNumberAlignment,
                      children: [new docx.TextRun({
                        children: headerPageNumberText,
                      })]
                    }),
                  ],
                },),
                even: new docx.Header({
                  children: [
                    new docx.Paragraph({
                      alignment: evenPageNumberAlignment,
                      children: [new docx.TextRun({
                        children: headerPageNumberText,
                      })]
                    }),
                  ],
                },),
                first: new docx.Header({
                  children: [
                    new docx.Paragraph({
                      alignment: oddPageNumberAlignment,
                      children: [new docx.TextRun({
                        children: headerFirstPageNumberText,
                      })]
                    }),
                  ],
                },)
              },
              footers: {
                default: new docx.Footer({
                  children: [
                    new docx.Paragraph({
                      alignment: oddPageNumberAlignment,
                      children: [new docx.TextRun({
                        children: footerPageNumberText,
                      })]
                    }),
                  ],
                },),
                even: new docx.Footer({
                  children: [
                    new docx.Paragraph({
                      alignment: evenPageNumberAlignment,
                      children: [new docx.TextRun({
                        children: footerPageNumberText,
                      })]
                    }),
                  ],
                },),
                first: new docx.Footer({
                  children: [
                    new docx.Paragraph({
                      alignment: oddPageNumberAlignment,
                      children: [new docx.TextRun({
                        children: footerFirstPageNumberText,
                      })]
                    }),
                  ],
                },)
              },
              children: docChildren
            }]});

          docx.Packer.toBuffer(doc).then((buffer) => {
            FileSystemService.writeFileSync(params.filepath + '.docx', buffer);
            if (callback) {
              callback();
            }
          });
        },

        initParagraphOptionsForParagraph: function(attribs) {
          let alignment = this.calculateAlignment(attribs);
          return {
            alignment: alignment,
            children: [],
            indent: params.exportconfig.indent && alignment !== docx.AlignmentType.CENTER? { firstLine: 600 } : null,
            spacing: spacingconfig.paragraphspacing,
          };
        },


        initParagraphOptionsForNote: function() {
          return {
            alignment: docx.AlignmentType.JUSTIFIED,
            children: [],
            indent: null,
            spacing: spacingconfig.paragraphspacing,
          };
        },

        calculateAlignment: function(attribs) {

          let alignment;
          let style = attribs.style;
          if (!style) {
            return docx.AlignmentType.LEFT;
          }
          style = style.replace(/\s/g, '');
          if (style.indexOf('text-align:left') > -1) {
            alignment = docx.AlignmentType.LEFT;
          } else if (style.indexOf('text-align:center') > -1) {
            alignment = docx.AlignmentType.CENTER;
          } else if (style.indexOf('text-align:right') > -1) {
            alignment = docx.AlignmentType.RIGHT;
          } else if (style.indexOf('text-align:justify') > -1) {
            alignment = docx.AlignmentType.JUSTIFIED;;
          }
          return alignment;
        },

        getTextBackgroundFromStyleAttribute: function(style) {

          if (!exporthighlightedtext || !style) {
            return null;
          }
          style = style.replace(/\s/g, '');
          if (style.indexOf('background-color:rgb(0,255,255)') > -1) { // aqua
            return '00FFFF';
          } else if (style.indexOf('background-color:rgb(0,255,0)') > -1) { // lime
            return '00FF00';
          } else if (style.indexOf('background-color:rgb(255,165,0)') > -1) { // orange
            return 'FFA500';      
          } else if (style.indexOf('background-color:rgb(255,133,250)') > -1) { // pink
            return 'FF85FA';
          } else if (style.indexOf('background-color:rgb(255,0,0)') > -1) { // red
            return 'FF0000';
          } else if (style.indexOf('background-color:rgb(255,255,0)') > -1) { // yellow
            return 'FFFF00';
          }
    
          return null;
        },

        manageFootendnote: function(attribs) {

          const footendnotemode = params.exportconfig.footendnotemode;
          if (attribs.class && attribs.class.indexOf('footendnote') > -1) {
            footnotesCounter++;
            if (footendnotemode === 'footnote') {
              footnotes[footnotesCounter] = {children: [new docx.Paragraph(attribs['data-note'])] };
              noteActive = true;
            } else if (footendnotemode === 'chapterend' || footendnotemode === 'bookend') {
              let textRun = new docx.TextRun({
                text: footnotesCounter.toString(),
                font: params.exportconfig.font,
                size: regularfontsize,
                superScript: true
              });
              currentParagraphOptions.children.push(textRun);
            }
          }
        },

        manageComment: function(attribs) {
          if (exportcomments === 'true' && attribs['data-iscomment'] && attribs['data-iscomment'] === 'true') {

            if (attribs.class.indexOf('comment-beginning') > -1) {
              commentsCounter++;       
              comments.children.push({
                id: commentsCounter,
                author: params.exportconfig.author,
                date: new Date(),
                children: [
                  new docx.Paragraph({
                    children: [
                      new docx.TextRun({
                        text: attribs['data-comment']
                      })
                    ],
                  }),
                ],
              });
              currentParagraphOptions.children.push(new docx.CommentRangeStart(commentsCounter));
            }

            if (attribs.class.indexOf('comment-end') > -1) {
              closeComment = true;
            }
          }
        },

      }, { decodeEntities: true });


      let images = [];
      ImageService.getImagesFromHtml(params.html, function(result) {
        images = result;
        // replace all &nbsp; with white spaces
        let html = params.html.replace(/&nbsp;/g, ' ');
        parser.write(html);
        parser.end();
      });
    },

    calculateRegularFontSize: function(fontSize) {
      let smallFontSize;
      switch(fontSize) {
      case 8:
        smallFontSize = 16;
        break;
      case 10:
        smallFontSize = 20;
        break;
      case 12:
        smallFontSize = 24;
        break;
      case 14:
        smallFontSize = 28;
        break;
      case 16:
        smallFontSize = 32;
        break;
      }
      return smallFontSize;
    },

    calculateSmallFontSize: function(fontSize) {
      let smallFontSize;
      switch(fontSize) {
      case 8:
        smallFontSize = 13;
        break;
      case 10:
        smallFontSize = 17;
        break;
      case 12:
        smallFontSize = 20;
        break;
      case 14:
        smallFontSize = 23;
        break;
      case 16:
        smallFontSize = 27;
        break;
      }
      return smallFontSize;
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
