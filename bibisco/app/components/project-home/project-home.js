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
component('projecthome', {
  templateUrl: 'components/project-home/project-home.html',
  controller: ProjectHomeController,
  bindings: {

  }
});

function ProjectHomeController($location, $rootScope, ContextMenuService,
  LoggerService, ProjectService) {
  LoggerService.debug('Start ProjectHomeController...');
  var self = this;

  self.project = function() {
    return ProjectService.getProjectInfo();
  }

  self.back = function() {
    $location.path('/start');
    ContextMenuService.destroy();
  }

  LoggerService.debug('End ProjectHomeController...');
}
