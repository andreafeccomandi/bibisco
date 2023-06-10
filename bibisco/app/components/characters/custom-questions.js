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
  component('customquestions', {
    templateUrl: 'components/characters/custom-questions.html',
    controller: CustomQuestionsController
  });

function CustomQuestionsController($location, $rootScope, $routeParams, $timeout, $translate, $window,
  CustomQuestionService, MainCharacterService, PopupBoxesService) {

  let self = this;
  self.$onInit = function () {

    self.maincharacter = MainCharacterService.getMainCharacter(parseInt($routeParams.id.split('?')[0]));
    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!self.maincharacter) {
      $window.history.back();
      return;
    }

    self.hotkeys = ['ctrl+n', 'command+n'];
    self.customquestions = CustomQuestionService.getCustomQuestions();
   
    // If there are no questions and I don't come from a question creation, I go directly to question creation
    if ((!self.customquestions || self.customquestions.length === 0) 
      && !$rootScope.previousPath.includes('customquestions/new')){
      self.createCustomQuestion();
    }

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_characters',
      href: '/characters'
    });
    self.breadcrumbitems.push({
      label: self.maincharacter.name,
      href: '/maincharacters/' + self.maincharacter.$loki
    });
    self.breadcrumbitems.push({
      label: 'common_custom',
      href: '/maincharacters/' + self.maincharacter.$loki + '/infowithquestion/custom/view'
    });
    self.breadcrumbitems.push({
      label: 'questions',
    });

    
  };

  self.edit = function (id) {
    $location.path('/maincharacters/'+self.maincharacter.$loki+'/customquestions/'+id);
  };

  self.delete = function (id) {
    let message = $translate.instant('custom_question_delete_confirm');
    PopupBoxesService.confirm(function () {
      $timeout(function () {
        CustomQuestionService.remove(id);
        self.customquestions = CustomQuestionService.getCustomQuestions();
      }, 0);
    },
    message,
    function () {
    });
  };

  self.createCustomQuestion = function() {
    $location.path('/maincharacters/'+self.maincharacter.$loki+'/customquestions/new');
  };
}
