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
  component('exporttoepub', {
    templateUrl: 'components/export/export-to-epub.html',
    controller: ExportToEpub
  });

function ExportToEpub($location, $rootScope, $scope, $timeout, 
  EPubExporterService, FileSystemService, ProjectService) {

  var self = this;

  self.$onInit = function() {

    $rootScope.$emit('EXPORT_SELECT_DIRECTORY');
    self.pageheadertitle = 'jsp.export.title.epub';
    
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
    let projectInfo = ProjectService.getProjectInfo();
    self.author = projectInfo.author;
    self.publisher = projectInfo.publisher;
    self.copyright = projectInfo.copyright;
    self.rights = projectInfo.rights;
    self.isbn = projectInfo.isbn;
    self.website = projectInfo.website;
    self.coverImage = ProjectService.getSelectedCoverImageName();

    self.checkExit = {
      active: true
    };
  };

  self.updateEpubMetadata = function() {
    ProjectService.updateEpubMetadata({
      author: self.author,
      publisher: self.publisher,
      copyright: self.copyright,
      rights: self.rights,
      isbn: self.isbn,
      website: self.website
    });
  };

  self.getCoverImageName = function() {
    let coverImage = ProjectService.getProjectInfo().coverImage;

    if (coverImage) {
      return coverImage.name;
    } else {
      return null;
    }
  };

  self.export = function(isValid) {
    if (isValid && !self.forbiddenDirectory) {
      self.checkExit = {
        active: false
      };
      self.saving = true;
      $timeout(function () {
        self.updateEpubMetadata();
        EPubExporterService.export(self.exportpath, self.exportCallback);
      }, 250);
    }
  },

  self.exportCallback = function() {
    $timeout(function () {
      $location.path(self.backpath);
    }, 0);
  };

  self.selectCoverImage = function () {
    self.updateEpubMetadata();
    $location.path('/exporttoepub/images');
  };

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
    //PopupBoxesService.locationChangeConfirm(event, self.exportpath, self.checkExit);
  });
}
