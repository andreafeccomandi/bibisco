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

angular.module('bibiscoApp').service('SceneService', function(
  CollectionUtilService, LoggerService, ProjectDbConnectionService
) {
  'use strict';

  var collection = ProjectDbConnectionService.getProjectDb().getCollection(
    'scenes');

  return {
    getScene: function(id) {
      return collection.get(id);
    },
    getScenesCount: function(chapterid) {
      return collection.count({
        'chapterid': chapterid
      });
    },
    getScenes: function(chapterid) {
      let chapterscenes = collection.addDynamicView('chapterscenes_' +
        chapterid);
      chapterscenes.applyFind({
        'chapterid': chapterid
      });
      chapterscenes.applySimpleSort('position');
      return chapterscenes.data();
    },
    insert: function(scene) {
      CollectionUtilService.insert(collection, scene);
    },
    move: function(sourceId, targetId) {
      return CollectionUtilService.move(collection, sourceId, targetId,
        this.getScenes);
    },
    remove: function(id) {
      CollectionUtilService.remove(collection, id);
    },
    update: function(scene) {
      CollectionUtilService.update(collection, scene);
    }
  }
});
