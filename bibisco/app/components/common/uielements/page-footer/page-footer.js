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
  component('pagefooter', {
    templateUrl: 'components/common/uielements/page-footer/page-footer.html',
    controller: PageFooterController,
    bindings: {
      buttonhotkey: '<',
      buttonlabel: '@',
      buttonfunction: '&',
      buttonshow: '<',
      buttonstyle: '@', 
      buttontooltip: '@',
      button2hotkey: '<',
      button2label: '@',
      button2function: '&',
      button2show: '<',
      button2style: '@', 
      button2tooltip: '@',
      dropdownitems: '<',
      dropdownopen: '@',
      supportersonly: '<',
      tipcode: '@',
      tipenabled: '<',
      tipmodalstyle: '@?'
    }
  });


function PageFooterController($rootScope, $scope, hotkeys, BibiscoPropertiesService, UuidService) {
  let self = this;

  self.$onInit = function () {

    self.buttonid = UuidService.generateUuid();
    self.button2id = UuidService.generateUuid();
    
    if (!self.buttonstyle) {
      self.buttonstyle = 'primary';
    }
    if (!self.button2style) {
      self.button2style = 'default';
    }

    if (self.buttonhotkey) {
      hotkeys.bindTo($scope)
        .add({
          combo: self.buttonhotkey,
          description: self.buttonlabel,
          callback: function ($event) {
            if (!self.confirmdialogopen) {
              $event.preventDefault();
              self.buttonfunction();
            }
          }
        });
    }

    if (self.button2hotkey) {
      hotkeys.bindTo($scope)
        .add({
          combo: self.button2hotkey,
          description: self.button2label,
          callback: function ($event) {
            if (!self.confirmdialogopen) {
              $event.preventDefault();
              self.button2function();
            }
          }
        });
    }
    self.theme = BibiscoPropertiesService.getProperty('theme');
    self.confirmdialogopen = false;
  };

  $rootScope.$on('OPEN_POPUP_BOX', function () {
    self.confirmdialogopen = true;
  });

  $rootScope.$on('CLOSE_POPUP_BOX', function () {
    self.confirmdialogopen = false;
  });
}
