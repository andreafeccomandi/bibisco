/*
 * Copyright (C) 2014-2022 Andrea Feccomandi
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

angular.module('bibiscoApp').service('DictionaryService', function(LoggerService, ProjectService) {
  'use strict';

  const ipc = require('electron').ipcRenderer;
  const webFrame = require('electron').webFrame;
  let dictionaryLoaded = null;
  let projectDictionaryLoaded = null;

  // dictionary loaded
  ipc.on('DICTIONARY_LOADED', (event, language) => {
    dictionaryLoaded = language;
    LoggerService.info('DictionaryService: dictionary ' + dictionaryLoaded + ' loaded!');
    
    // set spell check provider
    webFrame.setSpellCheckProvider(getChromiumLanguageCode(language), {
      spellCheck (words, callback) {
        setTimeout(() => {
          const misspelled = words.filter(function(word) {
            return ipc.sendSync('isMisspelled', word);
          });
          callback(misspelled);
        }, 0);
      }
    });
  });

  // dictionary loaded
  ipc.on('PROJECT_DICTIONARY_LOADED', (event, projectid) => {
    projectDictionaryLoaded = projectid;
    LoggerService.info('DictionaryService: project ' + projectid + ' dictionary loaded!');
    
  });
  
  // add word to project dictionary listener
  ipc.on('ADD_WORD_TO_PROJECT_DICTIONARY', (event, word) => {
    ProjectService.addWordToProjectDictionary(word);
    ipc.send('setProjectDictionary', ProjectService.getProjectInfo().projectdictionary);
    LoggerService.info('DictionaryService: addWordToProjectDictionary ' + word);
  });


  return {

    isDictionaryLoaded: function(language) {
      return language === dictionaryLoaded;
    },

    isProjectDictionaryLoaded: function() {
      return ProjectService.getProjectInfo().id === projectDictionaryLoaded;
    },

    loadDictionary: function(language) {
      // load dictionary
      ipc.send('loadDictionary', language);
    },

    loadProjectDictionary: function() {
      let projectInfo = ProjectService.getProjectInfo();

      // load project dictionary
      ipc.send('loadProjectDictionary', projectInfo.projectdictionary, projectInfo.id);
    },

    unpackAndLoadDictionary: function(language) {
      ipc.send('unpackAndLoadDictionary', language);
    }
     
  };
});

function getChromiumLanguageCode(language) {
  // serbian latin
  if (language === 'sr') {
    return 'sr-Latn';
  } else {
    return language;
  }
}