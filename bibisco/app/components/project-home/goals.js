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
  component('goals', {
    templateUrl: 'components/project-home/goals.html',
    controller: GoalsController
  });

function GoalsController($location, $rootScope, $scope, ChapterService, LocaleService, PopupBoxesService, ProjectService) {

  var self = this;

  self.$onInit = function() {

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_project',
      href: '/projecthome'
    });
    self.breadcrumbitems.push({
      label: 'goals_title'
    });

    let projectInfo = ProjectService.getProjectInfo();

    self.wordsGoal = projectInfo.wordsGoal;
    self.wordsPerDayGoal = projectInfo.wordsPerDayGoal;
    
    self.deadlineCalendarOpen = false;
    self.deadline = projectInfo.deadline;
    if (projectInfo.deadline) {
      self.deadline = new Date(projectInfo.deadline);
    }
    moment.locale(LocaleService.getCurrentLocale());

    self.checkExit = {
      active: true
    };
  };

  self.calculateWordsPerDayGoal = function() {
    self.wordsPerDayGoal = 0;
    let wordsWritten = ChapterService.getTotalWordsAndCharacters().words;
    if (self.deadline && self.wordsGoal && (self.wordsGoal > wordsWritten)) {
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      let diff = self.deadline - new Date();
      if (diff>0) {
        let daysLeft = Math.ceil(Math.abs((self.deadline - new Date()) / oneDay));
        if (daysLeft) {
          self.wordsPerDayGoal = Math.ceil(Math.abs((self.wordsGoal-wordsWritten) / daysLeft));
        }
      } 
    }
  };

  self.save = function(isValid) {
    if (isValid) {
      ProjectService.updateGoals({
        wordsGoal: self.wordsGoal ? Number(self.wordsGoal) : null,
        wordsPerDayGoal : self.wordsPerDayGoal ? Number(self.wordsPerDayGoal) : null,
        deadline : self.deadline
      });
  
      self.checkExit = {
        active: false
      };
      $location.path('/projecthome');
    }
  };

  self.onTimeSet = function(newDate) {
    self.deadline = newDate;
    $rootScope.dirty = true;
    self.deadlineCalendarOpen = false;
  };

  self.clearDeadline = function() {
    if (self.deadline) {
      $scope.goalsForm.$dirty = true;
    }
    self.deadline = null;
  };

  self.openCalendar = function($event) {
    $event.stopPropagation();
    setTimeout(function () { 
      document.getElementById('openCalendarBtn').click();
    }, 0);
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $scope.goalsForm.$dirty, self.checkExit);
  });
}
