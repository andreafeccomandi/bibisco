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
  component('wordswrittenhistory', {
    templateUrl: 'components/project-home/history/words-written-history.html',
    controller: WordsWrittenHistoryController
  });

function WordsWrittenHistoryController($location, $timeout, ProjectService) {

  var self = this;

  self.$onInit = function () {
    
    // breadcrumb
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_project',
      href: '/projecthome'
    });
    self.breadcrumbitems.push({
      label: 'goals_history'
    });

    // hotkeys
    self.hotkeys = ['esc'];

    self.loading = true;

    $timeout(function () {
      
      // Words per day goal
      let projectInfo = ProjectService.getProjectInfo();
      self.wordsGoal = projectInfo.wordsGoal;
      self.wordsperdaygoal = projectInfo.wordsPerDayGoal;

      self.loading = false;
    }, 250);
  };

  self.back = function() {
    $location.path('/projecthome');
  };

}