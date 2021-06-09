/*
 * Copyright (C) 2014-2021 Andrea Feccomandi
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
angular.
  module('bibiscoApp').
  component('exporttoformat', {
    templateUrl: 'components/export/export-to-format.html',
    controller: ExportToFormat
  });

function ExportToFormat($injector, $location, $routeParams, $rootScope, $scope, $timeout, $translate,
  ChapterService, ExportService, FileSystemService, LocationService, MainCharacterService, 
  PopupBoxesService, ProjectService, SecondaryCharacterService, SupporterEditionChecker) {

  var self = this;
  let ObjectService = null;
  let NoteService = null;

  self.$onInit = function() {

    // load translations
    self.translations = $translate.instant([
      'common_architecture',
      'common_chapters',
      'common_characters',
      'common_notes_title',
      'common_fabula',
      'common_locations',
      'common_premise',
      'common_setting',
      'common_strands',
      'export_novel_project',
      'export_novel',
      'export_project',
      'export_timeline',
      'objects',
    ]);

    $rootScope.$emit('EXPORT_SELECT_DIRECTORY');

    // supporters check
    self.supporterEdition = false;
    if (SupporterEditionChecker.check()) {
      $injector.get('IntegrityService').ok();
      self.supporterEdition = true;
    }

    self.exportAuthor;
    if ($routeParams.format === 'pdf') {
      self.pageheadertitle = 'jsp.export.title.pdf';
      self.exportAuthor = true;
    } else if ($routeParams.format === 'docx') {
      self.pageheadertitle = 'jsp.export.title.word';
      self.exportAuthor = true;
    } else if ($routeParams.format === 'txt') {
      self.pageheadertitle = 'jsp.export.title.txt';
      self.exportAuthor = true;
    } else if ($routeParams.format === 'archive') {
      self.pageheadertitle = 'jsp.export.title.archive';
      self.exportAuthor = false;
    }
    self.backpath = '/export';
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_export',
      href: self.backpath
    });
    self.breadcrumbitems.push({
      label: self.pageheadertitle
    });

    self.saving = false;
    self.exportpath;
    if (self.exportAuthor) {
      self.author = ProjectService.getProjectInfo().author;
    }

    self.showExportFilter = $routeParams.format === 'archive' ? false : true;
    if (self.showExportFilter) {
      // export items
      self.items = [];
      self.items.push.apply(self.items, self.getGeneralItems());
      self.items.push.apply(self.items, self.getChaptersFamily());
      self.items.push.apply(self.items, self.getArchitectureItem());
      self.items.push.apply(self.items, self.getStrandsItem());
      self.items.push.apply(self.items, self.getCharactersFamily());
      self.items.push.apply(self.items, self.getLocationsFamily());
      self.items.push.apply(self.items, self.getObjectsFamily());
      self.items.push.apply(self.items, self.getNotesFamily());
      self.items.push.apply(self.items, self.getTimelineItem());
      
      self.exportFilter = self.items[0];
    }

    self.checkExit = {
      active: true
    };
  };

  self.getGeneralItems= function () {
  
    let generalItems = [];
    let family = null;
    generalItems.push({
      id: 'novel_project',
      name: self.translations.export_novel_project,
      family: family
    });
    generalItems.push({
      id: 'novel',
      name: self.translations.export_novel,
      family: family
    });
    generalItems.push({
      id: 'project',
      name: self.translations.export_project,
      family: family
    });

    return generalItems;
  };

  self.getTimelineItem= function () {

    let timelineItem = [];

    timelineItem.push({
      id: 'timeline',
      name: self.translations.export_timeline,
      family: self.translations.export_timeline
    });

    return timelineItem;
  };

  self.selectItem = function(id) {
    if (id!=='novel_project' && !self.supporterEdition) {
      SupporterEditionChecker.showSupporterMessage();
      self.exportFilter = self.items[0];
    } 
  };
  
  self.getChaptersFamily = function () {
  
    let chaptersfamily = [];
    let family = self.translations.common_chapters;

    let chapters = ChapterService.getChaptersWithPrologueAndEpilogue();
    for (let i = 0; i < chapters.length; i++) {
      let type = 'chapter';
      let name = ChapterService.getChapterPositionDescription(chapters[i].position) + ' ' + chapters[i].title;
      if (chapters[i].position === ChapterService.PROLOGUE_POSITION) {
        type = 'prologue';
        name = chapters[i].title;
      } else if (chapters[i].position === ChapterService.EPILOGUE_POSITION) {
        type = 'epilogue';
        name = chapters[i].title;
      }

      chaptersfamily.push({
        id: chapters[i].$loki,
        name: name,
        family: family,
        type: type,
      });
    }

    return chaptersfamily;
  };

  self.getCharactersFamily = function() {
    
    let charactersfamily = [];
    let family = self.translations.common_characters;

    // main characters
    let mainCharacters = MainCharacterService.getMainCharacters();
    for (let i = 0; i < mainCharacters.length; i++) {
      charactersfamily.push({
        id: mainCharacters[i].$loki,
        name: mainCharacters[i].name,
        family: family,
        type: 'maincharacter'
      });
    }

    // secondary characters
    let secondaryCharacters = SecondaryCharacterService.getSecondaryCharacters();
    for (let i = 0; i < secondaryCharacters.length; i++) {
      charactersfamily.push({
        id: secondaryCharacters[i].$loki,
        name: secondaryCharacters[i].name,
        family: family,
        type: 'secondarycharacter'
      });
    }

    // sort by name
    charactersfamily.sort(function (a, b) {
      return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0);
    });

    return charactersfamily;
  };

  self.getArchitectureItem = function() {
    let architectureItem = [];

    let name =  self.translations.common_premise + ', ' + self.translations.common_fabula 
    + ', ' + self.translations.common_setting + ', ' + self.translations.common_notes_title;
    architectureItem.push({
      id: 'architecture',
      name: name,
      family: self.translations.common_architecture,
    });

    return architectureItem;
  };

  self.getStrandsItem = function() {
    let strandsItem = [];

    strandsItem.push({
      id: 'strands',
      name: self.translations.common_strands,
      family: self.translations.common_architecture,
    });

    return strandsItem;
  };

  self.getLocationsFamily = function () {
   
    let locationsfamily = [];
    let family = self.translations.common_locations;

    let locations = LocationService.getLocations();
    for (let i = 0; i < locations.length; i++) {
      let name = LocationService.calculateLocationName(locations[i]);
      locationsfamily.push({
        id: locations[i].$loki,
        name: name,
        family: family,
        type: 'location'
      });
    }

    // sort by name
    locationsfamily.sort(function (a, b) {
      return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0);
    });

    return locationsfamily;
  };

  self.getObjectsFamily = function () {

    let objectsfamily = [];
    if (self.supporterEdition) {
      let family = self.translations.objects;
      let objects = self.getObjectService().getObjects();
      for (let i = 0; i < objects.length; i++) {
        objectsfamily.push({
          id: objects[i].$loki,
          name: objects[i].name,
          family: family,
          type: 'object'
        });
      }
    }

    // sort by name
    objectsfamily.sort(function (a, b) {
      return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0);
    });

    return objectsfamily;
  };

  self.getNotesFamily = function () {

    let notesfamily = [];
    if (self.supporterEdition) {
      let family = self.translations.common_notes_title;
      let notes = self.getNoteService().getNotes();
      for (let i = 0; i < notes.length; i++) {
        notesfamily.push({
          id: notes[i].$loki,
          name: notes[i].name,
          family: family,
          type: 'note'
        });
      }
    }

    // sort by name
    notesfamily.sort(function (a, b) {
      return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0);
    });

    return notesfamily;
  };

  self.getObjectService = function () {
    if (!ObjectService) {
      ObjectService = $injector.get('ObjectService');
    }

    return ObjectService;
  };

  self.getNoteService = function () {
    if (!NoteService) {
      NoteService = $injector.get('NoteService');
    }

    return NoteService;
  };

  self.export = function(isValid) {
    if (isValid && !self.forbiddenDirectory) {
      self.checkExit = {
        active: false
      };
      self.saving = true;

      $timeout(function () {
        if (self.exportAuthor) {
          ProjectService.updateProjectAuthor(self.author);
        }
        if ($routeParams.format === 'pdf') {
          ExportService.exportPdf(self.exportFilter, self.exportpath, self.exportCallback);
        } else if ($routeParams.format === 'docx') {
          ExportService.exportWord(self.exportFilter, self.exportpath, self.exportCallback);
        } else if ($routeParams.format === 'txt') {
          ExportService.exportTxt(self.exportFilter, self.exportpath, self.exportCallback);
        } else if ($routeParams.format === 'archive') {
          ExportService.exportArchive(self.exportpath, self.exportCallback);
        }
      }, 250);
    }
  },

  self.exportCallback = function() {
    $timeout(function () {
      $location.path(self.backpath);
    }, 0);
  },

  self.selectProjectsDirectory = function (directory) {
    self.exportpath = directory;
    if (FileSystemService.canWriteDirectory(directory)) {
      self.forbiddenDirectory = false;
    } else {
      self.forbiddenDirectory = true;
    }
    
    $scope.$apply();
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, self.exportpath, self.checkExit);
  });
}
