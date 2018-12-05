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

angular.module('bibiscoApp').service('PopupBoxesService', function ($rootScope, $uibModal) {
  'use strict';

  return {
    alert: function(alertMessage) {
      var modalInstance = $uibModal.open({
        animation: true,
        backdrop: 'static',
        component: 'modalalert',
        resolve: {
          message: function() {
            return alertMessage;
          }
        },
        size: 'sm'
      });

      $rootScope.$emit('OPEN_POPUP_BOX');

      modalInstance.result.then(function() {
        // ok: unreachable code: we're in alert!
      }, function() {
        // cancel
        $rootScope.$emit('CLOSE_POPUP_BOX');
      });
    },
    confirm: function(confirmFunction, confirmMessage, cancelFunction) {
      var modalInstance = $uibModal.open({
        animation: true,
        backdrop: 'static',
        component: 'modalconfirm',
        resolve: {
          message: function() {
            return confirmMessage;
          }
        },
        size: 'sm'
      });

      $rootScope.$emit('OPEN_POPUP_BOX');

      modalInstance.result.then(function() {
        confirmFunction();
        $rootScope.$emit('CLOSE_POPUP_BOX');
      }, function() {
        if (cancelFunction) {
          cancelFunction();
        }
        $rootScope.$emit('CLOSE_POPUP_BOX');
      });
    }
  };
});
