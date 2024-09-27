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
  component('projectexplorersimpletext', {
    templateUrl: 'components/project-explorer/project-explorer-simple-text.html',
    controller: ProjectExplorerSimpleTextController,
    bindings: {
      images: '<',
      path: '@',
      sectiontitle: '<',
      text: '<',
      timeline: '<'
    }
  });

function ProjectExplorerSimpleTextController($location, ImageService, WordCharacterCountService) {

  let self = this;

  self.$onInit = function () {
    self.initText();
  };

  self.$onChanges = function () {
    self.initText();
  };

  self.initText = function() {
    let lenght = WordCharacterCountService.count(self.text);
    self.text = ((lenght && lenght.characters > 0) || ImageService.textContainsImages(self.text)) ? 
      ImageService.updateAllImageSrcToLocalPath(self.text) : null;
  };

  self.gotoElement = function() {
    $location.path(self.path);
  };
}