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
component('secondarycharacterdetail', {
  templateUrl: 'components/characters/secondary-character-detail.html',
  controller: SecondaryCharacterDetailController
});

function SecondaryCharacterDetailController($location, $rootScope, $routeParams,
  SecondaryCharacterService, LoggerService) {
  LoggerService.debug('Start SecondaryCharacterDetailController...');

  var self = this;

  self.$onInit = function() {

    $rootScope.$emit('SHOW_SECONDARY_CHARACTER_DETAIL');

    self.secondarycharacter = self.getSecondaryCharacter($routeParams.id);

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.nav.li.characters'
    });
    self.breadcrumbitems.push({
      labelvalue: self.secondarycharacter.name
    });

    self.editmode = false;
    self.showprojectexplorer = true;

  };

  self.back = function() {
    $location.path('/project/characters');
  }

  self.changeStatus = function(status) {
    self.secondarycharacter.status = status;
    SecondaryCharacterService.update(self.secondarycharacter);
  }

  self.changeTitle = function() {
    $location.path('/secondarycharactertitle/edit/' + self.secondarycharacter
      .$loki);
  }

  self.delete = function() {
    SecondaryCharacterService.remove(self.secondarycharacter
      .$loki);
    $location.path('/project/characters');
  }

  self.getSecondaryCharacter = function(id) {
    return secondaryCharacter = SecondaryCharacterService.getSecondaryCharacter(
      id);
  }

  self.savefunction = function(text) {
    SecondaryCharacterService.update(self.secondarycharacter);
  }

  self.showimagesfunction = function() {
    alert('Qui si visualizzeranno le immagini per id=' + self.secondarycharacter
      .$loki);
  }

  LoggerService.debug('End SecondaryCharacterDetailController...');
}
