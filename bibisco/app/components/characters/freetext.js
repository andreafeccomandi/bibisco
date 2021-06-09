/*
 * Copyright (C) 2014-2021 Andrea Feccomandi
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
  component('freetext', {
    templateUrl: 'components/characters/freetext.html',
    controller: FreetextEditorController,
    bindings: {
      autosaveenabled: '=',
      characters: '=',
      content: '=',
      editfunction: '&',
      editmode: '=',
      headersubtitle: '<',
      maincharacter: '=',
      nextelementlabel: '@',
      nextelementlink: '<',
      nextelementtooltip: '@?',
      previouselementlabel: '@',
      previouselementlink: '<',
      previouselementtooltip: '@?',
      showprojectexplorer: '<',
      type: '<',
      words: '='
    }
  });

function FreetextEditorController() {

  var self = this;

  self.$onInit = function () {
    self.content = self.maincharacter[self.type].freetext;
    self.characters = self.maincharacter[self.type].freetextcharacters;
    self.words = self.maincharacter[self.type].freetextwords;
  };
}
