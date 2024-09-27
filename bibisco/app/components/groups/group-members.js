
/*
 * Copyright (C) 2014-2024 Andrea Feccomandi
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
  component('groupmembers', {
    templateUrl: 'components/groups/group-members.html',
    controller: GroupMembersController
  });

function GroupMembersController($location, $rootScope, $routeParams, $scope, $translate, $window,
  hotkeys, BibiscoPropertiesService, GroupService, LocationService, MainCharacterService, NavigationService,
  ObjectService, PopupBoxesService, SecondaryCharacterService, StrandService, UtilService) {

  let self = this;

  self.$onInit = function() {

    self.breadcrumbitems = [];
    self.group = JSON.parse(JSON.stringify(self.getGroup(parseInt($routeParams.id))));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!self.group) {
      $window.history.back();
      return;
    }

    // breadcrumb
    self.mode = NavigationService.calculateMode($routeParams.mode); 
    self.breadcrumbitems.push({
      label: 'groups',
      href: '/groups'
    });
    self.breadcrumbitems.push({
      label: self.group.name,
      href: '/groups/' + self.group.$loki + '/default'
    });
    self.breadcrumbitems.push({
      label: 'group_members_title'
    });
    
    // init scene characters
    self.initGroupCharacters();

    // init locations
    self.initGroupLocations();

    // init objects
    self.initGroupObjects();

    // init strands
    self.initGroupStrands();

    // init title
    self.title = $translate.instant('group_members_of') + ' ' + self.group.name;

    // init save hotkey
    hotkeys.bindTo($scope)
      .add({
        combo: ['ctrl+s', 'command+s'],
        description: 'save',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function () {
          self.save();
        }
      });

    $rootScope.dirty = false;
    self.checkExit = {
      active: true
    };
  };

  self.getGroup = function (id) {
    return GroupService.getGroup(id);
  };

  self.toggleCharacter = function(id) {
    self.toggleTagElement(self.group.groupcharacters, id);
    self.initGroupCharacters();
  };

  self.toggleLocation = function(id) {
    self.toggleTagElement(self.group.grouplocations, id);
    self.initGroupLocations();
  };

  self.toggleObject = function(id) {
    self.toggleTagElement(self.group.groupobjects, id);
    self.initGroupObjects();
  };

  self.toggleStrand = function(id) {
    self.toggleTagElement(self.group.groupstrands, id);
    self.initGroupStrands();
  };

  self.toggleTagElement = function(arr, id) {

    let idx = UtilService.array.indexOf(arr, id);
    if (idx !== -1) {
      arr.splice(idx, 1);
    } else {
      arr.push(id);
    }
    $rootScope.dirty = true;
  };


  self.initGroupCharacters = function() {

    self.groupcharacters = [];

    // main characters
    let mainCharacters = MainCharacterService.getMainCharacters();
    for (let i = 0; i < mainCharacters.length; i++) {
      let itemid = 'm_' + mainCharacters[i].$loki;
      self.groupcharacters.push({
        id: itemid,
        name: mainCharacters[i].name,
        selected: UtilService.array.contains(self.group.groupcharacters, itemid)
      });
    }

    // secondary characters
    let secondaryCharacters = SecondaryCharacterService.getSecondaryCharacters();
    for (let i = 0; i < secondaryCharacters.length; i++) {
      let itemid = 's_' + secondaryCharacters[i].$loki;
      self.groupcharacters.push({
        id: itemid,
        name: secondaryCharacters[i].name,
        selected: UtilService.array.contains(self.group.groupcharacters, itemid)
      });
    }

    // sort by name
    self.groupcharacters.sort(function(a, b) {
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    });
  };

  self.initGroupLocations = function() {

    self.grouplocations = [];
    
    // locations
    let locations = LocationService.getLocations();
    for (let i = 0; i < locations.length; i++) {
      self.grouplocations.push({
        id: locations[i].$loki,
        name: LocationService.calculateLocationName(locations[i]),
        selected: UtilService.array.contains(self.group.grouplocations, locations[i].$loki)
      });
    }

    // sort by name
    self.grouplocations.sort(function(a, b) {
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    });
  };

  self.initGroupObjects = function () {

    self.groupobjects = [];

    // objects
    let objects = ObjectService.getObjects();
    for (let i = 0; i < objects.length; i++) {
      self.groupobjects.push({
        id: objects[i].$loki,
        name: objects[i].name,
        selected: UtilService.array.contains(self.group.groupobjects, objects[i].$loki)
      });
    }
  
    // sort by name
    self.groupobjects.sort(function (a, b) {
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    });
    
  };

  self.initGroupStrands = function () {

    self.groupstrands = [];

    // strands
    let strands = StrandService.getStrands();
    for (let i = 0; i < strands.length; i++) {
      self.groupstrands.push({
        id: strands[i].$loki,
        name: strands[i].name,
        selected: UtilService.array.contains(self.group.groupstrands, strands[i].$loki)
      });
    }
  
    // sort by name
    self.groupstrands.sort(function (a, b) {
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    });
    
  };

  self.createMainCharacter = function() {
    self.executeSave();
    $location.path('/groups/' + self.group.$loki + '/members/maincharacters/new');
  };

  self.createSecondaryCharacter = function() {
    self.executeSave();
    $location.path('/groups/' + self.group.$loki + '/members/secondarycharacters/new');
  };

  self.createLocation = function() {
    self.executeSave();
    $location.path('/groups/' + self.group.$loki + '/members/location/new');
  };

  self.createObject = function() {
    self.executeSave();
    $location.path('/groups/' + self.group.$loki + '/members/objects/new');
  };

  self.createStrand = function() {
    self.executeSave();
    $location.path('/groups/' + self.group.$loki + '/members/strands/new');
  };

  self.executeSave = function() {
    GroupService.update(self.group);
    $rootScope.dirty = false;
  };

  self.save = function() {
    self.executeSave();
    $window.history.back();
  };

  $scope.$on('$locationChangeStart', function (event) {
    let autosave = BibiscoPropertiesService.getProperty('autoSaveEnabled') === 'true';
    if (autosave && $rootScope.dirty) {
      self.executeSave();
    } else {
      PopupBoxesService.locationChangeConfirm(event, $rootScope.dirty, self.checkExit);
    }
  });
}
