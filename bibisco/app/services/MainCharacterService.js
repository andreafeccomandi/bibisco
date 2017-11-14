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
      maincharacter.personaldata = this.createMainCharacterInfoWithQuestionsWithoutCommit(
        'personaldata');

      // physionomy
      maincharacter.physionomy = this.createMainCharacterInfoWithQuestionsWithoutCommit(
        'physionomy');

      // behaviors
      maincharacter.behaviors = this.createMainCharacterInfoWithQuestionsWithoutCommit(
        'behaviors');

      // sociology
      maincharacter.sociology = this.createMainCharacterInfoWithQuestionsWithoutCommit(
        'sociology');

      // psychology
      maincharacter.psychology = this.createMainCharacterInfoWithQuestionsWithoutCommit(
        'psychology');

      // ideas
      maincharacter.ideas = this.createMainCharacterInfoWithQuestionsWithoutCommit(
        'ideas');

      // life before story beginning
      maincharacter.lifebeforestorybeginning = '';

      // conflict
      maincharacter.conflict = '';

      // evolutionduringthestory
      maincharacter.evolutionduringthestory = '';

      // insert character
      maincharacter = CollectionUtilService.insert(collection, maincharacter);
    },

    createMainCharacterInfoWithQuestionsWithoutCommit: function(type) {

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
        questions[i.toString()] = '';
      }

      return {
        freetext: '',
        freetext_enabled: false,
        questions: questions
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
      CollectionUtilService.update(collection, maincharacter);
    }
  };
});
