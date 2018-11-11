/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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
      exitpath: '<',
      savefunction: '&'
    }
  });

function ImagesAddImageController($location, $rootScope, $scope, $timeout, PopupBoxesService) {

  var self = this;

  self.$onInit = function() {

    // hide menu
    $rootScope.$emit('ADD_ELEMENT_IMAGE');

    self.imagename;
    self.imagepath;
    self.checkExitActive = true;
  };

  self.save = function(isValid) {
    if (isValid) {
      self.savefunction({
        name: self.imagename, 
        path: self.imagepath
      });
      self.checkExitActive = false;
      $location.path(self.exitpath);
    }
  };

  self.back = function() {
    $location.path(self.exitpath);
  };

  $scope.$on('$locationChangeStart', function (event) {

    if (self.checkExitActive && $scope.imagesAddImageForm.$dirty) {
      event.preventDefault();
      let wannaGoPath = $location.path();
      self.checkExitActive = false;

      PopupBoxesService.confirm(function () {
        $timeout(function () {
          $location.path(wannaGoPath);
        }, 0);
      },
      'js.common.message.confirmExitWithoutSave',
      function () {
        self.checkExitActive = true;
      });
    }
  });
}
