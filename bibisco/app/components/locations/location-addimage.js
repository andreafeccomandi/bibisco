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
  component('locationaddimage', {
    templateUrl: 'components/locations/location-addimage.html',
    controller: LocationAddImageController
  });

function LocationAddImageController($location, $routeParams, 
  BibiscoPropertiesService, LocationService, PopupBoxesService) {

  var self = this;

  self.$onInit = function() {

    let location = LocationService.getLocation($routeParams.id);
    let locationName = LocationService.calculateLocationName(location);

    // addprofile mode
    self.addprofile = $location.path().includes('addprofile');

    // breadcrumb
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_locations',
      href: '/locations/params/focus=locations_' + location.$loki
    });
    self.breadcrumbitems.push({
      label: locationName,
      href: '/locations/ ' + location.$loki + '/view'
    });

    if (self.addprofile) {
      self.breadcrumbitems.push({
        label: 'add_profile_image_title'
      });
  
      self.exitpath = '/locations/ ' + location.$loki + '/view';
      self.customtitle = 'add_profile_image_title';
    }
    else {
      self.breadcrumbitems.push({
        label: 'jsp.projectFromScene.select.location.images',
        href: '/locations/ ' + location.$loki + '/images'
      });
      self.breadcrumbitems.push({
        label: 'jsp.addImageForm.dialog.title'
      });
  
      self.exitpath = '/locations/' + $routeParams.id + '/images';
      self.customtitle = null;
    }
  };

  self.save = function(name, path) {
    let filename = LocationService.addImage($routeParams.id, name, path);
    if (self.addprofile) {
      LocationService.setProfileImage($routeParams.id, filename);
      if (BibiscoPropertiesService.getProperty('addProfileImageTip') === 'true') {
        PopupBoxesService.showTip('addProfileImageTip');
      }
    }
  };
}
