/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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
  component('chapterselect', {
    templateUrl: 'components/chapters/chapter-select.html',
    controller: ChapterSelectController
  });

function ChapterSelectController($location, $rootScope, $routeParams, $scope, 
  $timeout, ChapterService, PopupBoxesService) {
  var self = this;

  self.$onInit = function() {
    $rootScope.$emit('MOVE_SCENE_SELECT_CHAPTER');
    
    self.chapterid = $routeParams.chapterid;
    self.sourceChapter = ChapterService.getChapter($routeParams.chapterid);
    self.scene = ChapterService.getScene($routeParams.sceneid);

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_chapters',
      href: '/chapters/params/focus=chapters_' + self.sourceChapter.$loki
    });

    self.breadcrumbitems.push({
      label: '#' + self.sourceChapter.position + ' ' + self.sourceChapter.title,
      href: '/chapters/' + self.sourceChapter.$loki + '/params/focus=scenes_' + self.scene.$loki
    });

    self.breadcrumbitems.push({
      label: self.scene.title,
      href: '/chapters/' + self.sourceChapter.$loki + '/scenes/' + self.scene.$loki + '/view'
    });

    self.breadcrumbitems.push({
      label: 'jsp.scene.button.moveSceneToAnotherChapter.title'
    });

    let chapters = ChapterService.getChapters();
    self.selectedItem;
    self.selectItems = [];
    for (let i = 0; i < chapters.length; i++) {
      let chapterItem = {
        key: chapters[i].$loki,
        title: '#' + chapters[i].position + ' ' + chapters[i].title
      };
      self.selectItems.push(chapterItem);
      if (self.sourceChapter.$loki === chapters[i].$loki) {
        self.selectedItem = chapterItem;
      }
    }

    self.checkExitActive = true;
  };

  self.selectChapter = function() {

  };

  self.save = function(isValid) {
    if (isValid) {
      if (self.selectedItem.key !== self.sourceChapter.$loki) {
        ChapterService.moveSceneToAnotherChapter(self.scene.$loki, self.selectedItem.key);
      } 
      $location.path('/chapters/' + self.selectedItem.key);
      self.checkExitActive = false;
    }
  };

  self.back = function() {
    $location.path('/chapters/' + self.chapterid + 
      '/scenes/' + $routeParams.sceneid + '/view');
  };

  $scope.$on('$locationChangeStart', function (event) {

    if (self.checkExitActive && $scope.chapterSelectForm.$dirty) {
      event.preventDefault();
      let wannaGoPath = $location.path();
      self.checkExitActive = false;

      PopupBoxesService.confirm(function () {
        $timeout(function () {
          $location.path(wannaGoPath);
        }, 0);
      },
      'js.common.message.confirmExitWithoutSave',
      function () {
        self.checkExitActive = true;
      });
    }
  });
}
