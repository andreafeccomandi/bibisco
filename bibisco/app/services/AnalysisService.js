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

angular.module('bibiscoApp').service('AnalysisService', function(
  ChapterService, LocationService, MainCharacterService, SecondaryCharacterService
) {
  'use strict';

  return {
    getCharacterChapterDistribution: function() {
      
      let chapterscount = 0;
      let items = [];
      
      let chapters = ChapterService.getChapters();
      
      if (chapters && chapters.length > 0) {
        let characters = this.getCharacters();
        chapterscount = chapters.length;

        for (let i = 0; i < characters.length; i++) {
          let presence = [];
          for (let j = 0; j < chapters.length; j++) {
            let isCharacterInChapter = this.isCharacterInChapter(characters[i].id, chapters[j].$loki);
            presence.push(isCharacterInChapter);
          }
          let item = {
            label: characters[i].name,
            presence: presence
          };
          items.push(item);
        }
      }

      return {
        chapterscount: chapterscount,
        items: items
      };
    },

    getCharacters: function () {

      let characters = [];

      // main characters
      let mainCharacters = MainCharacterService.getMainCharacters();
      for (let i = 0; i < mainCharacters.length; i++) {
        characters.push({
          id: 'm_' + mainCharacters[i].$loki,
          name: mainCharacters[i].name
        });
      }

      // secondary characters
      let secondaryCharacters = SecondaryCharacterService.getSecondaryCharacters();
      for (let i = 0; i < secondaryCharacters.length; i++) {
        characters.push({
          id: 's_' + secondaryCharacters[i].$loki,
          name: secondaryCharacters[i].name
        });
      }

      // sort by name
      characters.sort(function (a, b) {
        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
      });

      return characters;
    },

    isCharacterInChapter: function(characterId, chapterId) {
      let presence = 0;
      let scenes = ChapterService.getScenes(chapterId);
      for (let i = 0; i < scenes.length; i++) {
        let scenecharacters = scenes[i].revisions[scenes[i].revision].scenecharacters;
        if (scenecharacters.indexOf(characterId) > -1) {
          presence = 1;
          break;
        }
      }

      return presence;
    },

    getLocationChapterDistribution: function () {

      let chapterscount = 0;
      let items = [];

      let chapters = ChapterService.getChapters();

      if (chapters && chapters.length > 0) {
        let locations = LocationService.getLocations();
        chapterscount = chapters.length;

        for (let i = 0; i < locations.length; i++) {
          let presence = [];
          for (let j = 0; j < chapters.length; j++) {
            let isLocationInChapter = this.isLocationInChapter(locations[i].$loki, chapters[j].$loki);
            presence.push(isLocationInChapter);
          }
          let item = {
            label: LocationService.calculateLocationName(locations[i]),
            presence: presence
          };
          items.push(item);
        }
      }

      return {
        chapterscount: chapterscount,
        items: items
      };
    },

    isLocationInChapter: function (locationId, chapterId) {
      let presence = 0;
      let scenes = ChapterService.getScenes(chapterId);
      for (let i = 0; i < scenes.length; i++) {
        let sceneLocationId = scenes[i].revisions[scenes[i].revision].locationid;
        if (sceneLocationId === locationId) {
          presence = 1;
          break;
        }
      }

      return presence;
    },
  };
});


