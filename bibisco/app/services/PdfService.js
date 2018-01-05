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

angular.module('bibiscoApp').service('PdfService', function () {
  'use strict';

  var remote = require('electron').remote;
  var htmlparser = remote.getGlobal('htmlparser');

  pdfMake.fonts = {
    courier: {
      normal: 'cour.ttf',
      bold: 'courbd.ttf',
      italics: 'couri.ttf',
      bolditalics: 'courbi.ttf'
    }
  };

  let paragraphmargin = [0, 0, 0, 10];

  return {
    createFirstPdf: function() {
    
      var docDefinition = {
        content: [
          // if you don't need styles, you can use a simple string to define a paragraph
          'This is a standard paragraph, using default style',

          // using a { text: '...' } object lets you set styling properties
          { text: 'Wtórna pierwsza osoba: historia jest opowiedziana z perpektywy pierwszej osoby przez drugorzędnego bohatera, który nie jest protagonistą relacjonującym wydarzenia. Ten punkt widzenia musi być stosowany, tylko jeżeli główni bohaterowie nie są świadomi swoich działań i dlatego nie są w stanie poprawnie opowiedzieć swojej historiii. Narrator nie zna myśli głównych bohaterów i może zrelacjonować tylko te wydarzenia, których był świadkiem.', fontSize: 15, alignment: 'justify' },

          // using a { text: '...' } object lets you set styling properties
          { text: 'Вы уверены, что хотите удалить эту сцену?', fontSize: 15, alignment: 'right' },

          // if you set pass an array instead of a string, you'll be able
          // to style any fragment individually
          {
            text: [
              'This paragraph is defined as an array of elements to make it possible to ',
              { text: 'restyle part of it and make it bigger ', fontSize: 15, bold: true},
              { text: 'restyle part of it and make it bigger ', fontSize: 15, italics: true },
              { text: 'restyle part of it and make it bigger ', fontSize: 15, decoration: 'underline', },
              { text: 'restyle part of it and make it bigger ', fontSize: 15, bold: true, italics: true, decoration: 'underline' },
              { text: 'Underline decoration', decoration: 'underline' },
              { text: 'Underline as property', underline: true },
              { text: 'Line Through decoration', decoration: 'lineThrough' },
              { text: 'Overline decoration', decoration: 'overline' },
              'than the rest.'
            ], pageBreak: 'before', margin: [40, 40, 40, 40] 
          }
        ],
        defaultStyle: {
          font: 'courier'
        }
      };
      
      // download the PDF
      pdfMake.createPdf(docDefinition).download('optionalName.pdf');   

      // test createTextFromHtml
      this.createTextFromHtml('Xyz <script type="text/javascript">var foo = "<<bar>>";</ script>');
    },

    createAndDownloadPdf: function(content) {

      var docDefinition = {
        content: content,
        defaultStyle: {
          font: 'courier'
        }
      };

      // download the PDF
      pdfMake.createPdf(docDefinition).download('export.pdf');  
    },

    createPdfFromHtml: function(html, createAndDownloadPdf) {

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
          createAndDownloadPdf(content);
        }
      }, { decodeEntities: true });

      parser.write(html);
      parser.end();
    },

    exportPdf: function() {
      let html = '';
      html += '<p>This is a standard paragraph, using default style</p>';
      html += '<p>Wtórna pierwsza osoba: historia jest opowiedziana z perpektywy pierwszej osoby przez drugorzędnego bohatera, który nie jest protagonistą relacjonującym wydarzenia. Ten punkt widzenia musi być stosowany, tylko jeżeli główni bohaterowie nie są świadomi swoich działań i dlatego nie są w stanie poprawnie opowiedzieć swojej historiii. Narrator nie zna myśli głównych bohaterów i może zrelacjonować tylko te wydarzenia, których był świadkiem.</p>';
      html += '<p>Вы уверены, что хотите удалить эту сцену?</p>';
      html += '<p>Questo è <i>occhio</i> <b>bello</b>, <b><i>questo</i></b> è suo fratello!</p> <p>Questa è la casina, questo è il campanello!</p> <p>Din, din din!</p>';
      html += '<p>Questa riga è allineata a sinistra,&nbsp;sinistra,&nbsp;sinistra, sinistra, sinistra.</p><p style=\"text-align: center;\">Questa riga è <b>centrata</b></p><p style=\"text-align: right;\">Questa <span style=\"background-color: rgb(255, 255, 0);\">riga è allineata</span> a destra</p><p style=\"text-align: justify;\">Questaa <strike>riga</strike> è giustificata, <i>perchè</i>&nbsp;non si è presentata a scuola al suono della campanella.</p><p style=\"text-align: justify;\"><u>Questa <i>riga </i><strike><i>continua ad essere</i> giustificata</strike></u>, perchè è andata dal dottore e si è fatta <i>rilasciare</i> un certificato.</p><p style=\"text-align: left;\">Questa riga <i>torna</i> ad <u>essere <i>allineata <b>a</b></i><b> sinistra</b>, sinistra,</u> sinistra, sinistra. Molto bene.</p><p style=\"text-align: left;\"></p><ol><li>Galli</li><li>Tassotti, <i>terzino</i> destro.</li><li>Maldini, <u>terzino</u> sinistro.</li></ol><ul><li style=\"text-align: center;\"><i><b><u>Colombo</u></b></i></li><li style=\"text-align: right;\">Costacurta</li><li style=\"text-align: right;\">Baresi</li><li style=\"text-align: right;\">Donadoni</li></ul><p style=\"text-align: right;\">Che due palle! Ma perchè non</p><p style=\"text-align: right;\"><ul><li>si methane d\'accordo ?</li ></ul > <p style=\"text-align: justify;\">« Prove tecniche »</p><p style=\"text-align: left;\">— Di dialogo</p></p><p></p>';
      this.createPdfFromHtml(html, this.createAndDownloadPdf);
    }
  };
});
