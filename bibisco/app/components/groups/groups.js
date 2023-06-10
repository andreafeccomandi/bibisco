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
  component('groups', {
    templateUrl: 'components/groups/groups.html',
    controller: GroupsController,
    bindings: {

    }
  });

function GroupsController($location, $rootScope, $scope, GroupService, SupporterEditionChecker) {

  var self = this;

  self.$onInit = function() {
    
    // show menu item
    $rootScope.$emit('SHOW_PAGE', {
      item: 'groups'
    });
    
    self.cardgriditems = this.getCardGridGroups();

    // hotkeys
    self.hotkeys = ['ctrl+n', 'command+n'];
  };

  self.itemsPresent = function() {
    return GroupService.getGroupsCount() > 0;
  };

  self.create = function() {
    SupporterEditionChecker.filterAction(function () {
      $location.path('/groups/new');
    });
  };

  self.getCardGridGroups = function () {
    let cardgriditems = null;
    if (GroupService.getGroupsCount() > 0) {
      let groups = GroupService.getGroups();
      cardgriditems = [];
      for (let i = 0; i < groups.length; i++) {
        cardgriditems.push({
          id: groups[i].$loki,
          image: groups[i].profileimage, 
          noimageicon: 'group',
          position: groups[i].position,
          status: groups[i].status,
          tags: [{label: '', color: groups[i].color}],
          title: groups[i].name
        });
      }
    }
    return cardgriditems;
  };

  self.move = function(draggedGroupId, destinationGroupId) {
    GroupService.move(draggedGroupId, destinationGroupId);
    self.cardgriditems = this.getCardGridGroups();
    $scope.$apply();
  };

  self.select = function(id) {
    SupporterEditionChecker.filterAction(function() {
      $location.path('/groups/' + id + '/view');
    });    
  };
}
