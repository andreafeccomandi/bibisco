/*
 * Copyright (C) 2014-2021 Andrea Feccomandi
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
  component('projectexplorerimages', {
    templateUrl: 'components/project-explorer/project-explorer-images.html',
    controller: ProjectExplorerImagesController,
    bindings: {
      images: '<'
    }
  });

function ProjectExplorerImagesController(ImageService) {

  var self = this;

  self.$onInit = function () {
  };

  self.fullpath = function (filename) {
    return ImageService.getImageFullPath(filename);
  };
}