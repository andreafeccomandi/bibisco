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

angular.module('bibiscoApp').service('SearchService', function(
  ArchitectureService, ChapterService, LocationService, MainCharacterService,
  ObjectService, SecondaryCharacterService) {
  'use strict';

  var findandreplacedomtext = require('./custom_node_modules/findandreplacedomtext');
  const extraAsciiCharacters = '\\u00c0-\\u00d6\\u00d8-\\u00f6\\u00f8-\\u00ff\\u0100-\\u017f\\u0180-\\u024f\\u0370-\\u0373\\u0376-\\u0376\\u037b-\\u037d\\u0388-\\u03ff\\u0400-\\u04FF\\u4E00-\\u9FFF\\u3400-\\u4dbf\\uf900-\\ufaff\\u3040-\\u309f\\uac00-\\ud7af\\u0400-\\u04FF\\u00E4\\u00C4\\u00E5\\u00C5\\u00F6\\u00D6';
  const findWholeWordPrefix = '((?<![\\w' + extraAsciiCharacters + '])|(?:^))(';
  const findWholeWordSuffix = ')(?![\\w' + extraAsciiCharacters + '])';

  return {

    searchInText: function (text, text2search, casesensitive, wholeword, results, callback) {
      let dom = new DOMParser().parseFromString(text, 'text/html');
      let matches = this.find(dom, text2search, casesensitive, wholeword);
      if (matches && matches.length > 0) {
        results.occurrences += matches.length;
        callback(matches.length);
      }
    },

    search: function (text2search, casesensitive, wholeword, onlyscenes) {
      let results = {};
      results.occurrences = 0;

      this.searchInChapters(results, text2search, casesensitive, wholeword, onlyscenes);
      if (!onlyscenes) {
        this.searchInArchitecture(results, text2search, casesensitive, wholeword);
        this.searchInMainCharacters(results, text2search, casesensitive, wholeword);
        this.searchInSecondaryCharacters(results, text2search, casesensitive, wholeword);
        this.searchInLocations(results, text2search, casesensitive, wholeword);
        this.searchInObjects(results, text2search, casesensitive, wholeword);
      }
      
      return results;
    },


    searchInChapters: function (results, text2search, casesensitive, wholeword, onlyscenes) {
      
      results.chapters = [];

      let chapters = ChapterService.getChapters();
      for (let i = 0; i < chapters.length; i++) {
        let chapterResult = null;
        let chapter = chapters[i];
        chapterResult = {};
        chapterResult.description = '#' + chapter.position + ' ' + chapter.title;
        chapterResult.scenes = [];
        chapterResult.elements = 1;
        chapterResult.reason = null;
        chapterResult.notes = null;
        
        // scenes
        let scenes = ChapterService.getScenes(chapter.$loki);
        for (let j = 0; j < scenes.length; j++) {
          this.searchInText(scenes[j].revisions[scenes[j].revision].text, text2search, casesensitive,
            wholeword, results, function (occurrences) {
              chapterResult.elements += 1;
              chapterResult.scenes.push({
                title: scenes[j].title,
                position: scenes[j].position,
                path: '/chapters/' + chapters[i].$loki + '/scenes/' + scenes[j].$loki + '/edit',
                occurrences: occurrences
              });
            });
        }

        //reason
        if (!onlyscenes) {
          this.searchInText(chapter.reason.text, text2search, casesensitive,
            wholeword, results, function (occurrences) {
              chapterResult.elements += 1;
              chapterResult.reason = {
                occurrences: occurrences,
                path: '/chapters/' + chapters[i].$loki + '/chapterinfos/reason/edit'
              };
            });
        }

        // notes
        if (!onlyscenes) {
          this.searchInText(chapter.notes.text, text2search, casesensitive,
            wholeword, results, function (occurrences) {
              chapterResult.elements += 1;
              chapterResult.notes = {
                occurrences: occurrences,
                path: '/chapters/' + chapters[i].$loki + '/chapterinfos/notes/edit'
              };
            });
        }

        if (chapterResult.elements > 1) {
          results.chapters.push(chapterResult);
        }
      }
    },

    searchInArchitecture: function (results, text2search, casesensitive, wholeword) {
      
      results.architecture = {};

      results.architecture.premise = null;
      this.searchInText(ArchitectureService.getPremise().text, text2search, casesensitive,
        wholeword, results, function (occurrences) {
          results.architecture.premise = {
            occurrences: occurrences,
            path: '/architectureitems/premise/edit'
          };
        });

      results.architecture.fabula = null;
      this.searchInText(ArchitectureService.getFabula().text, text2search, casesensitive,
        wholeword, results, function (occurrences) {
          results.architecture.fabula = {
            occurrences: occurrences,
            path: '/architectureitems/fabula/edit'
          };
        });

      results.architecture.setting = null;
      this.searchInText(ArchitectureService.getSetting().text, text2search, casesensitive,
        wholeword, results, function (occurrences) {
          results.architecture.setting = {
            occurrences: occurrences,
            path: '/architectureitems/setting/edit'
          };
        });

      results.architecture.globalnotes = null;
      this.searchInText(ArchitectureService.getGlobalNotes().text, text2search, casesensitive,
        wholeword, results, function (occurrences) {
          results.architecture.globalnotes = {
            occurrences: occurrences,
            path: '/architectureitems/globalnotes/edit'
          };
        });
    },

    searchInMainCharacters: function (results, text2search, casesensitive, wholeword) {

      results.maincharacters = [];

      let maincharacters = MainCharacterService.getMainCharacters();
      for (let i = 0; i < maincharacters.length; i++) {
        let maincharacterResult = null;
        maincharacterResult = {};
        maincharacterResult.name = maincharacters[i].name;
        maincharacterResult.elements = 1;

        // personaldata
        maincharacterResult.personaldata = {};
        this.searchInMainCharacterQuestions(results, maincharacters[i], 
          'personaldata', maincharacterResult, text2search, casesensitive, wholeword);

        // physionomy
        maincharacterResult.physionomy = {};
        this.searchInMainCharacterQuestions(results, maincharacters[i],
          'physionomy', maincharacterResult, text2search, casesensitive, wholeword);

        // behaviors
        maincharacterResult.behaviors = {};
        this.searchInMainCharacterQuestions(results, maincharacters[i],
          'behaviors', maincharacterResult, text2search, casesensitive, wholeword);

        // psychology
        maincharacterResult.psychology = {};
        this.searchInMainCharacterQuestions(results, maincharacters[i],
          'psychology', maincharacterResult, text2search, casesensitive, wholeword);
        
        // ideas
        maincharacterResult.ideas = {};
        this.searchInMainCharacterQuestions(results, maincharacters[i],
          'ideas', maincharacterResult, text2search, casesensitive, wholeword);
        
        // sociology
        maincharacterResult.sociology = {};
        this.searchInMainCharacterQuestions(results, maincharacters[i],
          'sociology', maincharacterResult, text2search, casesensitive, wholeword);
        
        // lifebeforestorybeginning
        maincharacterResult.lifebeforestorybeginning = null;
        this.searchInText(maincharacters[i].lifebeforestorybeginning.text, text2search, casesensitive,
          wholeword, results, function (occurrences) {
            maincharacterResult.elements += 1;
            maincharacterResult.lifebeforestorybeginning = {
              occurrences: occurrences,
              path: '/maincharacters/' + maincharacters[i].$loki + '/infowithoutquestion/lifebeforestorybeginning/edit'
            };    
          });

        // conflict
        maincharacterResult.conflict = null;
        this.searchInText(maincharacters[i].conflict.text, text2search, casesensitive,
          wholeword, results, function (occurrences) {
            maincharacterResult.elements += 1;
            maincharacterResult.conflict = {
              occurrences: occurrences,
              path: '/maincharacters/' + maincharacters[i].$loki + '/infowithoutquestion/conflict/edit'
            };    
          });

        // evolutionduringthestory
        maincharacterResult.evolutionduringthestory = null;
        this.searchInText(maincharacters[i].evolutionduringthestory.text, text2search, casesensitive,
          wholeword, results, function (occurrences) {
            maincharacterResult.elements += 1;
            maincharacterResult.evolutionduringthestory = {
              occurrences: occurrences,
              path: '/maincharacters/' + maincharacters[i].$loki + '/infowithoutquestion/evolutionduringthestory/edit'
            };    
          });

        if (maincharacterResult.elements > 1) {
          results.maincharacters.push(maincharacterResult);
        }
      }
    },

    searchInMainCharacterQuestions: function (results, maincharacter, info, 
      maincharacterResult, text2search, casesensitive, wholeword) {
      
      if (maincharacter[info].freetextenabled) {
        maincharacterResult[info].freetextenabled = true;
        this.searchInText(maincharacter[info].freetext, text2search, casesensitive, 
          wholeword, results, function (occurrences) {
            maincharacterResult.elements += 1;
            maincharacterResult[info].freetext = {
              occurrences: occurrences,
              path: '/maincharacters/' + maincharacter.$loki + '/infowithquestion/' +
                info + '/edit' 
            };    
          });
      } else {
        maincharacterResult[info].freetextenabled = false;
        maincharacterResult[info].questions = [];
        for (let j = 0; j < maincharacter[info].questions.length; j++) {
          this.searchInText(maincharacter[info].questions[j].text, text2search, casesensitive, 
            wholeword, results, function (occurrences) {
              maincharacterResult.elements += 1;
              maincharacterResult[info].questions.push({
                position: j,
                occurrences: occurrences,
                path: '/maincharacters/' + maincharacter.$loki +'/infowithquestion/' + 
                  info + '/edit/question/' + j
              });
            });
        }
      }
    },

    searchInSecondaryCharacters: function (results, text2search, casesensitive, wholeword) {

      results.secondarycharacters = [];
      let secondarycharacters = SecondaryCharacterService.getSecondaryCharacters();
      for (let i = 0; i < secondarycharacters.length; i++) {
        this.searchInText(secondarycharacters[i].description, text2search, casesensitive,
          wholeword, results, function (occurrences) {
            results.secondarycharacters.push({
              name: secondarycharacters[i].name,
              occurrences: occurrences,
              path: '/secondarycharacters/' + secondarycharacters[i].$loki + '/edit'
            });
          });
      }
    },

    searchInLocations: function (results, text2search, casesensitive, wholeword) {

      results.locations = [];
      let locations = LocationService.getLocations();
      for (let i = 0; i < locations.length; i++) {
        this.searchInText(locations[i].description, text2search, casesensitive,
          wholeword, results, function (occurrences) {
            results.locations.push({
              description: LocationService.calculateLocationName(locations[i]),
              occurrences: occurrences,
              path: '/locations/' + locations[i].$loki + '/edit'
            });
          });
      }
    },

    searchInObjects: function (results, text2search, casesensitive, wholeword) {

      results.objects = [];

      let objects = ObjectService.getObjects();
      for (let i = 0; i < objects.length; i++) {
        this.searchInText(objects[i].description, text2search, casesensitive,
          wholeword, results, function (occurrences) {
            results.objects.push({
              name: objects[i].name,
              occurrences: occurrences,
              path: '/objects/' + objects[i].$loki + '/edit'
            });
          });
      }
    },

    find: function (dom, text2search, casesensitive, wholeword) {

      let matches = findandreplacedomtext(dom, {
        preset: 'prose',
        find: new RegExp(this.calculateRegexp(text2search, wholeword), 
          this.calculateMode(casesensitive))
      }).search();

      return matches;
    },

    replace: function (dom, text2search, text2replace, casesensitive, wholeword, 
      occurrence) {

      let matches = findandreplacedomtext(dom, {
        preset: 'prose',
        find: new RegExp(this.calculateRegexp(text2search, wholeword), 
          this.calculateMode(casesensitive)),
        replace: text2replace,
        filterOccurrence: occurrence
      }).search();

      return matches;
    },

    calculateMode: function (casesensitive) {
      let mode = 'g';
      if (!casesensitive) {
        mode = mode + 'i';
      }
      return mode;
    },

    calculateRegexp: function (text2search, wholeword) {
      let regexp;
      let text2searchEscaped = text2search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
      if (wholeword) {
        regexp = findWholeWordPrefix + text2searchEscaped + findWholeWordSuffix;
      } else {
        regexp = text2searchEscaped;
      }

      return regexp;
    },

    getIndicesOf: function(searchStr, str, caseSensitive) {
      var searchStrLen = searchStr.length;
      if (searchStrLen === 0) {
        return [];
      }
      var startIndex = 0, index, indices = [];
      if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
      }
      while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
      }
      return indices;
    }
  };
});
