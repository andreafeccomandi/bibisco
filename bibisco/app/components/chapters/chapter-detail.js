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
angular.
module('bibiscoApp').
component('chapterdetail', {
  templateUrl: 'components/chapters/chapter-detail.html',
  controller: ChapterDetailController
});

function ChapterDetailController($location, $rootScope, $routeParams, $scope,
  ChapterService, LoggerService, SceneService) {
  LoggerService.debug('Start ChapterDetailController...');

  var self = this;

  self.$onInit = function() {

    $rootScope.$emit('SHOW_ELEMENT_DETAIL');

    self.chapter = ChapterService.getChapter($routeParams.id);

    self.title = '#' + self.chapter.position + ' ' + self.chapter.title;

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.nav.li.chapters',
      href: '/project/chapters'
    });
    self.breadcrumbitems.push({
      label: self.title
    });

    self.editmode = false;
    self.showprojectexplorer = true;

    // get chapter reason
    self.chapterreason = ChapterService.getChapterInfo(self.chapter.reason);

    // get chapter notes
    self.chapternotes = ChapterService.getChapterInfo(self.chapter.notes);

    // get scenes
    self.scenescardgriditems = self.getScenesCardGridItems($routeParams.id);
  };

  self.getScenesCardGridItems = function(chapterid) {

    let items = null;
    if (SceneService.getScenesCount(chapterid) > 0) {
      let scenes = SceneService.getScenes(chapterid);
      items = [];
      for (let i = 0; i < scenes.length; i++) {
        items.push({
          characters: scenes[i].characters,
          id: scenes[i].$loki,
          position: scenes[i].position,
          status: scenes[i].status,
          text: scenes[i].title,
          title: '#' + scenes[i].position,
          words: scenes[i].words
        });
      }
    }
    return items;
  }

  self.back = function() {
    $location.path('/project/chapters');
  }

  self.changeStatus = function(status) {
    self.chapter.status = status;
    ChapterService.update(self.chapter);
  }

  self.changeTitle = function() {
    $location.path('/chaptertitle/edit/' + self.chapter.$loki);
  }

  self.createScene = function() {
    $location.path('/chapters/' + self.chapter.$loki + '/newscene');
  }

  self.moveScene = function(draggedObjectId, destinationObjectId) {
    SceneService.move(draggedObjectId, destinationObjectId);
    self.scenescardgriditems = this.getScenesCardGridItems('' + self.chapter.$loki);
    $scope.$apply();
  }

  self.selectChapterInfo = function(id) {
    $location.path('/chapters/' + self.chapter.$loki + '/chapterinfos/' + id);
  }

  self.selectScene = function(id) {
    $location.path('/chapters/' + self.chapter.$loki + '/scenes/' + id);
  }

  self.delete = function() {
    ChapterService.remove(self.chapter.$loki);
    $location.path('/project/chapters');
  }

  self.showimagesfunction = function() {
    alert('Qui si visualizzeranno le immagini per id=' + self.chapter
      .$loki);
  }

  LoggerService.debug('End ChapterDetailController...');
}
