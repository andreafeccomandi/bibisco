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
angular.
  module('bibiscoApp').
  component('maincharacterinfowithquestion', {
    templateUrl: 'components/characters/main-character-info-with-question.html',
    controller: MainCharacterInfoWithQuestion
  });

function MainCharacterInfoWithQuestion($injector, $location, $rootScope, $routeParams, $window,
  MainCharacterService, NavigationService, SupporterEditionChecker) {

  let self = this;

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
    self.mode = NavigationService.calculateMode($routeParams.mode); 
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

    // action items
    self.actionitems = [];
    self.actionitems.push({
      label: 'jsp.character.thumbnail.images.title',
      itemfunction: self.showimagesfunction
    });
    self.actionitems.push({
      label: 'events_button_title',
      itemfunction: self.showeventsfunction,
      supportersonly: true
    });
    self.actionitems.push({
      label: 'groups_button',
      itemfunction: self.managegroupsmembership,
      supportersonly: true
    });
  };

  self.edit = function () {
    $location.path('/maincharacters/' + $routeParams.id + '/infowithquestion/' + $routeParams.info + '/edit').replace();
  };

  self.read = function () {
    $location.path('/maincharacters/' + $routeParams.id + '/infowithquestion/' + $routeParams.info + '/view').replace();
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
      self.nextelementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/physionomy/'+self.mode;
      break;
    case 'physionomy':
      self.nextelementlabel = 'common_behaviors';
      self.nextelementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/behaviors/'+self.mode;
      self.previouselementlabel  = 'common_personaldata';
      self.previouselementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/personaldata/'+self.mode;
      break;
    case 'behaviors':
      self.nextelementlabel = 'common_psychology';
      self.nextelementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/psychology/'+self.mode;
      self.previouselementlabel  = 'common_physionomy';
      self.previouselementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/physionomy/'+self.mode;
      break;
    case 'psychology':
      self.nextelementlabel = 'common_ideas';
      self.nextelementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/ideas/'+self.mode;
      self.previouselementlabel  = 'common_behaviors';
      self.previouselementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/behaviors/'+self.mode;
      break;
    case 'ideas':
      self.nextelementlabel = 'common_sociology';
      self.nextelementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/sociology/'+self.mode;
      self.previouselementlabel  = 'common_psychology';
      self.previouselementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/psychology/'+self.mode;
      break;
    case 'sociology':
      self.nextelementlabel = 'jsp.character.thumbnail.lifebeforestorybeginning.title';
      self.nextelementlink = '/maincharacters/' + $routeParams.id + '/infowithoutquestion/lifebeforestorybeginning/'+self.mode;
      self.previouselementlabel  = 'common_ideas';
      self.previouselementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/ideas/'+self.mode;
      break;
    case 'custom':
      self.nextelementlabel = 'jsp.character.thumbnail.conflict.title';
      self.nextelementlink = '/maincharacters/' + $routeParams.id + '/infowithoutquestion/conflict/'+self.mode;
      self.previouselementlabel = 'jsp.character.thumbnail.lifebeforestorybeginning.title';
      self.previouselementlink = '/maincharacters/' + $routeParams.id + '/infowithoutquestion/lifebeforestorybeginning/'+self.mode;
      break;
    }
  };

  self.manageCustomQuestions = function() {
    $location.path('/maincharacters/'+self.maincharacter.$loki+'/customquestions');
  };

  self.addprofileimage = function() {
    $location.path('/maincharacters/' + self.maincharacter.$loki + '/images/addprofile');
  };

  self.showimagesfunction = function() {
    $location.path('/maincharacters/' + self.maincharacter.$loki + '/images');
  };

  self.showeventsfunction = function() {
    SupporterEditionChecker.filterAction(function () {
      $location.path('/maincharacters/' + self.maincharacter.$loki + '/events');
    });
  };

  self.managegroupsmembership = function() {
    SupporterEditionChecker.filterAction(function () {
      $location.path('/maincharacters/' + self.maincharacter.$loki + '/groupsmembership');
    });
  };
}
