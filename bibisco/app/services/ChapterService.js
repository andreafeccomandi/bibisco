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
  ProjectService) {
  'use strict';

  var collection = ProjectDbConnectionService.getProjectDb().getCollection(
    'chapters');
  var chapterinfoscollection = ProjectDbConnectionService.getProjectDb().getCollection(
    'chapter_infos');
  var dynamicView = CollectionUtilService.getDynamicViewSortedByPosition(
    collection, 'all_chapters');
  var scenecollection = ProjectDbConnectionService.getProjectDb().getCollection(
    'scenes');
  var scenerevisionscollection = ProjectDbConnectionService.getProjectDb().getCollection(
    'scene_revisions');
  var scenerevisioncharacterscollection = ProjectDbConnectionService.getProjectDb()
    .getCollection('scene_revision_characters');
  var scenerevisionstrandscollection = ProjectDbConnectionService.getProjectDb()
    .getCollection('scene_revision_strands');


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

      // remove chapter
      CollectionUtilService.removeWithoutCommit(collection, id);

      // remove all scenes
      //let scenes = this.getScenes(id);
      let scenes = scenecollection.find({
        'chapterid': id
      });
      for (let i = 0; i < scenes.length; i++) {
        this.removeSceneWithoutCommit(scenes[i].$loki);
      }

      // save database
      ProjectDbConnectionService.saveDatabase();
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
      let chapterReason = this.getChapterInfo(chapter.reason);

      // get scenes
      let scenes = this.getScenes(id);

      // total statuses: all scenes + reason card
      let totalStatuses = scenes.length + 1;
      let totalTodo = 0;
      let totalDone = 0;
      let words = 0;
      let characters = 0;

      if (chapterReason.status == 'todo') {
        totalTodo = 1;
      } else if (chapterReason.status == 'done') {
        totalDone = 1;
      }

      for (let i = 0; i < scenes.length; i++) {
        words = words + scenes[i].words;
        characters = characters + scenes[i].characters;
        if (scenes[i].status == 'todo') {
          totalTodo = totalTodo + 1;
        } else if (scenes[i].status == 'done') {
          totalDone = totalDone + 1;
        }
      }

      chapter.words = words;
      chapter.characters = characters;
      if (totalTodo == totalStatuses) {
        chapter.status = 'todo';
      } else if (totalDone == totalStatuses) {
        chapter.status = 'done';
      } else {
        chapter.status = 'tocomplete';
      }

      CollectionUtilService.updateWithoutCommit(collection, chapter);
    },

    changeSceneRevision: function(id, revision) {
      let scene = scenecollection.get(id);
      let scenerevision = this.getSceneRevisionByPosition(id, revision);

      // update scene with revision info
      scene.revisionid = scenerevision.$loki;
      scene.revision = scenerevision.position;
      CollectionUtilService.update(scenecollection, scene);

      return this.getScene(id);
    },

    createSceneRevision: function(id, fromActual) {

      let scene = scenecollection.get(id);

      // insert new revision
      let scenerevision;
      let actualscenerevision;
      if (fromActual) {
        actualscenerevision = scenerevisionscollection.get(scene.revisionid);
        scenerevision = this.insertSceneRevision(scene.$loki,
          actualscenerevision);
      } else {
        scenerevision = this.insertSceneRevision(scene.$loki);
      }

      // update scene with revision info
      scene.revisionid = scenerevision.$loki;
      scene.revision = scenerevision.position;
      scene.revisioncount = scene.revisioncount + 1;
      CollectionUtilService.updateWithoutCommit(scenecollection, scene);

      // save database
      ProjectDbConnectionService.saveDatabase();

      if (fromActual) {
        LoggerService.info('Created revision ' + scene.revision +
          ' from revision ' + actualscenerevision.position +
          ' for scene with id=' + scene.$loki
        );
      } else {
        LoggerService.info('Created revision ' + scene.revision +
          ' from scratch for scene with id=' + scene.$loki
        );
      }

      return this.getScene(id);
    },
    createSceneRevisionFromActual: function(id) {
      return this.createSceneRevision(id, true);
    },
    createSceneRevisionFromScratch: function(id) {
      return this.createSceneRevision(id, false);
    },

    removeSceneRevisionWithoutCommit: function(sceneid, revisionid) {

      // remove scene revision
      CollectionUtilService.removeWithoutCommit(scenerevisionscollection,
        revisionid, {
          sceneid: {
            '$eq': sceneid
          }
        });

      // remove scene characters tags
      this.removeSceneCharactersWithoutCommit(revisionid);

      // remove scene strands
      this.removeSceneStrandsWithoutCommit(revisionid);
    },

    deleteActualSceneRevision: function(id) {

      let scene = scenecollection.get(id);

      // remove actual revision
      this.removeSceneRevisionWithoutCommit(parseInt(id), scene.revisionid);

      // get the new revision
      let newrevision = this.getSceneRevisionByPosition(id, (scene.revisioncount -
        1));

      // update scene with revision info
      scene.revisionid = newrevision.$loki;
      scene.revision = newrevision.position;
      scene.revisioncount = scene.revisioncount - 1;
      CollectionUtilService.updateWithoutCommit(scenecollection, scene);

      // save database
      ProjectDbConnectionService.saveDatabase();

      return this.getScene(id);
    },

    getScene: function(id) {
      let scene = scenecollection.get(id);
      let scenerevision = scenerevisionscollection.get(scene.revisionid);

      scene.characters = scenerevision.characters;
      scene.lastsave = scenerevision.lastsave;
      scene.locationid = scenerevision.locationid;
      scene.povid = scenerevision.povid;
      scene.povcharacterid = scenerevision.povcharacterid;
      scene.revision = scenerevision.position;
      scene.text = scenerevision.text;
      scene.time = scenerevision.time;
      scene.timegregorian = scenerevision.timegregorian;
      scene.words = scenerevision.words;

      return scene;
    },

    getSceneRevisionByPosition: function(sceneid, revisionposition) {
      return scenerevisionscollection.findOne({
        sceneid: parseInt(sceneid),
        position: parseInt(revisionposition)
      });
    },

    getScenesCount: function(chapterid) {
      return scenecollection.count({
        'chapterid': chapterid
      });
    },

    getScenes: function(chapterid) {
      let chapterscenes = CollectionUtilService.getDynamicViewSortedByPosition(
        scenecollection, 'chapterscenes_' + chapterid, {
          chapterid: {
            '$eq': chapterid
          }
        });

      return chapterscenes.data();
    },

    insertScene: function(scene) {

      // insert scene
      scene.revisioncount = 1;
      scene.revisionid = -1;
      scene = CollectionUtilService.insertWithoutCommit(scenecollection,
        scene, {
          chapterid: {
            '$eq': scene.chapterid
          }
        });

      // insert first revision
      let scenerevision = this.insertSceneRevision(scene.$loki);

      // update scene with revision info
      scene.revisionid = scenerevision.$loki;
      scene.revision = scenerevision.position;
      CollectionUtilService.updateWithoutCommit(scenecollection, scene);

      // save database
      ProjectDbConnectionService.saveDatabase();
    },

    insertSceneRevision: function(sceneid, actualscenerevision) {

      let scenerevision;
      let scenecharacters;
      let scenestrands;

      if (actualscenerevision != null) {
        scenerevision = {
          sceneid: sceneid,
          text: actualscenerevision.text,
          locationid: actualscenerevision.locationid,
          povid: actualscenerevision.povid,
          povcharacterid: actualscenerevision.povcharacterid,
          time: actualscenerevision.time,
          timegregorian: actualscenerevision.timegregorian
        };
        scenecharacters = this.getSceneCharacters(actualscenerevision.$loki)
          .characters;
        scenestrands = this.getSceneStrands(actualscenerevision.$loki).strands;
      } else {
        scenerevision = {
          sceneid: sceneid,
          text: '',
          locationid: null,
          povid: null,
          povcharacterid: null,
          time: null,
          timegregorian: true
        };
        scenecharacters = [];
        scenestrands = [];
      }

      // insert scene revision
      scenerevision = CollectionUtilService.insertWithoutCommit(
        scenerevisionscollection, scenerevision, {
          sceneid: {
            '$eq': sceneid
          }
        });

      // insert characters tags
      scenerevisioncharacterscollection.insert({
        id: scenerevision.$loki,
        characters: scenecharacters
      });

      // insert strand tags
      scenerevisionstrandscollection.insert({
        id: scenerevision.$loki,
        strands: scenestrands
      });

      return scenerevision;
    },

    moveScene: function(sourceId, targetId) {
      let chapterid = this.getScene(sourceId).chapterid;
      let chapterscenes = CollectionUtilService.getDynamicViewSortedByPosition(
        scenecollection, 'chapterscenes_' + chapterid, {
          chapterid: {
            '$eq': chapterid
          }
        });
      return CollectionUtilService.move(scenecollection, sourceId,
        targetId,
        chapterscenes, {
          chapterid: {
            '$eq': chapterid
          }
        });
    },

    removeSceneWithoutCommit: function(id) {

      // remove scene
      CollectionUtilService.removeWithoutCommit(scenecollection, id);

      // remove all scene revisions
      let scenerevisions = scenerevisionscollection.find({
        sceneid: {
          '$eq': id
        }
      });
      for (let i = 0; i < scenerevisions.length; i++) {
        this.removeSceneRevisionWithoutCommit(id, scenerevisions[i].$loki);
      }
    },

    removeScene: function(id) {
      this.removeSceneWithoutCommit(id);

      // save database
      ProjectDbConnectionService.saveDatabase();
    },

    updateScene: function(scene) {
      this.updateSceneWithoutCommit(scene);

      // save database
      ProjectDbConnectionService.saveDatabase();
    },

    updateSceneWithoutCommit: function(scene) {

      // update scene
      CollectionUtilService.updateWithoutCommit(scenecollection, scene);

      // update scene revision
      let scenerevision = scenerevisionscollection.get(scene.revisionid);
      scenerevision.characters = scene.characters;
      scenerevision.lastsave = scene.lastsave;
      scenerevision.locationid = scene.locationid;
      scenerevision.povid = scene.povid;
      scenerevision.povcharacterid = scene.povcharacterid;
      scenerevision.text = scene.text;
      scenerevision.time = scene.time;
      scenerevision.timegregorian = scene.timegregorian;
      scenerevision.words = scene.words;

      CollectionUtilService.updateWithoutCommit(
        scenerevisionscollection, scenerevision);

      // update chapter status
      this.updateChapterStatusWordsCharactersWithoutCommit(
        scene.chapterid);
    },

    updateSceneTitle: function(scene) {
      CollectionUtilService.update(scenecollection, scene);
    },

    removeSceneCharactersWithoutCommit: function(scenerevisionid) {
      scenerevisioncharacterscollection.findAndRemove({
        id: {
          '$eq': scenerevisionid
        }
      });
      LoggerService.info('Removed elements with id=' + scenerevisionid +
        ' from ' + scenerevisioncharacterscollection.name);
    },

    removeSceneStrandsWithoutCommit: function(scenerevisionid) {
      scenerevisionstrandscollection.findAndRemove({
        id: {
          '$eq': scenerevisionid
        }
      });
      LoggerService.info('Removed elements with id=' + scenerevisionid +
        ' from ' + scenerevisionstrandscollection.name);
    },

    getSceneCharacters: function(scenerevisionid) {
      return scenerevisioncharacterscollection.findOne({
        id: {
          '$eq': scenerevisionid
        }
      });
    },

    getSceneStrands: function(scenerevisionid) {
      return scenerevisionstrandscollection.findOne({
        id: {
          '$eq': scenerevisionid
        }
      });
    },

    getSceneTags: function(sceneid) {

      let scene = scenecollection.get(sceneid);
      let scenecharacters = this.getSceneCharacters(scene.revisionid);
      let scenestrands = this.getSceneStrands(scene.revisionid);

      return {
        sceneid: sceneid,
        characters: scenecharacters.characters,
        locationid: scene.locationid,
        povid: scene.povid,
        povcharacterid: scene.povcharacterid,
        strands: scenestrands.strands,
        time: scene.time,
        timegregorian: scene.timegregorian
      }
    },

    updateSceneTags: function(scenetags) {

      // get scene
      let scene = scenecollection.get(scenetags.sceneid);

      // update location, pov and time tags
      scene.locationid = scenetags.locationid;
      scene.povid = scenetags.povid;
      scene.povcharacterid = scenetags.povcharacterid;
      scene.time = scenetags.time;
      scene.timegregorian = scenetags.timegregorian;
      this.updateSceneWithoutCommit(scene);

      // remove previous scene characters tags
      this.removeSceneCharactersWithoutCommit(scene.revisionid);

      // insert selected characters tags
      scenerevisioncharacterscollection.insert({
        id: scene.revisionid,
        characters: scenetags.characters
      });

      // remove previous scene strand tag
      this.removeSceneStrandsWithoutCommit(scene.revisionid);

      // insert selected strands tags
      scenerevisionstrandscollection.insert({
        id: scene.revisionid,
        strands: scenetags.strands
      });

      // update last scentime tag
      if (scenetags.timegregorian == true) {
        ProjectService.updateLastScenetimeTag(scenetags.time);
      }

      // save database
      ProjectDbConnectionService.saveDatabase();
    },

    getLastScenetime: function() {
      return ProjectService.getProjectInfo().lastScenetimeTag;
    }
  }
});
