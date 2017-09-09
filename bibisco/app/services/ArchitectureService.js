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

angular.module('bibiscoApp').service('ArchitectureService', function(
  CollectionUtilService, LoggerService, ProjectDbConnectionService
) {
  'use strict';

  var collection = ProjectDbConnectionService.getProjectDb().getCollection(
    'architecture');

  return {
    getArchitectureItem: function(id) {
      return collection.findOne({
        type: id
      });
    },
    getFabula: function(id) {
      return collection.findOne({
        type: 'fabula'
      });
    },
    getPremise: function(id) {
      return collection.findOne({
        type: 'premise'
      });
    },
    getSetting: function() {
      return collection.findOne({
        type: 'setting'
      });
    },
    update: function(architectureItem) {
      CollectionUtilService.update(collection, architectureItem);
    }
  }
});
