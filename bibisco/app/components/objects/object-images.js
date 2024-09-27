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
  component('itemimages', {
    templateUrl: 'components/objects/object-images.html',
    controller: ItemImagesController
  });

function ItemImagesController($location, $routeParams, $window, ObjectService) {

  var self = this;

  self.$onInit = function() {
    
    self.breadcrumbitems = [];
    let object = ObjectService.getObject(parseInt($routeParams.id));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!object) {
      $window.history.back();
      return;
    }

    self.breadcrumbitems.push({
      label: 'objects',
      href: '/objects'
    });
    self.breadcrumbitems.push({
      label: object.name,
      href: '/objects/' + object.$loki + '/default'
    });
    self.breadcrumbitems.push({
      label: 'common_images'
    });

    self.images = object.images;
    self.selectedimage = object.profileimage;
    self.lastsave = object.lastsave;
    self.pageheadertitle = object.name;
  };

  self.delete = function(filename) {
    let object = ObjectService.deleteImage(parseInt($routeParams.id), filename);
    self.images = object.images;
    self.selectedimage = object.profileimage;
  };

  self.insert = function() {
    $location.path('/objects/' + $routeParams.id + '/images/new');
  };

  self.select = function(filename) {
    ObjectService.setProfileImage(parseInt($routeParams.id), filename);
    self.selectedimage = filename;
  };
}
