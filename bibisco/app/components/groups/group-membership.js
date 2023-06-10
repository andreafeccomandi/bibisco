
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
  component('groupmembership', {
    templateUrl: 'components/groups/group-membership.html',
    controller: GroupMembershipController,
    bindings: {
      breadcrumbitems: '<',
      id: '<',
      noprofileimageicon: '@',
      pageheadertitle: '@',
      profileimage: '@',
      type: '@'
    }
  });

function GroupMembershipController($location, $rootScope, $scope, $translate, $window,
  hotkeys, GroupService, PopupBoxesService, UtilService) {

  let self = this;

  self.$onInit = function() {

    // init title
    self.title = $translate.instant('groups_membership_title') + ' ' + self.pageheadertitle;

    // image enabled
    self.imageenabled = self.profileimage || self.noprofileimageicon ? true : false;

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

    // groups
    self.workingroups = GroupService.getGroups();

    // init group membership
    self.initGroupsMembership();
    
    $rootScope.dirty = false;
    self.checkExit = {
      active: true
    };
  };

  self.getElementId = function() {
    if (self.type === 'maincharacter') {
      return 'm_' + self.id;
    } else if (self.type === 'secondarycharacter') {
      return 's_' + self.id;
    } else if (self.type === 'location' || self.type === 'object' || self.type === 'strand') {
      return self.id;
    } 
  };

  self.getElementArray = function(group) {
    if (self.type === 'maincharacter' || self.type === 'secondarycharacter') {
      return group.groupcharacters;
    } else if (self.type === 'location') {
      return group.grouplocations;
    } else if (self.type === 'object') {
      return group.groupobjects;
    } else if (self.type === 'strand') {
      return group.groupstrands;
    } 
  };

  self.initGroupsMembership = function() {

    self.groupsmembership = [];
    for (let i = 0; i < self.workingroups.length; i++) {
      self.groupsmembership.push({
        id: self.workingroups[i].$loki,
        name: self.workingroups[i].name,
        selected: UtilService.array.contains(self.getElementArray(self.workingroups[i]), self.getElementId())
      });
    }
    
    // sort by name
    self.groupsmembership.sort(function(a, b) {
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    });
  };

  self.toggleGroup = function(id) {
    let group;

    for (let i = 0; i < self.workingroups.length; i++) {
      if (self.workingroups[i].$loki ===  id) {
        group = self.workingroups[i];
        break;
      }
    }
    
    let elementId = self.getElementId();
    let elementArray = self.getElementArray(group);
    let idx = UtilService.array.indexOf(elementArray, elementId);
    if (idx !== -1) {
      elementArray.splice(idx, 1);
    } else {
      elementArray.push(elementId);
    }
    $rootScope.dirty = true;
    self.initGroupsMembership();
  };

  self.createGroup = function() {
    self.executeSave();
    let path = '';
    if (self.type === 'maincharacter') {
      path += '/maincharacters/';
    } else if (self.type === 'secondarycharacter') {
      path += '/secondarycharacters/';
    } else if (self.type === 'location') {
      path += '/locations/';
    } else if (self.type === 'object') {
      path += '/objects/';
    } else if (self.type === 'strand') {
      path += '/strands/';
    } 
    path += self.id + '/groupsmembership/new';
    
    $location.path(path);
  };

  self.executeSave = function() {
    GroupService.updateGroups(self.workingroups);
    $rootScope.dirty = false;
  };

  self.save = function() {
    self.executeSave();
    $window.history.back();
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $rootScope.dirty, self.checkExit);
  });
}
