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
  var dynamicView = CollectionUtilService.getDynamicViewSortedByPosition(
    collection, 'all_chapters');
  var scenecollection = ProjectDbConnectionService.getProjectDb().getCollection(
    'scenes');

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

      // insert chapter
      chapter.reason = this.createChapterInfo('todo');
      chapter.notes = this.createChapterInfo(null);
      chapter = CollectionUtilService.insertWithoutCommit(collection,
        chapter);

      // save database
      ProjectDbConnectionService.saveDatabase();
    },

    createChapterInfo: function(status) {
      return {
        characters: 0,
        lastsave: (new Date()).toJSON(),
        status: status,
        text: '',
        words: 0
      };
    },

    move: function(sourceId, targetId) {
      return CollectionUtilService.move(collection, sourceId, targetId,
        dynamicView);
    },

    remove: function(id) {

      // remove all scenes
      let scenes = scenecollection.find({
        'chapterid': id
      });
      for (let i = 0; i < scenes.length; i++) {
        this.removeSceneWithoutCommit(scenes[i].$loki);
      }

      // remove chapter
      CollectionUtilService.removeWithoutCommit(collection, id);

      // save database
      ProjectDbConnectionService.saveDatabase();
    },

    update: function(chapter) {
      CollectionUtilService.update(collection, chapter);
    },

    updateChapterStatusWordsCharactersWithoutCommit: function(id) {

      // get chapter
      let chapter = collection.get(id);

      // get scenes
      let scenes = this.getScenes(id);

      // total statuses: all scenes + reason card
      let totalStatuses = scenes.length + 1;
      let totalTodo = 0;
      let totalDone = 0;
      let words = 0;
      let characters = 0;

      if (chapter.reason.status === 'todo') {
        totalTodo = 1;
      } else if (chapter.reason.status === 'done') {
        totalDone = 1;
      }

      for (let i = 0; i < scenes.length; i++) {
        words = words + scenes[i].words;
        characters = characters + scenes[i].characters;
        if (scenes[i].status === 'todo') {
          totalTodo = totalTodo + 1;
        } else if (scenes[i].status === 'done') {
          totalDone = totalDone + 1;
        }
      }

      chapter.words = words;
      chapter.characters = characters;
      if (totalTodo === totalStatuses) {
        chapter.status = 'todo';
      } else if (totalDone === totalStatuses) {
        chapter.status = 'done';
      } else {
        chapter.status = 'tocomplete';
      }

      CollectionUtilService.updateWithoutCommit(collection, chapter);
    },

    changeSceneRevision: function(id, revision) {
      let scene = scenecollection.get(id);
      scene.revision = revision;
      scene.characters = scene.revisions[revision].characters;
      scene.words = scene.revisions[revision].words;
      CollectionUtilService.update(scenecollection, scene);

      return this.getScene(id);
    },

    insertSceneRevision: function(id, fromActual) {

      let scene = scenecollection.get(id);

      // insert new revision
      let scenerevision;
      let actualscenerevision;
      if (fromActual) {
        actualscenerevision = scene.revisions[scene.revision];
        scenerevision = this.createSceneRevision(actualscenerevision);
      } else {
        scenerevision = this.createSceneRevision();
      }

      // update scene with revision info
      let revisions = scene.revisions;
      revisions.push(scenerevision);
      scene.revisions = revisions;
      scene.revision = revisions.length - 1;
      scene.characters = scenerevision.characters;
      scene.words = scenerevision.words;
      CollectionUtilService.update(scenecollection, scene);

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
    insertSceneRevisionFromActual: function(id) {
      return this.insertSceneRevision(id, true);
    },
    insertSceneRevisionFromScratch: function(id) {
      return this.insertSceneRevision(id, false);
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
      let scenerevision = scene.revisions[scene.revision];

      scene.characters = scenerevision.characters;
      scene.locationid = scenerevision.locationid;
      scene.povid = scenerevision.povid;
      scene.povcharacterid = scenerevision.povcharacterid;
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
      let revisions = [];
      let scenerevision = this.createSceneRevision();
      revisions.push(scenerevision);
      scene.revision = 0;
      scene.revisions = revisions;      
      scene = CollectionUtilService.insertWithoutCommit(scenecollection,
        scene, {
          chapterid: {
            '$eq': scene.chapterid
          }
        });

      // update chapter status
      this.updateChapterStatusWordsCharactersWithoutCommit(scene.chapterid);

      // save database
      ProjectDbConnectionService.saveDatabase();
    },

    createSceneRevision: function(actualscenerevision) {

      let scenerevision;

      if (actualscenerevision !== undefined) {
        scenerevision = {
          characters: 0,
          locationid: actualscenerevision.locationid,
          povid: actualscenerevision.povid,
          povcharacterid: actualscenerevision.povcharacterid,
          scenecharacters: actualscenerevision.scenecharacters,
          scenestrands: actualscenerevision.scenestrands,
          text: actualscenerevision.text,
          time: actualscenerevision.time,
          timegregorian: actualscenerevision.timegregorian,
          words: 0
        };

      } else {
        scenerevision = {
          characters: 0,
          locationid: null,
          povid: null,
          povcharacterid: null,
          scenecharacters: [],
          scenestrands: [],
          text: '',
          time: null,
          timegregorian: true,
          words: 0
        };
      }

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

      let scene = this.getScene(id);

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

      // update chapter status
      this.updateChapterStatusWordsCharactersWithoutCommit(scene.chapterid);
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

      // update scene revision
      let revisions = scene.revisions;
      let scenerevision = {};
      scenerevision.characters = scene.characters;
      scenerevision.locationid = scene.locationid;
      scenerevision.povid = scene.povid;
      scenerevision.povcharacterid = scene.povcharacterid;
      scenerevision.text = scene.text;
      scenerevision.time = scene.time;
      scenerevision.timegregorian = scene.timegregorian;
      scenerevision.words = scene.words;
      revisions[scene.revision] = scenerevision;
      scene.revisions = revisions;
      
      CollectionUtilService.updateWithoutCommit(scenecollection, scene);

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
      };
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

      // update last scenetime tag
      if (scenetags.timegregorian === true) {
        ProjectService.updateLastScenetimeTag(scenetags.time);
      }

      // save database
      ProjectDbConnectionService.saveDatabase();
    },

    getLastScenetime: function() {
      return ProjectService.getProjectInfo().lastScenetimeTag;
    }
  };
});
