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
  component('maincharacterinfowithoutquestion', {
    templateUrl: 'components/characters/main-character-info-without-question.html',
    controller: MainCharacterInfoWithoutQuestion
  });

function MainCharacterInfoWithoutQuestion($location, $rootScope, $routeParams, $window,
  MainCharacterService, SupporterEditionChecker) {

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

    self.breadcrumbitems.push({
      label: 'common_characters',
      href: '/characters'
    });
    self.breadcrumbitems.push({
      label: self.maincharacter.name,
      href: '/maincharacters/' + self.maincharacter.$loki
    });
    self.breadcrumbitems.push({
      label: 'jsp.character.thumbnail.' + $routeParams.info + '.title'
    });

    self.headertitle = 'jsp.character.thumbnail.' + $routeParams.info + '.title';
    self.headersubtitle = 'jsp.character.thumbnail.' + $routeParams.info + '.description';

    self.calculatePreviousNextElements(self.type);
  };

  self.edit = function () {
    $location.path('/maincharacters/' + $routeParams.id + '/infowithoutquestion/' + $routeParams.info + '/edit');
  };

  self.save = function () {
    MainCharacterService.update(self.maincharacter);
  };

  self.changestatus = function(status) {
    self.maincharacter[self.type].status = status;
    MainCharacterService.update(self.maincharacter);
  };

  self.calculatePreviousNextElements = function (type) {
    switch(type) {
    case 'lifebeforestorybeginning':
      self.nextelementlabel = SupporterEditionChecker.isSupporterOrTrial() ? 'common_custom' : 'jsp.character.thumbnail.conflict.title';
      self.nextelementlink = SupporterEditionChecker.isSupporterOrTrial() ? '/maincharacters/' + $routeParams.id + '/infowithquestion/custom/view' : '/maincharacters/' + $routeParams.id + '/infowithoutquestion/conflict/view';
      self.previouselementlabel  = 'common_sociology';
      self.previouselementlink = '/maincharacters/' + $routeParams.id + '/infowithquestion/sociology/view';
      break;
    case 'conflict':
      self.nextelementlabel = 'jsp.character.thumbnail.evolutionduringthestory.title';
      self.nextelementlink = '/maincharacters/' + $routeParams.id + '/infowithoutquestion/evolutionduringthestory/view';
      self.previouselementlabel = SupporterEditionChecker.isSupporterOrTrial() ? 'common_custom' : 'jsp.character.thumbnail.lifebeforestorybeginning.title';
      self.previouselementlink = SupporterEditionChecker.isSupporterOrTrial() ? '/maincharacters/' + $routeParams.id + '/infowithquestion/custom/view' : '/maincharacters/' + $routeParams.id + '/infowithoutquestion/lifebeforestorybeginning/view';
      break;
    case 'evolutionduringthestory':
      self.previouselementlabel  = 'jsp.character.thumbnail.conflict.title';
      self.previouselementlink = '/maincharacters/' + $routeParams.id + '/infowithoutquestion/conflict/view';
      break;
    }
  };
}
