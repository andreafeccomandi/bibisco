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
  component('scenetags', {
    templateUrl: 'components/chapters/scene-tags.html',
    controller: SceneTagsController
  });

function SceneTagsController($injector, $rootScope, $routeParams, $scope,
  ChapterService, hotkeys, LocationService, MainCharacterService, 
  PopupBoxesService, SecondaryCharacterService, 
  StrandService, SupporterEditionChecker, UtilService) {

  var self = this;

  self.$onInit = function() {

    self.chapter = ChapterService.getChapter($routeParams.chapterid);
    self.scene = ChapterService.getScene($routeParams.sceneid);
    self.backpath = '/chapters/' + self.chapter.$loki + '/scenes/' + self.scene.$loki + '/view';
    self.fromtimeline = $rootScope.actualPath.indexOf('timeline') !== -1;
    if (self.fromtimeline) {
      self.backpath = '/timeline' + self.backpath;
    } 

    // init breadcrumbs
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_chapters',
      href: '/chapters/params/focus=chapters_' + self.chapter.$loki
    });
    
    self.breadcrumbitems.push({
      label: ChapterService.getChapterPositionDescription(self.chapter.position) + ' ' + self.chapter.title,
      href: '/chapters/' + self.chapter.$loki + '/params/focus=scenes_' + self.scene.$loki
    });
    self.breadcrumbitems.push({
      label: self.scene.title,
      href: self.backpath
    });
    self.breadcrumbitems.push({
      label: 'jsp.scene.title.tags'
    });

    // init working scene revision
    self.workingscenerevision = JSON.parse(JSON.stringify(self.scene.revisions[self.scene.revision]));
    
    // init point of views
    self.initPointOfViews();

    // init scene characters
    self.initSceneCharacters();

    // init locations
    self.initLocations();

    // init objects
    self.initObjects();

    // init date time
    if (ChapterService.getLastScenetime() !== '') {
	  self.lastscenetime = new Date(ChapterService.getLastScenetime());
    } else {
	   self.lastscenetime = new Date();
    }
    // check if is valid gregorian date
    if (self.workingscenerevision.timegregorian) {
      let testDate = new Date(self.workingscenerevision.time);
      if (isNaN(testDate.getTime())) {
        self.workingscenerevision.time = null;
      }
    }

    // init narrative strands
    self.initStrands();

    // init title
    self.title = self.scene.title;
    self.pageheadertitle =
      'jsp.scene.dialog.title.updateTitle';

    // init save hotkey
    hotkeys.bindTo($scope)
      .add({
        combo: ['ctrl+s', 'command+s'],
        description: 'save',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function () {
          self.save();
        }
      });

    $rootScope.dirty = false;
    self.checkExit = {
      active: true
    };
  };

  self.initPointOfViews = function() {

    // point of views
    self.povs = [];

    self.povs.push({
      id: '1stOnMajor',
      selected: (self.workingscenerevision.povid === '1stOnMajor')
    });
    self.povs.push({
      id: '1stOnMinor',
      selected: (self.workingscenerevision.povid === '1stOnMinor')
    });
    self.povs.push({
      id: '3rdLimited',
      selected: (self.workingscenerevision.povid === '3rdLimited')
    });
    self.povs.push({
      id: '3rdOmniscient',
      selected: (self.workingscenerevision.povid === '3rdOmniscient')
    });
    self.povs.push({
      id: '3rdObjective',
      selected: (self.workingscenerevision.povid === '3rdObjective')
    });
    self.povs.push({
      id: '2nd',
      selected: (self.workingscenerevision.povid === '2nd')
    });

    if (self.workingscenerevision.povid === '1stOnMajor' || self.workingscenerevision.povid ===
      '1stOnMinor' || self.workingscenerevision.povid === '3rdLimited') {
      self.showpovcharacter = true;
      self.initPovCharacters();
    } else {
      self.showpovcharacter = false;
      self.workingscenerevision.povcharacterid = null;
    }
  };

  self.togglePov = function(id) {
    self.workingscenerevision.povid = id;
    self.initPointOfViews();
    $rootScope.dirty = true;
  };

  self.togglePovCharacter = function(id) {
    self.workingscenerevision.povcharacterid = id;
    self.initPovCharacters();
    $rootScope.dirty = true;
  };

  self.toggleSceneCharacter = function(id) {
    self.toggleTagElement(self.workingscenerevision.scenecharacters, id);
    self.initSceneCharacters();
  };

  self.toggleLocation = function(id) {
    self.workingscenerevision.locationid = id;
    self.initLocations();
    $rootScope.dirty = true;
  };

  self.toggleObject = function(id) {
    self.toggleTagElement(self.workingscenerevision.sceneobjects, id);
    self.initObjects();
  };

  self.toggleStrand = function(id) {
    self.toggleTagElement(self.workingscenerevision.scenestrands, id);
    self.initStrands();
  };

  self.toggleTagElement = function(arr, id) {

    let idx = UtilService.array.indexOf(arr, id);
    if (idx !== -1) {
      arr.splice(idx, 1);
    } else {
      arr.push(id);
    }
    $rootScope.dirty = true;
  };

  self.initPovCharacters = function() {
    self.povcharacters = self.initCharacters(function(id) {
      return self.workingscenerevision.povcharacterid === id;
    });
  };

  self.initSceneCharacters = function() {
    self.scenecharacters = self.initCharacters(function(id) {
      return UtilService.array.contains(self.workingscenerevision.scenecharacters, id);
    });
  };

  self.initCharacters = function(selectfunction) {

    let characters = [];

    // main characters
    let mainCharacters = MainCharacterService.getMainCharacters();
    for (let i = 0; i < mainCharacters.length; i++) {
      let itemid = 'm_' + mainCharacters[i].$loki;
      let isselected = selectfunction(itemid);
      characters.push({
        id: itemid,
        name: mainCharacters[i].name,
        selected: isselected
      });
    }

    // secondary characters
    let secondaryCharacters = SecondaryCharacterService.getSecondaryCharacters();
    for (let i = 0; i < secondaryCharacters.length; i++) {
      let itemid = 's_' + secondaryCharacters[i].$loki;
      let isselected = selectfunction(itemid);
      characters.push({
        id: itemid,
        name: secondaryCharacters[i].name,
        selected: isselected
      });
    }

    // sort by name
    characters.sort(function(a, b) {
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    });

    return characters;
  };

  self.initLocations = function() {

    // locations
    let locations = LocationService.getLocations();
    self.locations = [];
    for (let i = 0; i < locations.length; i++) {
      let name = LocationService.calculateLocationName(locations[i]);
      self.locations.push({
        id: locations[i].$loki,
        name: name,
        selected: (self.workingscenerevision.locationid === locations[i].$loki)
      });
    }

    // sort by name
    self.locations.sort(function(a, b) {
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    });
  };

  self.initObjects = function () {

    self.objects = [];

    if (SupporterEditionChecker.check()) {
      $injector.get('IntegrityService').ok();

      // objects
      let objects = $injector.get('ObjectService').getObjects();
      for (let i = 0; i < objects.length; i++) {
        let isselected = UtilService.array.contains(self.workingscenerevision.sceneobjects,
          objects[i].$loki);
        self.objects.push({
          id: objects[i].$loki,
          name: objects[i].name,
          selected: isselected
        });
      }
  
      // sort by name
      self.objects.sort(function (a, b) {
        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
      });
    }
  };

  self.initStrands = function() {

    // strands
    let strands = StrandService.getStrands();
    
    self.strands = [];
    for (let i = 0; i < strands.length; i++) {
      let isselected = UtilService.array.contains(self.workingscenerevision.scenestrands,
        strands[i].$loki);
      self.strands.push({
        id: strands[i].$loki,
        name: strands[i].name,
        selected: isselected
      });
    }

    // sort by name
    self.strands.sort(function(a, b) {
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    });
  };

  self.save = function() {
    self.scene.revisions[self.scene.revision] = JSON.parse(JSON.stringify(self.workingscenerevision));
    ChapterService.updateScene(self.scene);
    $rootScope.dirty = false;
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $rootScope.dirty, self.checkExit);
  });
}
