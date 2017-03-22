/*
 * Copyright (C) 2014-2017 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.gnu.org/licenses/gpl-2.0.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY.
 * See the GNU General Public License for more details.
 *
 */
angular.
module('bibiscoApp').
component('openproject', {
  templateUrl: 'components/open-project/open-project.html',
  controller: OpenProjectController
});

function OpenProjectController($location, LocaleService, ProjectService,
  LoggerService) {
  LoggerService.debug('Start OpenProjectController...');
  var self = this;

  self.getProjects = function() {
    return ProjectService.getProjects();
  }

  self.open = function(id) {
    ProjectService.load(id);
    $location.path('/project');
  }

  self.delete = function(id) {
    alert('id=' + id);
  }

  self.back = function() {
    $location.path('/start');
  }

  LoggerService.debug('End OpenProjectController...');
}
