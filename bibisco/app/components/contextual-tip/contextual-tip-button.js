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
angular.
  module('bibiscoApp').
  component('contextualtipbutton', {
    templateUrl: 'components/contextual-tip/contextual-tip-button.html',
    controller: ContextualTipButtonController,
    bindings: {
      tipcode: '@'
    }
  });


function ContextualTipButtonController($uibModal, BibiscoDbConnectionService, 
  BibiscoPropertiesService) {
  var self = this;

  self.$onInit = function () {
    self.buttonvisible = BibiscoPropertiesService.getProperty(self.tipcode) === 'true';
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
      size: 'sm'
    });

    modalInstance.result.then(function () {
      BibiscoPropertiesService.setProperty(self.tipcode, 'false');
      BibiscoDbConnectionService.saveDatabase();
      self.buttonvisible = false;
    }, function () {
    });
  };
}
