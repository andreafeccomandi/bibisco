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

angular.module('bibiscoApp').service('LocationService', function(
  CollectionUtilService, ImageService, LoggerService, ProjectDbConnectionService
) {
  'use strict';

  return {
    addImage: function(id, name, path) {
      let filename = ImageService.addImageToProject(path);
      LoggerService.info('Added image file: ' + filename + ' for element with $loki='
        + id + ' in locations');
      
      let location = this.getLocation(id);
      let images = location.images;
      images.push({
        name: name,
        filename: filename
      });
      location.images = images;
      CollectionUtilService.update(this.getCollection(), location);
    },
    calculateLocationName: function(location) {

      if(!location) {
        return '';
      }

      let useComma = false;
      let name = location.location;

      if (location.nation) {
        name = name + ' (' + location.nation;
        useComma = true;
      }
      if (location.state) {
        if (useComma) {
          name = name + ', ';
        } else {
          name = name + ' (';
        }
        name = name + location.state;
        useComma = true;
      }
      if (location.city) {
        if (useComma) {
          name = name + ', ';
        } else {
          name = name + ' (';
        }
        name = name + location.city;
      }

      if (useComma) {
        name = name + ')';
      }

      return name;
    },
    deleteImage: function(id, filename) {

      // delete image file
      ImageService.deleteImage(filename);
      LoggerService.info('Deleted image file: ' + filename + ' for element with $loki=' 
      + id + ' in locations');

      // delete reference
      let location = this.getLocation(id);
      let images = location.images;
      let imageToRemovePosition;
      for (let i = 0; i < images.length; i++) {
        if (images[i].filename === filename) {
          imageToRemovePosition = i;
          break;
        }
      }
      images.splice(imageToRemovePosition, 1);
      location.images = images;
      CollectionUtilService.update(this.getCollection(), location);

      return location;
    },
    getCities: function() {
      return this.getCollection().addDynamicView('cities').applySimpleSort(
        'city');
    },
    getCollection: function() {
      return ProjectDbConnectionService.getProjectDb().getCollection(
        'locations');
    },
    getDynamicView: function() {
      return CollectionUtilService.getDynamicViewSortedByPosition(
        this.getCollection(), 'all_locations');
    },
    getLocation: function(id) {
      if (id) {
        return this.getCollection().get(id);
      } else {
        return null;
      }
    },
    getLocationsCount: function() {
      return this.getCollection().count();
    },
    getLocations: function() {
      return this.getDynamicView().data();
    },
    getNations: function() {
      return this.getCollection().addDynamicView('nations').applySimpleSort(
        'nation');
    },
    getStates: function() {
      return this.getCollection().addDynamicView('states').applySimpleSort(
        'state');
    },
    getUsedCities: function() {
      let usedcities = [];
      if (this.getLocationsCount() > 0) {
        let set = new Set();
        let locations = this.getCities().data();
        for (let i = 0; i < locations.length; i++) {
          set.add(locations[i].city);
        }
        for (let item of set.values()) {
          usedcities.push(item);
        }
      }
      return usedcities;
    },
    getUsedNations: function() {
      let usednations = [];
      if (this.getLocationsCount() > 0) {
        let set = new Set();
        let locations = this.getNations().data();
        for (let i = 0; i < locations.length; i++) {
          set.add(locations[i].nation);
        }
        for (let item of set.values()) {
          usednations.push(item);
        }
      }
      return usednations;
    },
    getUsedStates: function() {
      let usedstates = [];
      if (this.getLocationsCount() > 0) {
        let set = new Set();
        let locations = this.getStates().data();
        for (let i = 0; i < locations.length; i++) {
          set.add(locations[i].state);
        }
        for (let item of set.values()) {
          usedstates.push(item);
        }
      }
      return usedstates;
    },
    insert: function(location) {
      let images = [];
      location.images = images;
      CollectionUtilService.insert(this.getCollection(), location);
    },
    move: function(sourceId, targetId) {
      return CollectionUtilService.move(this.getCollection(), sourceId, targetId,
        this.getDynamicView());
    },
    remove: function(id) {
      
      // delete images file
      let location = this.getLocation(id);
      let images = location.images;
      for (let i = 0; i < images.length; i++) {
        ImageService.deleteImage(images[i].filename);
      }

      // delete location
      CollectionUtilService.remove(this.getCollection(), id);
    },
    update: function(location) {
      CollectionUtilService.update(this.getCollection(), location);
    },
  };
});
