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

angular.module('bibiscoApp').service('SupporterEditionChecker', function (
  $uibModal) {
  'use strict';

  const { shell } = require('electron');

  return {
    isSupporterEdition: function () {
      return false;
    },
    showSupporterMessage: function () {
      var modalInstance = $uibModal.open({
        animation: true,
        backdrop: 'static',
        component: 'supportereditionpopup',
        size: 'md'
      });

      modalInstance.result.then(function () {
        shell.openExternal('http://www.bibisco.com');
      }, function () {
      });
    }
  };
});
