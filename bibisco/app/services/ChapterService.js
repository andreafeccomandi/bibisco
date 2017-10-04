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
  CollectionUtilService, LoggerService, ProjectDbConnectionService,
  SceneService
) {
  'use strict';

  var collection = ProjectDbConnectionService.getProjectDb().getCollection(
    'chapters');
  var chapterinfoscollection = ProjectDbConnectionService.getProjectDb().getCollection(
    'chapter_infos');
  var dynamicView = CollectionUtilService.getDynamicViewSortedByPosition(
    collection, 'all_chapters');

  return {

    getChapter: function(id) {
      return collection.get(id);
    },
    getChapterInfo: function(id) {
      return chapterinfoscollection.get(id);
    },
    getChaptersCount: function() {
      return collection.count();
    },
    getChapters: function() {
      return dynamicView.data();
    },
    insert: function(chapter) {

      // insert chapter
      chapter.reason = -1;
      chapter.notes = -1;
      chapter = CollectionUtilService.insertWithoutCommit(collection,
        chapter);

      // insert reason chapter info
      let reason = this.insertChapterInfoWithoutCommit(chapter.$loki,
        'reason');

      // insert notes info
      let notes = this.insertChapterInfoWithoutCommit(chapter.$loki,
        'notes');

      // update notes with null status
      notes.status = null;
      CollectionUtilService.updateWithoutCommit(chapterinfoscollection,
        notes);

      // update chapter with info
      chapter.reason = reason.$loki;
      chapter.notes = notes.$loki;
      CollectionUtilService.updateWithoutCommit(collection, chapter);

      // save database
      ProjectDbConnectionService.saveDatabase();
    },

    insertChapterInfoWithoutCommit: function(chapterid, type) {
      return CollectionUtilService.insertWithoutCommit(
        chapterinfoscollection, {
          chapterid: chapterid,
          type: type,
          text: ''
        }, {
          chapterid: {
            '$eq': chapterid
          }
        });
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
    },

    updateChapterInfo: function(chapterinfo) {

      // update chapter info
      CollectionUtilService.updateWithoutCommit(chapterinfoscollection,
        chapterinfo);

      // update chapter status
      this.updateChapterStatusWordsCharactersWithoutCommit(chapterinfo.chapterid);

      // save database
      ProjectDbConnectionService.saveDatabase();
    },

    updateChapterStatusWordsCharactersWithoutCommit: function(id) {

      // get chapter
      let chapter = collection.get(id);

      // get chapter reason
      let chapterReason = chapterinfoscollection.findOne({
        chapterid: id,
        type: 'reason'
      });

      // get scenes
      let scenes = SceneService.getScenes(id);

      // total statuses: all scenes + reason card
      let totalStatuses = scenes.length + 1;
      let totalTodo = 0;
      let totalDone = 0;

      if (chapterReason.status == 'todo') {
        totalTodo = 1;
      } else if (chapterReason.status == 'done') {
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
        chapter.status = 'todo';
      } else if (totalDone == totalStatuses) {
        chapter.status = 'done';
      } else {
        chapter.status = 'tocomplete';
      }

      CollectionUtilService.updateWithoutCommit(collection, chapter);
    },
  }
});
