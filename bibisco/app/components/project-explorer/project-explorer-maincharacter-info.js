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
  component('projectexplorermaincharacterinfo', {
    templateUrl: 'components/project-explorer/project-explorer-maincharacter-info.html',
    controller: ProjectExplorerMainCharacterInfoController,
    bindings: {
      characterid: '<',
      info: '<',
      label: '@',
      type: '<'
    }
  });

function ProjectExplorerMainCharacterInfoController($injector, $location, ImageService) {
  
  let self = this;

  self.$onInit = function() {
    for (let i  = 0; i < self.info.questions.length; i++) {
      self.info.questions[i].text = ImageService.updateAllImageSrcToLocalPath(self.info.questions[i].text);
    }
    if (self.info.freetext) {
      self.info.freetext = ImageService.updateAllImageSrcToLocalPath(self.info.freetext);
    }
    if (self.type === 'custom') {
      let CustomQuestionService = $injector.get('CustomQuestionService');
      self.customQuestions = CustomQuestionService.getCustomQuestions();
    } 
  };

  self.gotoElement = function (path) {
    $location.path(path);
  }; 
}