/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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

angular.module('bibiscoApp').service('GoToService', function ($location, $rootScope, PopupBoxesService) {
  'use strict';

  return {
    goToUrl: function (url) {
      if ($rootScope.dirty) {
        PopupBoxesService.confirm(function () {
          $rootScope.dirty = false;
          $location.path(url);
        },
        'js.common.message.confirmExitWithoutSave',
        function () {
          let richtexteditor = document.getElementById('richtexteditor');
          if (richtexteditor) {
            richtexteditor.focus();
          }
        });
      } else {
        $location.path(url);
      }
    }
  };
});
