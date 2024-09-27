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
  component('detailfooter', {
    templateUrl: 'components/common/uielements/detail-footer/detail-footer.html',
    controller: DetailFooterController,
    bindings: {
      actionitems: '<',
      autosaveenabled: '<',
      characters: '<',
      content: '<',
      custombuttonenabled: '<',
      custombuttonfunction: '&',
      custombuttonlabel: '@',
      custombuttontooltip: '@',
      editbuttonvisible: '<',
      editfunction: '&',
      editmode: '<',
      eventsenabled: '<',
      imagesenabled: '<',
      lastsave: '<',
      readfunction: '&',
      savefunction: '&',
      showeventsfunction: '&',
      showeventslabel: '@',
      showimagesfunction: '&',
      showimageslabel: '@',
      showprojectexplorer: '=',
      showtagsfunction: '&',
      showtagslabel: '@',
      tagsenabled: '<',
      tipcode: '@',
      tipenabled: '<',
      tipmodalstyle: '@?',
      words: '<',
      wordscharactersenabled: '<'
    }
  });


function DetailFooterController(ImageService) {

  let self = this;

  self.$onInit = function() {
    self.emptyContent = !(self.characters > 0 || ImageService.textContainsImages(self.content));
  };
}
