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
angular.
module('bibiscoApp').
component('maincharacterinfowithquestion', {
  templateUrl: 'components/characters/main-character-info-with-question.html',
  controller: MainCharacterInfoWithQuestion
});

function MainCharacterInfoWithQuestion($location, $rootScope, $routeParams,
  MainCharacterService, LoggerService) {
  LoggerService.debug('Start MainCharacterInfoWithQuestion...');

  var self = this;

  self.$onInit = function() {

    $rootScope.$emit('SHOW_ELEMENT_DETAIL');

    self.maincharacter = MainCharacterService.getMainCharacter($routeParams.id);

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.nav.li.characters',
      href: '/project/characters'
    });
    self.breadcrumbitems.push({
      label: self.maincharacter.name
    });
    self.breadcrumbitems.push({
      label: 'jsp.character.thumbnail.' + $routeParams.id + '.title'
    });

    self.editmode = false;
    self.showprojectexplorer = true;
    self.infotype = $routeParams.info;
  };

  self.back = function() {
    $location.path('/project/characters');
  }

  self.changeStatus = function(status) {
    //self.maincharacter.status = status;
    //MainCharacterService.update(self.maincharacter);
  }

  LoggerService.debug('End MainCharacterInfoWithQuestion...');
}
