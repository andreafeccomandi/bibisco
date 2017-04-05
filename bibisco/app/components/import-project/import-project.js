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
component('importproject', {
  templateUrl: 'components/import-project/import-project.html',
  controller: ImportProjectController
});

function ImportProjectController($location, $scope, ProjectService,
  LoggerService) {
  LoggerService.debug('Start ImportProjectController...');
  var self = this;
  self.fileToImport = null;
  self.invalidArchive = false;
  self.alreadyPresent = false;
  self.openConfirm = false;
  self.projectName;

  self.selectFileToImport = function(file) {
    self.fileToImport = file;
    self.invalidArchive = false;
    self.alreadyPresent = false;
    self.openConfirm = false;
    self.projectName = null;
    $scope.$apply();
  }

  self.save = function(isValid) {
    if (!isValid || self.invalidArchive || self.alreadyPresent) {
      return;
    }

    ProjectService.importProjectArchiveFile(self.fileToImport, function(
      result) {

      // is valid archive and the project isn't present in bibisco installation
      if (result.isValidArchive && !result.isAlreadyPresent) {
        ProjectService.import(result.projectId, result.projectName,
          function() {
            $location.path('/project');
            $scope.$apply(); // Why?!? http://stackoverflow.com/questions/11784656/angularjs-location-not-changing-the-path
          });
      } else if (result.isValidArchive && result.isAlreadyPresent) {
        self.invalidArchive = false;
        self.alreadyPresent = true;
        self.openConfirm = true;
        self.projectName = result.projectName;
        $scope.$apply();
      } else {
        self.invalidArchive = true;
        self.alreadyPresent = false;
        self.openConfirm = false;
        self.projectName = null;
        $scope.$apply();
      }

    });
  }

  self.back = function() {
    $location.path('/start');
  }

  LoggerService.debug('End ImportProjectController...');
}
