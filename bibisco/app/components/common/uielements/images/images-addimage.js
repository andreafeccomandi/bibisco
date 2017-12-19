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
  component('imagesaddimage', {
    templateUrl: 'components/common/uielements/images/images-addimage.html',
    controller: ImagesAddImageController,
    bindings: {
      breadcrumbitems: '<',
      exitpath: '<',
      savefunction: '&'
    }
  });

function ImagesAddImageController($location, $rootScope) {

  var self = this;

  self.$onInit = function() {

    // hide menu
    $rootScope.$emit('ADD_ELEMENT_IMAGE');

    self.imagename;
    self.imagepath;
  };

  self.save = function(isValid) {
    if (isValid) {
      self.savefunction({
        name: self.imagename, 
        path: self.imagepath
      });
      $location.path(self.exitpath);
    }
  };

  self.back = function() {
    $location.path(self.exitpath);
  };
}
