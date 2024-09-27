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

angular.module('bibiscoApp').service('PopupBoxesService', function ($location, 
  $rootScope, $timeout, $uibModal, $window, BibiscoPropertiesService, BibiscoDbConnectionService) {
  'use strict';

  return {
    alert: function(alertMessage, size) {
      this.executeAlert(alertMessage, size, false);
    },
    alertWithSelectableText: function(alertMessage, size) {
      this.executeAlert(alertMessage, size, true);
    },
    executeAlert: function(alertMessage, size, selectableText) {
      var modalInstance = $uibModal.open({
        animation: true,
        backdrop: 'static',
        component: 'modalalert',
        resolve: {
          message: function() {
            return alertMessage;
          },
          selectableText: function() {
            return selectableText;
          }
        },
        size: size ? size : 'sm'
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
    },

    locationChangeConfirm: function (event, formDirty, checkExit, confirmFunction, denyFunction) {
      
      let wannaGoPath = $location.path();
      if (checkExit && checkExit.active && formDirty && wannaGoPath !== '/error') {
        event.preventDefault();
        checkExit.active = false;

        this.confirm(function () {
          if (confirmFunction) {
            confirmFunction();
          }
          $timeout(function () {
            if (wannaGoPath === $rootScope.previousPath) {
              $window.history.back();
            } else {
              $location.path(wannaGoPath);
            }
          }, 0);
        },
        'js.common.message.confirmExitWithoutSave',
        function () {
          checkExit.active = true;
          if (denyFunction) {
            denyFunction();
          }
          $rootScope.$emit('LOCATION_CHANGE_DENIED');
        });
      }
    },

    showTip: function (tipcode, style, confirmFunction) {

      let modalstyle = style;
      if (!modalstyle) {
        modalstyle = 'contextualtip';
      }

      var modalInstance = $uibModal.open({
        animation: true,
        backdrop: 'static',
        component: 'contextualtip',
        resolve: {
          tipcode: function () {
            return tipcode;
          }
        },
        size: modalstyle
      });
  
      $rootScope.$emit('OPEN_POPUP_BOX');
  
      modalInstance.result.then(function () {
        BibiscoPropertiesService.setProperty(tipcode, 'false');
        BibiscoDbConnectionService.saveDatabase();
        self.buttonvisible = false;
        if (confirmFunction) {
          confirmFunction();
        }
        $rootScope.$emit('CLOSE_POPUP_BOX');
      }, function () {
        $rootScope.$emit('CLOSE_POPUP_BOX');
      });
    },

    waiting: function(waitingMessage, closeEvent, size) {
      var modalInstance = $uibModal.open({
        animation: true,
        backdrop: 'static',
        component: 'modalwaiting',
        keyboard: false,
        resolve: {
          message: function() {
            return waitingMessage;
          },
          closeEvent: function() {
            return closeEvent;
          }
        },
        size: size ? size : 'sm'
      });

      $rootScope.$emit('OPEN_POPUP_BOX');

      modalInstance.result.then(function() {
        // ok: unreachable code: we're in alert!
      }, function() {
        // cancel
        $rootScope.$emit('CLOSE_POPUP_BOX');
      });
    },
  };
});
