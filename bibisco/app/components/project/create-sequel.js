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
  component('createsequel', {
    templateUrl: 'components/project/create-sequel.html',
    controller: CreateSequelController
  });

function CreateSequelController($location, $rootScope, $scope,
  ContextMenuService, LoggerService, PopupBoxesService, ProjectService, 
  SequelService) {

  // hide menu
  $rootScope.$emit('SHOW_CREATE_SEQUEL');

  var self = this;

  self.$onInit = function () {
    self.projectName = null;
    self.projectAuthor = null;

    let projects = ProjectService.getProjects();
    self.selectedItem;
    self.selectItems = [];
    for (let i = 0; i < projects.length; i++) {
      let projectItem = {
        key: projects[i].id,
        title: projects[i].name
      };
      self.selectItems.push(projectItem);
    }

    self.checkExit = {
      active: true
    };
    self.backpath = '/start';
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $scope.createSequelForm.$dirty, self.checkExit);
  });

  self.save = function(isValid) {
    if (isValid && !self.hasError()) {
      let sequelProjectId = SequelService.createSequel(self.selectedItem.key, self.projectName);
      ContextMenuService.create();
      self.checkExit = {
        active: false
      };

      LoggerService.info('Open project ' + sequelProjectId);
      $location.path('/projecthome');
    }
  };

  self.hasError = function() {
    return $scope.createSequelForm.$submitted && !self.selectedItem;
  };
}
