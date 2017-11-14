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
angular.
  module('bibiscoApp').
  component('scenetags', {
    templateUrl: 'components/chapters/scene-tags.html',
    controller: SceneTagsController
  });

function SceneTagsController($location, $routeParams, $translate,
  ChapterService, LocaleService, LocationService,
  MainCharacterService, SecondaryCharacterService, StrandService, UtilService) {

  var self = this;

  self.$onInit = function() {

    // load translations
    self.translations = $translate.instant([
      'year_bc_scene_tags'
    ]);

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.nav.li.chapters'
    });

    let chapter = ChapterService.getChapter($routeParams.chapterid);
    self.breadcrumbitems.push({
      label: '#' + chapter.position + ' ' + chapter.title
    });
    let scene = ChapterService.getScene($routeParams.sceneid);
    self.breadcrumbitems.push({
      label: scene.title
    });
    self.breadcrumbitems.push({
      label: 'jsp.scene.title.tags'
    });

    // get scene tags
    self.scenetags = ChapterService.getSceneTags(scene.$loki);

    // init point of views
    self.initPointOfViews();

    // init scene characters
    self.initSceneCharacters();

    // init locations
    self.initLocations();

    // init date time
    if (ChapterService.getLastScenetime() !== null) {
      self.lastscenetime = new Date(ChapterService.getLastScenetime());
    }

    // init narrative strands
    self.initStrands();

    self.title = scene.title;
    self.pageheadertitle =
      'jsp.scene.dialog.title.updateTitle';

    self.dirty = false;

  };

  self.initPointOfViews = function() {

    // point of views
    self.povs = [];

    self.povs.push({
      id: '1stOnMajor',
      selected: (self.scenetags.povid === '1stOnMajor')
    });
    self.povs.push({
      id: '1stOnMinor',
      selected: (self.scenetags.povid === '1stOnMinor')
    });
    self.povs.push({
      id: '3rdLimited',
      selected: (self.scenetags.povid === '3rdLimited')
    });
    self.povs.push({
      id: '3rdOmniscient',
      selected: (self.scenetags.povid === '3rdOmniscient')
    });
    self.povs.push({
      id: '3rdObjective',
      selected: (self.scenetags.povid === '3rdObjective')
    });
    self.povs.push({
      id: '2nd',
      selected: (self.scenetags.povid === '2nd')
    });

    if (self.scenetags.povid === '1stOnMajor' || self.scenetags.povid ===
      '1stOnMinor' || self.scenetags.povid === '3rdLimited') {
      self.showpovcharacter = true;
      self.initPovCharacters();
    } else {
      self.showpovcharacter = false;
      self.scenetags.povcharacterid = null;
    }
  };

  self.togglePov = function(id) {
    self.scenetags.povid = id;
    self.initPointOfViews();
    self.dirty = true;
  };

  self.togglePovCharacter = function(id) {
    self.scenetags.povcharacterid = id;
    self.initPovCharacters();
    self.dirty = true;
  };

  self.toggleSceneCharacter = function(id) {
    self.toggleTagElement(self.scenetags.characters, id);
    self.initSceneCharacters();
  };

  self.toggleLocation = function(id) {
    self.scenetags.locationid = id;
    self.initLocations();
    self.dirty = true;
  };

  self.toggleStrand = function(id) {
    self.toggleTagElement(self.scenetags.strands, id);
    self.initStrands();
  };

  self.toggleTagElement = function(arr, id) {

    let idx = UtilService.array.indexOf(arr, id);
    if (idx !== -1) {
      arr.splice(idx, 1);
    } else {
      arr.push(id);
    }
    self.dirty = true;
  };

  self.initPovCharacters = function() {
    self.povcharacters = self.initCharacters(function(id) {
      return self.scenetags.povcharacterid === id;
    });
  };

  self.initSceneCharacters = function() {
    self.scenecharacters = self.initCharacters(function(id) {
      return UtilService.array.contains(self.scenetags.characters, id);
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
        selected: (self.scenetags.locationid === locations[i].$loki)
      });
    }

    // sort by name
    self.locations.sort(function(a, b) {
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    });
  };

  self.initStrands = function() {

    // strands
    let strands = StrandService.getStrands();
    self.strands = [];
    for (let i = 0; i < strands.length; i++) {
      let isselected = UtilService.array.contains(self.scenetags.strands,
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
    ChapterService.updateSceneTags(self.scenetags);
    self.dirty = false;
  };

  self.back = function() {
    $location.path('/chapters/' + $routeParams.chapterid + '/scenes/' +
      $routeParams.sceneid);
  };
}
