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
component('maincharacterdetail', {
  templateUrl: 'components/characters/main-character-detail.html',
  controller: MainCharacterDetailController
});

function MainCharacterDetailController($location, $rootScope, $routeParams,
  MainCharacterService, LoggerService) {
  LoggerService.debug('Start MainCharacterDetailController...');

  var self = this;

  self.$onInit = function() {

    $rootScope.$emit('SHOW_ELEMENT_DETAIL');

    self.maincharacter = self.getMainCharacter($routeParams.id);

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.nav.li.characters',
      href: '/project/characters'
    });
    self.breadcrumbitems.push({
      label: self.maincharacter.name
    });

    self.editmode = false;
    self.showprojectexplorer = true;

  };

  self.back = function() {
    $location.path('/project/characters');
  }

  self.changeStatus = function(status) {
    self.maincharacter.status = status;
    MainCharacterService.update(self.maincharacter);
  }

  self.changeTitle = function() {
    $location.path('/maincharacters/' + self.maincharacter.$loki + '/title');
  }

  self.delete = function() {
    MainCharacterService.remove(self.maincharacter
      .$loki);
    $location.path('/project/characters');
  }

  self.getMainCharacter = function(id) {
    return mainCharacter = MainCharacterService.getMainCharacter(
      id);
  }

  self.showimagesfunction = function() {
    alert('Qui si visualizzeranno le immagini per id=' + self.maincharacter
      .$loki);
  }

  self.showInfoWithQuestion = function(id) {
    $location.path('/maincharacters/' + self.maincharacter.$loki +
      '/infowithquestion/' + id);
  }

  LoggerService.debug('End MainCharacterDetailController...');
}
