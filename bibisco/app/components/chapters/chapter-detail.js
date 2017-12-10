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
  ChapterService, PopupBoxesService) {

  var self = this;

  self.$onInit = function() {

    $rootScope.$emit('SHOW_ELEMENT_DETAIL');

    self.chapter = ChapterService.getChapter($routeParams.id);
    self.title = '#' + self.chapter.position + ' ' + self.chapter.title;

    // breadcrumbs
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.nav.li.chapters',
      href: '/project/chapters'
    });
    self.breadcrumbitems.push({
      label: self.title
    });

    // action items
    self.actionitems = [];
    self.actionitems.push({
      label: 'jsp.chapter.button.updateTitle',
      itemfunction: self.changeTitle
    });
    self.actionitems.push({
      label: 'jsp.common.button.delete',
      itemfunction: function () {
        PopupBoxesService.confirm(self.delete, 'jsp.chapters.delete.confirm');
      }
    });

    // get scenes
    self.scenescardgriditems = self.getScenesCardGridItems(self.chapter.$loki);
  };

  self.getScenesCardGridItems = function(chapterid) {

    let items = null;
    if (ChapterService.getScenesCount(chapterid) > 0) {
      let scenes = ChapterService.getScenes(chapterid);
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
  };

  self.back = function() {
    $location.path('/project/chapters');
  };

  self.changeTitle = function() {
    $location.path('/chapters/' + self.chapter.$loki + '/title');
  };

  self.createScene = function() {
    $location.path('/chapters/' + self.chapter.$loki + '/scenes/new');
  };

  self.moveScene = function(draggedObjectId, destinationObjectId) {
    ChapterService.moveScene(draggedObjectId, destinationObjectId);
    self.scenescardgriditems = this.getScenesCardGridItems(self.chapter.$loki);
    $scope.$apply();
  };

  self.selectChapterInfo = function(type) {
    $location.path('/chapters/' + self.chapter.$loki + '/chapterinfos/' + type);
  };

  self.selectScene = function(id) {
    $location.path('/chapters/' + self.chapter.$loki + '/scenes/' + id);
  };

  self.delete = function() {
    ChapterService.remove(self.chapter.$loki);
    $location.path('/project/chapters');
  };

  self.showimagesfunction = function() {
    alert('Qui si visualizzeranno le immagini per id=' + self.chapter
      .$loki);
  };
}
