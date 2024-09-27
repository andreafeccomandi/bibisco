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

angular.module('bibiscoApp').service('CustomQuestionService', function($rootScope,
  CollectionUtilService, MainCharacterService, ProjectDbConnectionService
) {
  'use strict';

  return {
    getCollection: function() {
      return ProjectDbConnectionService.getProjectDb().getCollection(
        'customquestions');
    },
    getCustomQuestion: function(id) {
      return this.getCollection().get(id);
    },
    getCustomQuestionsCount: function() {
      return this.getCustomQuestions().length;
    },
    getCustomQuestions: function() {
      return CollectionUtilService.getDataSortedByPosition(this.getCollection());
    },
    insert: function(customquestion) {
      let isFirstCustomQuestion = this.getCustomQuestionsCount() === 0;
      CollectionUtilService.insertWithoutCommit(this.getCollection(), customquestion);
      
      let maincharacters = MainCharacterService.getMainCharacters();
      for (let i = 0; i < maincharacters.length; i++) {
        maincharacters[i].custom.questions.push({characters: 0, text: '', words: 0, questionid: customquestion.$loki});
        if (isFirstCustomQuestion) {
          maincharacters[i].custom.status = 'todo';
        }
        MainCharacterService.updateWithoutCommit(maincharacters[i]);
      }

      ProjectDbConnectionService.saveDatabase();
      
      // emit insert event
      $rootScope.$emit('INSERT_ELEMENT', {
        id: customquestion.$loki,
        collection: 'customquestions'
      });

      return customquestion;
    },
    move: function(sourceId, targetId) {
      CollectionUtilService.move(this.getCollection(), sourceId, targetId);
      // emit move event
      $rootScope.$emit('MOVE_ELEMENT', {
        id: sourceId,
        collection: 'customquestions'
      });
    },
    remove: function(id) {
      let isLastCustomQuestion = this.getCustomQuestionsCount() === 1;
      CollectionUtilService.removeWithoutCommit(this.getCollection(), id);
      
      let maincharacters = MainCharacterService.getMainCharacters();
      for (let i = 0; i < maincharacters.length; i++) {
        for (let j = 0; j <  maincharacters[i].custom.questions.length; j++) {
          const question = maincharacters[i].custom.questions[j];
          if (question.questionid === id) {
            maincharacters[i].custom.questions.splice(j,1);
            if (isLastCustomQuestion) {
              maincharacters[i].custom.status = null;
            }
            break;
          }
        }
        MainCharacterService.updateWithoutCommit(maincharacters[i]);
      }
      ProjectDbConnectionService.saveDatabase();

      // emit remove event
      $rootScope.$emit('DELETE_ELEMENT', {
        id: id,
        collection: 'customquestions'
      });
    },
    update: function(customquestion) {
      CollectionUtilService.update(this.getCollection(), customquestion);
      // emit update event
      $rootScope.$emit('UPDATE_ELEMENT', {
        id: customquestion.$loki,
        collection: 'customquestions'
      });
    }
  };
});
