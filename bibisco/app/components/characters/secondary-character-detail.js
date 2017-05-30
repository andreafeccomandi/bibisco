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

function SecondaryCharacterDetailController($location, $routeParams, $filter,
  SecondaryCharacterService, LoggerService) {
  LoggerService.debug('Start SecondaryCharacterDetailController...');

  var self = this;

  self.$onInit = function() {
    self.secondarycharacter = self.getSecondaryCharacter($routeParams.id);

    self.breadcrumbItems = [];
    self.breadcrumbItems.push({
      labelkey: 'jsp.projectFromScene.nav.li.characters',
      href: '/project/characters'
    });
    self.breadcrumbItems.push({
      label: self.secondarycharacter.name
    });

  };

  self.getSecondaryCharacter = function(id) {
    return secondaryCharacter = SecondaryCharacterService.getSecondaryCharacter(
      id);
  }

  LoggerService.debug('End SecondaryCharacterDetailController...');
}
