/*
 * Copyright (C) 2014-2024 Andrea Feccomandi
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
    controller: ProjectExplorerController,
    bindings: {
      editmode: '<'
    }
  });

function ProjectExplorerController($injector, $rootScope, $translate, 
  ArchitectureService, ChapterService, LocationService, MainCharacterService, NavigationService,
  SecondaryCharacterService, SupporterEditionChecker, StrandService) {
  
  let self = this;
  const { shell } = require('electron');

  let ObjectService = null;
  let GroupService = null;
  let NoteService = null;
  let TimelineService = null;

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
      'common_physionomy',
      'common_characters_psychology',
      'common_characters_sociology',
      'common_empty_section',
      'common_fabula',
      'common_notes_title',
      'common_locations',
      'common_premise',
      'common_setting',
      'common_strands',
      'groups',
      'objects'
    ]);

    self.includeSupporterEditionItems = SupporterEditionChecker.isSupporterOrTrial();
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

    // Groups
    self.items.push.apply(self.items, self.getGroupsFamily());

    // Notes
    self.items.push.apply(self.items, self.getNotesFamily());

    // Chapters
    self.items.push.apply(self.items, self.getChaptersFamily());
    
    let cacheElement = NavigationService.getProjectExplorerCacheEntry($rootScope.actualPath);
    if (cacheElement) {
      for (let i = 0; i < self.items.length; i++) {
        if (self.items[i].itemid === cacheElement) {
          self.selectedItem = self.items[i];
          self.selectItem();
          break;
        }
      }
    }

    // click event listener
    self.projectexplorer = document.getElementById('projectexplorer');
    self.projectexplorer.addEventListener('click', function(event) {
      let target = event.target;
        
      // click on anchor
      if (target.tagName === 'A') {
        event.preventDefault();
        let url = target.getAttribute('href');
        shell.openExternal(url);
      }
    });
  };

  self.getArchitectureFamily = function() {
    let architecturefamily = [];
    let family = self.translations.common_architecture;

    architecturefamily.push({
      itemid: 'architecture_premise',
      id: 'premise', 
      name: self.translations.common_premise, 
      family: family,
      selectfunction: self.showPremise
    });
    architecturefamily.push({
      itemid: 'architecture_fabula',
      id: 'fabula',
      name: self.translations.common_fabula,
      family: family,
      selectfunction: self.showFabula
    });
    architecturefamily.push({
      itemid: 'architecture_setting',
      id: 'setting',
      name: self.translations.common_setting,
      family: family,
      selectfunction: self.showSetting
    }); 
    if (self.includeSupporterEditionItems) {
      architecturefamily.push({
        itemid: 'architecture_globalnotes',
        id: 'globalnotes',
        name: self.translations.common_notes_title,
        family: family,
        selectfunction: self.showGlobalNotes
      });
    }
    architecturefamily.push({
      itemid: 'architecture_strands',
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
        itemid: 'maincharacter_' + mainCharacters[i].$loki,
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
        itemid: 'secondarycharacter_' + secondaryCharacters[i].$loki,
        id: secondaryCharacters[i].$loki,
        name: secondaryCharacters[i].name,
        family: family,
        selectfunction: self.showSecondaryCharacter
      });
    }

    // sort by name
    charactersfamily.sort(function (a, b) {
      return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0);
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
        itemid: 'location_' + locations[i].$loki,
        id: locations[i].$loki,
        name: name,
        family: family,
        selectfunction: self.showLocation
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
    if (self.includeSupporterEditionItems) {
      let family = self.translations.objects;
      let objects = self.getObjectService().getObjects();
      for (let i = 0; i < objects.length; i++) {
        objectsfamily.push({
          itemid: 'object_' + objects[i].$loki,
          id: objects[i].$loki,
          name: objects[i].name,
          family: family,
          selectfunction: self.showObject
        });
      }
    }

    // sort by name
    objectsfamily.sort(function (a, b) {
      return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0);
    });

    return objectsfamily;
  };

  self.getGroupsFamily = function () {

    let groupsfamily = [];
    if (self.includeSupporterEditionItems) {
      let family = self.translations.groups;
      let groups = self.getGroupService().getGroups();
      for (let i = 0; i < groups.length; i++) {
        groupsfamily.push({
          itemid: 'group_' + groups[i].$loki,
          id: groups[i].$loki,
          name: groups[i].name,
          family: family,
          selectfunction: self.showGroup
        });
      }
    }

    // sort by name
    groupsfamily.sort(function (a, b) {
      return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0);
    });

    return groupsfamily;
  };

  self.getNotesFamily = function () {

    let notesfamily = [];
    if (self.includeSupporterEditionItems) {
      let family = self.translations.common_notes_title;
      let notes = self.getNoteService().getNotes();
      for (let i = 0; i < notes.length; i++) {
        notesfamily.push({
          itemid: 'note_' + notes[i].$loki,
          id: notes[i].$loki,
          name: notes[i].name,
          family: family,
          selectfunction: self.showNote
        });
      }
    }

    // sort by name
    notesfamily.sort(function (a, b) {
      return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0);
    });

    return notesfamily;
  };

  self.getChaptersFamily = function () {
  
    let chaptersfamily = [];
    let family = self.translations.common_chapters;

    let chapters = ChapterService.getChaptersWithPrologueAndEpilogue();
    for (let i = 0; i < chapters.length; i++) {
      chaptersfamily.push({
        itemid: 'chapter_' + chapters[i].$loki,
        id: chapters[i].$loki,
        name: ChapterService.getChapterPositionDescription(chapters[i].position) + ' ' + chapters[i].title,
        family: family,
        selectfunction: self.showChapter
      });
    }

    return chaptersfamily;
  };

  self.selectItem = function() {
    self.selectedItem.selectfunction(self.selectedItem.id);
    $rootScope.$emit('PROJECT_EXPLORER_SELECTED_ITEM');
    NavigationService.setProjectExplorerCacheEntry($rootScope.actualPath, self.selectedItem.itemid);
  };

  self.showPremise = function() {
    self.sectiontitle = 'jsp.architecture.thumbnail.premise.title';
    self.text = ArchitectureService.getPremise().text;
    self.images = null;
    self.timeline = null;
    self.type = 'simpletext';
    self.path = '/architectureitems/premise/edit';
  };

  self.showFabula = function () {
    self.sectiontitle = 'jsp.architecture.thumbnail.fabula.title';   
    self.text = ArchitectureService.getFabula().text;
    self.images = null;
    self.timeline = null;
    self.type = 'simpletext';
    self.path = '/architectureitems/fabula/edit';
  };

  self.showSetting = function () {
    self.sectiontitle = 'jsp.architecture.thumbnail.setting.title';
    self.text = ArchitectureService.getSetting().text;
    self.images = null;
    if (self.includeSupporterEditionItems) {
      self.timeline = self.getTimelineService().getTimeline({type: 'architecture', id: 'setting'});
    } else {
      self.timeline = null;
    }
    self.type = 'simpletext';
    self.path = '/architectureitems/setting/edit';
  };

  self.showGlobalNotes = function () {
    if (self.includeSupporterEditionItems) {
      self.sectiontitle = 'common_notes_title';
      self.text = ArchitectureService.getGlobalNotes().text;
      self.images = null;
      self.timeline = null;
      self.type = 'simpletext';
      self.path = '/architectureitems/globalnotes/edit';
    }
  };

  self.showStrands = function () {
    self.strands = StrandService.getStrands();
    self.type = 'strands';
  };

  self.showMainCharacter = function (id) {
    self.maincharacter = MainCharacterService.getMainCharacter(id);
    if (self.includeSupporterEditionItems) {
      self.timeline = self.getTimelineService().getTimeline({type: 'maincharacter', id: id});
    } else {
      self.timeline = null;
    }
    self.type = 'maincharacter';
  };

  self.showSecondaryCharacter = function(id) {
    let secondarycharacter = SecondaryCharacterService.getSecondaryCharacter(id);
    self.sectiontitle = secondarycharacter.name;
    self.text = secondarycharacter.description;
    self.images = secondarycharacter.images;
    if (self.includeSupporterEditionItems) {
      self.timeline = self.getTimelineService().getTimeline({type: 'secondarycharacter', id: id});
    } else {
      self.timeline = null;
    }
    self.type = 'simpletext';
    self.path = '/secondarycharacters/'+id+'/edit';
  };

  self.showLocation = function(id) {
    let location = LocationService.getLocation(id);
    self.sectiontitle = LocationService.calculateLocationName(location);
    self.text = location.description;
    self.images = location.images;
    if (self.includeSupporterEditionItems) {
      self.timeline = self.getTimelineService().getTimeline({type: 'location', id: id});
    } else {
      self.timeline = null;
    }
    self.type = 'simpletext';
    self.path = '/locations/' + id + '/edit';
  };

  self.showObject = function (id) {
    if (self.includeSupporterEditionItems) {
      let object = self.getObjectService().getObject(id);
      self.sectiontitle = object.name;
      self.text = object.description;
      self.images = object.images;
      self.timeline = self.getTimelineService().getTimeline({type: 'object', id: id});
      self.type = 'simpletext';
      self.path = '/objects/' + id + '/edit';
    }
  };

  self.showGroup = function (id) {
    if (self.includeSupporterEditionItems) {
      let group = self.getGroupService().getGroup(id);
      self.sectiontitle = group.name;
      self.text = group.description;
      self.images = group.images;
      self.timeline = self.getTimelineService().getTimeline({type: 'group', id: id});
      self.type = 'simpletext';
      self.path = '/groups/' + id + '/edit';
    }
  };

  self.showNote = function (id) {
    if (self.includeSupporterEditionItems) {
      let note = self.getNoteService().getNote(id);
      self.sectiontitle = note.name;
      self.text = note.description;
      self.images = note.images;
      self.timeline = null;
      self.type = 'simpletext';
      self.path = '/notes/' + id + '/edit';
    }
  };

  self.showChapter = function(id) {
    self.chapter = ChapterService.getChapter(id);
    self.scenes = ChapterService.getScenes(id);
    self.type = 'chapter';
  };

  self.getObjectService = function () {
    if (!ObjectService) {
      ObjectService = $injector.get('ObjectService');
    }

    return ObjectService;
  };

  self.getGroupService = function () {
    if (!GroupService) {
      GroupService = $injector.get('GroupService');
    }

    return GroupService;
  };
  
  self.getNoteService = function () {
    if (!NoteService) {
      NoteService = $injector.get('NoteService');
    }

    return NoteService;
  };

  self.getTimelineService = function () {
    if (!TimelineService) {
      TimelineService = $injector.get('TimelineService');
    }

    return TimelineService;
  };
}
