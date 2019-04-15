/*
 * Copyright (C) 2014-2019 Andrea Feccomandi
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
  component('start', {
    templateUrl: 'components/start/start.html',
    controller: StartController
  });

function StartController($location, $rootScope, ProjectService, SupporterEditionChecker) {
  
  // hide menu
  $rootScope.$emit('SHOW_START');

  var self = this;

  self.projectsPresent = function() {
    return ProjectService.getProjectsCount() > 0;
  };

  self.createProject = function() {
    $location.path('/createproject');
  };

  self.openProject = function() {
    $location.path('/openproject');
  };

  self.importProject = function() {
    $location.path('/importproject');
  };

  self.settings = function() {
    $location.path('/settings');
  };

  self.info = function () {
    $location.path('/info');
  };

  self.createSequel = function() {
    if (!SupporterEditionChecker.check()) {
      SupporterEditionChecker.showSupporterMessage();
    } else {
      $location.path('/createsequel');
    }
  };
}
