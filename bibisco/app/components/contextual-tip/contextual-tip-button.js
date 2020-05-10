/*
 * Copyright (C) 2014-2020 Andrea Feccomandi
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


function ContextualTipButtonController($rootScope, $uibModal, BibiscoDbConnectionService, 
  BibiscoPropertiesService) {
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
    var modalInstance = $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'contextualtip',
      resolve: {
        tipcode: function () {
          return self.tipcode;
        }
      },
      size: self.style
    });

    $rootScope.$emit('OPEN_POPUP_BOX');

    modalInstance.result.then(function () {
      BibiscoPropertiesService.setProperty(self.tipcode, 'false');
      BibiscoDbConnectionService.saveDatabase();
      self.buttonvisible = false;
      $rootScope.$emit('CLOSE_POPUP_BOX');
    }, function () {
      $rootScope.$emit('CLOSE_POPUP_BOX');
    });
  };
}
