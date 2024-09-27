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
  component('detailcontent', {
    templateUrl: 'components/common/uielements/detail-content/detail-content.html',
    controller: DetailContentController,
    bindings: {
      autosaveenabled: '=',
      characters: '=',
      content: '=',
      disableemptymessage: '<',
      editfunction: '&',
      editmode: '<',
      headersubtitle: '<',
      nextelementlabel: '@',
      nextelementlink: '<',
      nextelementtooltip: '@?',
      previouselementlabel: '@',
      previouselementlink: '<',
      previouselementtooltip: '@?',
      showprojectexplorer: '<',
      todaywords: '=?',
      totalwords: '=?',
      words: '='
    }
  });


function DetailContentController($scope, $rootScope, hotkeys, ImageService) {

  let self = this;

  self.$onInit = function() {

    self.emptyContent = !(self.characters > 0 || ImageService.textContainsImages(self.content));

    if (!self.editmode) {
      hotkeys.bindTo($scope)
        .add({
          combo: ['up'],
          description: 'scrollup',
          callback: function () {
            document.getElementById('richtextviewercontainer').scrollTop -= 100;
          }
        })
        .add({
          combo: ['down'],
          description: 'scrolldown',
          callback: function() {
            document.getElementById('richtextviewercontainer').scrollTop += 100;
          }
        });
    }
  };

  self.dblclickontext = function (event) {
    $rootScope.textSelected = event.target.innerText;
    if ($rootScope.textSelected) {
      $rootScope.textSelected = $rootScope.textSelected.replace(/[\n\r]/g, '');
      $rootScope.textSelected = $rootScope.textSelected.trim();
    }
    self.editfunction();
  };
}
