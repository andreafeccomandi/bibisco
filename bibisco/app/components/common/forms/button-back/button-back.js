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
  component('buttonback', {
    templateUrl: 'components/common/forms/button-back/button-back.html',
    controller: ButtonBackController,
    bindings: {
      disabled: '<'
    }
  });

function ButtonBackController($rootScope, $scope, $window, hotkeys, ContextService) {

  let self = this;
  const ipc = require('electron').ipcRenderer;
  
  self.$onInit = function() {

    // hotkey
    hotkeys.bindTo($scope).
      add({
        combo: ['esc', 'esc'],
        description: 'back',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function ($event) {
          if (!self.confirmdialogopen && !self.buttonpaused) {
            $event.preventDefault();
            self.back();
          }
        }
      });
    
    self.buttonpaused = false;
    self.confirmdialogopen = false;
  };

  $rootScope.$on('OPEN_POPUP_BOX', function () {
    self.confirmdialogopen = true;
  });

  $rootScope.$on('CLOSE_POPUP_BOX', function () {
    self.confirmdialogopen = false;
  });

  $rootScope.$on('LOCATION_CHANGE_DENIED', function () {
    self.buttonpaused = false;
  });

  self.back = function() {
    if (self.disabled || $rootScope.trialmessageopen) {
      return;
    }

    if ($rootScope.fullscreen) {
      $rootScope.fullscreen = false;
      $rootScope.$emit('BACK_FROM_FULL_SCREEN_VIEW');
      if (!$rootScope.previouslyFullscreen || ContextService.getOs().startsWith('win')) {
        ipc.send('exitFullScreen');
      }
    } else if (!self.buttonpaused) {
      self.buttonpaused = true;
      $window.history.back();
    }
  };
}
