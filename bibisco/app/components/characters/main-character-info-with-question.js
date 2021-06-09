/*
 * Copyright (C) 2014-2021 Andrea Feccomandi
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

function MainCharacterInfoWithQuestion($location, $rootScope, $routeParams,
  MainCharacterService) {

  var self = this;

  self.$onInit = function() {

    $rootScope.$emit('SHOW_ELEMENT_DETAIL');

    self.maincharacter = MainCharacterService.getMainCharacter($routeParams.id);
    self.type = $routeParams.info;
    self.mode = $routeParams.mode;
    self.editmode = (self.mode !== 'view');
    let backpath = '/maincharacters/' + $routeParams.id + '/params/focus=maincharactersdetails_' + $routeParams.info;

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_characters',
      href: '/characters/params/focus=maincharacters_' + self.maincharacter.$loki
    });
    self.breadcrumbitems.push({
      label: self.maincharacter.name,
      href: backpath
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

    if (self.mode === 'view') {
      self.backpath = backpath;
    }

    self.characters;
    self.words;

    self.calculatePreviousNextElements(self.type);
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
    }
  };

}
