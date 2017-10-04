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
    calculateChapterStatus: function(reasonStatus, scenes) {

      // total statuses: all scenes + reason card
      let totalStatuses = scenes.length + 1;
      let totalTodo = 0;
      let totalDone = 0;

      if (reasonStatus == 'todo') {
        totalTodo = 1;
      } else if (reasonStatus == 'done') {
        totalDone = 1;
      }

      for (let i = 0; i < scenes.length; i++) {
        if (scenes[i].status == 'todo') {
          totalTodo = totalTodo + 1;
        } else if (scenes[i].status == 'done') {
          totalDone = totalDone + 1;
        }
      }

      if (totalTodo == totalStatuses) {
        return 'todo';
      } else if (totalDone == totalStatuses) {
        return 'done';
      } else {
        return 'tocomplete';
      }

    },
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
        dynamicView);
    },
    remove: function(id) {
      CollectionUtilService.remove(collection, id);
    },
    update: function(chapter) {
      CollectionUtilService.update(collection, chapter);
    }
  }
});
