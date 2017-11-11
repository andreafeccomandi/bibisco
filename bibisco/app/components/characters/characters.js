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
  component('characters', {
    templateUrl: 'components/characters/characters.html',
    controller: CharactersController,
    bindings: {

    }
  });

function CharactersController($location, $scope, LoggerService,
  MainCharacterService, SecondaryCharacterService) {
  LoggerService.debug('Start CharactersController...');
  var self = this;

  self.$onInit = function() {
    self.maincharacterscardgriditems = self.getMainCharacterCardGridItems();
    self.secondarycharacterscardgriditems = self.getSecondaryCharacterCardGridItems();
  };

  self.createMainCharacter = function() {
    $location.path('/maincharacters/new');
  };

  self.createSecondaryCharacter = function() {
    $location.path('/secondarycharacters/new');
  };

  self.getMainCharacterCardGridItems = function() {
    let items;
    if (MainCharacterService.getMainCharactersCount() > 0) {
      let characters = MainCharacterService.getMainCharacters();
      items = self.getGridItemsFromCharacters(characters);
    }
    return items;
  };

  self.getSecondaryCharacterCardGridItems = function() {
    let items;
    if (SecondaryCharacterService.getSecondaryCharactersCount() > 0) {
      let characters = SecondaryCharacterService.getSecondaryCharacters();
      items = self.getGridItemsFromCharacters(characters);
    }
    return items;
  };

  self.getGridItemsFromCharacters = function(characters) {
    let items = [];
    for (let i = 0; i < characters.length; i++) {
      items.push({
        id: characters[i].$loki,
        position: characters[i].position,
        status: characters[i].status,
        title: characters[i].name
      });
    }
    return items;
  };

  self.mainCharacterSelect = function(id) {
    $location.path('/maincharacters/' + id);
  };

  self.secondaryCharacterSelect = function(id) {
    $location.path('/secondarycharacters/' + id);
  };

  self.mainCharacterMove = function(draggedObjectId, destinationObjectId) {
    MainCharacterService.move(draggedObjectId, destinationObjectId);
    self.maincharacterscardgriditems = this.getMainCharacterCardGridItems();
    $scope.$apply();
  };

  self.secondaryCharacterMove = function(draggedObjectId, destinationObjectId) {
    SecondaryCharacterService.move(draggedObjectId, destinationObjectId);
    self.secondarycharacterscardgriditems = this.getSecondaryCharacterCardGridItems();
    $scope.$apply();
  };

  LoggerService.debug('End CharactersController...');
}
