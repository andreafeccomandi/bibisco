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
  component('projectexplorer', {
    templateUrl: 'components/project-explorer/project-explorer.html',
    controller: ProjectExplorerController
  });

function ProjectExplorerController($translate, ArchitectureService, ChapterService, 
  LocationService, MainCharacterService, SecondaryCharacterService,
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
      'common_empty_section',
      'common_fabula',
      'common_locations',
      'common_premise',
      'common_setting',
      'common_strands'
    ]);

    self.text;
    self.selectedItem;
    self.items = [];
    self.emptytext = '<i>' + self.translations.common_empty_section + '</i>'; 

    // Architecture
    self.items.push.apply(self.items, self.getArchitectureFamily());

    // Characters
    self.items.push.apply(self.items, self.getCharactersFamily());

    // Locations
    self.items.push.apply(self.items, self.getLocationsFamily());

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
    let premise = ArchitectureService.getPremise();
    self.text = self.defaultString(premise.text);
  };

  self.showFabula = function () {
    let fabula = ArchitectureService.getFabula();
    self.text = self.defaultString(fabula.text);
  };

  self.showSetting = function () {
    let setting = ArchitectureService.getSetting();
    self.text = self.defaultString(setting.text);
  };

  self.showStrands = function () {
    
    let html = '';
    let strands = StrandService.getStrands();
    if (strands.length > 0) {
      for (let i = 0; i < strands.length; i++) {
        html += '<h5>' + strands[i].name + '</h5>';
        html += self.defaultString(strands[i].description);
      }
    } else {
      html = self.emptytext;
    }

    self.text = html;
  };

  self.showSecondaryCharacter = function(id) {
    let secondarycharacter = SecondaryCharacterService.getSecondaryCharacter(id);
    self.text = self.defaultString(secondarycharacter.description);
  };

  self.showLocation = function(id) {
    let location = LocationService.getLocation(id);
    self.text = self.defaultString(location.description);
  };

  self.showChapter = function(id) {
    let html;
    let chapter = ChapterService.getChapter(id);
    
    html = self.getAllScenesAsHtml(id);
    html += '<hr>';
    html += '<h5>' + self.translations.common_chapter_reason + '</h5>';
    html += self.defaultString(chapter.reason.text);
    html += '<hr>';
    html += '<h5>' + self.translations.common_chapter_notes + '</h5>';
    html += self.defaultString(chapter.reason.text);
    
    self.text = html;
  };

  self.getAllScenesAsHtml =  function (id) {

    let html = '';
    let scenes = ChapterService.getScenes(id);

    if (scenes.length > 0) {
      for (let i = 0; i < scenes.length; i++) {
        html += '<h5>' + scenes[i].title + '</h5>';
        html += self.defaultString(scenes[i].revisions[scenes[i].revision].text);
      }
    } else {
      html = self.emptytext;
    }

    return html;
  };


  self.defaultString = function (text) {
    if (text) {
      return text;
    } else {
      return self.emptytext; 
    }
  };
}
