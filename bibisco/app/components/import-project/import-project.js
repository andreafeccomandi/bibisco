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
  self.checkArchiveResult;

  self.selectFileToImport = function(file) {
    self.fileToImport = file;
    $scope.$apply();
  }

  self.save = function() {
    ProjectService.importProjectArchiveFile(self.fileToImport, function(
      result) {

      // is valid archive and the project isn't present in bibisco installation
      if (result.isValidArchive && !result.isAlreadyPresent) {
        ProjectService.import(result.projectId, result.projectName);
        $location.path('/project');
        $scope.$apply();
      } else {
        alert(JSON.stringify(result));
        self.checkArchiveResult = result;
      }

    });
  }

  self.back = function() {
    $location.path('/start');
  }

  LoggerService.debug('End ImportProjectController...');
}
