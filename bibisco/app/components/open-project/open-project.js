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

function OpenProjectController($location, $rootScope, ContextMenuService,
  LoggerService, ProjectDbConnectionService, ProjectService) {
  LoggerService.debug('Start OpenProjectController...');

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

  LoggerService.debug('End OpenProjectController...');
}
