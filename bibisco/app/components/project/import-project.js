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
  component('importproject', {
    templateUrl: 'components/project/import-project.html',
    controller: ImportProjectController
  });

function ImportProjectController($location, $rootScope, $scope, $timeout, 
  $translate, hotkeys, BibiscoPropertiesService, PopupBoxesService, ProjectService) {

  // hide menu
  $rootScope.$emit('SHOW_IMPORT_PROJECT');

  let self = this;
  self.fileToImport = null;
  self.invalidArchive = false;
  self.projectName;
  self.projectId;
  self.backupDirectoryPath = BibiscoPropertiesService.getProperty('backupDirectory');

  self.$onInit = function () {
    hotkeys.bindTo($scope)
      .add({
        combo: ['esc', 'esc'],
        description: 'esc',
        callback: function ($event) {
          $event.preventDefault();
          setTimeout(function () {
            document.getElementById('importProjectBackButton').focus();
            document.getElementById('importProjectBackButton').click();
          }, 0);
        }
      });

    self.checkExit = {
      active: true
    };
  };


  self.selectFileToImport = function(file) {
    self.fileToImport = file;
    self.invalidArchive = false;
    self.projectName = null;
    self.projectId = null;
    $scope.$apply();
  };

  self.confirmImportExistingProject = function() {
    ProjectService.importExistingProject(self.projectId, self.projectName,
      function() {
        $location.path('/projecthome');
      });
  };

  self.save = function(isValid) {
    if (!isValid || self.invalidArchive) {
      return;
    }

    self.checkExit = {
      active: false
    };
    ProjectService.importProjectArchiveFile(self.fileToImport, function(
      result) {

      // is valid archive and the project isn't present in bibisco installation
      if (result.isValidArchive && !result.isAlreadyPresent) {
        ProjectService.import(result.projectId, result.projectName,
          function() {
            $location.path('/projecthome');
            $scope.$apply(); // Why?!? http://stackoverflow.com/questions/11784656/angularjs-location-not-changing-the-path
          });

      // is valid archive and the project is present in bibisco installation
      } else if (result.isValidArchive && result.isAlreadyPresent) {
        self.invalidArchive = false;        
        $scope.$apply();

        self.projectName = result.projectName;
        self.projectId = result.projectId;
        let message = $translate.instant('jsp.closeImportProject.importAlreadyPresent.confirm', { projectName: self.projectName });
        PopupBoxesService.confirm(function () {
          $timeout(function () {
            self.confirmImportExistingProject();
          }, 0);
        },
        message,
        function () {
          self.projectName = null;
          self.projectId = null;
        });

      // is not valid archive
      } else {
        self.invalidArchive = true;
        self.projectName = null;
        self.projectId = null;
        $scope.$apply();
      }

    });
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, self.fileToImport, self.checkExit);
  });
}
