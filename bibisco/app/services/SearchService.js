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
          let dom = new DOMParser().parseFromString(scenes[j].revisions[scenes[j].revision].text, 'text/html');
          let matches = this.find(dom, text2search, casesensitive, wholeword);
          if (matches && matches.length>0) {
            results.occurrences += matches.length;
            chapterResult.elements += 1;
            chapterResult.scenes.push({
              title: scenes[j].title,
              position: scenes[j].position,
              occurrences: matches.length
            });
          }
        }

        //reason
        if (!onlyscenes) {
          let matches = this.find(new DOMParser().parseFromString(chapter.reason.text, 'text/html'), 
            text2search, casesensitive, wholeword);
          if (matches && matches.length>0) {
            results.occurrences += matches.length;
            chapterResult.elements += 1;
            chapterResult.reason = {
              occurrences: matches.length
            };
          }
        }

        // notes
        if (!onlyscenes) {
          let matches = this.find(new DOMParser().parseFromString(chapter.notes.text, 'text/html'), 
            text2search, casesensitive, wholeword);
          if (matches && matches.length>0) {
            results.occurrences += matches.length;
            chapterResult.elements += 1;
            chapterResult.notes = {
              occurrences: matches.length
            };
          }
        }

        if (chapterResult.elements > 1) {
          results.chapters.push(chapterResult);
        }
      }
    },

    searchInArchitecture: function (results, text2search, casesensitive, wholeword) {
      
      results.architecture = {};
      results.architecture.premise = null;
      let premise = ArchitectureService.getPremise();
      let matches = this.find(new DOMParser().parseFromString(premise.text, 'text/html'), 
        text2search, casesensitive, wholeword);
      if (matches && matches.length>0) {
        results.occurrences += matches.length;
        results.architecture.premise = matches.length;
      }

      results.architecture.fabula = null;
      let fabula = ArchitectureService.getFabula();
      matches = this.find(new DOMParser().parseFromString(fabula.text, 'text/html'), 
        text2search, casesensitive, wholeword);
      if (matches && matches.length>0) {
        results.occurrences += matches.length;
        results.architecture.fabula = matches.length;
      }

      results.architecture.setting = null;
      let setting = ArchitectureService.getSetting();
      matches = this.find(new DOMParser().parseFromString(setting.text, 'text/html'), 
        text2search, casesensitive, wholeword);
      if (matches && matches.length>0) {
        results.occurrences += matches.length;
        results.architecture.setting = matches.length;
      }

      results.architecture.globalnotes = null;
      let globalnotes = ArchitectureService.getGlobalNotes();
      matches = this.find(new DOMParser().parseFromString(globalnotes.text, 'text/html'), 
        text2search, casesensitive, wholeword);
      if (matches && matches.length>0) {
        results.occurrences += matches.length;
        results.architecture.globalnotes = matches.length;
      }
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
        this.searchInMainCharacterQuestions(results, maincharacters[i].personaldata,
          maincharacterResult, maincharacterResult.personaldata,
          text2search, casesensitive, wholeword);

        // physionomy
        maincharacterResult.physionomy = {};
        this.searchInMainCharacterQuestions(results, maincharacters[i].physionomy,
          maincharacterResult, maincharacterResult.physionomy,
          text2search, casesensitive, wholeword);

        // behaviors
        maincharacterResult.behaviors = {};
        this.searchInMainCharacterQuestions(results, maincharacters[i].behaviors,
          maincharacterResult, maincharacterResult.behaviors,
          text2search, casesensitive, wholeword);

        // psychology
        maincharacterResult.psychology = {};
        this.searchInMainCharacterQuestions(results, maincharacters[i].psychology,
          maincharacterResult, maincharacterResult.psychology,
          text2search, casesensitive, wholeword);
        
        // ideas
        maincharacterResult.ideas = {};
        this.searchInMainCharacterQuestions(results, maincharacters[i].ideas,
          maincharacterResult, maincharacterResult.ideas,
          text2search, casesensitive, wholeword);
        
        // sociology
        maincharacterResult.sociology = {};
        this.searchInMainCharacterQuestions(results, maincharacters[i].sociology,
          maincharacterResult, maincharacterResult.sociology,
          text2search, casesensitive, wholeword);
        
        // lifebeforestorybeginning
        maincharacterResult.lifebeforestorybeginning = null;
        this.searchInText(maincharacters[i].lifebeforestorybeginning.text, text2search, casesensitive,
          wholeword, results, function (occurrences) {
            maincharacterResult.elements += 1;
            maincharacterResult.lifebeforestorybeginning = occurrences;
          });

        // conflict
        maincharacterResult.conflict = null;
        this.searchInText(maincharacters[i].conflict.text, text2search, casesensitive,
          wholeword, results, function (occurrences) {
            maincharacterResult.elements += 1;
            maincharacterResult.conflict = occurrences;
          });

        // evolutionduringthestory
        maincharacterResult.evolutionduringthestory = null;
        this.searchInText(maincharacters[i].evolutionduringthestory.text, text2search, casesensitive,
          wholeword, results, function (occurrences) {
            maincharacterResult.elements += 1;
            maincharacterResult.evolutionduringthestory = occurrences;
          });

        if (maincharacterResult.elements > 1) {
          results.maincharacters.push(maincharacterResult);
        }
      }
    },

    searchInMainCharacterQuestions: function (results, questionset, maincharacterResult, 
      maincharacterResultQuestionSet, text2search, casesensitive, wholeword) {
      if (questionset.freetextenabled) {
        maincharacterResultQuestionSet.freetextenabled = true;
        this.searchInText(questionset.freetext, text2search, casesensitive, 
          wholeword, results, function (occurrences) {
            maincharacterResult.elements += 1;
            maincharacterResultQuestionSet.freetext = occurrences;
          });
      } else {
        maincharacterResultQuestionSet.freetextenabled = false;
        maincharacterResultQuestionSet.questions = [];
        for (let j = 0; j < questionset.questions.length; j++) {
          this.searchInText(questionset.questions[j].text, text2search, casesensitive, 
            wholeword, results, function (occurrences) {
              maincharacterResult.elements += 1;
              maincharacterResultQuestionSet.questions.push({
                position: j,
                occurrences: occurrences
              });
            });
        }
      }
    },

    searchInSecondaryCharacters: function (results, text2search, casesensitive, wholeword) {

      results.secondarycharacters = [];

      let secondarycharacters = SecondaryCharacterService.getSecondaryCharacters();
      for (let i = 0; i < secondarycharacters.length; i++) {
        let dom = new DOMParser().parseFromString(secondarycharacters[i].description, 'text/html');
        let matches = this.find(dom, text2search, casesensitive, wholeword);
        if (matches && matches.length > 0) {
          results.occurrences += matches.length;
          results.secondarycharacters.push({
            name: secondarycharacters[i].name,
            occurrences: matches.length
          });
        }
      }
    },

    searchInLocations: function (results, text2search, casesensitive, wholeword) {

      results.locations = [];

      let locations = LocationService.getLocations();
      for (let i = 0; i < locations.length; i++) {
        let dom = new DOMParser().parseFromString(locations[i].description, 'text/html');
        let matches = this.find(dom, text2search, casesensitive, wholeword);
        if (matches && matches.length > 0) {
          results.occurrences += matches.length;
          results.locations.push({
            description: LocationService.calculateLocationName(locations[i]),
            occurrences: matches.length
          });
        }
      }
    },

    searchInObjects: function (results, text2search, casesensitive, wholeword) {

      results.objects = [];

      let objects = ObjectService.getObjects();
      for (let i = 0; i < objects.length; i++) {
        let dom = new DOMParser().parseFromString(objects[i].description, 'text/html');
        let matches = this.find(dom, text2search, casesensitive, wholeword);
        if (matches && matches.length > 0) {
          results.occurrences += matches.length;
          results.objects.push({
            name: objects[i].name,
            occurrences: matches.length
          });
        }
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
