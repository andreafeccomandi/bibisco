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

angular.module('bibiscoApp').service('ExportService', function (
  $translate, DocxExporterService, FileSystemService, PdfExporterService, ProjectService) {
  'use strict';

  const { shell } = require('electron');
  let dateFormat = require('dateformat');
  let translations;
  
  return {

    exportPdf: function (exportpath) {
      this.export(exportpath, PdfExporterService);
    },

    exportWord: function (exportpath) {
      this.export(exportpath, DocxExporterService);
    },

    export: function (exportpath, exporter) {

      // let html = '';
      // html += '<h1>Questo è un titolo di primo livello</h1>';
      // html += '<h2>Questo è un titolo di secondo livello</h2>';
      // html += '<h3>Questo è un <i>titolo</i> <b>di</b> terzo livello</h3>';
      // html += '<h4>Questo è un titolo di quarto livello</h4>';
      // html += '<h5>Questo è un titolo di quinto livello</h5>';
      // html += '<title>Questo è un title</title>';
      // html += '<p>This is a <b>standard</b> <i>paragraph</i>, using default style</p>';
      // html += '<p>Wtórna pierwsza osoba: historia jest opowiedziana z perpektywy pierwszej osoby przez drugorzędnego bohatera, który nie jest protagonistą relacjonującym wydarzenia. Ten punkt widzenia musi być stosowany, tylko jeżeli główni bohaterowie nie są świadomi swoich działań i dlatego nie są w stanie poprawnie opowiedzieć swojej historiii. Narrator nie zna myśli głównych bohaterów i może zrelacjonować tylko te wydarzenia, których był świadkiem.</p>';
      // html += '<p>Вы уверены, что хотите удалить эту сцену?</p>';
      // html += '<p>Questo è <i>occhio</i><b> bello</b> <b><i>questo</i></b> è suo fratello!</p><p>Questa è la casina, questo è il campanello!</p><p>Din, din din!</p>';
      // html += '<p>Questa riga è allineata a sinistra,&nbsp;sinistra,&nbsp;sinistra, sinistra, sinistra.</p><p style="text-align: center;">Questa riga è <b>centrata</b></p><p style="text-align: right;">Questa <span style="background-color: rgb(255, 255, 0);">riga è allineata</span> a destra</p> <p style="text-align: justify;">Questaa <strike>riga</strike> è giustificata, <i>perchè</i>&nbsp;non si è presentata a scuola al suono della campanella. Che è sempre molto bella, snella, piella, biella, sella, <i>rella</i> <u>fella</u> previous, preceding, prior, former, precedent, foregoing, previous, preceding, prior, former, precedent, foregoing, previous, preceding, prior, former, precedent, foregoing, previous, preceding, prior, former, precedent, foregoing, previous, preceding, prior, former, precedent, foregoing</p><p style="text-align: justify;"><u>Questa <i>riga </i><strike><i>continua ad essere</i> giustificata</strike></u>, perchè è andata dal dottore e si è fatta <i>rilasciare</i> un certificato.</p><p style="text-align: left;">Questa riga <i>torna</i> ad <u>essere <i>allineata <b>a</b></i><b> sinistra</b>, sinistra,</u> sinistra, sinistra. Molto bene.</p><p style="text-align: left;"></p>';
      // html += '<ol><li>Galli</li><li>Tassotti, <i>terzino</i> destro.</li><li>Maldini, <u>terzino</u> sinistro.</li></ol><ul><li style=\"text-align: center;\"><i><b><u>Colombo</u></b></i></li><li style=\"text-align: right;\">Costacurta</li><li style=\"text-align: right;\">Baresi</li><li style=\"text-align: right;\">Donadoni</li></ul><p style=\"text-align: right;\">Che due palle! Ma perchè non</p><p style=\"text-align: right;\"><ul><li>si methane d\'accordo ?</li ></ul > <p style=\"text-align: justify;\">« Prove tecniche »</p><p style=\"text-align: left;\">— Di dialogo</p></p><p></p>';
      
      // load translations
      this.loadTranslations();

      // select font
      let font = 'Courier';
      //let font = 'Arial';
      //let font = 'Times New Roman';

      // indent
      let indent = true;

      // export timestamp
      let timestamp = dateFormat(new Date(), 'yyyymmddHHMMss');
      
      // novel
      let novelfilename = 'novel_' + timestamp;
      let novelfilepath = FileSystemService.concatPath(exportpath, novelfilename);
      let novelhtml = this.createNovelHtml();
      
      // project
      let projectfilename = 'project_' + timestamp;
      let projectfilepath = FileSystemService.concatPath(exportpath, projectfilename);
      let projecthtml = this.createProjectHtml();

      exporter.export(novelfilepath, novelhtml, font, indent, 
        exporter.export(projectfilepath, projecthtml, font, indent, 
          shell.showItemInFolder(exportpath)));
    },

    createProjectHtml: function () {
      let html = '';

      // title
      html += this.createTitle();

      // subtitle
      html += this.createProjectSubtitle();

      return html;
    },

    createNovelHtml: function() {
      let html = '';

      // title
      html += this.createTitle();

      // subtitle
      html += this.createNovelSubtitle();

      return html;
    },

    createTitle: function() {
      return this.createTag('exporttitle', ProjectService.getProjectInfo().name);
    },

    createNovelSubtitle: function () {
      return this.createTag('exportsubtitle', '');
    },

    createProjectSubtitle: function () {
      return this.createTag('exportsubtitle', translations.export_project_subtitle);
    },

    createTag: function (tagname, content, attribs) {
      let html = '';
      html += '<' + tagname;
      if (attribs && attribs.length > 0) {
        for (let i = 0; i < attribs.length; i++) {
          html += ' ';
          html += attribs[i].name;
          html += '= "';
          html += attribs[i].value;
          html += '"';
        }
      } 
      html += '>';
      html += content;
      html += '</' + tagname + '>';
      return html;
    },

    loadTranslations: function() {
      translations = $translate.instant([
        'export_project_subtitle',
      ]);
    }
  };
});
