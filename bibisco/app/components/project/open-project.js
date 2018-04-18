/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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
  component('openproject', {
    templateUrl: 'components/project/open-project.html',
    controller: OpenProjectController
  });

function OpenProjectController($location, $rootScope, ContextMenuService,
  LoggerService, ProjectDbConnectionService, ProjectService) {
  

  // hide menu
  $rootScope.$emit('SHOW_OPEN_PROJECT');

  var self = this;

  self.getProjects = function() {
    return ProjectService.getProjects();
  };

  self.open = function(id) {
    ProjectDbConnectionService.load(id);
    $location.path('/project/projecthome');
    ContextMenuService.create();
    LoggerService.info('Open project ' + id);
  };

  self.delete = function(id) {
    ProjectService.delete(id);
  };

  self.back = function() {
    $location.path('/start');
  };

  
}
