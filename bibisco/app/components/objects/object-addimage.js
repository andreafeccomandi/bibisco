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
  component('itemaddimage', {
    templateUrl: 'components/objects/object-addimage.html',
    controller: ItemAddImageController
  });

function ItemAddImageController($routeParams, ObjectService) {

  var self = this;

  self.$onInit = function() {

    let object = ObjectService.getObject($routeParams.id);

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
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.select.location.images',
      href: '/objects/' + object.$loki + '/images'
    });
    self.breadcrumbitems.push({
      label: 'jsp.addImageForm.dialog.title'
    });

    self.exitpath = '/objects/' + object.$loki + '/images';
  };

  self.save = function(name, path) {
    ObjectService.addImage($routeParams.id, name, path);
  };
}
