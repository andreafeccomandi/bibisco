/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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
  component('projectexplorer', {
    templateUrl: 'components/project-explorer/project-explorer.html',
    controller: ProjectExplorerController
  });

function ProjectExplorerController($translate, ArchitectureService, ChapterService, 
  ObjectService, LocationService, MainCharacterService, SecondaryCharacterService,
  StrandService) {
  
  var self = this;

  self.$onInit = function () {

    // load translations
    self.translations = $translate.instant([
      'common_architecture',
      'common_chapter_notes',
      'common_chapter_reason',
      'common_chapters',
      'common_characters',
      'common_characters_behaviors',
      'common_characters_conflict',
      'common_characters_evolutionduringthestory',
      'common_characters_ideas',
      'common_characters_lifebeforestorybeginning',
      'common_characters_personaldata',
      'common_characters_physionomy',
      'common_characters_psychology',
      'common_characters_sociology',
      'common_empty_section',
      'common_fabula',
      'common_notes_title',
      'common_locations',
      'common_premise',
      'common_setting',
      'common_strands',
      'objects'
    ]);

    self.type;
    self.text;
    self.images;
    self.selectedItem;
    self.items = [];
    self.emptytext = '<i>' + self.translations.common_empty_section + '</i>'; 

    // Architecture
    self.items.push.apply(self.items, self.getArchitectureFamily());

    // Characters
    self.items.push.apply(self.items, self.getCharactersFamily());

    // Locations
    self.items.push.apply(self.items, self.getLocationsFamily());

    // Objects
    self.items.push.apply(self.items, self.getObjectsFamily());

    // Chapters
    self.items.push.apply(self.items, self.getChaptersFamily());
  };

  self.getArchitectureFamily = function() {
    let architecturefamily = [];
    let family = self.translations.common_architecture;

    architecturefamily.push({
      id: 'premise', 
      name: self.translations.common_premise, 
      family: family,
      selectfunction: self.showPremise
    });
    architecturefamily.push({
      id: 'fabula',
      name: self.translations.common_fabula,
      family: family,
      selectfunction: self.showFabula
    });
    architecturefamily.push({
      id: 'setting',
      name: self.translations.common_setting,
      family: family,
      selectfunction: self.showSetting
    }); 
    architecturefamily.push({
      id: 'globalnotes',
      name: self.translations.common_notes_title,
      family: family,
      selectfunction: self.showGlobalNotes
    });
    architecturefamily.push({
      id: 'strands',
      name: self.translations.common_strands,
      family: family,
      selectfunction: self.showStrands
    });

    return architecturefamily;
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
        selectfunction: self.showMainCharacter
      });
    }

    // secondary characters
    let secondaryCharacters = SecondaryCharacterService.getSecondaryCharacters();
    for (let i = 0; i < secondaryCharacters.length; i++) {
      charactersfamily.push({
        id: secondaryCharacters[i].$loki,
        name: secondaryCharacters[i].name,
        family: family,
        selectfunction: self.showSecondaryCharacter
      });
    }

    // sort by name
    charactersfamily.sort(function (a, b) {
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    });

    return charactersfamily;
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
        selectfunction: self.showLocation
      });
    }

    return locationsfamily;
  };

  self.getObjectsFamily = function () {

    let objectsfamily = [];
    let family = self.translations.objects;

    let objects = ObjectService.getObjects();
    for (let i = 0; i < objects.length; i++) {
      objectsfamily.push({
        id: objects[i].$loki,
        name: objects[i].name,
        family: family,
        selectfunction: self.showObject
      });
    }

    return objectsfamily;
  };

  self.getChaptersFamily = function () {
  
    let chaptersfamily = [];
    let family = self.translations.common_chapters;

    let chapters = ChapterService.getChapters();
    for (let i = 0; i < chapters.length; i++) {
      chaptersfamily.push({
        id: chapters[i].$loki,
        name: '#' + chapters[i].position + ' ' + chapters[i].title,
        family: family,
        selectfunction: self.showChapter
      });
    }

    return chaptersfamily;
  };

  self.selectItem = function() {
    self.selectedItem.selectfunction(self.selectedItem.id);
  };

  self.showPremise = function() {
    self.sectiontitle = 'jsp.architecture.thumbnail.premise.title';
    self.text = ArchitectureService.getPremise().text;
    self.images = null;
    self.type = 'simpletext';
    self.path = '/architectureitems/premise/edit';
  };

  self.showFabula = function () {
    self.sectiontitle = 'jsp.architecture.thumbnail.fabula.title';   
    self.text = ArchitectureService.getFabula().text;
    self.images = null;
    self.type = 'simpletext';
    self.path = '/architectureitems/fabula/edit';
  };

  self.showSetting = function () {
    self.sectiontitle = 'jsp.architecture.thumbnail.setting.title';
    self.text = ArchitectureService.getSetting().text;
    self.images = null;
    self.type = 'simpletext';
    self.path = '/architectureitems/setting/edit';
  };

  self.showGlobalNotes = function () {
    self.sectiontitle = 'common_notes_title';
    self.text = ArchitectureService.getGlobalNotes().text;
    self.images = null;
    self.type = 'simpletext';
    self.path = '/architectureitems/globalnotes/edit';
  };

  self.showStrands = function () {
    self.strands = StrandService.getStrands();
    self.type = 'strands';
  };

  self.showMainCharacter = function (id) {
    self.maincharacter = MainCharacterService.getMainCharacter(id);
    self.type = 'maincharacter';
  };

  self.showSecondaryCharacter = function(id) {
    let secondarycharacter = SecondaryCharacterService.getSecondaryCharacter(id);
    self.sectiontitle = secondarycharacter.name;
    self.text = secondarycharacter.description;
    self.images = secondarycharacter.images;
    self.type = 'simpletext';
    self.path = '/secondarycharacters/'+id+'/edit';
  };

  self.showLocation = function(id) {
    let location = LocationService.getLocation(id);
    self.sectiontitle = LocationService.calculateLocationName(location);
    self.text = location.description;
    self.images = location.images;
    self.type = 'simpletext';
    self.path = '/locations/' + id + '/edit';
  };

  self.showObject = function (id) {
    let object = ObjectService.getObject(id);
    self.sectiontitle = object.name;
    self.text = object.description;
    self.images = object.images;
    self.type = 'simpletext';
    self.path = '/objects/' + id + '/edit';
  };

  self.showChapter = function(id) {
    self.chapter = ChapterService.getChapter(id);
    self.scenes = ChapterService.getScenes(id);
    self.type = 'chapter';
  };
}
