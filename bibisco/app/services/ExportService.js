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
  MainCharacterService, PdfExporterService, ProjectService, StrandService) {
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

      // main characters
      html += this.createMainCharacters();

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

    createMainCharacters: function () {
      let html = '';

      let mainCharacters = MainCharacterService.getMainCharacters();
      if (mainCharacters && mainCharacters.length > 0) {
        html += this.createTag('h1', translations.common_main_characters);
        for (let i = 0; i < mainCharacters.length; i++) {
          html += this.createMainCharacter(mainCharacters[i]);          
        }
      }

      return html;
    },

    createMainCharacter: function (mainCharacter) {
      let html = '';
      // mainCharacters[i].$loki
      html += this.createTag('h2', mainCharacter.name);
      html += this.createMainCharacterInfoWithQuestions(mainCharacter, 'personaldata');
      html += this.createMainCharacterInfoWithQuestions(mainCharacter, 'physionomy');
      html += this.createMainCharacterInfoWithQuestions(mainCharacter, 'behaviors');
      html += this.createMainCharacterInfoWithQuestions(mainCharacter, 'psychology');
      html += this.createMainCharacterInfoWithQuestions(mainCharacter, 'ideas');
      html += this.createMainCharacterInfoWithQuestions(mainCharacter, 'sociology');
     
      return html;
    },

    createMainCharacterInfoWithQuestions: function (mainCharacter, info) {
      let html = '';
      let translation_key = 'common_' + info;

      html += this.createTag('h3', translations[translation_key]);
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
        'common_behaviors',
        'common_fabula',
        'common_ideas',
        'common_main_characters',
        'common_personaldata',
        'common_physionomy',
        'common_premise',
        'common_psychology',
        'common_secondary_characters',
        'common_setting',
        'common_sociology',
        'common_strands',
        'export_project_subtitle',
      ]);
    }
  };
});
