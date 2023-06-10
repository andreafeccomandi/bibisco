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
  component('groupdetail', {
    templateUrl: 'components/groups/group-detail.html',
    controller: GroupDetailController
  });

function GroupDetailController($location, $rootScope, $routeParams, $scope, $window, hotkeys, GroupService) {

  let self = this;

  self.$onInit = function () {

    self.breadcrumbitems = [];
    self.group = self.getGroup(parseInt($routeParams.id));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!self.group) {
      $window.history.back();
      return;
    }

    // breadcrumb
    self.mode = $routeParams.mode;
    self.breadcrumbitems.push({
      label: 'groups',
      href: '/groups'
    });
    self.breadcrumbitems.push({
      label: self.group.name
    });

    // tags
    self.tags = [];
    self.tags.push({label: 'group_color_tag_label', color: self.group.color});

    self.deleteforbidden = self.isDeleteForbidden();
  };

  self.addprofileimage = function() {
    $location.path('/groups/' + self.group.$loki + '/images/addprofile');
  };

  self.changeTitle = function () {
    $location.path('/groups/' + self.group.$loki + '/title');
  };

  self.changeColor = function () {
    $location.path('/groups/' + self.group.$loki + '/color');
  };

  self.changeStatus = function (status) {
    self.group.status = status;
    GroupService.update(self.group);
  };

  self.delete = function () {
    if ($rootScope.groupFilter && $rootScope.groupFilter.key === self.group.$loki) {
      $rootScope.groupFilter = null;
    }
    GroupService.remove(self.group.$loki);
    $window.history.back();
  };

  self.edit = function () {
    $location.path('/groups/' + self.group.$loki + '/edit');
  };

  self.getGroup = function (id) {
    return GroupService.getGroup(id);
  };

  self.isDeleteForbidden = function () {

    let deleteForbidden = false;

    return deleteForbidden;
  };

  hotkeys.bindTo($scope)
    .add({
      combo: ['ctrl+m', 'command+m'],
      description: 'groupmembers',
      callback: function () {
        self.managegroupmembers();
      }
    });

  self.managegroupmembers = function() {
    $location.path('/groups/' + self.group.$loki + '/members');
  };

  self.savefunction = function () {
    GroupService.update(self.group);
  };

  self.showeventsfunction = function() {
    $location.path('/groups/' + self.group.$loki + '/events');
  };

  self.showimagesfunction = function () {
    $location.path('/groups/' + self.group.$loki + '/images');
  };
}
