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
  component('groupcolor', {
    templateUrl: 'components/groups/group-color.html',
    controller: GroupColorController
  });

function GroupColorController($rootScope, $routeParams, $scope, $window, hotkeys, GroupService, PopupBoxesService) {

  let self = this;

  self.$onInit = function() {

    $rootScope.$emit('SHOW_ELEMENT_TITLE');

    let group = GroupService.getGroup(parseInt($routeParams.id));

    // common bradcrumb root
    self.breadcrumbitems = [];

    // create breadcrumb groups
    self.breadcrumbitems.push({
      label: group.name,
      href: '/groups/' + group.$loki + '/default'
    });
    self.breadcrumbitems.push({
      label: 'group_change_color_title'
    });

    self.profileimage = group.profileimage;
    self.color = group.color;
    self.pageheadertitle = 'group_change_color_title';

    self.checkExit = {
      active: true
    };

    hotkeys.bindTo($scope)
      .add({
        combo: ['enter', 'enter'],
        description: 'enter',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'],
        callback: function ($event) {
          $event.preventDefault();
          $scope.groupColorForm.$submitted = true;
          self.save($scope.groupColorForm.$valid);
        }
      });
  };

  self.save = function(isValid) {
    let group = GroupService.getGroup(parseInt($routeParams.id));
    group.color = self.color;
    GroupService.update(group);
    $scope.groupColorForm.$dirty = false;
    $window.history.back();
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $scope.groupColorForm.$dirty, self.checkExit);
  });
}
