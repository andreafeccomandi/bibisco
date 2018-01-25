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

angular.module('bibiscoApp').service('StrandService', function(
  CollectionUtilService, LoggerService, ProjectDbConnectionService
) {
  'use strict';

  return {
    getCollection: function() {
      return ProjectDbConnectionService.getProjectDb().getCollection(
        'strands');
    },
    getDynamicView: function() {
      return CollectionUtilService.getDynamicViewSortedByPosition(
        this.getCollection(), 'all_strands');
    },
    getStrand: function(id) {
      return this.getCollection().get(id);
    },
    getStrandsCount: function() {
      return this.getCollection().count();
    },
    getStrands: function() {
      return this.getDynamicView().data();
    },
    insert: function(strand) {
      CollectionUtilService.insert(this.getCollection(), strand);
    },
    move: function(sourceId, targetId) {
      return CollectionUtilService.move(this.getCollection(), sourceId, targetId,
        this.getDynamicView());
    },
    remove: function(id) {
      CollectionUtilService.remove(this.getCollection(), id);
    },
    update: function(strand) {
      CollectionUtilService.update(this.getCollection(), strand);
    }
  };
});
