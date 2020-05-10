/*
 * Copyright (C) 2014-2020 Andrea Feccomandi
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

angular.module('bibiscoApp').service('ChapterService', function (CollectionUtilService,
  LoggerService, ProjectDbConnectionService, ProjectService) {
  'use strict';

  return {

    getChapter: function (id) {
      return this.getCollection().get(id);
    },
    getChaptersCount: function () {
      return this.getCollection().count();
    },
    getChapters: function () {
      return this.getDynamicView().data();
    },
    getTotalWordsAndCharacters: function () {
      let characters = 0;
      let words = 0;
      this.getChapters().forEach(chapter => {
        characters += chapter.characters;
        words += chapter.words;
      });

      return {
        characters: characters,
        words: words
      };
    },

    checkWordsWrittenInit: function() {
      let totalWords = this.getTotalWordsAndCharacters().words;
      let collection = this.getWordswrittenperdayCollection();

      // collection is empty and totalWords > 0: switch to bibisco version 2.2 from previous
      if (collection.count() === 0 && totalWords>0) {
        collection.insert({
          day: 0,
          words: totalWords
        });
        ProjectDbConnectionService.saveDatabase();
        LoggerService.info('Initialized wordswrittenperday collection with ' + totalWords + ' words.');
      }

      // total words is greater than tracked words: insert or update untrackedWords element
      // how is it possible? working at the project using bibisco version 2.2 and previous (maybe from different PC/Mac)
      else {
        let trackedWords = 0;
        for (let index = 0; index < collection.count(); index++) {
          trackedWords += collection.get(index+1).words;
        }
        if (!(totalWords===trackedWords)) {
          let untrackedWords = totalWords - trackedWords;
          let results = collection.find({'day': { '$eq' : 0 }});
          if (results && results.length === 1) {
            let untrackedWordsElement = results[0];
            untrackedWordsElement.words += untrackedWords;
            collection.update(untrackedWordsElement);
          } else {
            collection.insert({
              day: 0,
              words: totalWords
            });
          }
          ProjectDbConnectionService.saveDatabase();
          LoggerService.info('Found ' + untrackedWords + ' untracked words.');
        }
      }
    },

    getWordsWrittenLast30Days : function() {
      
      let last30days = [];
      let collection = this.getWordswrittenperdayCollection();

      let now = moment();
      for (let index = 29; index >= 0; index--) {
        let day = Number(now.clone().subtract(index, 'days').format('YYYYMMDD'));
        let element = collection.findOne({'day': { '$eq' : day }});
        if (!element) {
          element = {
            day: day,
            words: 0
          };
        }
        last30days.push(element);
      }

      return last30days;
    },

    getWordsWrittenMonthAvg : function() {
      
      let monthAvg = [];
      let wordswrittenperday = this.getWordswrittenperdayDynamicView();

      let firstWritingDay = null;
      if (wordswrittenperday.length > 0 && wordswrittenperday[0].day > 0) {
        firstWritingDay = wordswrittenperday[0].day;
      } else if (wordswrittenperday.length > 1 && wordswrittenperday[1].day > 0) {
        firstWritingDay = wordswrittenperday[1].day;
      }
        
      if (firstWritingDay) {
      
        let wordswrittenMonthMap = new Map();
        let wordswrittenMonthAvgMap = new Map();
        
        // Calculate month total words
        for (let index = 0; index < wordswrittenperday.length; index++) {
          let element = wordswrittenperday[index];
          if (element.day === 0) {
            continue;
          }
          let year_month = moment(String(element.day)).format('YYYY-MM');
          let mapElementWords =  wordswrittenMonthMap.get(year_month);
          let words = mapElementWords ? mapElementWords + element.words : element.words;
          wordswrittenMonthMap.set(year_month, words);
        }

        // Calculate month average words
        let now = moment();
        let current_month = now.format('YYYY-MM');
        let days_total_current_month = Number(now.format('D'));
        wordswrittenMonthMap.forEach(function(value, key) {
          let avg = 0;
          // this month
          if (key === current_month) {
            avg = Math.round(value / days_total_current_month + Number.EPSILON);
          } 
          // previous months
          else {
            avg = Math.round(value / moment(key, 'YYYY-MM').daysInMonth() + Number.EPSILON);
          }
          wordswrittenMonthAvgMap.set(key, avg);
        });

        // From map to array 
        let index = moment(String(moment(String(firstWritingDay)).format('YYYYMM')+'01'));
        let nextMonth = moment(String(moment().format('YYYYMM')+'01')).add(1, 'months');
        do {
          let year_month = index.format('YYYY-MM');
          monthAvg.push({
            day: index.format('YYYYMMDD'),
            words: wordswrittenMonthAvgMap.get(year_month) || 0
          });
          index.add(1, 'months');
        } while (nextMonth.isAfter(index));
        
      }

      return monthAvg;
    }, 
    
    getWordsWrittenDayOfWeek : function() {
      
      let dayOfWeek = [];
      let wordswrittenperday = this.getWordswrittenperdayDynamicView();

      // init day of week
      for (let index = 0; index < 7; index++) {
        dayOfWeek[index] = 0;
      }

      wordswrittenperday.forEach(element => {
        if (element.day > 0) {
          let day = moment(String(element.day)).day();
          dayOfWeek[day] += element.words;
        }
      });

      return dayOfWeek;
    },

    getCollection: function () {
      return ProjectDbConnectionService.getProjectDb().getCollection(
        'chapters');
    },
    getDynamicView: function () {
      return CollectionUtilService.getDynamicViewSortedByPosition(
        this.getCollection(), 'all_chapters');
    },
    getSceneCollection: function () {
      return ProjectDbConnectionService.getProjectDb().getCollection('scenes');
    },
    getWordswrittenperdayCollection: function () {
      return ProjectDbConnectionService.getProjectDb().getCollection('wordswrittenperday');
    },
    getWordswrittenperdayDynamicView: function () {
      return CollectionUtilService.getDynamicViewSortedByField(
        this.getWordswrittenperdayCollection(), 'all_wordswrittenperday', 'day').data();
    },
    getAllScenes: function () {
      let collection = ProjectDbConnectionService.getProjectDb().getCollection('scenes');
      let dynamicViewName = 'all_scenes';
      let dynamicView = collection.getDynamicView(dynamicViewName);
      if (!dynamicView) {
        LoggerService.debug('Created ' + dynamicViewName + ' dynamicView');
        dynamicView = collection.addDynamicView(dynamicViewName, {
          sortPriority: 'active'
        });
      } else {
        LoggerService.debug('Loaded ' + dynamicViewName + ' dynamicView');
      }

      return dynamicView.data();
    },
    getAllScenesCount: function () {
      return ProjectDbConnectionService.getProjectDb().getCollection('scenes').count();
    },
    insert: function (chapter) {

      // insert chapter
      chapter.reason = this.createChapterInfo('todo');
      chapter.notes = this.createChapterInfo(null);
      chapter = CollectionUtilService.insertWithoutCommit(this.getCollection(),
        chapter);

      // save database
      ProjectDbConnectionService.saveDatabase();
    },

    createChapterInfo: function (status) {
      return {
        characters: 0,
        lastsave: (new Date()).toJSON(),
        status: status,
        text: '',
        words: 0
      };
    },

    move: function (sourceId, targetId) {
      return CollectionUtilService.move(this.getCollection(), sourceId, targetId,
        this.getDynamicView());
    },

    remove: function (id) {

      // remove all scenes
      let scenes = this.getSceneCollection().find({
        'chapterid': id
      });
      for (let i = 0; i < scenes.length; i++) {
        this.removeSceneWithoutCommit(scenes[i].$loki);
      }

      // remove chapter
      CollectionUtilService.removeWithoutCommit(this.getCollection(), id);

      // save database
      ProjectDbConnectionService.saveDatabase();
    },

    update: function (chapter) {
      this.updateChapterStatusWordsCharactersWithoutCommit(chapter.$loki);
      CollectionUtilService.updateWithoutCommit(this.getCollection(), chapter);

      // save database
      ProjectDbConnectionService.saveDatabase();
    },

    updateChapterStatusWordsCharactersWithoutCommit: function (id) {

      // get chapter
      let chapter = this.getCollection().get(id);

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

      if (totalStatuses === 1) {
        if (totalTodo === 1) {
          chapter.status = 'todo';
        } else {
          chapter.status = 'tocomplete';
        }
      }

      else {
        if (totalTodo === totalStatuses) {
          chapter.status = 'todo';
        } else if (totalDone === totalStatuses) {
          chapter.status = 'done';
        } else {
          chapter.status = 'tocomplete';
        }
      }

      CollectionUtilService.updateWithoutCommit(this.getCollection(), chapter);

      this.updateWordsWrittenTodayWithoutCommit();
    },

    updateWordsWrittenTodayWithoutCommit: function() {
      let today = Number(moment().format('YYYYMMDD'));
      let totalWords = this.getTotalWordsAndCharacters().words;
      let wordswrittenperdayCollection = this.getWordswrittenperdayCollection();

      // calculate words written before today
      let wordsWrittenBeforeToday = 0;
      wordswrittenperdayCollection.find({'day': { '$lt' : today }}).forEach(day => {
        wordsWrittenBeforeToday += day.words;
      });

      // calculate words written today
      let wordsWrittenToday = totalWords - wordsWrittenBeforeToday;

      // insert or update today record
      let todayWordsElement = wordswrittenperdayCollection.findOne({'day': { '$eq' : today }});
      if (todayWordsElement) {
        todayWordsElement.words = wordsWrittenToday;
        wordswrittenperdayCollection.update(todayWordsElement);
      } else {
        wordswrittenperdayCollection.insert({
          day: today,
          words: wordsWrittenToday
        });
      }
    },

    changeSceneRevision: function (id, revision) {

      // update scene
      let scene = this.getSceneCollection().get(id);
      scene.revision = revision;
      scene.characters = scene.revisions[revision].characters;
      scene.words = scene.revisions[revision].words;
      CollectionUtilService.updateWithoutCommit(this.getSceneCollection(), scene);

      // update chapter status
      this.updateChapterStatusWordsCharactersWithoutCommit(scene.chapterid);

      // save database
      ProjectDbConnectionService.saveDatabase();

      return this.getScene(id);
    },

    insertSceneRevision: function (id, fromActual) {

      let scene = this.getSceneCollection().get(id);

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
      CollectionUtilService.updateWithoutCommit(this.getSceneCollection(), scene);

      // update chapter status
      this.updateChapterStatusWordsCharactersWithoutCommit(
        scene.chapterid);

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
    insertSceneRevisionFromActual: function (id) {
      return this.insertSceneRevision(id, true);
    },
    insertSceneRevisionFromScratch: function (id) {
      return this.insertSceneRevision(id, false);
    },

    deleteActualSceneRevision: function (id) {

      let scene = this.getSceneCollection().get(id);

      // remove actual revision
      let revisions = scene.revisions;
      revisions.splice(scene.revision, 1);
      scene.revisions = revisions;

      // update scene with revision info
      scene.revision = scene.revisions.length - 1;
      scene.characters = scene.revisions[scene.revision].characters;
      scene.words = scene.revisions[scene.revision].words;
      CollectionUtilService.updateWithoutCommit(this.getSceneCollection(), scene);

      // update chapter status
      this.updateChapterStatusWordsCharactersWithoutCommit(scene.chapterid);

      // save database
      ProjectDbConnectionService.saveDatabase();

      return this.getScene(id);
    },

    getScene: function (id) {
      return this.getSceneCollection().get(id);
    },

    getScenesCount: function (chapterid) {
      return this.getSceneCollection().count({
        'chapterid': chapterid
      });
    },

    getScenes: function (chapterid) {
      let chapterscenes = CollectionUtilService.getDynamicViewSortedByPosition(
        this.getSceneCollection(), 'chapterscenes_' + chapterid, {
          chapterid: {
            '$eq': chapterid
          }
        });

      return chapterscenes.data();
    },

    insertScene: function (scene) {

      // insert scene
      let revisions = [];
      let scenerevision = this.createSceneRevision();
      revisions.push(scenerevision);
      scene.revision = 0;
      scene.revisions = revisions;
      scene = CollectionUtilService.insertWithoutCommit(this.getSceneCollection(),
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

    createSceneRevision: function (actualscenerevision) {

      let scenerevision;

      if (actualscenerevision !== undefined) {
        scenerevision = {
          characters: actualscenerevision.characters,
          locationid: actualscenerevision.locationid,
          povid: actualscenerevision.povid,
          povcharacterid: actualscenerevision.povcharacterid,
          scenecharacters: actualscenerevision.scenecharacters,
          sceneobjects: actualscenerevision.sceneobjects,
          scenestrands: actualscenerevision.scenestrands,
          text: actualscenerevision.text,
          time: actualscenerevision.time,
          timegregorian: actualscenerevision.timegregorian,
          words: actualscenerevision.words
        };

      } else {
        scenerevision = {
          characters: 0,
          locationid: null,
          povid: null,
          povcharacterid: null,
          scenecharacters: [],
          sceneobjects: [],
          scenestrands: [],
          text: '',
          time: null,
          timegregorian: true,
          words: 0
        };
      }

      return scenerevision;
    },

    moveScene: function (sourceId, targetId) {
      let chapterid = this.getScene(sourceId).chapterid;
      let chapterscenes = CollectionUtilService.getDynamicViewSortedByPosition(
        this.getSceneCollection(), 'chapterscenes_' + chapterid, {
          chapterid: {
            '$eq': chapterid
          }
        });
      return CollectionUtilService.move(this.getSceneCollection(), sourceId,
        targetId,
        chapterscenes, {
          chapterid: {
            '$eq': chapterid
          }
        });
    },

    removeSceneWithoutCommit: function (id) {

      let scene = this.getScene(id);

      // remove scene
      CollectionUtilService.removeWithoutCommit(this.getSceneCollection(), id);

      // update chapter status
      this.updateChapterStatusWordsCharactersWithoutCommit(scene.chapterid);
    },

    removeScene: function (id) {
      this.removeSceneWithoutCommit(id);

      // save database
      ProjectDbConnectionService.saveDatabase();
    },

    updateSceneWithoutCommit: function (scene) {

      // update scene
      scene.characters = scene.revisions[scene.revision].characters;
      scene.words = scene.revisions[scene.revision].words;
      CollectionUtilService.updateWithoutCommit(this.getSceneCollection(), scene);

      // update last scenetime tag
      if (scene.revisions[scene.revision].timegregorian === true) {
        ProjectService.updateLastScenetimeTagWithoutCommit(scene.revisions[scene.revision].time);
      }

      // update chapter status
      this.updateChapterStatusWordsCharactersWithoutCommit(
        scene.chapterid);
    },

    updateScene: function (scene) {

      // update scene
      this.updateSceneWithoutCommit(scene);

      // save database
      ProjectDbConnectionService.saveDatabase();
    },

    updateSceneTitle: function (scene) {
      CollectionUtilService.update(this.getSceneCollection(), scene);
    },

    getLastScenetime: function () {
      return ProjectService.getProjectInfo().lastScenetimeTag;
    },

    moveSceneToAnotherChapter: function (sceneid, chapterid) {

      let maxPosition = this.getScenesCount(chapterid);
      let scene = this.getScene(sceneid);
      let previousChapterid = scene.chapterid;
      let previousPosition = scene.position;
      let previousChapterScenesCount = this.getScenesCount(previousChapterid);

      // update scene
      scene.chapterid = chapterid;
      scene.position = maxPosition + 1;
      this.updateSceneWithoutCommit(scene);

      // shift down previous chapter scenes
      CollectionUtilService.shiftDown(this.getSceneCollection(),
        previousPosition + 1,
        previousChapterScenesCount, {
          'chapterid': previousChapterid
        });

      // update previous chapter status
      this.updateChapterStatusWordsCharactersWithoutCommit(previousChapterid);

      // save database
      ProjectDbConnectionService.saveDatabase();
    }
  };
});

