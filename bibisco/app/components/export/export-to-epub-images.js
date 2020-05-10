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
  component('exporttoepubimages', {
    templateUrl: 'components/export/export-to-epub-images.html',
    controller: ExportToEpubImagesController
  });

function ExportToEpubImagesController($location, $routeParams,
  ProjectService) {

  var self = this;

  self.$onInit = function() {
    
    self.backpath = '/exporttoepub';

    // breadcrumb
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_export',
      href: '/export'
    });
    self.breadcrumbitems.push({
      label: 'jsp.export.title.epub',
      href: self.backpath
    });
    self.breadcrumbitems.push({
      label: 'epub_cover_images'
    });

    self.images = ProjectService.getProjectInfo().coverImages;
  };

  self.delete = function(filename) {
    self.images = ProjectService.deleteCoverImage(filename);
  };

  self.insert = function() {
    $location.path('/exporttoepub/images/new');
  };

  self.select = function(filename) {
    self.images = ProjectService.selectCoverImage(filename);
    $location.path(self.backpath);
  };
}
