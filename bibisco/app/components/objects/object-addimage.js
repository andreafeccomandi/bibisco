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
      label: 'common_items'
    });
    self.breadcrumbitems.push({
      label: object.name
    });
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.select.location.images'
    });
    self.breadcrumbitems.push({
      label: 'jsp.addImageForm.dialog.title'
    });

    self.exitpath = '/objects/' + $routeParams.id + '/images';
  };

  self.save = function(name, path) {
    ObjectService.addImage($routeParams.id, name, path);
  };
}
