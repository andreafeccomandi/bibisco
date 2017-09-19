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

angular.module('bibiscoApp').service('ChapterService', function(
  CollectionUtilService, LoggerService, ProjectDbConnectionService
) {
  'use strict';

  var collection = ProjectDbConnectionService.getProjectDb().getCollection(
    'chapters');
  var dynamicView = CollectionUtilService.getDynamicViewSortedByPosition(
    collection, 'all_chapters');

  return {
    getChapter: function(id) {
      return collection.get(id);
    },
    getChaptersCount: function() {
      return collection.count();
    },
    getChapters: function() {
      return dynamicView.data();
    },
    insert: function(chapter) {
      CollectionUtilService.insert(collection, chapter);
    },
    move: function(sourceId, targetId) {
      return CollectionUtilService.move(collection, sourceId, targetId,
        this.getChapters);
    },
    remove: function(id) {
      CollectionUtilService.remove(collection, id);
    },
    update: function(strand) {
      CollectionUtilService.update(collection, strand);
    }
  }
});
