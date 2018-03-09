/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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

angular.module('bibiscoApp').service('TimelineService', function ( 
  ChapterService, DatetimeService, LocationService, MainCharacterService, 
  SecondaryCharacterService) {
  'use strict';

  return {

    getTimeline: function() {

      let timeline = [];
      let scenes = ChapterService.getAllScenes();
      let characters = this.getCharacters();

      for (let i = 0; i < scenes.length; i++) {
        let timelineitem = {};
        
        // title
        timelineitem.title = scenes[i].title;

        // time
        timelineitem.timegregorian = scenes[i].revisions[scenes[i].revision].timegregorian;
        timelineitem.time = scenes[i].revisions[scenes[i].revision].time;
        if (timelineitem.time && timelineitem.timegregorian) {
          timelineitem.time = new Date(timelineitem.time);
          timelineitem.sceneyear = DatetimeService.calculateSceneYear(timelineitem.time);
        } else {
          timelineitem.sceneyear = null;
        }

        // scene id
        timelineitem.sceneid = scenes[i].$loki;

        // scene position
        timelineitem.sceneposition = scenes[i].position;

        let chapter = ChapterService.getChapter(scenes[i].chapterid);
        // chapter id
        timelineitem.chapterid = chapter.$loki;

        // chapter position
        timelineitem.chapterposition = chapter.position;

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
            scenecharactersnames.push(characters[scenecharacters[j]]);
          }
          scenecharactersnames.sort();
          for (let k = 0; k < scenecharactersnames.length; k++) {
            let prefix = (k === 0) ? '' : ', ';
            timelineitem.characters += (prefix + scenecharactersnames[k]);
          }
        }
        
        timeline.push(timelineitem);
      }

      timeline.sort(function (item1, item2) {
        if (!item1.time && !item2.time) return 0; 
        else if (item1.time && !item2.time) return 1;
        else if (!item1.time && item2.time) return -1;
        else if (item1.time > item2.time) return 1;
        else if (item1.time < item2.time) return -1;
        else {
          if (item1.chapterposition > item2.chapterposition) return 1;
          else if (item1.chapterposition < item2.chapterposition) return -1;
          else {
            if (item1.sceneposition > item2.sceneposition) return 1;
            else if (item1.sceneposition < item2.sceneposition) return -1;
            else return 0;
          }
        }
      });

      return timeline;
    },

    getCharacters: function () {

      let characters = [];

      // main characters
      let mainCharacters = MainCharacterService.getMainCharacters();
      for (let i = 0; i < mainCharacters.length; i++) {
        characters['m_' + mainCharacters[i].$loki] = mainCharacters[i].name;
      }

      // secondary characters
      let secondaryCharacters = SecondaryCharacterService.getSecondaryCharacters();
      for (let i = 0; i < secondaryCharacters.length; i++) {
        characters['s_' + secondaryCharacters[i].$loki] = secondaryCharacters[i].name;
      }
      return characters;
    },
  };
});

