/*
 * Copyright (C) 2014-2020 Andrea Feccomandi
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

angular.module('bibiscoApp').service('ArchitectureService', function(
  CollectionUtilService, LoggerService, ProjectDbConnectionService
) {
  'use strict';

  return {
    getArchitectureItem: function(id) {
      return this.getCollection().findOne({
        type: id
      });
    },
    getCollection: function() {
      return ProjectDbConnectionService.getProjectDb().getCollection(
        'architecture');
    },
    getFabula: function() {
      return this.getCollection().findOne({
        type: 'fabula'
      });
    },
    getPremise: function() {
      return this.getCollection().findOne({
        type: 'premise'
      });
    },
    getSetting: function() {
      return this.getCollection().findOne({
        type: 'setting'
      });
    },
    getGlobalNotes: function () {
      return this.getCollection().findOne({
        type: 'globalnotes'
      });
    },
    update: function(architectureItem) {
      CollectionUtilService.update(this.getCollection(), architectureItem);
    }
  };
});
