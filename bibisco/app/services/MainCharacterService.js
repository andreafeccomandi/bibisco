/*
 * Copyright (C) 2014-2019 Andrea Feccomandi
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

angular.module('bibiscoApp').service('MainCharacterService', function(
  CollectionUtilService, ImageService, LoggerService, ProjectDbConnectionService
) {
  'use strict';

  return {
    addImage: function (id, name, path) {
      let filename = ImageService.addImageToProject(path);
      LoggerService.info('Added image file: ' + filename + ' for element with $loki='
        + id + ' in maincharacters');

      let maincharacter = this.getMainCharacter(id);
      let images = maincharacter.images;
      images.push({
        name: name,
        filename: filename
      });
      maincharacter.images = images;
      CollectionUtilService.update(this.getCollection(), maincharacter);
    },
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
    deleteImage: function (id, filename) {

      // delete image file
      ImageService.deleteImage(filename);
      LoggerService.info('Deleted image file: ' + filename + ' for element with $loki='
        + id + ' in maincharacters');

      // delete reference
      let maincharacter = this.getMainCharacter(id);
      let images = maincharacter.images;
      let imageToRemovePosition;
      for (let i = 0; i < images.length; i++) {
        if (images[i].filename === filename) {
          imageToRemovePosition = i;
          break;
        }
      }
      images.splice(imageToRemovePosition, 1);
      maincharacter.images = images;
      CollectionUtilService.update(this.getCollection(), maincharacter);

      return maincharacter;
    },
    getCollection: function() { 
      return ProjectDbConnectionService.getProjectDb().getCollection('maincharacters');
    },
    getDynamicView: function() {
      return CollectionUtilService.getDynamicViewSortedByPosition(
        this.getCollection(), 'all_maincharacters');
    }, 
    getMainCharacter: function(id) {
      return this.getCollection().get(id);
    },
    getMainCharactersCount: function() {
      return this.getCollection().count();
    },
    getMainCharacters: function() {
      return this.getDynamicView().data();
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

      // images
      let images = [];
      maincharacter.images = images;

      // insert character
      maincharacter = CollectionUtilService.insert(this.getCollection(), maincharacter);
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
        characters: 0, 
        status: 'todo',
        text: '',
        words: 0
      };
    },
    
    move: function(sourceId, targetId) {
      return CollectionUtilService.move(this.getCollection(), sourceId, targetId,
        this.getDynamicView());
    },
    remove: function(id) {
      CollectionUtilService.remove(this.getCollection(), id);
    },
    update: function(maincharacter) {
      maincharacter.status = this.calculateStatus(maincharacter);
      CollectionUtilService.update(this.getCollection(), maincharacter);
    }
  };
});
