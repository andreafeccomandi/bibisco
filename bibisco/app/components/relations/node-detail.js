/*
 * Copyright (C) 2014-2022 Andrea Feccomandi
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
  component('nodedetail', {
    templateUrl: 'components/relations/node-detail.html',
    controller: NodeDetailController,
    bindings: {
      close: '&',
      dismiss: '&',
      resolve: '='
    },
  });

function NodeDetailController($injector, $scope, $timeout, hotkeys, LocationService, PopupBoxesService,
  MainCharacterService, SecondaryCharacterService) {

  var self = this;
  var ObjectService = null;

  self.$onInit = function() {

    self.name = self.resolve.name;
    self.editMode = self.resolve.name ? true : false;

    // init group
    self.maincharacter = false;
    self.secondarycharacter = false;
    self.location = false;
    self.object = false;
    if (self.resolve.group) {
      self.group = self.resolve.group;
      if (self.group === 'main_characters') {
        self.maincharacter = true;
      } else if (self.group === 'secondary_characters') {
        self.secondarycharacter = true;
      } else if (self.group === 'locations') {
        self.location = true;
      } else if (self.group === 'objects') {
        self.object = true;
      }
    } else {
      self.group = 'main_characters';
      self.maincharacter = true;
    }

    self.items = [];

    // Characters
    self.items.push.apply(self.items, self.getCharactersNames());

    // Locations
    self.items.push.apply(self.items, self.getLocationsNames());

    // Objects
    self.items.push.apply(self.items, self.getObjectsNames());
    
    hotkeys.bindTo($scope)
      .add({
        combo: ['enter', 'enter'],
        description: 'enter',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function ($event) {
          $event.preventDefault();
          self.save();
        }
      });
  };

  self.getCharactersNames = function () {

    let charactersnames = [];

    // main characters
    let mainCharacters = MainCharacterService.getMainCharacters();
    for (let i = 0; i < mainCharacters.length; i++) {
      charactersnames.push(mainCharacters[i].name);
    }

    // secondary characters
    let secondaryCharacters = SecondaryCharacterService.getSecondaryCharacters();
    for (let i = 0; i < secondaryCharacters.length; i++) {
      charactersnames.push(secondaryCharacters[i].name);
    }

    return charactersnames;
  };

  self.getLocationsNames = function () {

    let locationsnames = [];
    let locations = LocationService.getLocations();
    for (let i = 0; i < locations.length; i++) {
      let name = LocationService.calculateLocationName(locations[i]);
      locationsnames.push(name);
    }

    return locationsnames;
  };

  self.getObjectsNames = function () {

    let objectsnames = [];
    let objects = self.getObjectService().getObjects();
    for (let i = 0; i < objects.length; i++) {
      objectsnames.push(objects[i].name);
    }

    return objectsnames;
  };

  self.getObjectService = function () {
    if (!ObjectService) {
      ObjectService = $injector.get('ObjectService');
    }

    return ObjectService;
  };

  self.selectMaincharacter = function() {
    self.maincharacter = true;
    self.secondarycharacter = false;
    self.location = false;
    self.object = false;
    self.group = 'main_characters';
    self.focusOnNameField();
  };

  self.selectSecondarycharacter = function() {
    self.maincharacter = false;
    self.secondarycharacter = true;
    self.location = false;
    self.object = false;
    self.group = 'secondary_characters';
    self.focusOnNameField();
  };

  self.setLocation = function() {
    self.maincharacter = false;
    self.secondarycharacter = false;
    self.location = true;
    self.object = false;
    self.group = 'locations';
    self.focusOnNameField();
  };

  self.setObject = function() {
    self.maincharacter = false;
    self.secondarycharacter = false;
    self.location = false;
    self.object = true;
    self.group = 'objects';
    self.focusOnNameField();
  };

  self.focusOnNameField = function() {
    $timeout(function () {
      document.getElementById('nodedetailid').focus();
    }, 0);
  };

  self.save = function () {
    self.nodeDetailForm.$submitted = true;
    if (self.nodeDetailForm.$valid) {
      self.close({
        $value: {
          action: 'edit',
          name: self.name, 
          group: self.group
        }
      });
    } 
  };

  self.back = function() {
    self.dismiss({
      $value: 'cancel'
    });
  };

  self.delete = function () {
    PopupBoxesService.confirm(function() {
      self.close({
        $value: {
          action: 'delete'
        }
      });
    }, 'relations_delete_element_confirm');    
  };
}
