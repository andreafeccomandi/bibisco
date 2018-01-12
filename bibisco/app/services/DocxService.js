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

angular.module('bibiscoApp').service('DocxService', function () {
  'use strict';

  var remote = require('electron').remote;
  var htmlparser = remote.getGlobal('htmlparser');
  var docx = remote.getGlobal('docx');
  
  return {
  
    export: function (options) {

      let currentParagraph = null;
      let boldActive = false;
      let italicsActive = false;
      let underlineActive = false;
      let strikeActive = false;
      let orderedListActive = false;
      let unorderedListActive = false;
    
      const numbering = new docx.Numbering();
      const numberedAbstract = numbering.createAbstractNumbering();
      numberedAbstract.createLevel(0, 'decimal', '%1. ', 'left');
      const letterNumbering = numbering.createConcreteNumbering(numberedAbstract);

      let fontSize = 24; // font size, measured in half-points

      // Create document
      let doc = new docx.Document();

      var parser = new htmlparser.Parser({

        onopentag: function (name, attribs) {

          if (name === 'ul') {
            unorderedListActive = true;
          } else if (name === 'ol') {
            orderedListActive = true;
          } else if(name === 'h1') {
            currentParagraph = new docx.Paragraph();
            currentParagraph.heading1();
          } else if (name === 'h2') {
            currentParagraph = new docx.Paragraph();
            currentParagraph.heading2();
          } else if (name === 'h3') {
            currentParagraph = new docx.Paragraph();
            currentParagraph.heading3();
          } else if (name === 'h4') {
            currentParagraph = new docx.Paragraph();
            currentParagraph.heading4();
          } else if (name === 'h5') {
            currentParagraph = new docx.Paragraph();
            currentParagraph.heading5();
          } else if (name === 'title') {
            currentParagraph = new docx.Paragraph();
            currentParagraph.title();
          } else if (name === 'p' || name === 'li') {

            currentParagraph = new docx.Paragraph();

            // spacing
            currentParagraph.spacing({ after: 100 });
            
            // alignment
            if (!attribs.style || attribs.style.indexOf('text-align: left') > -1) {
              currentParagraph.left();
            } else if (attribs.style.indexOf('text-align: center') > -1) {
              currentParagraph.center();
            } else if (attribs.style.indexOf('text-align: right') > -1) {
              currentParagraph.right();
            } else if (attribs.style.indexOf('text-align: justify') > -1) {
              currentParagraph.justified();
            }

            // indent
            if (options.indent) {
              currentParagraph.indent({ firstLine: 600 });
            }

            if (name === 'li') {
              if (unorderedListActive) {
                currentParagraph.bullet();
              } else if (orderedListActive) {
                currentParagraph.setNumbering(letterNumbering, 0);
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

          if (currentParagraph) {

            let currentText = new docx.TextRun(text);
            currentText.size(fontSize);
            currentText.font(options.font);
 
            if (boldActive) {
              currentText.bold();
            }
            if(italicsActive) {
              currentText.italic();
            }
            if (underlineActive) {
              currentText.underline();
            }
            if (strikeActive) {
              currentText.strike();
            }
            currentParagraph.addRun(currentText);
          }
        },

        onclosetag: function (name) {

          if (name === 'ul') {
            unorderedListActive = false;
          } else if (name === 'ol') {
            orderedListActive = false;
          } else if ( name === 'h1' ||
            name === 'h2' ||
            name === 'h3' ||
            name === 'h4' ||
            name === 'h5' ||
            name === 'title' ||
            name === 'p' || 
            name === 'li') {
            doc.addParagraph(currentParagraph);
            currentParagraph = null;
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
          let exporter = new docx.LocalPacker(doc, undefined, undefined, numbering);
          exporter.pack(options.novelfilepath + '.docx');
          options.callback();
        }
      }, { decodeEntities: true });

      // replace all &nbsp; with white spaces
      options.novelhtml = options.novelhtml.replace(/&nbsp;/g, ' ');
      parser.write(options.novelhtml);
      parser.end();
    }
  };
});
