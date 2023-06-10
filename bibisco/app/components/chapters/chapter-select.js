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
  component('chapterselect', {
    templateUrl: 'components/chapters/chapter-select.html',
    controller: ChapterSelectController
  });

function ChapterSelectController($location, $rootScope, $routeParams, $scope, $window,
  ChapterService, PopupBoxesService) {
  var self = this;

  self.$onInit = function() {

    self.breadcrumbitems = [];
    
    self.chapterid = parseInt($routeParams.chapterid);
    self.sourceChapter = ChapterService.getChapter(parseInt($routeParams.chapterid));
    self.scene = ChapterService.getScene(parseInt($routeParams.sceneid));

    // If we get to the page using the back button it's possible that the scene has been deleted or moved to another chapter. Let's go back again.
    if (!self.sourceChapter || !self.scene || self.chapterid !== self.scene.chapterid) {
      $window.history.back();
      return;
    }

    $rootScope.$emit('MOVE_SCENE_SELECT_CHAPTER');
    self.breadcrumbitems.push({
      label: 'common_chapters',
      href: '/chapters/' + self.sourceChapter.$loki
    });

    self.breadcrumbitems.push({
      label: ChapterService.getChapterPositionDescription(self.sourceChapter.position) + ' ' + self.sourceChapter.title,
      href: '/chapters/' + self.sourceChapter.$loki
    });

    self.breadcrumbitems.push({
      label: self.scene.title,
      href: '/chapters/' + self.sourceChapter.$loki + '/scenes/' + self.scene.$loki + '/view'
    });

    self.breadcrumbitems.push({
      label: 'jsp.scene.button.moveSceneToAnotherChapter.title'
    });

    let chapters = ChapterService.getChaptersWithPrologueAndEpilogue();
    self.selectedItem;
    self.selectItems = [];
    for (let i = 0; i < chapters.length; i++) {
      let chapterItem = {
        key: chapters[i].$loki,
        title: ChapterService.getChapterPositionDescription(chapters[i].position) + ' ' + chapters[i].title
      };
      self.selectItems.push(chapterItem);
      if (self.sourceChapter.$loki === chapters[i].$loki) {
        self.selectedItem = chapterItem;
      }
    }

    self.checkExit = {
      active: true
    };
  };

  self.selectChapter = function() {

  };

  self.save = function(isValid) {
    if (isValid) {
      if (self.selectedItem.key !== self.sourceChapter.$loki) {
        ChapterService.moveSceneToAnotherChapter(self.scene.$loki, self.selectedItem.key);
      } 
      $location.path('/chapters/' + self.selectedItem.key);
      self.checkExit = {
        active: false
      };
    }
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $scope.chapterSelectForm.$dirty, self.checkExit);
  });
}
