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
  component('exportlogs', {
    templateUrl: 'components/export/export-logs.html',
    controller: ExportLogs
  });

function ExportLogs($scope, $timeout, BibiscoDbConnectionService,BibiscoPropertiesService, 
  ContextService, ExportService, FileSystemService, PopupBoxesService, $window) {

  let self = this;

  self.$onInit = function() {

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'jsp.settings.h1',
      href: '/settings'
    });
    self.breadcrumbitems.push({
      label: 'download_logs_title'
    });

    self.saving = false;
    
    self.exportpath = BibiscoPropertiesService.getProperty('exportpath');
    self.exportpathchanged = false;
    self.exportdefaultpath = self.exportpath ? self.exportpath : ContextService.getDownloadsDirectoryPath();

    self.checkExit = {
      active: true
    };
  };

  self.export = function(isValid) {
    if (isValid && !self.forbiddenDirectory) {
      self.checkExit = {
        active: false
      };
      self.saving = true;

      $timeout(function () {
        BibiscoPropertiesService.setProperty('exportpath', self.exportpath);
        BibiscoDbConnectionService.saveDatabase();
        ExportService.exportLogs(self.exportpath, self.exportCallback);
      }, 250);
    }
  },

  self.exportCallback = function() {
    $timeout(function () {
      $window.history.back();
    }, 0);
  },

  self.selectProjectsDirectory = function (directory) {
    self.exportpathchanged = true;
    self.exportpath = directory;
    if (FileSystemService.canWriteDirectory(directory)) {
      self.forbiddenDirectory = false;
    } else {
      self.forbiddenDirectory = true;
    }
    
    $scope.$apply();
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $scope.exportLogs.$dirty || self.exportpathchanged, self.checkExit);
  });
}
