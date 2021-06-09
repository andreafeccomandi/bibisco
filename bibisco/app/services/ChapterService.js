/*
 * Copyright (C) 2014-2021 Andrea Feccomandi
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

    PROLOGUE_POSITION: -1,
    EPILOGUE_POSITION: -2,
    getChapter: function (id) {
      return this.getCollection().get(id);
    },
    getChapterByPosition(position) {
      let chapters = this.getCollection().data;
      for (let i = 0; i < chapters.length; i++) {
        if (chapters[i].position === position) {
          return chapters[i];
        }
      }
    },
    getChaptersCount: function () {
      return this.getDynamicView().count();
    },
    getChapters: function () {
      return this.getDynamicView().data();
    },
    getChaptersWithPrologueAndEpilogue: function () {
      let result = [];
      
      // prologue
      let prologue = this.getPrologue();
      if (prologue) {
        result.push(prologue);
      }

      // chapters
      let chapters = this.getChapters();
      for (let i = 0; i < chapters.length; i++) {
        result.push(chapters[i]);
      }

      // epilogue
      let epilogue = this.getEpilogue();
      if (epilogue) {
        result.push(epilogue);
      }

      return result;
    },
    getChapterPositionDescription: function(position) {
      if (position > 0) {
        return '#' + position;
      } else if (position === this.PROLOGUE_POSITION) {
        return '#P';
      } else if (position === this.EPILOGUE_POSITION) {
        return '#E';
      }
    },
    getTotalWordsAndCharacters: function () {
      let characters = 0;
      let words = 0;
      
      this.getChaptersWithPrologueAndEpilogue().forEach(chapter => {
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
              words: untrackedWords
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
    getScenesCollection: function () {
      return ProjectDbConnectionService.getProjectDb().getCollection('scenes');
    },
    getWordswrittenperdayCollection: function () {
      return ProjectDbConnectionService.getProjectDb().getCollection('wordswrittenperday');
    },
    getWordswrittenperdayDynamicView: function () {
      return CollectionUtilService.getDynamicViewSortedByField(
        this.getWordswrittenperdayCollection(), 'all_wordswrittenperday', 'day').data();
    },
    getPartsCount: function () {
      return this.getPartsDynamicView().count();
    },
    getPartsCollection: function () {
      return ProjectDbConnectionService.getProjectDb().getCollection('parts');
    },
    getPartsDynamicView: function () {
      return CollectionUtilService.getDynamicViewSortedByPosition(this.getPartsCollection(), 'all_parts');
    },
    getPart: function (id) {
      return this.getPartsCollection().get(id);
    },
    getPartByPosition: function(position) {
      let result = null;
      if (this.getPartsCount() > 0) {
        let parts = this.getParts();
        for (let i = 0; i < parts.length; i++) {
          if (parts[i].position === position) {
            result = parts[i];
            break;
          }
        }
      } 
      return result;
    },
    getParts: function () {
      return this.getPartsDynamicView().data();
    },
    insertPart: function (part) {
      let chaptersincluded = 0;
      if (this.getPartsCount() === 0) {
        chaptersincluded = this.getChaptersCount();
      } 
      part.chaptersincluded = chaptersincluded;
      CollectionUtilService.insert(this.getPartsCollection(), part);
    },
    updatePart: function (part) {
      CollectionUtilService.update(this.getPartsCollection(), part);
    },
    removePart: function (id) {

      // move chapter to landing part
      if (this.getPartsCount() > 1) {
        let parttoremove = this.getPart(id);
        let landingpart;
        if (parttoremove.position === 1) {
          landingpart = this.getPartByPosition(2);
        } else {
          landingpart = this.getPartByPosition(parttoremove.position - 1);
        }
        landingpart.chaptersincluded += parttoremove.chaptersincluded;
    
        CollectionUtilService.updateWithoutCommit(this.getPartsCollection(), landingpart);
      }

      // remove part
      CollectionUtilService.removeWithoutCommit(this.getPartsCollection(), id);

      // save database
      ProjectDbConnectionService.saveDatabase();
    },
    getAllScenes: function () {
      return this.getAllScenesDynamicView().data();
    },
    getAllScenesCount: function () {
      return this.getAllScenesDynamicView().count();
    },
    getAllScenesDynamicView: function () {
      let dynamicViewName = 'all_scenes';
      let dynamicView = this.getScenesCollection().getDynamicView(dynamicViewName);
      if (!dynamicView) {
        LoggerService.debug('Created ' + dynamicViewName + ' dynamicView');
        dynamicView = this.getScenesCollection().addDynamicView(dynamicViewName);
        // get only positions greater than zero; we use negative position for special records
        dynamicView.applyFind({'position': {'$gt': 0}});

        // save database
        ProjectDbConnectionService.saveDatabase();
      } else {
        LoggerService.debug('Loaded ' + dynamicViewName + ' dynamicView');
      }

      return dynamicView;
    },
    insert: function (chapter, partId) {

      // insert chapter
      this.executeInsert(chapter);

      // add chapter to part if specified
      if (partId) {
        let part = this.getPart(partId);
        part.chaptersincluded += 1;
        CollectionUtilService.updateWithoutCommit(this.getPartsCollection(), part); 

        // update chapter position based on part
        let partLastChapterPosition = this.getPartLastChapterPosition(partId);
        let chapterTargetId = this.getChapterByPosition(partLastChapterPosition).$loki;
        // a new chapter is always inserted in the last position
        let chapterSourceId  = this.getChapterByPosition(this.getChaptersCount()).$loki; 
        CollectionUtilService.moveWithoutCommit(this.getCollection(), chapterSourceId, chapterTargetId,
          this.getDynamicView());
      }

      // save database
      ProjectDbConnectionService.saveDatabase();
    },

    insertPrologue: function (chapter) {

      // insert chapter
      this.executeInsert(chapter);

      // set position 
      chapter.position = this.PROLOGUE_POSITION;

      // update chapter
      CollectionUtilService.updateWithoutCommit(this.getCollection(), chapter);

      // save database
      ProjectDbConnectionService.saveDatabase();
    },

    insertEpilogue: function (chapter) {

      // insert chapter
      this.executeInsert(chapter);

      // set position 
      chapter.position = this.EPILOGUE_POSITION;

      // update chapter
      CollectionUtilService.updateWithoutCommit(this.getCollection(), chapter);

      // save database
      ProjectDbConnectionService.saveDatabase();
    },

    getPrologue: function() {
      return this.getChapterByPosition(this.PROLOGUE_POSITION);
    },

    getEpilogue: function() {
      return this.getChapterByPosition(this.EPILOGUE_POSITION);
    },

    executeInsert: function (chapter) {
      chapter.reason = this.createChapterInfo('todo');
      chapter.notes = this.createChapterInfo(null);
      chapter = CollectionUtilService.insertWithoutCommit(this.getCollection(), chapter);
    },

    getPartLastChapterPosition: function(partId) {
      let position = 0;
      let parts = this.getParts();
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        position += part.chaptersincluded;
        if (part.$loki === partId) {
          break;
        }
      }
      return position;
    },

    getPartByChapterPosition: function(position) {
      
      let part = null;
      let parts = this.getParts();
      let start = 0;
      let end = 0;

      for (let i = 0; i < parts.length; i++) {
        end += parts[i].chaptersincluded;
        if (position > start && position <= end) {
          part = parts[i];
          break;
        }
        start = end;
      }

      return part;
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

      let result;

      // move chapter to another part
      if (this.getPartsCount() > 1) {
        let sourceChapter = this.getChapter(sourceId);
        let targetChapter = this.getChapter(targetId);
        let sourcePart = this.getPartByChapterPosition(sourceChapter.position);
        let targetPart = this.getPartByChapterPosition(targetChapter.position);
        if (sourcePart.$loki !== targetPart.$loki) {
          sourcePart.chaptersincluded -= 1;
          targetPart.chaptersincluded += 1;
          CollectionUtilService.updateWithoutCommit(this.getPartsCollection(), sourcePart); 
          CollectionUtilService.updateWithoutCommit(this.getPartsCollection(), targetPart); 
        }
      }

      // move chapter
      result =  CollectionUtilService.moveWithoutCommit(this.getCollection(), sourceId, targetId,
        this.getDynamicView());

      // save database
      ProjectDbConnectionService.saveDatabase();

      return result;
    },

    moveToPart: function (chapterId, partId) {
      let sourceChapter = this.getChapter(chapterId);
      let sourcePart = this.getPartByChapterPosition(sourceChapter.position);
      let targetPart = this.getPart(partId);

      if (sourcePart.$loki !== targetPart.$loki) {
        sourcePart.chaptersincluded -= 1;
        targetPart.chaptersincluded += 1;
        CollectionUtilService.updateWithoutCommit(this.getPartsCollection(), sourcePart); 
        CollectionUtilService.updateWithoutCommit(this.getPartsCollection(), targetPart); 

        // update chapter position based on part
        let partLastChapterPosition = this.getPartLastChapterPosition(partId);
        let chapterTargetId = this.getChapterByPosition(partLastChapterPosition).$loki;
        CollectionUtilService.moveWithoutCommit(this.getCollection(), chapterId, chapterTargetId,
          this.getDynamicView());

        // save database
        ProjectDbConnectionService.saveDatabase();
      }
    },

    remove: function (id) {

      let chapter = this.getChapter(id);

      // if chapter is not prologue or epilogue update part if specified 
      if (this.getPartsCount() > 0) {
        let part = this.getPartByChapterPosition(chapter.position);
        if (part) {
          part.chaptersincluded -= 1;
          CollectionUtilService.updateWithoutCommit(this.getPartsCollection(), part);
        }
      }
      
      // remove all scenes
      let scenes = this.getScenesCollection().find({
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
      let scene = this.getScenesCollection().get(id);
      scene.revision = revision;
      scene.characters = scene.revisions[revision].characters;
      scene.words = scene.revisions[revision].words;
      CollectionUtilService.updateWithoutCommit(this.getScenesCollection(), scene);

      // update chapter status
      this.updateChapterStatusWordsCharactersWithoutCommit(scene.chapterid);

      // save database
      ProjectDbConnectionService.saveDatabase();

      return this.getScene(id);
    },

    insertSceneRevision: function (id, fromActual) {

      let scene = this.getScenesCollection().get(id);

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
      CollectionUtilService.updateWithoutCommit(this.getScenesCollection(), scene);

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

      let scene = this.getScenesCollection().get(id);

      // remove actual revision
      let revisions = scene.revisions;
      revisions.splice(scene.revision, 1);
      scene.revisions = revisions;

      // update scene with revision info
      scene.revision = scene.revisions.length - 1;
      scene.characters = scene.revisions[scene.revision].characters;
      scene.words = scene.revisions[scene.revision].words;
      CollectionUtilService.updateWithoutCommit(this.getScenesCollection(), scene);

      // update chapter status
      this.updateChapterStatusWordsCharactersWithoutCommit(scene.chapterid);

      // save database
      ProjectDbConnectionService.saveDatabase();

      return this.getScene(id);
    },

    getScene: function (id) {
      return this.getScenesCollection().get(id);
    },

    getScenesCount: function (chapterid) {
      return this.getChapterScenesDynamicView(chapterid).count();
    },

    getScenes: function (chapterid) {
      return this.getChapterScenesDynamicView(chapterid).data();
    },

    getChapterScenesDynamicView:  function (chapterid) {
      return CollectionUtilService.getDynamicViewSortedByPosition(
        this.getScenesCollection(), 'chapterscenes_' + chapterid, {
          chapterid: {
            '$eq': chapterid
          }
        });
    },

    insertScene: function (scene) {

      // insert scene
      let revisions = [];
      let scenerevision = this.createSceneRevision();
      revisions.push(scenerevision);
      scene.revision = 0;
      scene.revisions = revisions;
      scene = CollectionUtilService.insertWithoutCommit(this.getScenesCollection(),
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
        this.getScenesCollection(), 'chapterscenes_' + chapterid, {
          chapterid: {
            '$eq': chapterid
          }
        });
      return CollectionUtilService.move(this.getScenesCollection(), sourceId,
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
      CollectionUtilService.removeWithoutCommit(this.getScenesCollection(), id);

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
      CollectionUtilService.updateWithoutCommit(this.getScenesCollection(), scene);

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
      CollectionUtilService.update(this.getScenesCollection(), scene);
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
      CollectionUtilService.shiftDown(this.getScenesCollection(),
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

