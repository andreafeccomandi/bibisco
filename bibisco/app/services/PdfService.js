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

      pdfMake.fonts = {
        courier: {
          normal: 'cour.ttf',
          bold: 'courbd.ttf',
          italics: 'couri.ttf',
          bolditalics: 'courbi.ttf'
        }
      };
      
      // download the PDF
      pdfMake.createPdf(docDefinition).download('optionalName.pdf');    
    }
  };
});
