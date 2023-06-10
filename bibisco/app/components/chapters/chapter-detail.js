/*
 * Copyright (C) 2014-2023 Andrea Feccomandi
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
  component('chapterdetail', {
    templateUrl: 'components/chapters/chapter-detail.html',
    controller: ChapterDetailController
  });

function ChapterDetailController($location, $rootScope, $routeParams, $scope, $window,
  ChapterService, hotkeys, PopupBoxesService, SupporterEditionChecker) {

  let self = this;

  self.$onInit = function() {

    self.breadcrumbitems = [];
    
    self.chapter = ChapterService.getChapter(parseInt($routeParams.id.split('?')[0]));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!self.chapter) {
      $window.history.back();
      return;
    }
    
    $rootScope.$emit('SHOW_ELEMENT_DETAIL');
    self.title = ChapterService.getChapterPositionDescription(self.chapter.position) + ' ' + self.chapter.title;        

    // breadcrumbs
    self.breadcrumbitems.push({
      label: 'common_chapters',
      href: 'chapters'
    });
    self.breadcrumbitems.push({
      label: self.title
    });

    // groups
    self.grouptags = [];
    if (SupporterEditionChecker.isSupporterOrTrial()) {
      let groups = ChapterService.getChapterGroups(parseInt(self.chapter.$loki));
      for (let i = 0; i < groups.length; i++) {
        self.grouptags.push({label: groups[i].name, color: groups[i].color});
      }
    }

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

    // hotkeys
    hotkeys.bindTo($scope)
      .add({
        combo: ['ctrl+n', 'command+n'],
        description: 'newscene',
        callback: function () {
          self.createScene();
        }
      })
      .add({
        combo: ['ctrl+o', 'command+o'],
        description: 'readchapter',
        callback: function($event) {
          $event.preventDefault();
          self.showChapterRead();
        }
      });
  };

  self.getScenesCardGridItems = function(chapterid) {

    let items = null;
    if (ChapterService.getScenesCount(chapterid) > 0) {
      let scenes = ChapterService.getScenes(chapterid);
      items = [];
      for (let i = 0; i < scenes.length; i++) {
        let tags = [];
        if (SupporterEditionChecker.isSupporterOrTrial()) {
          let sceneGroups = ChapterService.getSceneGroups(scenes[i].$loki);
          for (let i = 0; i < sceneGroups.length; i++) {
            tags.push({label: sceneGroups[i].name, color: sceneGroups[i].color});
          }
        }

        items.push({
          characters: scenes[i].characters,
          id: scenes[i].$loki,
          noimageicon: 'bookmark-o',
          position: scenes[i].position,
          status: scenes[i].status,
          tags: tags,
          text: scenes[i].title,
          title: '#' + scenes[i].position,
          words: scenes[i].words
        });
      }
    }
    return items;
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
    $location.path('/chapters/' + self.chapter.$loki + '/chapterinfos/' + type + '/view');
  };

  self.selectScene = function(id) {
    $location.path('/chapters/' + self.chapter.$loki + '/scenes/' + id + '/view');
  };

  self.delete = function() {
    ChapterService.remove(self.chapter.$loki);
    $window.history.back();
  };

  self.showChapterRead = function() {
    SupporterEditionChecker.filterAction(function() {
      $location.path('/chapters/read/'+self.chapter.$loki);
    });
  };
}
