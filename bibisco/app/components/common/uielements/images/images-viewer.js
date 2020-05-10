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
  component('imagesviewer', {
    templateUrl: 'components/common/uielements/images/images-viewer.html',
    controller: ImagesViewerController,
    bindings: {
      backpath: '<',
      breadcrumbitems: '<',
      deletefunction: '&',
      images: '<',
      insertbuttonstyle: '@',
      insertfunction: '&',
      lastsave: '<',
      pageheadertitle: '@',
      pageheadercustomtitle: '<',
      selectfunction: '&',
      showselectbutton: '<'
    }
  });

function ImagesViewerController($rootScope, $translate, ImageService) {

  var self = this;

  self.$onInit = function() {

    // hide menu
    $rootScope.$emit('SHOW_ELEMENT_IMAGES');

    if (!self.insertbuttonstyle) {
      self.insertbuttonstyle = 'primary';
    }

    self.title;
    if (self.pageheadercustomtitle) {
      self.title = $translate.instant(self.pageheadertitle);
    } else {
      self.title = $translate.instant('jsp.carouselImage.dialog.title') + ' ' + self.pageheadertitle;
    }

    // hotkeys
    self.hotkeys = ['ctrl+n', 'command+n'];
  };

  self.fullpath = function(filename) {
    return ImageService.getImageFullPath(filename);
  };
}
