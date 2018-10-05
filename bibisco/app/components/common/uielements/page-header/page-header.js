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
      buttonhotkey: '@',
      buttonlabel: '@',
      buttonfunction: '&',
      buttonshow: '<',
      buttonstyle: '@', 
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


function PageHeaderController($scope, hotkeys) {
  var self = this;

  self.$onInit = function () {
    if (!self.buttonstyle) {
      self.buttonstyle = 'primary';
    }

    if (self.buttonhotkey) {
      hotkeys.bindTo($scope)
        .add({
          combo: [self.buttonhotkey, self.buttonhotkey],
          description: self.buttonhotkey,
          callback: function ($event) {
            $event.preventDefault();
            setTimeout(function () {
              document.getElementById('pageHeaderButton').focus();
              document.getElementById('pageHeaderButton').click();
            }, 0);
          }
        });
    }
  };
}
