/*
 * Copyright (C) 2014-2021 Andrea Feccomandi
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
  component('modalbase', {
    templateUrl: 'components/common/uielements/modal/modal-base/modal-base.html',
    controller: ModalBaseController,
    bindings: {
      close: '&',
      dismiss: '&',
      mode: '@',
      resolve: '<'
    },
  });

function ModalBaseController($scope, $translate, hotkeys) {

  var self = this;

  self.$onInit = function() {
    self.message = $translate.instant(self.resolve.message);
    self.selectableText = self.resolve.selectableText;
    hotkeys.bindTo($scope)
      .add({
        combo: ['enter', 'enter'],
        description: 'enter',
        callback: function ($event) {
          $event.preventDefault();
          self.ok();
        }
      });
  };

  self.ok = function() {
    self.close({
      $value: 'ok'
    });
  };

  self.cancel = function() {
    self.dismiss({
      $value: 'cancel'
    });
  };
}
