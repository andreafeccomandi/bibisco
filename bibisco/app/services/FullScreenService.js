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

angular.module('bibiscoApp').service('FullScreenService', function($rootScope, $timeout) {
  'use strict';
  
  const ipc = require('electron').ipcRenderer;
  return {
    fullScreen: function(callback) {
      $rootScope.fullscreen = true;
      $timeout(function () {
        let isFullScreenEnabled = ipc.sendSync('isFullScreenEnabled');
        if (isFullScreenEnabled) {
          $rootScope.previouslyFullscreen = true;
        } else {
          ipc.send('enableFullScreen');
          $rootScope.previouslyFullscreen = false;
        }
        $rootScope.exitfullscreenmessage = true;
        self.focus();
        $timeout(function () {
          $rootScope.exitfullscreenmessage = false;
        }, 2000);
        if (callback) {
          $timeout(function () {
            callback();
          }, 3000);
        }
      },0);
    }
  };
});
