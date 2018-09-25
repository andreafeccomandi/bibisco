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
angular.
  module('bibiscoApp').
  component('buttonwithconfirm', {
    templateUrl: 'components/common/forms/button-with-confirm/button-with-confirm.html',
    controller: ButtonWithConfirmController,
    bindings: {
      buttonfunction: '&',
      buttonlabel: '@',
      buttonstyle: '@',
      confirmmessage: '@',
      enableconfirm: '<',
      hotkey: '@'
    }
  });


function ButtonWithConfirmController($scope, hotkeys, PopupBoxesService) {

  
  var self = this;

  self.$onInit = function () {
    if (self.hotkey) {
      hotkeys.bindTo($scope)
        .add({
          combo: [self.hotkey, self.hotkey],
          description: self.hotkey,
          callback: function ($event) {
            $event.preventDefault();
            setTimeout(function () { 
              document.getElementById('confirmButton').focus();
              document.getElementById('confirmButton').click();
            }, 0);
          }
        });
    }
  };

  self.click = function () {
    self.executeAction();
  };

  self.executeAction = function() {
    if (self.enableconfirm) {
      PopupBoxesService.confirm(self.buttonfunction, self.confirmmessage);
    } else {
      self.buttonfunction();
    }
  };
}
