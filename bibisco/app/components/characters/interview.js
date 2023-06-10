/*
 * Copyright (C) 2014-2023 Andrea Feccomandi
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
  component('interview', {
    templateUrl: 'components/characters/interview.html',
    controller: InterviewController,
    bindings: {
      autosaveenabled: '=',
      characters: '=',
      content: '=',
      editfunction: '&',
      editmode: '=',
      maincharacter: '=',
      nextelementlabel: '@',
      nextelementlink: '<',
      nextelementtooltip: '@?',
      previouselementlabel: '@',
      previouselementlink: '<',
      previouselementtooltip: '@?',
      questionselected: '=',
      showprojectexplorer: '<',
      type: '<',
      words: '='
    }
  });

function InterviewController($location) {

  let self = this;

  self.$onInit = function() {
    
  };

  self.createFirstCustomQuestion = function() {
    $location.path('/maincharacters/'+self.maincharacter.$loki+'/customquestions');
  };
}
