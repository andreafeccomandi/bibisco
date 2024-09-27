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
  component('imagesaddimage', {
    templateUrl: 'components/common/uielements/images/images-addimage.html',
    controller: ImagesAddImageController,
    bindings: {
      breadcrumbitems: '<',
      customtitle: '@',
      savefunction: '&'
    }
  });

function ImagesAddImageController($rootScope, $scope, $window, PopupBoxesService) {

  var self = this;

  self.$onInit = function() {

    // hide menu
    $rootScope.$emit('ADD_ELEMENT_IMAGE');

    self.imagename;
    self.imagepath;
    self.checkExit = {
      active: true
    };

    if (self.customtitle) {
      self.title = self.customtitle;
    } else {
      self.title = 'add_image';
    }
  };

  self.save = function(isValid) {
    if (isValid) {
      self.savefunction({
        name: self.imagename, 
        path: self.imagepath
      });
      self.checkExit = {
        active: false
      };
      $window.history.back();
    }
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $scope.imagesAddImageForm.$dirty, self.checkExit);
  });
}
