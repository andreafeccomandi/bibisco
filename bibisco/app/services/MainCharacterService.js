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

angular.module('bibiscoApp').service('MainCharacterService', function(
  CollectionUtilService, LoggerService, ProjectDbConnectionService
) {
  'use strict';

  var collection = ProjectDbConnectionService.getProjectDb().getCollection(
    'maincharacters');
  var dynamicView = CollectionUtilService.getDynamicViewSortedByPosition(
    collection, 'all_maincharacters');

  return {
    calculateStatus: function (maincharacter) {
      let result;

      if (maincharacter.personaldata.status === 'todo' &&
        maincharacter.physionomy.status === 'todo' &&
        maincharacter.behaviors.status === 'todo' &&
        maincharacter.sociology.status === 'todo' &&
        maincharacter.psychology.status === 'todo' &&
        maincharacter.ideas.status === 'todo' &&
        maincharacter.lifebeforestorybeginning.status === 'todo' &&
        maincharacter.conflict.status === 'todo' &&
        maincharacter.evolutionduringthestory.status === 'todo'
      ) {
        result = 'todo';
      } else if (maincharacter.personaldata.status === 'done' &&
        maincharacter.physionomy.status === 'done' &&
        maincharacter.behaviors.status === 'done' &&
        maincharacter.sociology.status === 'done' &&
        maincharacter.psychology.status === 'done' &&
        maincharacter.ideas.status === 'done' &&
        maincharacter.lifebeforestorybeginning.status === 'done' &&
        maincharacter.conflict.status === 'done' &&
        maincharacter.evolutionduringthestory.status === 'done'
      ) {
        result = 'done';
      } else {
        result = 'tocomplete';
      }

      return result;
    },
    getMainCharacter: function(id) {
      return collection.get(id);
    },
    getMainCharactersCount: function() {
      return collection.count();
    },
    getMainCharacters: function() {
      return dynamicView.data();
    },
    insert: function(maincharacter) {

      // personal data
      maincharacter.personaldata = this.createInfoWithQuestions('personaldata');

      // physionomy
      maincharacter.physionomy = this.createInfoWithQuestions('physionomy');

      // behaviors
      maincharacter.behaviors = this.createInfoWithQuestions('behaviors');

      // sociology
      maincharacter.sociology = this.createInfoWithQuestions('sociology');

      // psychology
      maincharacter.psychology = this.createInfoWithQuestions('psychology');

      // ideas
      maincharacter.ideas = this.createInfoWithQuestions('ideas');

      // life before story beginning
      maincharacter.lifebeforestorybeginning = this.createInfoWithoutQuestions();

      // conflict
      maincharacter.conflict = this.createInfoWithoutQuestions();

      // evolutionduringthestory
      maincharacter.evolutionduringthestory = this.createInfoWithoutQuestions();

      // insert character
      maincharacter = CollectionUtilService.insert(collection, maincharacter);
    },

    createInfoWithQuestions: function(type) {

      let questionNumber;
      switch (type) {
      case 'personaldata':
        questionNumber = 12;
        break;
      case 'physionomy':
        questionNumber = 24;
        break;
      case 'behaviors':
        questionNumber = 12;
        break;
      case 'sociology':
        questionNumber = 10;
        break;
      case 'psychology':
        questionNumber = 62;
        break;
      case 'ideas':
        questionNumber = 18;
        break;
      }

      let questions = [questionNumber];
      for (let i = 0; i < questionNumber; i++) {
        questions[i.toString()] = {
          characters: 0, 
          text: '', 
          words: 0
        };
      }

      return {
        freetextcharacters: 0,
        freetext: '',
        freetextenabled: false,
        questions: questions,
        status: 'todo',
        freetextwords: 0
      };
    },

    createInfoWithoutQuestions: function () {
      return {
        status: 'todo',
        text: ''
      };
    },
    
    move: function(sourceId, targetId) {
      return CollectionUtilService.move(collection, sourceId, targetId,
        dynamicView);
    },
    remove: function(id) {
      CollectionUtilService.remove(collection, id);
    },
    update: function(maincharacter) {
      maincharacter.status = this.calculateStatus(maincharacter);
      CollectionUtilService.update(collection, maincharacter);
    }
  };
});
