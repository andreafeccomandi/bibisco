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
  component('detailfooter', {
    templateUrl: 'components/common/uielements/detail-footer/detail-footer.html',
    controller: DetailFooterController,
    bindings: {
      actionitems: '<',
      autosaveenabled: '<',
      backfunction: '&',
      characters: '=',
      content: '=',
      hideprojectexplorerbutton: '<',
      imagesenabled: '<',
      editmode: '=',
      lastsave: '<',
      savedcharacters: '=',
      savedcontent: '=',
      savedwords: '=',
      savefunction: '&',
      showimagesfunction: '&',
      showimageslabel: '@',
      showprojectexplorer: '=',
      words: '=',
      wordscharactersenabled: '<'
    }
  });


function DetailFooterController() {}
