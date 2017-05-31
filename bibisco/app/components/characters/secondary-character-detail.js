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

    self.breadcrumbItems = [];
    self.breadcrumbItems.push({
      label: 'jsp.projectFromScene.nav.li.characters',
      href: '/project/characters'
    });
    self.breadcrumbItems.push({
      labelvalue: self.secondarycharacter.name
    });

  };

  self.changeTitle = function() {
    $location.path('/secondarycharactertitle/edit/' + self.secondarycharacter
      .$loki);
  }

  self.getSecondaryCharacter = function(id) {
    return secondaryCharacter = SecondaryCharacterService.getSecondaryCharacter(
      id);
  }

  LoggerService.debug('End SecondaryCharacterDetailController...');
}
