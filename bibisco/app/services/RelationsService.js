/*
 * Copyright (C) 2014-2024 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * This program is distributed in the hope that it willapp be useful,
 * but WITHOUT ANY WARRANTY.
 * See the GNU General Public License for more details.
 *
 */

angular.module('bibiscoApp').service('RelationsService', function(
  LoggerService, ProjectDbConnectionService) {
  'use strict';

  return {

    getRelationsEdges: function (relationsedgesCollectionName) {
      return ProjectDbConnectionService.getProjectDb().getCollection(relationsedgesCollectionName).data;
    },

    getRelationsNodes: function (relationsnodesCollectionName) {
      return ProjectDbConnectionService.getProjectDb().getCollection(relationsnodesCollectionName).data;
    },

    updateRelations: function (relationsnodesCollectionName, relationsnodes, relationsedgesCollectionName, relationsedges) {

      // delete relationsnodes
      this.deleteRelationsCollection(relationsnodesCollectionName);

      // delete relationsedges
      this.deleteRelationsCollection(relationsedgesCollectionName);

      // update relationsnodes
      this.insertRelationsCollection(relationsnodesCollectionName, relationsnodes);

      // update relationsedges
      this.insertRelationsCollection(relationsedgesCollectionName, relationsedges);

      // save project database
      ProjectDbConnectionService.saveDatabase();
    },

    insertRelationsCollection: function (collectionName, elements) {
      let collection = ProjectDbConnectionService.getProjectDb().getCollection(collectionName);
      if (elements && elements.length > 0) {
        for (let i = 0; i < elements.length; i++) {
          delete elements[i]['$loki'];
          collection.insert(elements[i]);
          LoggerService.info('Insert element with $loki=' + elements[i].$loki + ' in ' + collectionName);
        }
      }
    },

    deleteRelationsCollection: function (collectionName) {
      let collection = ProjectDbConnectionService.getProjectDb().getCollection(collectionName);
      collection.clear();
      LoggerService.info('Cleared ' + collectionName);
    }
  };
});