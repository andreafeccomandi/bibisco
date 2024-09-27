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

angular.module('bibiscoApp').service('TimelineService', function ( 
  ArchitectureService, ChapterService, CollectionUtilService, DatetimeService, GroupService, LocationService, 
  LoggerService, MainCharacterService, ObjectService, ProjectDbConnectionService, ProjectService, 
  SecondaryCharacterService, UuidService) {
  'use strict';

  return {

    getTimeline: function(filter) {

      let timeline = [];

      // scenes
      this.pushScenes(timeline, filter);

      // setting
      this.pushSetting(timeline, filter);

      // main characters
      this.pushMainCharacters(timeline, filter);

      // secondary characters
      this.pushSecondaryCharacters(timeline, filter);

      // locations
      this.pushLocations(timeline, filter);

      // objects
      this.pushObjects(timeline, filter);

      // groups
      this.pushGroups(timeline, filter);

      // sort
      this.sortTimeline(timeline);

      return timeline;
    },

    pushScenes: function(timeline, filter) {

      if (filter && filter.type!=='scene') return;

      let scenes = ChapterService.getAllScenes();
      let charactersnames = this.getCharactersNames();
      let objectsnames = this.getObjectsNames();

      for (let i = 0; i < scenes.length; i++) {
        let timelineitem = {};

        // type
        timelineitem.type = 'scene';

        // title
        timelineitem.title = scenes[i].title;

        // time
        this.calculateTimelineItemTime(timelineitem, scenes[i].revisions[scenes[i].revision].timegregorian, scenes[i].revisions[scenes[i].revision].time);

        // scene id
        timelineitem.id = scenes[i].$loki;

        // scene position
        timelineitem.sceneposition = scenes[i].position;

        // chapter id
        let chapter = ChapterService.getChapter(scenes[i].chapterid);
        timelineitem.chapterid = chapter.$loki;

        // chapter position
        timelineitem.chapterposition = chapter.position;

        // chapter position description
        timelineitem.chapterpositiondescription = ChapterService.getChapterPositionDescription();

        // chapter title
        timelineitem.chaptertitle = chapter.title;
        let part = ChapterService.getPartByChapterPosition(chapter.position);
        if (part) {
          timelineitem.chaptertitle += ' (' + part.title + ')';
        }

        // location
        timelineitem.locationname = '';
        if (scenes[i].revisions[scenes[i].revision].locationid) {
          let location = LocationService.getLocation(scenes[i].revisions[scenes[i].revision].locationid);
          timelineitem.locationname = LocationService.calculateLocationName(location);
        } 

        // characters
        timelineitem.characters = '';
        let scenecharacters = scenes[i].revisions[scenes[i].revision].scenecharacters;
        if (scenecharacters && scenecharacters.length > 0) {
          let scenecharactersnames = [];
          for (let j = 0; j < scenecharacters.length; j++) {
            scenecharactersnames.push(charactersnames[scenecharacters[j]]);
          }
          scenecharactersnames.sort();
          for (let k = 0; k < scenecharactersnames.length; k++) {
            let prefix = (k === 0) ? '' : ', ';
            timelineitem.characters += (prefix + scenecharactersnames[k]);
          }
        }

        // objects
        timelineitem.objects = '';
        let sceneobjects = scenes[i].revisions[scenes[i].revision].sceneobjects;
        if (sceneobjects && sceneobjects.length > 0) {
          let sceneobjectsnames = [];
          for (let j = 0; j < sceneobjects.length; j++) {
            sceneobjectsnames.push(objectsnames[sceneobjects[j]]);
          }
          sceneobjectsnames.sort();
          for (let k = 0; k < sceneobjectsnames.length; k++) {
            let prefix = (k === 0) ? '' : ', ';
            timelineitem.objects += (prefix + sceneobjectsnames[k]);
          }
        }
        
        timeline.push(timelineitem);
      }
    },

    pushSetting: function(timeline, filter) {
      if (filter && filter.type!=='architecture') return;
      let setting = ArchitectureService.getArchitectureItem('setting');
      this.pushEvents(timeline, setting.events, 'architecture', 'setting', null);
    },

    pushMainCharacters: function(timeline, filter) {
      if (filter && filter.type!=='maincharacter') return;
      let mainCharacters = MainCharacterService.getMainCharacters();
      for (let i = 0; i < mainCharacters.length; i++) {
        if (filter && filter.id !== mainCharacters[i].$loki) continue;
        this.pushEvents(timeline, mainCharacters[i].events, 'maincharacter', mainCharacters[i].$loki, mainCharacters[i].name);
      }
    },

    pushSecondaryCharacters: function(timeline, filter) {
      if (filter && filter.type!=='secondarycharacter') return;
      let secondaryCharacters = SecondaryCharacterService.getSecondaryCharacters();
      for (let i = 0; i < secondaryCharacters.length; i++) {
        if (filter && filter.id !== secondaryCharacters[i].$loki) continue;
        this.pushEvents(timeline, secondaryCharacters[i].events, 'secondarycharacter', secondaryCharacters[i].$loki, secondaryCharacters[i].name);
      }
    },

    pushLocations: function(timeline, filter) {
      if (filter && filter.type!=='location') return;
      let locations = LocationService.getLocations();
      for (let i = 0; i < locations.length; i++) {
        if (filter && filter.id !== locations[i].$loki) continue;
        this.pushEvents(timeline, locations[i].events, 'location', locations[i].$loki, LocationService.calculateLocationName(locations[i]));
      }
    },

    pushObjects: function(timeline, filter) {
      if (filter && filter.type!=='object') return;
      let objects = ObjectService.getObjects();
      for (let i = 0; i < objects.length; i++) {
        if (filter && filter.id !== objects[i].$loki) continue;
        this.pushEvents(timeline, objects[i].events, 'object', objects[i].$loki, objects[i].name);
      }
    },

    pushGroups: function(timeline, filter) {
      if (filter && filter.type!=='group') return;
      let groups = GroupService.getGroups();
      for (let i = 0; i < groups.length; i++) {
        if (filter && filter.id !== groups[i].$loki) continue;
        this.pushEvents(timeline, groups[i].events, 'group', groups[i].$loki, groups[i].name);
      }
    },

    pushEvents: function(timeline, events, type, id, description) {
      
      if (events && events.length> 0) {
        for (let i = 0; i < events.length; i++) {
          let timelineitem = {};
  
          // type
          timelineitem.type = type;

          // id
          timelineitem.id = id;

          // description
          timelineitem.description = description;

          // event id
          timelineitem.eventid = events[i].id;

          // title
          timelineitem.title = events[i].event;
  
          // time
          this.calculateTimelineItemTime(timelineitem, events[i].timegregorian, events[i].time);
          
          timeline.push(timelineitem);
        }
      }
    },

    calculateTimelineItemTime: function(timelineitem, timegregorian, time) {
      timelineitem.timegregorian = timegregorian;
      timelineitem.time = time;
      if (timelineitem.time && timelineitem.timegregorian) {
        timelineitem.time = new Date(timelineitem.time);
        if (isNaN(timelineitem.time.getTime())) {
          timelineitem.time = null;
        } else {
          timelineitem.sceneyear = DatetimeService.calculateYear(timelineitem.time);
          timelineitem.dayofweek = DatetimeService.calculateDayOfWeek(timelineitem.time);
        }
        
      } else {
        timelineitem.sceneyear = null;
        timelineitem.dayofweek = null;
      }
    },

    getCharactersNames: function () {

      let charactersnames = [];

      // main characters
      let mainCharacters = MainCharacterService.getMainCharacters();
      for (let i = 0; i < mainCharacters.length; i++) {
        charactersnames['m_' + mainCharacters[i].$loki] = mainCharacters[i].name;
      }

      // secondary characters
      let secondaryCharacters = SecondaryCharacterService.getSecondaryCharacters();
      for (let i = 0; i < secondaryCharacters.length; i++) {
        charactersnames['s_' + secondaryCharacters[i].$loki] = secondaryCharacters[i].name;
      }
      return charactersnames;
    },

    getObjectsNames: function () {

      let objectsnames = [];

      // objects
      let objects = ObjectService.getObjects();;
      for (let i = 0; i < objects.length; i++) {
        objectsnames[objects[i].$loki] = objects[i].name;
      }

      return objectsnames;
    },

    sortTimeline: function(timeline) {
      timeline.sort(function (item1, item2) {
        if (item1.time && !item2.time) return 1;
        else if (!item1.time && item2.time) return -1;
        else if (item1.time && item2.time && item1.timegregorian && !item2.timegregorian) return 1;
        else if (item1.time && item2.time && !item1.timegregorian && item2.timegregorian) return -1;
        else if (item1.time && item2.time && item1.timegregorian && item2.timegregorian && item1.time > item2.time) return 1;
        else if (item1.time && item2.time && item1.timegregorian && item2.timegregorian && item1.time < item2.time) return -1;
        else if (item1.time && item2.time && !item1.timegregorian && !item2.timegregorian && item1.time.toUpperCase() > item2.time.toUpperCase()) return 1;
        else if (item1.time && item2.time && !item1.timegregorian && !item2.timegregorian && item1.time.toUpperCase() < item2.time.toUpperCase()) return -1;
        else if (item1.type === 'scene' && item2.type === 'scene') {
          if (item1.chapterposition > item2.chapterposition 
            || item2.chapterposition === ChapterService.PROLOGUE_POSITION
            || item1.chapterposition === ChapterService.EPILOGUE_POSITION) return 1;
          else if (item1.chapterposition < item2.chapterposition
            || item1.chapterposition === ChapterService.PROLOGUE_POSITION
            || item2.chapterposition === ChapterService.EPILOGUE_POSITION) return -1;
          else {
            if (item1.sceneposition > item2.sceneposition) return 1;
            else if (item1.sceneposition < item2.sceneposition) return -1;
            else return 0;
          }
        }
        else if (item1.type === 'scene' && item2.type !== 'scene') return 1;
        else if (item1.type !== 'scene' && item2.type === 'scene') return -1;
        else {
          if (item1.name > item2.name) return 1;
          else if (item1.name < item2.name) return -1;
          else return 0;
        }
      });
    },

    addEvent: function(type, id, time, timegregorian, event) {
      let element = this.getElement(type, id);
      if (!element.events) {
        element.events = [];
      }
      let events = element.events;
      events.push({
        id: UuidService.generateUuid(),
        time: time,
        timegregorian: timegregorian,
        event: event
      });
      element.events = events;
      CollectionUtilService.updateWithoutCommit(this.getCollection(type), element);

      // update last scenetime tag
      if (timegregorian) {
        ProjectService.updateLastScenetimeTagWithoutCommit(time);
      }

      // save project database
      ProjectDbConnectionService.saveDatabase();
    },
    deleteEvent: function (type, id, eventid) {
      let element = this.getElement(type, id);
      let events = element.events;
      let eventToRemovePosition;
      for (let i = 0; i < events.length; i++) {
        if (events[i].id === eventid) {
          eventToRemovePosition = i;
          break;
        }
      }
      events.splice(eventToRemovePosition, 1);
      element.events = events;
      CollectionUtilService.update(this.getCollection(type), element);
      LoggerService.info('Deleted event ' + eventid + ' for element with $loki='+ id + ' of type ' + type);
    },
    editEvent: function (type, id, eventid, time, timegregorian, event) {
      let element = this.getElement(type, id);
      let events = element.events;
      for (let i = 0; i < events.length; i++) {
        if (events[i].id === eventid) {
          events[i].time = time;
          events[i].timegregorian = timegregorian;
          events[i].event = event;
          break;
        }
      }
      element.events = events;
      CollectionUtilService.update(this.getCollection(type), element);
      LoggerService.info('Edited event ' + eventid + ' for element with $loki='+ id + ' of type ' + type);
    },
    getCollection: function(type) {
      let collection;
      switch(type) {
      case 'architecture':
        collection = ArchitectureService.getCollection();
        break;
      case 'maincharacter':
        collection = MainCharacterService.getCollection();
        break;
      case 'secondarycharacter':
        collection = SecondaryCharacterService.getCollection();
        break;
      case 'location':
        collection = LocationService.getCollection();
        break;
      case 'object':
        collection = ObjectService.getCollection();
        break;
      case 'group':
        collection = GroupService.getCollection();
        break;
      }
      return collection;
    },

    getEvent: function(type,id, eventid) {
      let element = this.getElement(type, id);
      let events = element.events;
      for (let i = 0; i < events.length; i++) {
        if (events[i].id === eventid) {
          return events[i];
        }
      }
    },

    getElement: function(type,id) {
      let element;
      switch(type) {
      case 'architecture':
        element = ArchitectureService.getArchitectureItem(id);
        break;
      case 'maincharacter':
        element = MainCharacterService.getMainCharacter(id);
        break;
      case 'secondarycharacter':
        element = SecondaryCharacterService.getSecondaryCharacter(id);
        break;
      case 'location':
        element = LocationService.getLocation(id);
        break;
      case 'object':
        element = ObjectService.getObject(id);
        break;
      case 'group':
        element = GroupService.getGroup(id);
        break;
      }
      return element;
    }
  };
});

