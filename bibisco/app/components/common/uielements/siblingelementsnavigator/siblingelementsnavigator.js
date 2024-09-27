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
  component('siblingelementsnavigator', {
    templateUrl: 'components/common/uielements/siblingelementsnavigator/siblingelementsnavigator.html',
    controller: SiblingElementsNavigatorController,
    bindings: {
      editmode: '<?',
      nextelementlabel: '@',
      nextelementlink: '<',
      nextelementtooltip: '@?',
      previouselementlabel: '@',
      previouselementlink: '<',
      previouselementtooltip: '@?',
    }
  });


function SiblingElementsNavigatorController($location, $scope, hotkeys) {

  let self = this;
  self.$onInit = function () {

    // hotkeys
    if (self.editmode) {
      self.previouselementtooltiphotkey = 'previous_siblings_edit_hotkey';
      self.nextelementtooltiphotkey = 'next_siblings_edit_hotkey';
      hotkeys.bindTo($scope)
        .add({
          combo: ['ctrl+alt+right','command+alt+right'],
          description: 'gotonext',
          callback: function () {
            self.gotonextlement();
          }
        })
        .add({
          combo: ['ctrl+alt+left','command+alt+left'],
          description: 'gotoprevious',
          callback: function() {
            self.gotopreviouslement();
          }
        });
    } else {     
      self.previouselementtooltiphotkey = 'previous_siblings_view_hotkey';
      self.nextelementtooltiphotkey = 'next_siblings_view_hotkey';
      hotkeys.bindTo($scope)
        .add({
          combo: ['right','ctrl+alt+right','command+alt+right'],
          description: 'gotonext',
          callback: function () {
            self.gotonextlement();
          }
        })
        .add({
          combo: ['left','ctrl+alt+left','command+alt+left'],
          description: 'gotoprevious',
          callback: function() {
            self.gotopreviouslement();
          }
        });
    }

  };

  self.gotopreviouslement = function () {
    if (self.previouselementlink) {
      $location.path(self.previouselementlink).replace();
    }
    
  };

  self.gotonextlement = function () {
    if (self.nextelementlink) {
      $location.path(self.nextelementlink).replace();
    }
  };
}
