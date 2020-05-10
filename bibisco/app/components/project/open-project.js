/*
 * Copyright (C) 2014-2020 Andrea Feccomandi
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

function OpenProjectController($location, $rootScope, $timeout, $translate, ChapterService,
  ContextMenuService, LoggerService, PopupBoxesService, ProjectService) {

  // hide menu
  $rootScope.$emit('SHOW_OPEN_PROJECT');

  var self = this;
  self.$onInit = function () {
    self.confirmdialogopen = false;
    self.hotkeys = ['esc'];
  };

  self.getProjects = function() {
    return ProjectService.getProjects();
  };

  self.open = function(id) {
    ProjectService.load(id);
    $location.path('/projecthome');
    ContextMenuService.create();
    ChapterService.checkWordsWrittenInit();
    LoggerService.info('Open project ' + id);
  };

  self.delete = function (id, projectName) {
    let message = $translate.instant('jsp.selectProject.delete.confirm', { projectName: projectName });
    PopupBoxesService.confirm(function () {
      $timeout(function () {
        ProjectService.delete(id);
      }, 0);
    },
    message,
    function () {

    });
  };

  self.back = function() {
    $location.path('/start');
  };
}
