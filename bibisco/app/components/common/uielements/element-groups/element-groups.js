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
  component('elementtags', {
    templateUrl: 'components/common/uielements/element-groups/element-groups.html',
    controller: ElementGroupsController,
    bindings: {
      breadcrumbitems: '<',
      element: '<',
      lastsave: '<',
      savefunction: '&',
      title: '@'
    }
  });

function ElementGroupsController($rootScope, $scope, hotkeys, PopupBoxesService, UtilService) {

  let self = this;

  self.$onInit = function() {

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

  self.toggleTagElement = function(arr, id) {

    let idx = UtilService.array.indexOf(arr, id);
    if (idx !== -1) {
      arr.splice(idx, 1);
    } else {
      arr.push(id);
    }
    $rootScope.dirty = true;
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $rootScope.dirty, self.checkExit);
  });
}
