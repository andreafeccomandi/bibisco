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
  component('projecthome', {
    templateUrl: 'components/project-home/project-home.html',
    controller: ProjectHomeController,
    bindings: {

    }
  });

function ProjectHomeController($injector, $location, $rootScope, $scope, $translate, ChapterService, 
  DictionaryService, LocationService, MainCharacterService, PopupBoxesService, ProjectService, 
  SecondaryCharacterService, StrandService, SupporterEditionChecker) {
  
  let self = this;
  self.loadingDictionary = false;
  let ObjectService = null;

  // dictionary loaded
  const ipc = require('electron').ipcRenderer;

  self.dictionaryLoadedListener = function(event) {
    DictionaryService.loadProjectDictionary();
  };
  ipc.once('DICTIONARY_LOADED', self.dictionaryLoadedListener);
  
  self.projectDictionaryLoadedListener = function(event) {
    self.loadingDictionary = false;
    $scope.$apply();

    // show menu item
    $rootScope.$emit('SHOW_PAGE', {
      item: 'projecthome'
    });
  };
  ipc.once('PROJECT_DICTIONARY_LOADED', self.projectDictionaryLoadedListener);

  self.$onDestroy = function () {
    ipc.removeListener('DICTIONARY_LOADED', self.dictionaryLoadedListener);
    ipc.removeListener('PROJECT_DICTIONARY_LOADED', self.projectDictionaryLoadedListener);
  };

  self.$onInit = function () {

    // action items
    self.actionitems = [];
    self.actionitems.push({
      label: 'jsp.project.button.updateTitle',
      itemfunction: function() {
        $location.path('/project/title');
      }
    }, {
      label: 'jsp.project.button.updateAuthor',
      itemfunction: function() {
        $location.path('/project/author');
      }
    }, {
      label: 'jsp.project.button.bibiscoProjectSuggestions',
      itemfunction: function() {
        $location.path('/tips');
      }
    }, {
      label: 'show_project_id',
      itemfunction: function() {
        let text = '<b>' + $translate.instant('project_id') + '</b>: '+ ProjectService.getProjectInfo().id;
        PopupBoxesService.alertWithSelectableText(text, 'md');
      }
    });

    // supporters check
    self.supporterEdition = false;
    if (SupporterEditionChecker.check()) {
      $injector.get('IntegrityService').ok();
      self.supporterEdition = true;
    } 

    // hotkeys
    self.hotkeys = ['esc'];

    // elements
    self.wordsTotal;
    self.charactersTotal;
    self.wordsGoal;
    self.wordsPerDayGoal;
    self.deadline;
    self.chapters;
    self.chaptersTodo;
    self.chaptersTocomplete;
    self.chaptersCompleted;
    self.scenes;
    self.scenesTodo;
    self.scenesTocomplete;
    self.scenesCompleted;
    self.narrativeStrands;
    self.narrativeStrandsTodo;
    self.narrativeStrandsTocomplete;
    self.narrativeStrandsCompleted;
    self.mainCharacters;
    self.mainCharactersTodo;
    self.mainCharactersTocomplete;
    self.mainCharactersCompleted;
    self.secondaryCharacters;
    self.secondaryCharactersTodo;
    self.secondaryCharactersTocomplete;
    self.secondaryCharactersCompleted;
    self.locations;
    self.locationsTodo;
    self.locationsTocomplete;
    self.locationsCompleted;    
    self.objects;
    self.objectsTodo;
    self.objectsTocomplete;
    self.objectsCompleted;    
    self.showMotivational;
    
    self.calculateWords();
    self.calculateDeadline();
    self.calculateChapters();
    self.calculateScenes();
    self.calculateNarrativeStrands();
    self.calculateMainCharacters();
    self.calculateSecondaryCharacters();
    self.calculateLocations();

    if (self.supporterEdition) {
      self.calculateObjects();
    }
    self.calculateMotivational();
    
    // dictionary
    let language = ProjectService.getProjectInfo().language;
    let isDictionaryLoaded = DictionaryService.isDictionaryLoaded(language);
    let isProjectDictionaryLoaded = DictionaryService.isProjectDictionaryLoaded();

    if (!isDictionaryLoaded) {
      // load dictionary
      DictionaryService.loadDictionary(language);
      self.loadingDictionary = true;
    } else {
      // show menu item
      $rootScope.$emit('SHOW_PAGE', {
        item: 'projecthome'
      });
    }

    if (isDictionaryLoaded && !isProjectDictionaryLoaded) {
      // load project dictionary
      DictionaryService.loadProjectDictionary();
    }
  };

  self.project = function() {
    return ProjectService.getProjectInfo();
  };

  self.showTips = function() {
    $location.path('/tips');
  };

  self.back = function() {
    ProjectService.close();
    $location.path('/start');
  };

  self.goals = function() {
    self.supporterEditionFilterAction('/project/goals');
  };

  self.calculateMotivational = function() {

    self.showMotivational = true;

    if (self.wordsTotal > 0 || self.wordsGoal || self.deadline || self.chapters > 0 
      || self.scenes > 0 || self.narrativeStrands > 0 || self.mainCharacters > 0 
      || self.secondaryCharacters > 0 || self.locations > 0 || self.objects > 0) {
        
      self.showMotivational = false;
    }
  };

  self.calculateWords = function() {

    let wordsWritten = ChapterService.getWordsWrittenLast30Days();
    let totalWordsAndCharacters = ChapterService.getTotalWordsAndCharacters();
    self.wordsTotal = totalWordsAndCharacters.words;
    self.charactersTotal = totalWordsAndCharacters.characters;

    let projectInfo = ProjectService.getProjectInfo();
    self.wordsGoal = projectInfo.wordsGoal;
    self.wordsPerDayGoal = projectInfo.wordsPerDayGoal;

    if (self.wordsGoal) {
      self.wordsGoalPerc = Math.round((self.wordsTotal / self.wordsGoal * 100 + Number.EPSILON));
    }
    
    self.wordsRemaining = self.wordsGoal-self.wordsTotal;
    if (self.wordsRemaining < 0) {
      self.wordsRemaining = 0;
    } 

    self.wordsWrittenToday = wordsWritten[29].words;
    self.wordsWrittenYesterday = wordsWritten[28].words;
    self.wordsWrittenLast7Days = 0;
    for (let index = 23; index < 30; index++) {
      self.wordsWrittenLast7Days +=  wordsWritten[index].words;  
    }
    self.averageLastSevenDays = Math.round(self.wordsWrittenLast7Days / 7 + Number.EPSILON);
  };

  self.wordsWrittenHistory = function() {
    self.supporterEditionFilterAction('/project/history');
  };

  self.supporterEditionFilterAction = function(path) {
    if (!SupporterEditionChecker.check()) {
      SupporterEditionChecker.showSupporterMessage();
    } else {
      $injector.get('IntegrityService').ok();
      $location.path(path);
    }
  };

  self.calculateDeadline = function() {

    self.deadline = null;
    
    let projectInfo = ProjectService.getProjectInfo();
    if (projectInfo.deadline) {
      self.deadline = new Date(projectInfo.deadline);
    }

    if (self.deadline) {
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      let diff = self.deadline - new Date();
      if (diff>0) {
        self.daysLeft = Math.ceil(Math.abs((self.deadline - new Date()) / oneDay));
      } else {
        self.daysLeft = 0;
      }
    }
  };

  self.calculateChapters = function() {
    self.chapters = ChapterService.getChaptersWithPrologueAndEpilogue().length;
    self.chaptersTodo = 0;
    self.chaptersTocomplete = 0;
    self.chaptersCompleted = 0;

    if (self.chapters > 0) {
      let chapters = ChapterService.getChaptersWithPrologueAndEpilogue();
      for (let i = 0; i < chapters.length; i++) {
        if (chapters[i].status === 'todo') {
          self.chaptersTodo += 1;
        } else if (chapters[i].status === 'tocomplete') {
          self.chaptersTocomplete += 1;
        } else if (chapters[i].status === 'done') {
          self.chaptersCompleted += 1;
        }
      }
    }
  };

  self.calculateScenes = function() {

    self.scenes = ChapterService.getAllScenesCount();
    self.scenesTodo = 0;
    self.scenesTocomplete = 0;
    self.scenesCompleted = 0;

    if (self.scenes > 0) {
      let scenes = ChapterService.getAllScenes();
      for (let i = 0; i < scenes.length; i++) {
        if (scenes[i].status === 'todo') {
          self.scenesTodo += 1;
        } else if (scenes[i].status === 'tocomplete') {
          self.scenesTocomplete += 1;
        } else if (scenes[i].status === 'done') {
          self.scenesCompleted += 1;
        }
      }
    }
  };

  self.calculateNarrativeStrands = function() {
    self.narrativeStrands = StrandService.getStrandsCount();
    self.narrativeStrandsTodo = 0;
    self.narrativeStrandsTocomplete = 0;
    self.narrativeStrandsCompleted = 0;

    if (self.narrativeStrands > 0) {
      let narrativeStrands = StrandService.getStrands();
      for (let i = 0; i < narrativeStrands.length; i++) {
        if (narrativeStrands[i].status === 'todo') {
          self.narrativeStrandsTodo += 1;
        } else if (narrativeStrands[i].status === 'tocomplete') {
          self.narrativeStrandsTocomplete += 1;
        } else if (narrativeStrands[i].status === 'done') {
          self.narrativeStrandsCompleted += 1;
        }
      }
    }
  };

  self.calculateMainCharacters = function() {

    self.mainCharacters = MainCharacterService.getMainCharactersCount();
    self.mainCharactersTodo = 0;
    self.mainCharactersTocomplete = 0;
    self.mainCharactersCompleted = 0;

    if (self.mainCharacters > 0) {
      let mainCharacters = MainCharacterService.getMainCharacters();
      for (let i = 0; i < mainCharacters.length; i++) {
        if (mainCharacters[i].status === 'todo') {
          self.mainCharactersTodo += 1;
        } else if (mainCharacters[i].status === 'tocomplete') {
          self.mainCharactersTocomplete += 1;
        } else if (mainCharacters[i].status === 'done') {
          self.mainCharactersCompleted += 1;
        }
      }
    }
  };

  self.calculateSecondaryCharacters = function() {
   
    self.secondaryCharacters = SecondaryCharacterService.getSecondaryCharactersCount();
    self.secondaryCharactersTodo = 0;
    self.secondaryCharactersTocomplete = 0;
    self.secondaryCharactersCompleted = 0;

    if (self.secondaryCharacters > 0) {
      let secondaryCharacters = SecondaryCharacterService.getSecondaryCharacters();
      for (let i = 0; i < secondaryCharacters.length; i++) {
        if (secondaryCharacters[i].status === 'todo') {
          self.secondaryCharactersTodo += 1;
        } else if (secondaryCharacters[i].status === 'tocomplete') {
          self.secondaryCharactersTocomplete += 1;
        } else if (secondaryCharacters[i].status === 'done') {
          self.secondaryCharactersCompleted += 1;
        }
      }
    }
  };

  self.calculateLocations = function() {
   
    self.locations = LocationService.getLocationsCount();
    self.locationsTodo = 0;
    self.locationsTocomplete = 0;
    self.locationsCompleted = 0;

    if (self.locations > 0) {
      let locations = LocationService.getLocations();
      for (let i = 0; i < locations.length; i++) {
        if (locations[i].status === 'todo') {
          self.locationsTodo += 1;
        } else if (locations[i].status === 'tocomplete') {
          self.locationsTocomplete += 1;
        } else if (locations[i].status === 'done') {
          self.locationsCompleted += 1;
        }
      }
    }
  };

  self.calculateObjects = function() {
    self.objects = this.getObjectService().getObjectsCount();
    self.objectsTodo = 0;
    self.objectsTocomplete = 0;
    self.objectsCompleted = 0;

    if (self.objects > 0) {
      let objects = this.getObjectService().getObjects();
      for (let i = 0; i < objects.length; i++) {
        if (objects[i].status === 'todo') {
          self.objectsTodo += 1;
        } else if (objects[i].status === 'tocomplete') {
          self.objectsTocomplete += 1;
        } else if (objects[i].status === 'done') {
          self.objectsCompleted += 1;
        }
      }
    }
  };

  self.getObjectService = function () {
    if (!ObjectService) {
      $injector.get('IntegrityService').ok();
      ObjectService = $injector.get('ObjectService');
    }

    return ObjectService;
  };
}
