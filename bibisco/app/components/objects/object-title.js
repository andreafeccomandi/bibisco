/*
 * Copyright (C) 2014-2023 Andrea Feccomandi
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
  component('objecttitle', {
    templateUrl: 'components/objects/object-title.html',
    controller: ObjectTitleController
  });

function ObjectTitleController($routeParams, $window, ObjectService) {
  let self = this;

  self.$onInit = function() {

    // common bradcrumb root
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

    // edit breadcrumb objects
    self.breadcrumbitems.push({
      label: object.name,
      href: '/objects/' + object.$loki + '/view'
    });
    self.breadcrumbitems.push({
      label: 'object_change_name_title'
    });

    self.profileimageenabled = true;
    self.profileimage = object.profileimage;
    self.name = object.name;
    self.pageheadertitle = 'object_change_name_title';
  };

  self.save = function(title) {
    let object = ObjectService.getObject(parseInt($routeParams.id));
    object.name = title;
    ObjectService.update(object);
  };
}
