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

angular.module('bibiscoApp').service('DocxExporterService', function () {
  'use strict';

  var remote = require('electron').remote;
  var htmlparser = remote.getGlobal('htmlparser');
  var docx = remote.getGlobal('docx');

  let fontSize = 24; // font size, measured in half-points

  let exportitlespacing = { before: 5000, after: 200, line: 350 };
  let h1marginspacing = { after: 250, before: 250, line: 350 };
  let h2marginspacing = { after: 250, before: 250, line: 350 };
  let h3marginspacing = { after: 250, line: 350 };
  let paragraphspacing = { after: 250, line: 350 };
  
  return {
  
    export: function (path, html, font, indent, callback) {

      let currentParagraph = null;
      let boldActive = false;
      let italicsActive = false;
      let underlineActive = false;
      let strikeActive = false;
      let orderedListActive = false;
      let unorderedListActive = false;
      let h1counter = 0;
      let h2counter = 0;
      let h3counter = 0;
    
      const numbering = new docx.Numbering();
      const numberedAbstract = numbering.createAbstractNumbering();
      numberedAbstract.createLevel(0, 'decimal', '%1. ', 'left');
      const letterNumbering = numbering.createConcreteNumbering(numberedAbstract);

      // Create document
      let doc = new docx.Document();

      var parser = new htmlparser.Parser({

        onopentag: function (name, attribs) {

          if (name === 'exporttitle') {
            currentParagraph = new docx.Paragraph();
            currentParagraph.center();
            currentParagraph.spacing(exportitlespacing);
            boldActive = true;

          } else if (name === 'exportsubtitle') {
            currentParagraph = new docx.Paragraph();
            currentParagraph.center();
            boldActive = true;

          } else if (name === 'h1') {
            h1counter += 1;
            currentParagraph = new docx.Paragraph();
            currentParagraph.pageBreak();
            boldActive = true;
            let currentText = new docx.TextRun(h1counter + ' ');
            currentText.size(fontSize);
            currentText.font(font);
            currentText.bold();
            currentParagraph.addRun(currentText);
            currentParagraph.spacing(h1marginspacing);

          } else if (name === 'h2') {
            h2counter += 1;
            currentParagraph = new docx.Paragraph();
            italicsActive = true;
            let currentText = new docx.TextRun(h1counter + '.' + h2counter + ' ');
            currentText.size(fontSize);
            currentText.font(font);
            currentText.italic();
            currentParagraph.addRun(currentText);
            currentParagraph.spacing(h2marginspacing);

          } else if (name === 'h3') {
            h3counter += 1;
            currentParagraph = new docx.Paragraph();
            let currentText = new docx.TextRun(h1counter + '.' + h2counter + '.' + h3counter + ' ');
            currentText.size(fontSize);
            currentText.font(font);
            currentParagraph.addRun(currentText);
            currentParagraph.spacing(h3marginspacing);

          } else if (name === 'question') {
            currentParagraph = new docx.Paragraph();
            currentParagraph.spacing(paragraphspacing);
            boldActive = true;
            italicsActive = true;
        
          } else if (name === 'ul') {
            unorderedListActive = true;
          } else if (name === 'ol') {
            orderedListActive = true;
          } else if (name === 'p' || name === 'li') {

            currentParagraph = new docx.Paragraph();

            // spacing
            currentParagraph.spacing(paragraphspacing);
            
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
            if (indent) {
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
            currentText.font(font);
 
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

          if (name === 'exporttitle' || name === 'exportsubtitle') {
            doc.addParagraph(currentParagraph);
            currentParagraph = null;
            boldActive = false;

          } else if (name === 'h1') {
            doc.addParagraph(currentParagraph);
            currentParagraph = null;
            boldActive = false;
            h2counter = 0;

          } else if (name === 'h2') {
            doc.addParagraph(currentParagraph);
            currentParagraph = null;
            italicsActive = false;
            h3counter = 0;

          } else if (name === 'h3') {
            doc.addParagraph(currentParagraph);
            currentParagraph = null;

          } else if (name === 'question') {
            doc.addParagraph(currentParagraph);
            currentParagraph = null;
            boldActive = false;
            italicsActive = false;

          } else if (name === 'ul') {
            unorderedListActive = false;
          } else if (name === 'ol') {
            orderedListActive = false;
          } else if ( name === 'p' || 
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
          exporter.pack(path + '.docx');
          if (callback) {
            callback();
          }
        }
      }, { decodeEntities: true });

      // replace all &nbsp; with white spaces
      html = html.replace(/&nbsp;/g, ' ');
      parser.write(html);
      parser.end();
    }
  };
});
