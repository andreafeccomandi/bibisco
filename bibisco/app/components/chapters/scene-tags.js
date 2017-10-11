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
  controller: SceneTitleController
});

function SceneTitleController($location, $routeParams, ChapterService,
  LocationService, LoggerService, MainCharacterService,
  SecondaryCharacterService, StrandService) {
  LoggerService.debug('Start SceneTitleController...');

  var self = this;

  self.$onInit = function() {

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.nav.li.chapters'
    });

    let chapter = ChapterService.getChapter($routeParams.chapterid);
    self.breadcrumbitems.push({
      labelvalue: '#' + chapter.position + ' ' + chapter.title
    });

    let scene = ChapterService.getScene($routeParams.sceneid);
    self.breadcrumbitems.push({
      labelvalue: scene.title
    });
    self.breadcrumbitems.push({
      label: 'jsp.scene.title.tags'
    });

    // init point of views
    self.initPointOfViews();

    // init characters
    self.initCharacters();

    // init locations
    self.initLocations();

    // init narrative strands
    self.initStrands();

    self.title = scene.title;
    self.pageheadertitle =
      'jsp.scene.dialog.title.updateTitle';

    self.dirty = true;

  }

  self.initPointOfViews = function() {

    // point of views
    self.povs = [];

    self.povs.push({
      id: '1stOnMajor',
      selected: true,
      characterRelated: true
    });
    self.povs.push({
      id: '1stOnMinor',
      selected: true,
      characterRelated: true
    });
    self.povs.push({
      id: '3rdLimited',
      selected: true,
      characterRelated: true
    });
    self.povs.push({
      id: '3rdOmniscient',
      selected: true,
      characterRelated: true
    });
    self.povs.push({
      id: '3rdObjective',
      selected: true,
      characterRelated: true
    });
    self.povs.push({
      id: '2nd',
      selected: true,
      characterRelated: true
    });
  }

  self.initCharacters = function() {

    // main characters
    let mainCharacters = MainCharacterService.getMainCharacters();
    self.characters = [];
    for (let i = 0; i < mainCharacters.length; i++) {
      self.characters.push({
        id: mainCharacters[i].$loki,
        name: mainCharacters[i].name,
        main: true,
        selected: true
      });
    }

    // secondary characters
    let secondaryCharacters = SecondaryCharacterService.getSecondaryCharacters();
    for (let i = 0; i < secondaryCharacters.length; i++) {
      self.characters.push({
        id: secondaryCharacters[i].$loki,
        name: secondaryCharacters[i].name,
        main: false,
        selected: true
      });
    }

    // sort by name
    self.characters.sort(function(a, b) {
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    });
  }

  self.initLocations = function() {

    // locations
    let locations = LocationService.getLocations();
    self.locations = [];
    for (let i = 0; i < locations.length; i++) {
      let name = LocationService.calculateLocationName(locations[i]);
      self.locations.push({
        id: locations[i].$loki,
        name: name,
        selected: true
      });
    }

    // sort by name
    self.locations.sort(function(a, b) {
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    });
  }

  self.initStrands = function() {

    // strands
    let strands = StrandService.getStrands();
    self.strands = [];
    for (let i = 0; i < strands.length; i++) {
      self.strands.push({
        id: strands[i].$loki,
        name: strands[i].name,
        selected: true
      });
    }

    // sort by name
    self.strands.sort(function(a, b) {
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    });
  }

  self.save = function() {
    alert('Save tags!');
  }

  self.back = function() {
    $location.path('/chapters/' + $routeParams.chapterid + '/scenes/' +
      $routeParams.sceneid)
  }

  LoggerService.debug('End SceneTitleController...');
}
