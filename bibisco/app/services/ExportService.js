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

angular.module('bibiscoApp').service('ExportService', function () {
  'use strict';

  var remote = require('electron').remote;
  var htmlparser = remote.getGlobal('htmlparser');
  var docx = remote.getGlobal('docx');
  
  return {

    exportPdf: function () {
      this.export(this.createPdf);
    },

    exportWord: function () {
      this.export(this.createDocx);
    },

    export: function(exportFunction) {

      // Create document
      let doc = new docx.Document();

      let html = '';
      html += '<h1>Questo è un titolo di primo livello</h1>';
      html += '<h2>Questo è un titolo di secondo livello</h2>';
      html += '<h3>Questo è un <i>titolo</i> <b>di</b> terzo livello</h3>';
      html += '<h4>Questo è un titolo di quarto livello</h4>';
      html += '<h5>Questo è un titolo di quinto livello</h5>';
      html += '<title>Questo è un title</title>';
      html += '<p>This is a <b>standard</b> <i>paragraph</i>, using default style</p>';
      html += '<p>Wtórna pierwsza osoba: historia jest opowiedziana z perpektywy pierwszej osoby przez drugorzędnego bohatera, który nie jest protagonistą relacjonującym wydarzenia. Ten punkt widzenia musi być stosowany, tylko jeżeli główni bohaterowie nie są świadomi swoich działań i dlatego nie są w stanie poprawnie opowiedzieć swojej historiii. Narrator nie zna myśli głównych bohaterów i może zrelacjonować tylko te wydarzenia, których był świadkiem.</p>';
      html += '<p>Вы уверены, что хотите удалить эту сцену?</p>';
      html += '<p>Questo è <i>occhio</i><b> bello</b> <b><i>questo</i></b> è suo fratello!</p><p>Questa è la casina, questo è il campanello!</p><p>Din, din din!</p>';
      html += '<p>Questa riga è allineata a sinistra,&nbsp;sinistra,&nbsp;sinistra, sinistra, sinistra.</p><p style="text-align: center;">Questa riga è <b>centrata</b></p><p style="text-align: right;">Questa <span style="background-color: rgb(255, 255, 0);">riga è allineata</span> a destra</p> <p style="text-align: justify;">Questaa <strike>riga</strike> è giustificata, <i>perchè</i>&nbsp;non si è presentata a scuola al suono della campanella. Che è sempre molto bella, snella, piella, biella, sella, <i>rella</i> <u>fella</u> previous, preceding, prior, former, precedent, foregoing, previous, preceding, prior, former, precedent, foregoing, previous, preceding, prior, former, precedent, foregoing, previous, preceding, prior, former, precedent, foregoing, previous, preceding, prior, former, precedent, foregoing</p><p style="text-align: justify;"><u>Questa <i>riga </i><strike><i>continua ad essere</i> giustificata</strike></u>, perchè è andata dal dottore e si è fatta <i>rilasciare</i> un certificato.</p><p style="text-align: left;">Questa riga <i>torna</i> ad <u>essere <i>allineata <b>a</b></i><b> sinistra</b>, sinistra,</u> sinistra, sinistra. Molto bene.</p><p style="text-align: left;"></p>';
      html += '<ol><li>Galli</li><li>Tassotti, <i>terzino</i> destro.</li><li>Maldini, <u>terzino</u> sinistro.</li></ol><ul><li style=\"text-align: center;\"><i><b><u>Colombo</u></b></i></li><li style=\"text-align: right;\">Costacurta</li><li style=\"text-align: right;\">Baresi</li><li style=\"text-align: right;\">Donadoni</li></ul><p style=\"text-align: right;\">Che due palle! Ma perchè non</p><p style=\"text-align: right;\"><ul><li>si methane d\'accordo ?</li ></ul > <p style=\"text-align: justify;\">« Prove tecniche »</p><p style=\"text-align: left;\">— Di dialogo</p></p><p></p>';
     
      this.parseHtml(doc, html, '/Users/andreafeccomandi/Downloads/MyFirstDocumentGiorgioneIndent.pdf', exportFunction);
    },

    createPdf: function (doc, path, numbering) {
      let exporter = new docx.LocalPacker(doc, undefined, undefined, numbering);
      exporter.packPdf(path);
    },   
    
    createDocx: function (doc, path, numbering) {
      let exporter = new docx.LocalPacker(doc, undefined, undefined, numbering);
      exporter.pack(path);
    },
  
    parseHtml: function (doc, html, path, callback) {

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

      let font = 'Courier';
      //let font = 'Arial';
      //let font = 'Times New Roman';
      let fontSize = 24; // font size, measured in half-points

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
            currentParagraph.indent({ firstLine: 600 });

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
          callback(doc, path, numbering);
        }
      }, { decodeEntities: true });

      // replace all &nbsp; with white spaces
      html = html.replace(/&nbsp;/g, ' ');
      parser.write(html);
      parser.end();
    }
  };
});
