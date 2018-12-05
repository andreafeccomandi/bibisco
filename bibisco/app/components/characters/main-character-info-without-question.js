/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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

function MainCharacterInfoWithoutQuestion($location, $rootScope, $routeParams,
  MainCharacterService) {

  var self = this;

  self.$onInit = function() {

    $rootScope.$emit('SHOW_ELEMENT_DETAIL');

    self.maincharacter = MainCharacterService.getMainCharacter($routeParams.id);
    self.type = $routeParams.info;
    self.mode = $routeParams.mode;

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_characters',
      href: '/characters/params/focus=maincharacters_' + self.maincharacter.$loki
    });
    self.breadcrumbitems.push({
      label: self.maincharacter.name,
      href: '/maincharacters/' + self.maincharacter.$loki + '/params/focus=maincharactersdetails_' + $routeParams.info
    });
    self.breadcrumbitems.push({
      label: 'jsp.character.thumbnail.' + $routeParams.info + '.title'
    });

    self.headertitle = 'jsp.character.thumbnail.' + $routeParams.info + '.title';
    self.headersubtitle = 'jsp.character.thumbnail.' + $routeParams.info + '.description';
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
}
