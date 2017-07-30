/*
 * Copyright (C) 2014-2017 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.gnu.org/licenses/gpl-2.0.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY.
 * See the GNU General Public License for more details.
 *
 */

angular.module('bibiscoApp').service('PopupBoxesService', function($uibModal) {
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

      modalInstance.result.then(function(selectedItem) {
        // ok: unreachable code: we're in alert!
      }, function() {
        // cancel
      });
    },
    confirm: function(confirmFunction, confirmMessage) {
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

      modalInstance.result.then(function(selectedItem) {
        confirmFunction();
      }, function() {
        // cancel
      });
    }
  }
});
