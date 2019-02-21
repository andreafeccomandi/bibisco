/*
 * Copyright (C) 2014-2019 Andrea Feccomandi
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

angular.module('bibiscoApp').service('ExportService', function (
  $translate, ArchitectureService, BibiscoPropertiesService, ChapterService, 
  DocxExporterService, FileSystemService, LocationService, MainCharacterService, 
  PdfExporterService, ProjectService, SecondaryCharacterService, StrandService,
  UtilService) {
  'use strict';

  const { shell } = require('electron');
  let dateFormat = require('dateformat');
  let translations;

  const behaviors_questions_count = 12;
  const ideas_questions_count = 18;
  const personaldata_questions_count = 12;
  const physionomy_questions_count = 24;
  const psychology_questions_count = 62;
  const sociology_questions_count = 10;
  
  return {

    exportPdf: function (exportpath, callback) {
      this.export(exportpath, PdfExporterService, callback);
    },

    exportWord: function (exportpath, callback) {
      this.export(exportpath, DocxExporterService, callback);
    },

    exportArchive: function (exportpath, callback) {
      let archivefilepath = this.calculateExportFilePath(exportpath, 'archive', new Date());
      ProjectService.export(archivefilepath, function () {
        shell.showItemInFolder(exportpath);
        callback();
      });
    },

    calculateExportFilePath: function (exportpath, type, timestamp) {
      let timestampFormatted = dateFormat(timestamp, 'yyyy_mm_dd_HH_MM_ss');
      let name = UtilService.string.slugify(ProjectService.getProjectInfo().name, '_');
      let filename = name + '_' + type + '_' + timestampFormatted;
      return FileSystemService.concatPath(exportpath, filename);
    },

    export: function (exportpath, exporter, callback) {
  
      // load translations
      this.loadTranslations();

      // font
      let font = this.getFont();

      // indent
      let indent = (BibiscoPropertiesService.getProperty('indentParagraphEnabled') === 'true');

      // export timestamp
      let timestamp = new Date();
      
      // novel
      let novelfilepath = this.calculateExportFilePath(exportpath, 'novel', timestamp);
      let novelhtml = this.createNovelHtml();
      
      // project
      let projectfilepath = this.calculateExportFilePath(exportpath, 'project', timestamp);
      let projecthtml = this.createProjectHtml();

      exporter.export(novelfilepath, novelhtml, font, indent, 
        function() {
          exporter.export(projectfilepath, projecthtml, font, indent,
            function () {
              shell.showItemInFolder(exportpath);
              callback();
            }); 
        });
    },

    getFont: function() {
      let font = BibiscoPropertiesService.getProperty('font');
      if (font === 'courier') {
        return 'Courier';
      } else if (font === 'times') {
        return 'Times New Roman';
      } else if (font === 'arial') {
        return 'Arial';
      }
    },

    createProjectHtml: function () {
      let html = '';

      html += this.createTitle();
      html += this.createProjectSubtitle();
      html += this.createArchitecture();
      html += this.createMainCharacters();
      html += this.createSecondaryCharacters();
      html += this.createLocations();
      html += this.createChaptersForProject();
      
      return html;
    },

    createNovelHtml: function() {
      let html = '';

      html += this.createTitle();
      html += this.createNovelSubtitle();
      html += this.createChaptersForNovel();

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

      // global notes
      html += this.createTag('h2', translations.common_notes_title);
      html += ArchitectureService.getGlobalNotes().text;

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
      html += this.createMainCharacterInfoWithQuestions(mainCharacter, 'personaldata', personaldata_questions_count);
      html += this.createMainCharacterInfoWithQuestions(mainCharacter, 'physionomy', physionomy_questions_count);
      html += this.createMainCharacterInfoWithQuestions(mainCharacter, 'behaviors', behaviors_questions_count);
      html += this.createMainCharacterInfoWithQuestions(mainCharacter, 'psychology',psychology_questions_count);
      html += this.createMainCharacterInfoWithQuestions(mainCharacter, 'ideas', ideas_questions_count);
      html += this.createMainCharacterInfoWithQuestions(mainCharacter, 'sociology', sociology_questions_count);
      html += this.createMainCharacterInfoWithoutQuestions(mainCharacter, 'lifebeforestorybeginning');
      html += this.createMainCharacterInfoWithoutQuestions(mainCharacter, 'conflict');
      html += this.createMainCharacterInfoWithoutQuestions(mainCharacter, 'evolutionduringthestory');
      return html;
    },

    createMainCharacterInfoWithQuestions: function (mainCharacter, info, questionsCount) {
      
      let html = '';
      html += this.createTag('h3', translations['common_' + info]);
      
      // freetext
      if (mainCharacter[info].freetextenabled) {
        html += mainCharacter[info].freetext;
      } 
      // questions
      else {
        for (let i = 0; i < questionsCount; i++) {
          let question = '(' + (i+1) + '/' + questionsCount + ') ' + translations['characterInfo_question_' + info + '_' + i];
          html += this.createTag('question', question);   
          html += mainCharacter[info].questions[i].text;
        }
      }
      return html;
    },

    createMainCharacterInfoWithoutQuestions: function (mainCharacter, info) {
      let html = '';
      html += this.createTag('h3', translations['common_characters_' + info]);
      html += mainCharacter[info].text;
      return html; 
    },

    createSecondaryCharacters: function() {
      let html = '';
      let secondaryCharacters = SecondaryCharacterService.getSecondaryCharacters();
      if (secondaryCharacters && secondaryCharacters.length > 0) {
        html += this.createTag('h1', translations.common_secondary_characters);
        for (let i = 0; i < secondaryCharacters.length; i++) {
          html += this.createTag('h2', secondaryCharacters[i].name);
          html += secondaryCharacters[i].description;
        }
      }
      return html;
    },

    createLocations: function() {
      let html = '';
      let locations = LocationService.getLocations();
      if (locations && locations.length > 0) {
        html += this.createTag('h1', translations.common_locations);
        for (let i = 0; i < locations.length; i++) {
          html += this.createTag('h2', LocationService.calculateLocationName(locations[i]));
          html += locations[i].description;
        }
      }
      return html;
    },

    createChaptersForProject: function () {
      let html = '';
      let chapters = ChapterService.getChapters();
      if (chapters && chapters.length > 0) {
        html += this.createTag('h1', translations.common_chapters);
        for (let i = 0; i < chapters.length; i++) {
          html += this.createTag('h2', '#' + chapters[i].position + ' ' + chapters[i].title);
          html += this.createTag('h3', translations.common_chapter_reason);
          html += chapters[i].reason.text;
          html += this.createTag('h3', translations.common_chapter_notes);
          html += chapters[i].notes.text;
        }
      }
      return html;
    },

    createChaptersForNovel: function () {
      let html = '';
      let chapters = ChapterService.getChapters();
      if (chapters && chapters.length > 0) {
        for (let i = 0; i < chapters.length; i++) {
          html += this.createTag('h1', chapters[i].title);
          let scenes = ChapterService.getScenes(chapters[i].$loki);
          for (let j = 0; j < scenes.length; j++) {
            html += scenes[j].revisions[scenes[j].revision].text;
            html += this.createTag('p', '');
          }
        }
      }
      return html;
    },

    createTag: function(tagname, content, attribs) {
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
      
      let translationkeys = ['common_architecture',
        'common_behaviors',
        'common_chapter_notes',
        'common_chapter_reason',
        'common_chapters',
        'common_characters_conflict',
        'common_characters_evolutionduringthestory',
        'common_characters_lifebeforestorybeginning',
        'common_fabula',
        'common_ideas',
        'common_notes_title',
        'common_locations',
        'common_main_characters',
        'common_personaldata',
        'common_physionomy',
        'common_premise',
        'common_psychology',
        'common_secondary_characters',
        'common_setting',
        'common_sociology',
        'common_strands',
        'export_project_subtitle'];

      translationkeys.push.apply(translationkeys, 
        this.addInfoQuestionsTranslationKeys('behaviors', behaviors_questions_count));
      translationkeys.push.apply(translationkeys,
        this.addInfoQuestionsTranslationKeys('ideas', ideas_questions_count));
      translationkeys.push.apply(translationkeys,
        this.addInfoQuestionsTranslationKeys('personaldata', personaldata_questions_count));
      translationkeys.push.apply(translationkeys,
        this.addInfoQuestionsTranslationKeys('physionomy', physionomy_questions_count));
      translationkeys.push.apply(translationkeys,
        this.addInfoQuestionsTranslationKeys('psychology', psychology_questions_count));
      translationkeys.push.apply(translationkeys,
        this.addInfoQuestionsTranslationKeys('sociology', sociology_questions_count));

      translations = $translate.instant(translationkeys);
    },

    addInfoQuestionsTranslationKeys: function(info, questionNumber) {
      let infoQuestionsTranslationKeys = [];
      for (let i = 0; i < questionNumber; i++) {    
        infoQuestionsTranslationKeys.push('characterInfo_question_' + info + '_' + i);
      }
      return infoQuestionsTranslationKeys;
    } 
  };
});
