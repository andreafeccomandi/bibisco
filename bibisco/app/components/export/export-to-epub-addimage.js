/*
 * Copyright (C) 2014-2023 Andrea Feccomandi
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
  component('exporttoepubaddimage', {
    templateUrl: 'components/export/export-to-epub-addimage.html',
    controller: ExportToEpubAddImageController
  });

function ExportToEpubAddImageController(ProjectService) {

  var self = this;

  self.$onInit = function() {
    
    // breadcrumb
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_export',
      href: '/export'
    });
    self.breadcrumbitems.push({
      label: 'jsp.export.title.epub',
      href: '/exporttoepub'
    });
    self.breadcrumbitems.push({
      label: 'epub_cover_images',
      href: '/exporttoepub/images'
    });
    self.breadcrumbitems.push({
      label: 'jsp.addImageForm.dialog.title'
    });

  };

  self.save = function(name, path) {
    ProjectService.addCoverImage(name, path);
  };
}
