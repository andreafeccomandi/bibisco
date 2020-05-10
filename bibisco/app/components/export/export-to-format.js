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
  component('exporttoformat', {
    templateUrl: 'components/export/export-to-format.html',
    controller: ExportToFormat
  });

function ExportToFormat($location, $routeParams, $rootScope, $scope, $timeout, 
  ExportService, FileSystemService, PopupBoxesService, ProjectService) {

  var self = this;

  self.$onInit = function() {

    $rootScope.$emit('EXPORT_SELECT_DIRECTORY');

    self.exportAuthor;
    if ($routeParams.format === 'pdf') {
      self.pageheadertitle = 'jsp.export.title.pdf';
      self.exportAuthor = true;
    } else if ($routeParams.format === 'docx') {
      self.pageheadertitle = 'jsp.export.title.word';
      self.exportAuthor = true;
    } else if ($routeParams.format === 'txt') {
      self.pageheadertitle = 'jsp.export.title.txt';
      self.exportAuthor = true;
    } else if ($routeParams.format === 'archive') {
      self.pageheadertitle = 'jsp.export.title.archive';
      self.exportAuthor = false;
    }
    self.backpath = '/export';
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_export',
      href: self.backpath
    });
    self.breadcrumbitems.push({
      label: self.pageheadertitle
    });

    self.saving = false;
    self.exportpath;
    if (self.exportAuthor) {
      self.author = ProjectService.getProjectInfo().author;
    }

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
        if (self.exportAuthor) {
          ProjectService.updateProjectAuthor(self.author);
        }
        if ($routeParams.format === 'pdf') {
          ExportService.exportPdf(self.exportpath, self.exportCallback);
        } else if ($routeParams.format === 'docx') {
          ExportService.exportWord(self.exportpath, self.exportCallback);
        } else if ($routeParams.format === 'txt') {
          ExportService.exportTxt(self.exportpath, self.exportCallback);
        } else if ($routeParams.format === 'archive') {
          ExportService.exportArchive(self.exportpath, self.exportCallback);
        }
      }, 250);
    }
  },

  self.exportCallback = function() {
    $timeout(function () {
      $location.path(self.backpath);
    }, 0);
  },

  self.selectProjectsDirectory = function (directory) {
    self.exportpath = directory;
    if (FileSystemService.canWriteDirectory(directory)) {
      self.forbiddenDirectory = false;
    } else {
      self.forbiddenDirectory = true;
    }
    
    $scope.$apply();
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, self.exportpath, self.checkExit);
  });
}
