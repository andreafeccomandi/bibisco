/*
 * Copyright (C) 2014-2023 Andrea Feccomandi
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

function SupporterEditionPopupController($translate) {
   
  var self = this;
  const { shell } = require('electron');

  self.$onInit = function () {
    
  };

  self.getIt = function () {
    self.close({
      $value: 'ok'
    });
  };

  self.cancel = function () {
    self.dismiss({
      $value: 'cancel'
    });
  };

  self.takeALook = function () {
    let url = $translate.instant('supporter_edition_take_a_look_button_url'); 
    shell.openExternal(url);
  };
}