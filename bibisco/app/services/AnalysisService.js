/*
 * Copyright (C) 2014-2023 Andrea Feccomandi
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

angular.module('bibiscoApp').service('AnalysisService', function ($injector, $translate,
  ChapterService, LocationService, MainCharacterService, SecondaryCharacterService, 
  StrandService, SupporterEditionChecker) {
  'use strict';
  
  let ObjectService;
  let chapters;
  let chapter_scenes;
  let parts;
  let characters;
  let mainCharacters;
  let secondaryCharacters;
  let locations;
  let objects;
  let strands;
  

  return {

    // empty function, just to create the service while loading page
    // without eslint error
    init: function () {

      // chapters and scenes
      chapters = ChapterService.getChaptersWithPrologueAndEpilogue();
      chapter_scenes = [];
      if (chapters && chapters.length > 0) {
        for (let i = 0; i < chapters.length; i++) {
          chapter_scenes[chapters[i].$loki] = ChapterService.getScenes(chapters[i].$loki);
        }
      }

      // parts
      parts = null;
      if (ChapterService.getPartsCount()>0) {
        parts = ChapterService.getParts();
      } 

      // characters
      characters = [];
      mainCharacters = MainCharacterService.getMainCharacters();
      secondaryCharacters = SecondaryCharacterService.getSecondaryCharacters();
      for (let i = 0; i < mainCharacters.length; i++) {
        characters.push({
          id: 'm_' + mainCharacters[i].$loki,
          name: mainCharacters[i].name
        });
      }
      for (let i = 0; i < secondaryCharacters.length; i++) {
        characters.push({
          id: 's_' + secondaryCharacters[i].$loki,
          name: secondaryCharacters[i].name
        });
      }
      characters.sort(function (a, b) {
        return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0);
      });

      locations = LocationService.getLocations();
      strands = StrandService.getStrands();

      if (SupporterEditionChecker.isSupporterOrTrial()) {
        objects = this.getObjectService().getObjects();
      }
    },

    getChaptersLength: function() {
      let chapterpositions = [];
      let words = [];
      let total = 0;
      let totalcharacters = 0;
      let partsdelimiters = [];
      let partswords = [];
      let partsenabled = (parts && parts.length > 0) ? true : false;

      if (chapters && chapters.length > 0) {
        for (let i = 0; i < chapters.length; i++) {
          chapterpositions.push(chapters[i].position);
          words.push(chapters[i].words);
          total += chapters[i].words;
          totalcharacters += chapters[i].characters;

          // calculate parts' words
          if(partsenabled) {
            let part = ChapterService.getPartByChapterPosition(chapters[i].position);
            if (part) {
              partswords[part.position-1] = partswords[part.position-1] ? partswords[part.position-1]+chapters[i].words : chapters[i].words;
            }
          }
        }
      }

      // calculate parts' delimiters
      if (partsenabled && chapters && chapters.length > 0) {
        let lastPart = null;
        for (let i = 0; i < chapters.length; i++) {
          let actualElementPart = ChapterService.getPartByChapterPosition(chapters[i].position);
          if (lastPart !== actualElementPart) {
            if (i>0) {
              let position = i-0.5;
              let parts = [];
              if (!lastPart && actualElementPart) {
                parts = [null,actualElementPart.position];
              } else if (lastPart && !actualElementPart)  {
                parts = [lastPart.position,null];
              } else {
                parts = [lastPart.position,actualElementPart.position];
              }
              partsdelimiters.push ({
                position: position,
                parts: parts
              });
            }
            lastPart = actualElementPart;
          }
        }
      }

      return { 
        chapterpositions: chapterpositions,
        total: total, 
        totalcharacters: totalcharacters, 
        words: words, 
        partsdelimiters: partsdelimiters,
        partsenabled: partsenabled,
        partswords: partswords,
      };
    },

    getCharacterChapterDistribution: function() {
      
      let chapterscount = 0;
      let items = [];
      let chapterspositions = [];
            
      if (chapters && chapters.length > 0) {
        chapterscount = chapters.length;
        for (let i = 0; i < chapters.length; i++) {
          chapterspositions.push(chapters[i].position);
        }

        for (let i = 0; i < characters.length; i++) {
          let presence = [];
          let presencecount = 0;
          for (let j = 0; j < chapters.length; j++) {
            let isCharacterInChapter = this.isCharacterInChapter(characters[i].id, chapters[j].$loki);
            if (isCharacterInChapter === 1) {
              presencecount++;
            }
            presence.push(isCharacterInChapter);
          }
          let item = {
            label: characters[i].name,
            presence: presence,
            percentage: ((presencecount / chapterscount) * 100).toFixed(2)
          };
          items.push(item);
        }
      }

      return {
        chapterscount: chapterscount,
        chapterspositions: chapterspositions,
        items: items
      };
    },

    getCharacters: function () {

      let characters = [];

      // main characters
      for (let i = 0; i < mainCharacters.length; i++) {
        characters.push({
          id: 'm_' + mainCharacters[i].$loki,
          name: mainCharacters[i].name
        });
      }

      // secondary characters
      for (let i = 0; i < secondaryCharacters.length; i++) {
        characters.push({
          id: 's_' + secondaryCharacters[i].$loki,
          name: secondaryCharacters[i].name
        });
      }

      // sort by name
      characters.sort(function (a, b) {
        return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0);
      });

      return characters;
    },

    isCharacterInChapter: function(characterId, chapterId) {
      let presence = 0;
      let scenes = chapter_scenes[chapterId];
      for (let i = 0; i < scenes.length; i++) {
        let scenecharacters = scenes[i].revisions[scenes[i].revision].scenecharacters;
        if (scenecharacters.indexOf(characterId) > -1) {
          presence = 1;
          break;
        }
      }

      return presence;
    },

    getObjectChapterDistribution: function () {

      if (!objects) {
        return null;
      }

      let chapterscount = 0;
      let items = [];
      let chapterspositions = [];

      if (chapters && chapters.length > 0) {
        chapterscount = chapters.length;
        for (let i = 0; i < chapters.length; i++) {
          chapterspositions.push(chapters[i].position);
        }

        for (let i = 0; i < objects.length; i++) {
          let presence = [];
          let presencecount = 0;
          for (let j = 0; j < chapters.length; j++) {
            let isObjectInChapter = this.isObjectInChapter(objects[i].$loki, chapters[j].$loki);
            if (isObjectInChapter === 1) {
              presencecount++;
            }
            presence.push(isObjectInChapter);
          }
          let item = {
            label: objects[i].name,
            presence: presence,
            percentage: ((presencecount / chapterscount) * 100).toFixed(2)
          };
          items.push(item);
        }

        // sort by label
        items.sort(function (a, b) {
          return (a.label.toUpperCase() > b.label.toUpperCase()) ? 1 : ((b.label.toUpperCase() > a.label.toUpperCase()) ? -1 : 0);
        });
      }

      return {
        chapterscount: chapterscount,
        chapterspositions: chapterspositions,
        items: items
      };
    },

    isObjectInChapter: function(objectId, chapterId) {
      let presence = 0;
      let scenes = chapter_scenes[chapterId];
      for (let i = 0; i < scenes.length; i++) {
        let sceneobjects = scenes[i].revisions[scenes[i].revision].sceneobjects;
        if (sceneobjects.indexOf(objectId) > -1) {
          presence = 1;
          break;
        }
      }

      return presence;
    },

    getLocationChapterDistribution: function () {

      let chapterscount = 0;
      let items = [];
      let chapterspositions = [];

      if (chapters && chapters.length > 0) {
        chapterscount = chapters.length;
        for (let i = 0; i < chapters.length; i++) {
          chapterspositions.push(chapters[i].position);
        }

        for (let i = 0; i < locations.length; i++) {
          let presence = [];
          let presencecount = 0;
          for (let j = 0; j < chapters.length; j++) {
            let isLocationInChapter = this.isLocationInChapter(locations[i].$loki, chapters[j].$loki);
            if (isLocationInChapter === 1) {
              presencecount++;
            }
            presence.push(isLocationInChapter);
          }
          let item = {
            label: LocationService.calculateLocationName(locations[i]),
            presence: presence,
            percentage: ((presencecount / chapterscount) * 100).toFixed(2)
          };
          items.push(item);
        }

        // sort by label
        items.sort(function (a, b) {
          return (a.label.toUpperCase() > b.label.toUpperCase()) ? 1 : ((b.label.toUpperCase() > a.label.toUpperCase()) ? -1 : 0);
        });
      }

      return {
        chapterscount: chapterscount,
        chapterspositions: chapterspositions,
        items: items
      };
    },

    isLocationInChapter: function (locationId, chapterId) {
      let presence = 0;
      let scenes = chapter_scenes[chapterId];
      for (let i = 0; i < scenes.length; i++) {
        let sceneLocationId = scenes[i].revisions[scenes[i].revision].locationid;
        if (sceneLocationId === locationId) {
          presence = 1;
          break;
        }
      }

      return presence;
    },

    getStrandChapterDistribution: function () {

      let chapterscount = 0;
      let items = [];
      let chapterspositions = [];

      if (chapters && chapters.length > 0) {
        chapterscount = chapters.length;
        for (let i = 0; i < chapters.length; i++) {
          chapterspositions.push(chapters[i].position);
        }

        for (let i = 0; i < strands.length; i++) {
          let presence = [];
          let presencecount = 0;
          for (let j = 0; j < chapters.length; j++) {
            let isStrandInChapter = this.isStrandInChapter(strands[i].$loki, chapters[j].$loki);
            if (isStrandInChapter === 1) {
              presencecount++;
            }
            presence.push(isStrandInChapter);
          }
          let item = {
            label: strands[i].name,
            presence: presence,
            percentage: ((presencecount / chapterscount) * 100).toFixed(2)
          };
          items.push(item);
        }

        // sort by label
        items.sort(function (a, b) {
          return (a.label.toUpperCase() > b.label.toUpperCase()) ? 1 : ((b.label.toUpperCase() > a.label.toUpperCase()) ? -1 : 0);
        });
      }

      return {
        chapterscount: chapterscount,
        chapterspositions: chapterspositions,
        items: items
      };
    },

    isStrandInChapter: function (strandId, chapterId) {
      let presence = 0;
      let scenes = chapter_scenes[chapterId];
      for (let i = 0; i < scenes.length; i++) {
        let scenestrands = scenes[i].revisions[scenes[i].revision].scenestrands;
        if (scenestrands.indexOf(strandId) > -1) {
          presence = 1;
          break;
        }
      }

      return presence;
    },

    getPointOfViewChapterDistribution: function () {

      let chapterscount = 0;
      let items = [];
      let chapterspositions = [];

      if (chapters && chapters.length > 0) {
        let povs = this.getPointOfViews();
        chapterscount = chapters.length;
        for (let i = 0; i < chapters.length; i++) {
          chapterspositions.push(chapters[i].position);
        }

        for (let i = 0; i < povs.length; i++) {
          let presence = [];
          let presencecount = 0;
          let isPresent = false;
          for (let j = 0; j < chapters.length; j++) {
            let isPovInChapter = this.isPointOfViewInChapter(povs[i], chapters[j].$loki);
            if (isPovInChapter) {
              isPresent = true;
              presencecount++;
            }
            presence.push(isPovInChapter);
          }

          // add pov only if at least is present in one scene
          if (isPresent) {
            let item = {
              label: povs[i].label,
              labelshort: povs[i].labelshort,
              presence: presence,
              percentage: ((presencecount / chapterscount) * 100).toFixed(2)
            };
            items.push(item);
          }
        }
      }

      return {
        chapterscount: chapterscount,
        chapterspositions: chapterspositions,
        items: items
      };
    },

    getPointOfViews: function() {

      // load translations
      let translations = $translate.instant([
        'common_pointOfView_1stOnMajor',
        'common_pointOfView_1stOnMajor_short',
        'common_pointOfView_1stOnMinor',
        'common_pointOfView_1stOnMinor_short',
        'common_pointOfView_3rdLimited',
        'common_pointOfView_3rdLimited_short',
        'common_pointOfView_3rdOmniscient',
        'common_pointOfView_3rdOmniscient_short',
        'common_pointOfView_3rdObjective',
        'common_pointOfView_3rdObjective_short',
        'common_pointOfView_2nd',
        'common_pointOfView_2nd_short'
      ]);

      let povs = [];

      povs.push.apply(povs, this.createEntriesForPointOfView('1stOnMajor', true, characters, translations));
      povs.push.apply(povs, this.createEntriesForPointOfView('1stOnMinor', true, characters, translations));
      povs.push.apply(povs, this.createEntriesForPointOfView('3rdLimited', true, characters, translations));
      povs.push.apply(povs, this.createEntriesForPointOfView('3rdOmniscient', false, characters, translations));
      povs.push.apply(povs, this.createEntriesForPointOfView('3rdObjective', false, characters, translations)); 
      povs.push.apply(povs, this.createEntriesForPointOfView('2nd', false, characters, translations));

      return povs;
    },

    createEntriesForPointOfView: function (povid, dependOnCharacter, characters, translations) {

      let entries = [];

      let povname = translations['common_pointOfView_' + povid];
      let povnameshort = translations['common_pointOfView_' + povid + '_short'];
      if (dependOnCharacter) {
        for (let i = 0; i < characters.length; i++) {
          entries.push({
            id: povid,
            characterid: characters[i].id,
            label: povname + ': ' + characters[i].name,
            labelshort: povnameshort + ' ' + characters[i].name,
          });
          
        }
      } else {
        entries.push({
          id: povid,
          characterid: null,
          label: povname,
          labelshort: povnameshort
        });
      }

      return entries;
    },

    isPointOfViewInChapter: function (pov, chapterId) {
      let presence = 0;
      let scenes = chapter_scenes[chapterId];
      for (let i = 0; i < scenes.length; i++) {
        let id = scenes[i].revisions[scenes[i].revision].povid;
        let characterid = scenes[i].revisions[scenes[i].revision].povcharacterid;
        
        if (pov.id === id && pov.characterid === characterid) {
          presence = 1;
          break;
        }
      }

      return presence;
    },

    getObjectsListOfAppearance: function() {

      if (!objects) {
        return null;
      }

      let chapterscount = 0;
      let items = [];

      if (chapters && chapters.length > 0) {
        chapterscount = chapters.length;

        for (let i = 0; i < objects.length; i++) {
          let appearances = [];
          for (let j = 0; j < chapters.length; j++) {
            appearances.push.apply(appearances, this.getObjectAppearencesInChapter(objects[i].$loki, chapters[j]));
          }

          // sort appearences by time, chapter position, scene position
          appearances = this.sortAppearances(appearances);
          
          let item = {
            label: objects[i].name,
            appearances: appearances
          };
          items.push(item);
        }
      }

      return {
        chapterscount: chapterscount,
        items: items
      };
    },

    getCharactersListOfAppearance: function() {

      let chapterscount = 0;
      let items = [];

      if (chapters && chapters.length > 0) {
        chapterscount = chapters.length;

        for (let i = 0; i < characters.length; i++) {
          let appearances = [];
          for (let j = 0; j < chapters.length; j++) {
            appearances.push.apply(appearances, this.getCharacterAppearencesInChapter(characters[i].id, chapters[j]));
          }

          // sort appearences by time, chapter position, scene position
          appearances = this.sortAppearances(appearances);
          
          let item = {
            label: characters[i].name,
            appearances: appearances
          };
          items.push(item);
        }
      }

      return {
        chapterscount: chapterscount,
        items: items
      };
    },

    sortAppearances: function (appearances) {
      appearances.sort(function (a, b) {

        if (a.time && !b.time) return 1;
        else if (!a.time && b.time) return -1;
        else if (a.time && b.time && a.timegregorian && !b.timegregorian) return 1;
        else if (a.time && b.time && !a.timegregorian && b.timegregorian) return -1;
        else if (a.time && b.time && a.timegregorian && b.timegregorian && a.time > b.time) return 1;
        else if (a.time && b.time && a.timegregorian && b.timegregorian && a.time < b.time) return -1;
        else if (a.time && b.time && !a.timegregorian && !b.timegregorian && a.time.toUpperCase() > b.time.toUpperCase()) return 1;
        else if (a.time && b.time && !a.timegregorian && !b.timegregorian && a.time.toUpperCase() < b.time.toUpperCase()) return -1;
        else {
          if (a.chapterposition > b.chapterposition 
            || b.chapterposition === ChapterService.PROLOGUE_POSITION
            || a.chapterposition === ChapterService.EPILOGUE_POSITION) {
            return 1;
          } else if (a.chapterposition < b.chapterposition 
            || a.chapterposition === ChapterService.PROLOGUE_POSITION
            || b.chapterposition === ChapterService.EPILOGUE_POSITION) {
            return -1;
          } else {
            if (a.sceneposition > b.sceneposition) {
              return 1;
            } else if (a.sceneposition < b.sceneposition) {
              return -1;
            } else {
              return 0;
            }
          }
        }
      });

      return appearances;
    },

    getItemAppearencesInChapter: function (sceneitemsname, itemId, chapter) {
      
      let appearances = [];
      let scenes = chapter_scenes[chapter.$loki];
      for (let i = 0; i < scenes.length; i++) {
        let sceneitems = scenes[i].revisions[scenes[i].revision][sceneitemsname];
        if (sceneitems.indexOf(itemId) > -1) {
          let chapterposition = chapter.position;
          let chaptertitle = ChapterService.getChapterPositionDescription(chapter.position) + ' ' + chapter.title;
          let locationId = scenes[i].revisions[scenes[i].revision].locationid;
          let sceneposition = scenes[i].position;
          let scenetitle = scenes[i].title;
          let time = scenes[i].revisions[scenes[i].revision].time;
          let timegregorian = scenes[i].revisions[scenes[i].revision].timegregorian;
          if (time && timegregorian) {
            time = new Date(time);
            if (isNaN(time.getTime())) {
              time = null;
            }
          } 

          appearances.push({
            chapterposition: chapterposition,
            chaptertitle: chaptertitle,
            location: LocationService.calculateLocationName(LocationService.getLocation(locationId)),
            sceneposition: sceneposition,
            scenetitle: scenetitle,
            time: time,
            timegregorian: timegregorian
          });
        }
      }

      return appearances;
    },

    getObjectAppearencesInChapter: function (objectId, chapter) {
      return this.getItemAppearencesInChapter('sceneobjects', objectId, chapter);
    },
    
    getCharacterAppearencesInChapter: function (characterId, chapter) {
      return this.getItemAppearencesInChapter('scenecharacters', characterId, chapter);
    },

    getObjectService: function () {
      if (!ObjectService) {
        ObjectService = $injector.get('ObjectService');
      }
      return ObjectService;
    }
  };
});


