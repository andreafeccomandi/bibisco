/*
 * Copyright (C) 2014-2022 Andrea Feccomandi
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
  component('contextualtipbutton', {
    templateUrl: 'components/contextual-tip/contextual-tip-button.html',
    controller: ContextualTipButtonController,
    bindings: {
      modalstyle: '@?',
      tipcode: '@'
    }
  });


function ContextualTipButtonController(BibiscoPropertiesService, PopupBoxesService) {
  var self = this;

  self.$onInit = function () {
    self.style = self.modalstyle;
    if (!self.style) {
      self.style = 'contextualtip';
    }
    self.buttonvisible = BibiscoPropertiesService.getProperty(self.tipcode) === 'true';
    if (self.buttonvisible) {
      self.showTip();
    }
  };

  self.showTip = function () {
    PopupBoxesService.showTip(self.tipcode, self.style, function() {self.buttonvisible = false;});
  };
}
