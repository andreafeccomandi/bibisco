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
  component('pageheader', {
    templateUrl: 'components/common/uielements/page-header/page-header.html',
    controller: PageHeaderController,
    bindings: {
      buttonhotkey: '<',
      buttonlabel: '@',
      buttonfunction: '&',
      buttonshow: '<',
      buttonstyle: '@', 
      buttontooltip: '@',
      characters: '<',
      dropdownitems: '<',
      dropdownopen: '@',
      headertitle: '@',
      headersubtitle: '@',
      taskstatus: '<',
      taskstatuschangefunction: '&',
      taskstatusreadonly: '<',
      taskstatusshow: '<',
      tipcode: '@',
      tipenabled: '<',
      words: '<'
    }
  });


function PageHeaderController($rootScope, $scope, hotkeys, UuidService) {
  var self = this;

  self.$onInit = function () {
    self.buttonid = UuidService.generateUuid();
    
    if (!self.buttonstyle) {
      self.buttonstyle = 'primary';
    }

    if (self.buttonhotkey) {
      hotkeys.bindTo($scope)
        .add({
          combo: self.buttonhotkey,
          description: self.buttonlabel,
          callback: function ($event) {
            if (!self.confirmdialogopen) {
              $event.preventDefault();
              setTimeout(function () {
                document.getElementById(self.buttonid).focus();
                document.getElementById(self.buttonid).click();
              }, 0);
            }
          }
        });
    }
    self.confirmdialogopen = false;
  };

  $rootScope.$on('OPEN_POPUP_BOX', function () {
    self.confirmdialogopen = true;
  });

  $rootScope.$on('CLOSE_POPUP_BOX', function () {
    self.confirmdialogopen = false;
  });
}
