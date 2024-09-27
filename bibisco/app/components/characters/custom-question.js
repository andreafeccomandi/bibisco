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
  component('customquestion', {
    templateUrl: 'components/characters/custom-question.html',
    controller: CustomQuestionController
  });

function CustomQuestionController($routeParams, $window,  CustomQuestionService, MainCharacterService) {
  let self = this;

  self.$onInit = function() {

    // common breadcrumb root
    self.breadcrumbItems = [];

    self.breadcrumbitems = [];
    self.maincharacter = MainCharacterService.getMainCharacter(parseInt($routeParams.id));
    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!self.maincharacter) {
      $window.history.back();
      return;
    }
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
      href: '/maincharacters/' + self.maincharacter.$loki + '/infowithquestion/custom/default'
    });
    self.breadcrumbitems.push({
      label: 'questions',
      href: '/maincharacters/'+self.maincharacter.$loki+'/customquestions'
    });

    if ($routeParams.questionid !== undefined) {
      let customquestion = CustomQuestionService.getCustomQuestion(parseInt($routeParams.questionid));
      
      // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
      if (!customquestion) {
        $window.history.back();
        return;
      }

      // edit breadcrumb items
      let label = 'custom_question_edit_title';
      self.breadcrumbItems.push({
        label: label
      });

      self.title = customquestion.question;
      self.pageheadertitle = label;
    } else {
    
      // edit breadcrumb items
      let label = 'custom_question_create_title';
      self.breadcrumbItems.push({
        label: label
      });
 
      self.title = '';
      self.pageheadertitle = label;
    }

    self.exitpath = '/maincharacters/'+self.maincharacter.$loki+'/customquestions';
  };

  self.save = function(title) {      
    if ($routeParams.questionid !== undefined) {
      let question = CustomQuestionService.getCustomQuestion(parseInt($routeParams.questionid));
      question.question = title;
      CustomQuestionService.update(question);
    } else {
      CustomQuestionService.insert({
        question: title
      });
    } 
  };
}
