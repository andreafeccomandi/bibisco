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
angular.
  module('bibiscoApp').
  component('chaptersread', {
    templateUrl: 'components/chapters/chapters-read.html',
    controller: ChaptersReadController
  });

function ChaptersReadController($location, $rootScope, $routeParams, $scope, $timeout, $translate, 
  hotkeys, ChapterService, FullScreenService, ProjectService, WordCharacterCountService) {
  
  let self = this;
  const ipc = require('electron').ipcRenderer;


  self.$onInit = function () {

    self.readnovelcontainer = document.getElementById('readnovelcontainer');
    let chapter = ChapterService.getChapter(parseInt($routeParams.chapterid));
    
    // If I come fron scene's creation it means that I created it from the reading page, 
    // so I go to the corresponding chapter
    if ($rootScope.previousPath.includes('/scenes/new')) {
      $location.path('/chapters/' + chapter.$loki);
    }

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_chapters',
      href: 'chapters'
    });
    self.breadcrumbitems.push({
      label: ChapterService.getChapterPositionDescription(chapter.position) + ' ' + chapter.title,
      href: '/chapters/' + chapter.$loki
    });
    self.breadcrumbitems.push({
      label: 'read_title'
    });

    self.projectname = ProjectService.getProjectInfo().name;
    self.chapterToRead = self.prepareChapterToRead(chapter);

    self.selectedChapter = {
      id: self.chapterToRead.id,
      title: self.chapterToRead.title
    };

    self.chaptersToSelect = [];
    let partsPresent = ChapterService.getPartsCount() > 0;
    let chapters = ChapterService.getChaptersWithPrologueAndEpilogue();
    for (let i = 0; i < chapters.length; i++) {
      let chapterItem = {
        id: chapters[i].$loki,
        title: ChapterService.getChapterPositionDescription(chapters[i].position) + ' ' +
          chapters[i].title
      };
     
      if (partsPresent) {
        switch (chapters[i].position) {
        case ChapterService.PROLOGUE_POSITION:
          chapterItem.part = $translate.instant('prologue');
          break;
        case ChapterService.EPILOGUE_POSITION:
          chapterItem.part = $translate.instant('epilogue');
          break;
        default:
          chapterItem.part = ChapterService.getPartByChapterPosition(chapters[i].position).title;
          break;
        }
      }
      self.chaptersToSelect.push(chapterItem);

      hotkeys.bindTo($scope)
        .add({
          combo: ['f11', 'command+l'],
          description: 'fullscreen',
          allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
          callback: function () {
            self.fullscreen();
          }
        })
        .add({
          combo: ['up'],
          description: 'scrollup',
          callback: function () {
            self.readnovelcontainer.scrollTop -= 100;
          }
        })
        .add({
          combo: ['down'],
          description: 'scrolldown',
          callback: function() {
            self.readnovelcontainer.scrollTop += 100;
          }
        });
    }

    $timeout(function () {
      if (self.chapterToRead.id === $rootScope.readNovelDblClickChapterId) {
        let readnovelcontainer = document.getElementById('readnovelcontainer');
        readnovelcontainer.scrollTop = 
                self.readnovelcontainer.scrollTop + $rootScope.readNovelDblClickOffsetY;
      }
      $rootScope.readNovelDblClickOffsetY = 0;
      $rootScope.readNovelDblClickChapterId = null;
    });
  };

  self.prepareChapterToRead = function(chapter) {

    let text = '';
    let chapterToReadScenes = [];

    let scenes = ChapterService.getScenes(chapter.$loki);
    for (let i = 0; i < scenes.length; i++) {          
      text += scenes[i].revisions[scenes[i].revision].text;
      chapterToReadScenes.push({
        id: scenes[i].$loki,
        text: scenes[i].revisions[scenes[i].revision].text
      });
    }

    let previousChapter; 
    let nextChapter;
    let chaptersCount = ChapterService.getChaptersCount();
    if (chapter.position === ChapterService.PROLOGUE_POSITION) {
      previousChapter = null;
      nextChapter = ChapterService.getChapterByPosition(1);
    } else if (chapter.position === ChapterService.EPILOGUE_POSITION) {
      previousChapter = ChapterService.getChapterByPosition(chaptersCount);
      nextChapter = null;
    } else if (chapter.position === 1) {
      previousChapter = ChapterService.getPrologue();
      nextChapter = ChapterService.getChapterByPosition(chapter.position+1);
    } else if (chapter.position === chaptersCount) {
      previousChapter = ChapterService.getChapterByPosition(chapter.position-1);
      nextChapter = ChapterService.getEpilogue();
    } else {
      previousChapter = ChapterService.getChapterByPosition(chapter.position-1);
      nextChapter = ChapterService.getChapterByPosition(chapter.position+1);
    }

    let chapterToRead = {
      id: chapter.$loki,
      title: ChapterService.getChapterPositionDescription(chapter.position) + ' ' + chapter.title,
      scenes: chapterToReadScenes,
      length: WordCharacterCountService.count(text),
      previouslabel: previousChapter ? ChapterService.getChapterPositionDescription(previousChapter.position)
        + ' ' + previousChapter.title : null,
      previouslink: previousChapter ? '/chapters/read/'+previousChapter.$loki : null,
      nextlabel: nextChapter ? ChapterService.getChapterPositionDescription(nextChapter.position)
        + ' ' + nextChapter.title : null,
      nextlink: nextChapter ? '/chapters/read/'+nextChapter.$loki : null,
    };

    return chapterToRead;
  };

  self.selectChapter = function() {
    $location.path('/chapters/read/'+self.selectedChapter.id);
  };

  self.dblclickontext = function (event, id) {
    $rootScope.readNovelDblClickOffsetY = event.target.offsetTop - 175;
    $rootScope.readNovelDblClickChapterId = self.chapterToRead.id;
    $rootScope.textSelected  = event.target.innerText;
    if ($rootScope.textSelected) {
      $rootScope.textSelected = $rootScope.textSelected.replace(/[\n\r]/g, '');
      $rootScope.textSelected = $rootScope.textSelected.trim();
    }
    $location.path('/chapters/'+self.chapterToRead.id+'/scenes/'+id+'/edit');

    if ($rootScope.fullscreen) {
      $rootScope.fullscreen = false;
      if (!$rootScope.previouslyFullscreen) {
        ipc.send('exitFullScreen');
      }
    }
  };

  self.showChaptersProject = function() {
    $location.path('/chapters');
  };

  self.createFirstScene = function() {
    $location.path('/chapters/read/' + self.chapterToRead.id + '/scenes/new');
  };

  self.editFirstScene = function () {
    $location.path('/chapters/' + self.chapterToRead.id + '/scenes/'+self.chapterToRead.scenes[0].id+'/edit');
  };
 
  self.fullscreen = function() {
    FullScreenService.fullScreen();
  };
}
