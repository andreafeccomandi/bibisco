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
  CollectionUtilService, LoggerService, ProjectDbConnectionService) {
  'use strict';

  var collection = ProjectDbConnectionService.getProjectDb().getCollection(
    'scenes');
  var scenerevisionscollection = ProjectDbConnectionService.getProjectDb().getCollection(
    'scene_revisions');

  return {
    changeRevision: function(id, revision) {
      let scene = collection.get(id);
      let scenerevision = this.getSceneRevisionByPosition(id, revision);

      // update scene with revision info
      scene.revisionid = scenerevision.$loki;
      scene.revision = scenerevision.position;
      CollectionUtilService.update(collection, scene);

      return this.getScene(id);
    },

    createRevision: function(id, fromActual) {

      let scene = collection.get(id);
      let actualscenerevision = scenerevisionscollection.get(scene.revisionid);

      // get revision text
      let text;
      if (fromActual) {
        text = actualscenerevision.text;
      } else {
        text = '';
      }

      // insert new revision
      let scenerevision = this.insertRevision(scene.$loki, text);

      // update scene with revision info
      scene.revisionid = scenerevision.$loki;
      scene.revision = scenerevision.position;
      scene.revisioncount = scene.revisioncount + 1;
      CollectionUtilService.updateWithoutCommit(collection, scene);

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
    createRevisionFromActual: function(id) {
      return this.createRevision(id, true);
    },
    createRevisionFromScratch: function(id) {
      return this.createRevision(id, false);
    },

    deleteActualRevision: function(id) {

      let scene = collection.get(id);

      // remove actual revision
      CollectionUtilService.removeWithoutCommit(scenerevisionscollection,
        scene.revisionid, {
          sceneid: {
            '$eq': parseInt(id)
          }
        });

      // get the new revision
      let newrevision = this.getSceneRevisionByPosition(id, (scene.revisioncount -
        1));

      // update scene with revision info
      scene.revisionid = newrevision.$loki;
      scene.revision = newrevision.position;
      scene.revisioncount = scene.revisioncount - 1;
      CollectionUtilService.updateWithoutCommit(collection, scene);

      // save database
      ProjectDbConnectionService.saveDatabase();

      return this.getScene(id);
    },

    getScene: function(id) {
      let scene = collection.get(id);
      let scenerevision = scenerevisionscollection.get(scene.revisionid);
      scene.text = scenerevision.text;
      scene.revision = scenerevision.position;

      return scene;
    },

    getSceneRevisionByPosition: function(sceneid, revisionposition) {
      return scenerevisionscollection.findOne({
        sceneid: parseInt(sceneid),
        position: parseInt(revisionposition)
      });
    },

    getScenesCount: function(chapterid) {
      return collection.count({
        'chapterid': chapterid
      });
    },

    getScenes: function(chapterid) {
      let chapterscenes = CollectionUtilService.getDynamicViewSortedByPosition(
        collection, 'chapterscenes_' + chapterid, {
          chapterid: {
            '$eq': chapterid
          }
        });

      return chapterscenes.data();
    },

    insert: function(scene) {

      // insert scene
      scene.revisioncount = 1;
      scene.revisionid = -1;
      scene = CollectionUtilService.insertWithoutCommit(collection,
        scene, {
          chapterid: {
            '$eq': scene.chapterid
          }
        });

      // insert first revision
      let scenerevision = this.insertRevision(scene.$loki, '');

      // update scene with revision info
      scene.revisionid = scenerevision.$loki;
      scene.revision = scenerevision.position;
      CollectionUtilService.updateWithoutCommit(collection, scene);

      // save database
      ProjectDbConnectionService.saveDatabase();
    },

    insertRevision: function(sceneid, text) {
      return CollectionUtilService.insertWithoutCommit(
        scenerevisionscollection, {
          sceneid: sceneid,
          text: text
        }, {
          sceneid: {
            '$eq': sceneid
          }
        });
    },

    move: function(sourceId, targetId) {
      let chapterid = this.getScene(sourceId).chapterid;
      let chapterscenes = CollectionUtilService.getDynamicViewSortedByPosition(
        collection, 'chapterscenes_' + chapterid, {
          chapterid: {
            '$eq': chapterid
          }
        });
      return CollectionUtilService.move(collection, sourceId,
        targetId,
        chapterscenes, {
          chapterid: {
            '$eq': chapterid
          }
        });
    },

    remove: function(id) {
      CollectionUtilService.remove(collection, id);
    },

    update: function(scene) {

      // remove text property from scene
      let text = scene.text;

      // update scene
      CollectionUtilService.updateWithoutCommit(collection, scene);

      // update scene revision
      let scenerevision = scenerevisionscollection.get(scene.revisionid);
      scenerevision.text = text;
      CollectionUtilService.updateWithoutCommit(
        scenerevisionscollection,
        scenerevision);

      // save database
      ProjectDbConnectionService.saveDatabase();
    }
  }
});
