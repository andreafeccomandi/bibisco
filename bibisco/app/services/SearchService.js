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

angular.module('bibiscoApp').service('SearchService', function($rootScope, $timeout, $translate,
  ArchitectureService, ChapterService, CustomQuestionService, GroupService, LocationService, LoggerService,
  MainCharacterService, NoteService, ObjectService, PopupBoxesService, ProjectDbConnectionService, 
  ProjectService, SecondaryCharacterService, StrandService, WordCharacterCountService) {
  'use strict';

  var findandreplacedomtext = require('./custom_node_modules/findAndReplaceDOMText');
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
        this.searchInStrands(results, text2search, casesensitive, wholeword);
        this.searchInMainCharacters(results, text2search, casesensitive, wholeword);
        this.searchInSecondaryCharacters(results, text2search, casesensitive, wholeword);
        this.searchInLocations(results, text2search, casesensitive, wholeword);
        this.searchInObjects(results, text2search, casesensitive, wholeword);
        this.searchInGroups(results, text2search, casesensitive, wholeword);
        this.searchInNotes(results, text2search, casesensitive, wholeword);
      }
      
      return results;
    },


    searchInChapters: function (results, text2search, casesensitive, wholeword, onlyscenes) {
      
      results.chapters = [];

      let chapters = ChapterService.getChaptersWithPrologueAndEpilogue();
      for (let i = 0; i < chapters.length; i++) {
        let chapterResult = null;
        let chapter = chapters[i];
        chapterResult = {};
        chapterResult.id = chapter.$loki;
        chapterResult.description = ChapterService.getChapterPositionDescription(chapter.position) + ' ' + chapter.title;
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
                id: scenes[j].$loki,
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

    searchInStrands: function (results, text2search, casesensitive, wholeword) {

      results.strands = [];

      let strands = StrandService.getStrands();
      for (let i = 0; i < strands.length; i++) {
        this.searchInText(strands[i].description, text2search, casesensitive,
          wholeword, results, function (occurrences) {
            results.strands.push({
              id: strands[i].$loki,
              name: strands[i].name,
              occurrences: occurrences,
              path: '/strands/' + strands[i].$loki + '/edit'
            });
          });
      }
    },

    searchInMainCharacters: function (results, text2search, casesensitive, wholeword) {

      results.maincharacters = [];

      let maincharacters = MainCharacterService.getMainCharacters();
      for (let i = 0; i < maincharacters.length; i++) {
        let maincharacterResult = null;
        maincharacterResult = {};
        maincharacterResult.id = maincharacters[i].$loki;
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

        // custom questions
        maincharacterResult.custom = {};
        this.searchInMainCharacterQuestions(results, maincharacters[i],
          'custom', maincharacterResult, text2search, casesensitive, wholeword);

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

        // notes
        maincharacterResult.notes = null;
        this.searchInText(maincharacters[i].notes.text, text2search, casesensitive,
          wholeword, results, function (occurrences) {
            maincharacterResult.elements += 1;
            maincharacterResult.notes = {
              occurrences: occurrences,
              path: '/maincharacters/' + maincharacters[i].$loki + '/infowithoutquestion/notes/edit'
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
              let question = {
                position: j,
                occurrences: occurrences,
                path: '/maincharacters/' + maincharacter.$loki +'/infowithquestion/' + 
                  info + '/edit/question/' + j
              };
              if (info === 'custom') {
                question.text = CustomQuestionService.getCustomQuestions()[j].question;
              }
              maincharacterResult[info].questions.push(question);
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
              id: secondarycharacters[i].$loki,
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
              id: locations[i].$loki,
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
              id: objects[i].$loki,
              name: objects[i].name,
              occurrences: occurrences,
              path: '/objects/' + objects[i].$loki + '/edit'
            });
          });
      }
    },

    searchInGroups: function (results, text2search, casesensitive, wholeword) {

      results.groups = [];

      let groups = GroupService.getGroups();
      for (let i = 0; i < groups.length; i++) {
        this.searchInText(groups[i].description, text2search, casesensitive,
          wholeword, results, function (occurrences) {
            results.groups.push({
              id: groups[i].$loki,
              name: groups[i].name,
              occurrences: occurrences,
              path: '/groups/' + groups[i].$loki + '/edit'
            });
          });
      }
    },

    searchInNotes: function (results, text2search, casesensitive, wholeword) {

      results.notes = [];

      let notes = NoteService.getNotes();
      for (let i = 0; i < notes.length; i++) {
        this.searchInText(notes[i].description, text2search, casesensitive,
          wholeword, results, function (occurrences) {
            results.notes.push({
              id: notes[i].$loki,
              name: notes[i].name,
              occurrences: occurrences,
              path: '/notes/' + notes[i].$loki + '/edit'
            });
          });
      }
    },

    globalReplace: function (text2search, casesensitive, wholeword, onlyscenes, text2replace) {
      
      let results = this.search(text2search, casesensitive, wholeword, onlyscenes);
      let confirmMessage = $translate.instant('replace_all_confirm', 
        { text2replace: text2replace,
          text2search: text2search
        });
      let replaceEndMessage = $translate.instant('global_replace_end', 
        { text2replace: text2replace,
          text2search: text2search,
          occurrences: results.occurrences
        });

      let self = this;
      let executeGlobalReplaceFunction = function() {
        $rootScope.$emit('START_GLOBAL_REPLACE');
        $timeout(function() {            
          // execute replace
          self.executeGlobalReplace(results, text2search, casesensitive, 
            wholeword, onlyscenes, text2replace);
          $rootScope.$emit('END_GLOBAL_REPLACE');
          PopupBoxesService.alert(replaceEndMessage);
        });   
      };

      let backupAndExecuteGlobalReplaceFunction = function() {
        ProjectService.executeBackup({
          backupFileSuffix: 'BEFORE_GLOBAL_REPLACE',
          showWaitingModal: true,
          callback: executeGlobalReplaceFunction
        });
      };

      PopupBoxesService.confirm(function() {
        PopupBoxesService.confirm(backupAndExecuteGlobalReplaceFunction, 
          'backup_before_replacement_confirm', executeGlobalReplaceFunction);
      }, confirmMessage);
    },

    executeGlobalReplace: function (results, text2search, casesensitive, wholeword, onlyscenes, text2replace) {

      this.replaceInChapters(results.chapters, text2search, casesensitive, wholeword, text2replace);
      if (!onlyscenes) {
        this.replaceInArchitecture(results.architecture, text2search, casesensitive, wholeword, text2replace);
        this.replaceInStrands(results.strands, text2search, casesensitive, wholeword, text2replace);
        this.replaceInMainCharacters(results.maincharacters, text2search, casesensitive, wholeword, text2replace);
        this.replaceInSecondaryCharacters(results.secondarycharacters, text2search, casesensitive, wholeword, text2replace);
        this.replaceInLocations(results.locations, text2search, casesensitive, wholeword, text2replace);
        this.replaceInObjects(results.objects, text2search, casesensitive, wholeword, text2replace);
        this.replaceInGroups(results.groups, text2search, casesensitive, wholeword, text2replace);
        this.replaceInNotes(results.notes, text2search, casesensitive, wholeword, text2replace);
      }

      // save database
      ProjectDbConnectionService.saveDatabase();

      // log the operation
      LoggerService.info('Replaced \'' + text2search + '\' with \'' + text2replace + '\' for '
        + results.occurrences + ' occurrences');
    },

    replaceInChapters: function (chaptersResult, text2search, casesensitive, wholeword, text2replace) {
      
      for (let i = 0; i < chaptersResult.length; i++) {
        let chapterResult = chaptersResult[i];
        if (chapterResult.reason || chapterResult.notes) {
          let chapter = ChapterService.getChapter(chapterResult.id);
          if (chapterResult.reason) {
            let replacementResult = this.replaceElementText(chapter.reason.text, text2search, text2replace, casesensitive, wholeword);
            chapter.reason.text = replacementResult.text;
            chapter.reason.words = replacementResult.words;
            chapter.reason.characters = replacementResult.characters;
          }
          if (chapterResult.notes) {
            let replacementResult = this.replaceElementText(chapter.notes.text, text2search, text2replace, casesensitive, wholeword);
            chapter.notes.text = replacementResult.text;
            chapter.notes.words = replacementResult.words;
            chapter.notes.characters = replacementResult.characters;
          }
          ChapterService.updateWithoutCommit(chapter);
        }

        if (chapterResult.scenes && chapterResult.scenes.length > 0) {
          for (let i = 0; i < chapterResult.scenes.length; i++) {
            let scene = ChapterService.getScene(chapterResult.scenes[i].id);
            let replacementResult = this.replaceElementText(scene.revisions[scene.revision].text, text2search, text2replace, casesensitive, wholeword);
            scene.revisions[scene.revision].text = replacementResult.text;
            scene.revisions[scene.revision].words = replacementResult.words;
            scene.revisions[scene.revision].characters = replacementResult.characters;
            ChapterService.updateSceneWithoutCommit(scene);
          }
        }
      }
    },


    replaceInArchitecture: function (architectureResults, text2search, casesensitive, wholeword, text2replace) {
      
      if (architectureResults.premise) {
        let premise = ArchitectureService.getPremise();
        let replacementResult = this.replaceElementText(premise.text, text2search, text2replace, casesensitive, wholeword);
        premise.text = replacementResult.text;
        premise.words = replacementResult.words;
        premise.characters = replacementResult.characters;
        ArchitectureService.updateWithoutCommit(premise);
      }
      if (architectureResults.fabula) {
        let fabula = ArchitectureService.getFabula();
        let replacementResult = this.replaceElementText(fabula.text, text2search, text2replace, casesensitive, wholeword);
        fabula.text = replacementResult.text;
        fabula.words = replacementResult.words;
        fabula.characters = replacementResult.characters;
        ArchitectureService.updateWithoutCommit(fabula);
      }
      if (architectureResults.setting) {
        let setting = ArchitectureService.getSetting();
        let replacementResult = this.replaceElementText(setting.text, text2search, text2replace, casesensitive, wholeword);
        setting.text = replacementResult.text;
        setting.words = replacementResult.words;
        setting.characters = replacementResult.characters;
        ArchitectureService.updateWithoutCommit(setting);
      }
      if (architectureResults.globalnotes) {
        let globalnotes = ArchitectureService.getGlobalNotes();
        let replacementResult = this.replaceElementText(globalnotes.text, text2search, text2replace, casesensitive, wholeword);
        globalnotes.text = replacementResult.text;
        globalnotes.words = replacementResult.words;
        globalnotes.characters = replacementResult.characters;
        ArchitectureService.updateWithoutCommit(globalnotes);
      }
    },

    replaceInStrands: function (strandsResults, text2search, casesensitive, wholeword, text2replace) {
      for (let i = 0; i < strandsResults.length; i++) {
        let strand = StrandService.getStrand(strandsResults[i].id);        
        let replacementResult = this.replaceElementText(strand.description, text2search, text2replace, casesensitive, wholeword);
        strand.description = replacementResult.text;
        strand.words = replacementResult.words;
        strand.characters = replacementResult.characters;
        StrandService.updateWithoutCommit(strand);
      }
    },

    replaceInMainCharacters: function (mainCharactersResults, text2search, casesensitive, wholeword, text2replace) {
      
      for (let i = 0; i < mainCharactersResults.length; i++) {
        let mainCharacter = MainCharacterService.getMainCharacter(mainCharactersResults[i].id);
        
        // personaldata
        if (mainCharactersResults[i].personaldata) {
          this.replaceInMainCharacterQuestions(mainCharacter, 'personaldata', 
            mainCharactersResults[i], text2search, casesensitive, wholeword, text2replace);
        }

        // physionomy
        if (mainCharactersResults[i].physionomy) {
          this.replaceInMainCharacterQuestions(mainCharacter, 'physionomy', 
            mainCharactersResults[i], text2search, casesensitive, wholeword, text2replace);
        }

        // behaviors
        if (mainCharactersResults[i].behaviors) {
          this.replaceInMainCharacterQuestions(mainCharacter, 'behaviors', 
            mainCharactersResults[i], text2search, casesensitive, wholeword, text2replace);
        }

        // psychology
        if (mainCharactersResults[i].psychology) {
          this.replaceInMainCharacterQuestions(mainCharacter, 'psychology', 
            mainCharactersResults[i], text2search, casesensitive, wholeword, text2replace);
        }
        
        // ideas
        if (mainCharactersResults[i].ideas) {
          this.replaceInMainCharacterQuestions(mainCharacter, 'ideas', 
            mainCharactersResults[i], text2search, casesensitive, wholeword, text2replace);
        }

        // sociology
        if (mainCharactersResults[i].sociology) {
          this.replaceInMainCharacterQuestions(mainCharacter, 'sociology', 
            mainCharactersResults[i], text2search, casesensitive, wholeword, text2replace);
        }
                
        // sociology
        if (mainCharactersResults[i].custom) {
          this.replaceInMainCharacterQuestions(mainCharacter, 'custom', 
            mainCharactersResults[i], text2search, casesensitive, wholeword, text2replace);
        }
                
        // lifebeforestorybeginning
        if (mainCharactersResults[i].lifebeforestorybeginning) {
          let replacementResult = this.replaceElementText(mainCharacter.lifebeforestorybeginning.text, text2search, text2replace, casesensitive, wholeword);
          mainCharacter.lifebeforestorybeginning.text = replacementResult.text;
          mainCharacter.lifebeforestorybeginning.words = replacementResult.words;
          mainCharacter.lifebeforestorybeginning.characters = replacementResult.characters;
        }
       
        // conflict
        if (mainCharactersResults[i].conflict) {
          let replacementResult = this.replaceElementText(mainCharacter.conflict.text, text2search, text2replace, casesensitive, wholeword);
          mainCharacter.conflict.text = replacementResult.text;
          mainCharacter.conflict.words = replacementResult.words;
          mainCharacter.conflict.characters = replacementResult.characters;
        }

        // evolutionduringthestory
        if (mainCharactersResults[i].evolutionduringthestory) {
          let replacementResult = this.replaceElementText(mainCharacter.evolutionduringthestory.text, text2search, text2replace, casesensitive, wholeword);
          mainCharacter.evolutionduringthestory.text = replacementResult.text;
          mainCharacter.evolutionduringthestory.words = replacementResult.words;
          mainCharacter.evolutionduringthestory.characters = replacementResult.characters;
        }

        MainCharacterService.updateWithoutCommit(mainCharacter);
      }
    },

    replaceInMainCharacterQuestions: function (maincharacter, info, 
      maincharacterResult, text2search, casesensitive, wholeword, text2replace) {
      
      if (maincharacter[info].freetextenabled && maincharacterResult[info].freetext) {
        let replacementResult = this.replaceElementText(maincharacter[info].freetext, text2search, text2replace, casesensitive, wholeword);
        maincharacter[info].freetext = replacementResult.text;
        maincharacter[info].freetextwords = replacementResult.words;
        maincharacter[info].freetextcharacters = replacementResult.characters;
      } else {
        for (let j = 0; j < maincharacterResult[info].questions.length; j++) {
          let position = maincharacterResult[info].questions[j].position;          
          let replacementResult = this.replaceElementText(maincharacter[info].questions[position].text, text2search, text2replace, casesensitive, wholeword);
          maincharacter[info].questions[position].text = replacementResult.text;
          maincharacter[info].questions[position].words = replacementResult.words;
          maincharacter[info].questions[position].characters = replacementResult.characters;
        }
      }
    },

    replaceInSecondaryCharacters: function (secondaryCharactersResults, text2search, casesensitive, wholeword, text2replace) {
      for (let i = 0; i < secondaryCharactersResults.length; i++) {
        let secondaryCharacter = SecondaryCharacterService.getSecondaryCharacter(secondaryCharactersResults[i].id);        
        let replacementResult = this.replaceElementText(secondaryCharacter.description, text2search, text2replace, casesensitive, wholeword);
        secondaryCharacter.description = replacementResult.text;
        secondaryCharacter.words = replacementResult.words;
        secondaryCharacter.characters = replacementResult.characters;
        SecondaryCharacterService.updateWithoutCommit(secondaryCharacter);
      }
    },

    replaceInLocations: function (locationsResults, text2search, casesensitive, wholeword, text2replace) {
      for (let i = 0; i < locationsResults.length; i++) {
        let location = LocationService.getLocation(locationsResults[i].id);
        let replacementResult = this.replaceElementText(location.description, text2search, text2replace, casesensitive, wholeword);
        location.description = replacementResult.text;
        location.words = replacementResult.words;
        location.characters = replacementResult.characters;
        LocationService.updateWithoutCommit(location);
      }
    },

    replaceInObjects: function (objectsResults, text2search, casesensitive, wholeword, text2replace) {
      for (let i = 0; i < objectsResults.length; i++) {
        let object = ObjectService.getObject(objectsResults[i].id);
        let replacementResult = this.replaceElementText(object.description, text2search, text2replace, casesensitive, wholeword);
        object.description = replacementResult.text;
        object.words = replacementResult.words;
        object.characters = replacementResult.characters;
        ObjectService.updateWithoutCommit(object);
      }
    },

    replaceInGroups: function (groupsResults, text2search, casesensitive, wholeword, text2replace) {
      for (let i = 0; i < groupsResults.length; i++) {
        let group = GroupService.getGroup(groupsResults[i].id);
        let replacementResult = this.replaceElementText(group.description, text2search, text2replace, casesensitive, wholeword);
        group.description = replacementResult.text;
        group.words = replacementResult.words;
        group.characters = replacementResult.characters;
        GroupService.updateWithoutCommit(group);
      }
    },

    replaceInNotes: function (notesResults, text2search, casesensitive, wholeword, text2replace) {
      for (let i = 0; i < notesResults.length; i++) {
        let note = NoteService.getNote(notesResults[i].id);
        let replacementResult = this.replaceElementText(note.description, text2search, text2replace, casesensitive, wholeword);
        note.description = replacementResult.text;
        note.words = replacementResult.words;
        note.characters = replacementResult.characters;
        NoteService.updateWithoutCommit(note);
      }
    },

    replaceElementText: function(elementText, text2search, text2replace, casesensitive, wholeword) {
      const containerDiv = document.createElement('div');
      containerDiv.innerHTML = elementText;
      this.replace(containerDiv, text2search, text2replace, casesensitive, wholeword);
      elementText = containerDiv.innerHTML;

      let wordCountMode = ProjectService.getProjectInfo().wordCountMode;
      let wordCountResult = WordCharacterCountService.count(elementText, wordCountMode);

      return {text: elementText, words: wordCountResult.words, characters: wordCountResult.characters};
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
