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
  component('supportereditionpopup', {
    templateUrl: 'components/supporter-edition-popup/supporter-edition-popup.html',
    controller: SupporterEditionPopupController,
    bindings: {
      close: '&',
      dismiss: '&',
      resolve: '<'
    },
  });

function SupporterEditionPopupController($rootScope, $scope, $translate, hotkeys) {
   
  let self = this;
  const { shell } = require('electron');

  self.$onInit = function () {
    $rootScope.$emit('OPEN_SUPPORTER_EDITION_POPUP');
    self.cta = $translate.instant('supporters_edition_cta');
    self.showcountdown = false;
    self.countdown;

    hotkeys.bindTo($scope)
      .add({
        combo: ['esc', 'esc'],
        description: 'esc',
        callback: function ($event) {
          $event.preventDefault();
        }
      });;
  };

  self.getIt = function() {
    self.close({
      $value: 'ok'
    });
  };

  self.cancel = function () {
    self.showcountdown = true;
    self.countdown = 10;
    let downloadTimer = setInterval(function () {
      if (self.countdown <= 1) {
        clearInterval(downloadTimer);
        self.dismiss({
          $value: 'cancel'
        });
      }
      self.countdown -= 1;
      $scope.$apply();
    }, 1000);
  };
    
}