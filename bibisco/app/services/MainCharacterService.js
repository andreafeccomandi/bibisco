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
  var maincharacters_infos_no_question_collection =
    ProjectDbConnectionService.getProjectDb().getCollection(
      'maincharacters_infos_no_question');

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

      // insert personal data
      let personaldata = this.createMainCharacterInfoWithQuestionsWithoutCommit(
        maincharacter.$loki, 'personaldata');

      // insert physionomy
      let physionomy = this.createMainCharacterInfoWithQuestionsWithoutCommit(
        maincharacter.$loki, 'physionomy');

      // insert behaviors
      let behaviors = this.createMainCharacterInfoWithQuestionsWithoutCommit(
        maincharacter.$loki, 'behaviors');

      // insert sociology
      let sociology = this.createMainCharacterInfoWithQuestionsWithoutCommit(
        maincharacter.$loki, 'sociology');

      // insert psychology
      let psychology = this.createMainCharacterInfoWithQuestionsWithoutCommit(
        maincharacter.$loki, 'psychology');

      // insert ideas
      let ideas = this.createMainCharacterInfoWithQuestionsWithoutCommit(
        maincharacter.$loki, 'ideas');

      // insert life before story beginning
      let lifebeforestorybeginning = this.insertMainCharacterInfoNoQuestionsWithoutCommit(
        maincharacter.$loki, 'lifebeforestorybeginning');

      // insert conflict
      let conflict = this.insertMainCharacterInfoNoQuestionsWithoutCommit(
        maincharacter.$loki, 'conflict');

      // insert evolutionduringthestory
      let evolutionduringthestory = this.insertMainCharacterInfoNoQuestionsWithoutCommit(
        maincharacter.$loki, 'evolutionduringthestory');

      // insert main character
      maincharacter = CollectionUtilService.insertWithoutCommit(
        collection, maincharacter);

      // update main character
      maincharacter.personaldata = personaldata.$loki;
      maincharacter.physionomy = physionomy.$loki;
      maincharacter.behaviors = behaviors.$loki;
      maincharacter.sociology = sociology.$loki;
      maincharacter.psychology = psychology.$loki;
      maincharacter.ideas = ideas.$loki;
      maincharacter.lifebeforestorybeginning = lifebeforestorybeginning.$loki;
      maincharacter.conflict = conflict.$loki;
      maincharacter.evolutionduringthestory = evolutionduringthestory.$loki;
      CollectionUtilService.updateWithoutCommit(collection, maincharacter);

      // save database
      ProjectDbConnectionService.saveDatabase();
    },

    createMainCharacterInfoWithQuestionsWithoutCommit: function(type) {

      let questionNumber;
      switch (type) {
      case 'personaldata':
        questionNumber = 11;
        break;
      case 'physionomy':
        questionNumber = 23;
        break;
      case 'behaviors':
        questionNumber = 11;
        break;
      case 'sociology':
        questionNumber = 9;
        break;
      case 'psychology':
        questionNumber = 61;
        break;
      case 'ideas':
        questionNumber = 17;
        break;
      }

      let questions = {};
      for (let i = 0; i < questionNumber; i++) {
        questions[i.toString()] = '';
      }

      return {
        questions: questions,
        freetext: ''
      };
    },

    insertMainCharacterInfoNoQuestionsWithoutCommit: function(
      maincharacterid, type) {
      return CollectionUtilService.insertWithoutCommit(
        maincharacters_infos_no_question_collection, {
          id: maincharacterid,
          type: type,
          text: ''
        }, {
          id: {
            '$eq': maincharacterid
          }
        });
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
