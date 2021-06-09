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
  component('itemaddimage', {
    templateUrl: 'components/objects/object-addimage.html',
    controller: ItemAddImageController
  });

function ItemAddImageController($location, $routeParams, 
  BibiscoPropertiesService, ObjectService, PopupBoxesService) {

  var self = this;

  self.$onInit = function() {

    let object = ObjectService.getObject($routeParams.id);

    // addprofile mode
    self.addprofile = $location.path().includes('addprofile');

    // breadcrumb
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'objects',
      href: '/objects/params/focus=objects_' + object.$loki
    });
    self.breadcrumbitems.push({
      label: object.name,
      href: '/objects/' + object.$loki + '/view'
    });

    if (self.addprofile) {
      self.breadcrumbitems.push({
        label: 'add_profile_image_title'
      });
  
      self.exitpath = '/objects/ ' + object.$loki + '/view';
      self.customtitle = 'add_profile_image_title';
    }
    else {
      self.breadcrumbitems.push({
        label: 'jsp.projectFromScene.select.location.images',
        href: '/objects/' + object.$loki + '/images'
      });
      self.breadcrumbitems.push({
        label: 'jsp.addImageForm.dialog.title'
      });
  
      self.exitpath = '/objects/' + object.$loki + '/images';
      self.customtitle = null;
    }

  };

  self.save = function(name, path) {
    let filename = ObjectService.addImage($routeParams.id, name, path);
    if (self.addprofile) {
      ObjectService.setProfileImage($routeParams.id, filename);
      if (BibiscoPropertiesService.getProperty('addProfileImageTip') === 'true') {
        PopupBoxesService.showTip('addProfileImageTip');
      }
    }
  };
}
