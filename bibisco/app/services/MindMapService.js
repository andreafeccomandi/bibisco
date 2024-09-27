/*
 * Copyright (C) 2014-2024 Andrea Feccomandi
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

angular.module('bibiscoApp').service('MindmapService', function($rootScope,
  CollectionUtilService, LoggerService, ProjectDbConnectionService, RelationsService,
) {
  'use strict';

  return {
    getCollection: function() {
      return ProjectDbConnectionService.getProjectDb().getCollection(
        'mindmaps');
    },
    getMindmap: function(id) {
      return this.getCollection().get(id);
    },
    getMindmapsCount: function() {
      return this.getMindmaps().length;
    },
    getMindmaps: function() {
      return CollectionUtilService.getDataSortedByPosition(this.getCollection());
    },
    insert: function(mindmap) {
      
      let projectdb = ProjectDbConnectionService.getProjectDb();

      // insert element in mindmap collection
      CollectionUtilService.insertWithoutCommit(this.getCollection(), mindmap);

      // create new relationsnodes collection
      let relationsnodesCollectionName = 'relationsnodes_' + mindmap.$loki;
      projectdb.addCollection(relationsnodesCollectionName);
      LoggerService.info('Added collection relationsnodes: ' + relationsnodesCollectionName);

      // create new relationsedges collection
      let relationsedgesCollectionName = 'relationsedges_' + mindmap.$loki;
      projectdb.addCollection(relationsedgesCollectionName);
      LoggerService.info('Added collection relationsedges: ' + relationsedgesCollectionName);
        
      // update mindmap with relationsnodes and relationsedges names
      mindmap.relationnodes = relationsnodesCollectionName;
      mindmap.relationsedges = relationsedgesCollectionName;
      CollectionUtilService.updateWithoutCommit(this.getCollection(), mindmap);

      // save database
      ProjectDbConnectionService.saveDatabase();

      // emit insert event
      $rootScope.$emit('INSERT_ELEMENT', {
        id: mindmap.$loki,
        collection: 'mindmaps'
      });
      return mindmap;
    },
    move: function(sourceId, targetId) {
      CollectionUtilService.move(this.getCollection(), sourceId, targetId);
      // emit move event
      $rootScope.$emit('MOVE_ELEMENT', {
        id: sourceId,
        collection: 'mindmaps'
      });
    },
    remove: function(id) {
      CollectionUtilService.remove(this.getCollection(), id);
      // emit remove event
      $rootScope.$emit('DELETE_ELEMENT', {
        id: id,
        collection: 'mindmaps'
      });
    },
    update: function(mindmap) {
      CollectionUtilService.update(this.getCollection(), mindmap);
      // emit update event
      $rootScope.$emit('UPDATE_ELEMENT', {
        id: mindmap.$loki,
        collection: 'mindmaps'
      });
    }
  };
});
