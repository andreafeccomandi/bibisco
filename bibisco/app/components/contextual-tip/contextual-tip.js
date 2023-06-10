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
  component('contextualtip', {
    templateUrl: 'components/contextual-tip/contextual-tip.html',
    controller: ContextualTipController,
    bindings: {
      close: '&',
      dismiss: '&',
      resolve: '<'
    },
  });

function ContextualTipController() {
  var self = this;

  self.$onInit = function () {
    self.tipcode = self.resolve.tipcode;
  };

  self.tiphtml = function() {
    return 'components/contextual-tip/tips/' + self.tipcode + '.html';
  };

  self.dontTellMeMore = function () {
    self.close({
      $value: 'ok'
    });
  };

  self.cancel = function () {
    self.dismiss({
      $value: 'cancel'
    });
  };
}
