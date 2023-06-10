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
angular.
  module('bibiscoApp').
  component('maincharacterinfowithquestion', {
    templateUrl: 'components/characters/main-character-info-with-question.html',
    controller: MainCharacterInfoWithQuestion
  });

function MainCharacterInfoWithQuestion($injector, $location, $rootScope, $routeParams, $window,
  MainCharacterService) {

  var self = this;

  self.$onInit = function() {

    self.breadcrumbitems = [];
    self.maincharacter = MainCharacterService.getMainCharacter(parseInt($routeParams.id));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!self.maincharacter) {
      $window.history.back();
      return;
    }

    $rootScope.$emit('SHOW_ELEMENT_DETAIL');

    self.type = $routeParams.info;
    self.mode = $routeParams.mode;
    self.editmode = (self.mode !== 'view');

    self.breadcrumbitems.push({
      label: 'common_characters',
      href: '/characters'
    });
    self.breadcrumbitems.push({
      label: self.maincharacter.name,
      href: '/maincharacters/' + $routeParams.id
    });
    self.breadcrumbitems.push({
      label: 'common_' + $routeParams.info
    });

    self.headertitle = 'common_' + $routeParams.info;
    self.headersubtitle = 'jsp.character.thumbnail.' + $routeParams.info + '.description';

    self.autosaveenabled;
    self.content;
    $rootScope.dirty = false;
    
    if ($routeParams.question) {
      self.questionselected = parseInt($routeParams.question);
    } else {
      self.questionselected = 0;
    }

    self.characters;
    self.words;

    self.calculatePreviousNextElements(self.type);

    self.editbuttonenabled = true;
    if (self.type === 'custom') {
      let CustomQuestionService = $injector.get('CustomQuestionService');
      self.customQuestions = CustomQuestionService.getCustomQuestionsCount();
      if (CustomQuestionService.getCustomQuestionsCount() === 0) {
        self.editbuttonenabled = false;
      }
    }
  };

  self.edit = function () {
    $location.path('/maincharacters/' + $routeParams.id + '/infowithquestion/' + $routeParams.info + '/edit');
  };

  self.save = function () {

    if (self.mode === 'view') {
      return;
    }

    if (self.maincharacter[self.type].freetextenabled === true) {
      self.maincharacter[self.type].freetext = self.content;
      self.maincharacter[self.type].freetextcharacters = self.characters;
      self.maincharacter[self.type].freetextwords = self.words;
    } else {
      let questions = self.maincharacter[self.type].questions;
      questions[self.questionselected].text = self.content;
      questions[self.questionselected].characters = self.characters;
      questions[self.questionselected].words = self.words;

      self.maincharacter[self.type].questions = questions;
    }
    MainCharacterService.update(self.maincharacter);
  };

  self.changestatus = function(status) {
    self.maincharacter[self.type].status = status;
    MainCharacterService.update(self.maincharacter);
  };

  self.calculatePreviousNextElements = function (type) {
    switch(type) {
    case 'personaldata':
      self.nextelementlabel = 'common_physionomy';
      self.nextelementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/physionomy/view';
      break;
    case 'physionomy':
      self.nextelementlabel = 'common_behaviors';
      self.nextelementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/behaviors/view';
      self.previouselementlabel  = 'common_personaldata';
      self.previouselementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/personaldata/view';
      break;
    case 'behaviors':
      self.nextelementlabel = 'common_psychology';
      self.nextelementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/psychology/view';
      self.previouselementlabel  = 'common_physionomy';
      self.previouselementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/physionomy/view';
      break;
    case 'psychology':
      self.nextelementlabel = 'common_ideas';
      self.nextelementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/ideas/view';
      self.previouselementlabel  = 'common_behaviors';
      self.previouselementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/behaviors/view';
      break;
    case 'ideas':
      self.nextelementlabel = 'common_sociology';
      self.nextelementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/sociology/view';
      self.previouselementlabel  = 'common_psychology';
      self.previouselementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/psychology/view';
      break;
    case 'sociology':
      self.nextelementlabel = 'jsp.character.thumbnail.lifebeforestorybeginning.title';
      self.nextelementlink = '/maincharacters/' + $routeParams.id + '/infowithoutquestion/lifebeforestorybeginning/view';
      self.previouselementlabel  = 'common_ideas';
      self.previouselementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/ideas/view';
      break;
    case 'custom':
      self.nextelementlabel = 'jsp.character.thumbnail.conflict.title';
      self.nextelementlink = '/maincharacters/' + $routeParams.id + '/infowithoutquestion/conflict/view';
      self.previouselementlabel = 'jsp.character.thumbnail.lifebeforestorybeginning.title';
      self.previouselementlink = '/maincharacters/' + $routeParams.id + '/infowithoutquestion/lifebeforestorybeginning/view';
      break;
    }
  };

  self.manageCustomQuestions = function() {
    $location.path('/maincharacters/'+self.maincharacter.$loki+'/customquestions');
  };
}
