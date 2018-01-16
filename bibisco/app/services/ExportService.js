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
  $translate, ArchitectureService, DocxExporterService, FileSystemService, 
  PdfExporterService, ProjectService, StrandService) {
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

      // architecture
      html += this.createArchitecture();

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

    createArchitecture: function () {
      let html = '';

      html += this.createTag('h1', translations.common_architecture);

      // premise
      html += this.createTag('h2', translations.common_premise);
      html += ArchitectureService.getPremise().text;

      // fabula
      html += this.createTag('h2', translations.common_fabula);
      html += ArchitectureService.getFabula().text;

      // settings
      html += this.createTag('h2', translations.common_setting);
      html += ArchitectureService.getSetting().text;

      // strands
      let strands = StrandService.getStrands();
      if (strands && strands.length > 0) {
        html += this.createTag('h1', translations.common_strands);
        for (let i = 0; i < strands.length; i++) {
          html += this.createTag('h2', strands[i].name);
          html += strands[i].description;
        }
      }
    
      return html;
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
        'common_architecture',
        'common_fabula',
        'common_premise',
        'common_setting',
        'common_strands',
        'export_project_subtitle',
      ]);
    }
  };
});
