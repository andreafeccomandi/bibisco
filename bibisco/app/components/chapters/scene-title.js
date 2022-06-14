/*
 * Copyright (C) 2014-2022 Andrea Feccomandi
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
  component('scenetitle', {
    templateUrl: 'components/chapters/scene-title.html',
    controller: SceneTitleController
  });

function SceneTitleController($rootScope, $routeParams, $window, ChapterService) {

  var self = this;

  self.$onInit = function() {

    self.breadcrumbItems = [];

    let chapter = ChapterService.getChapter(parseInt($routeParams.chapterid));

    // If we get to the page using the back button it's possible that the scene has been deleted or moved to another chapter. Let's go back again.
    if (!chapter) {
      $window.history.back();
      return;
    }

    // common breadcrumb root
    self.breadcrumbItems.push({
      label: 'common_chapters',
      href: '/chapters/params/focus=chapters_' + chapter.$loki
    });
    self.breadcrumbItems.push({
      label: ChapterService.getChapterPositionDescription(chapter.position) + ' ' + chapter.title,
      href: '/chapters/' + chapter.$loki
    });

    if ($routeParams.sceneid !== undefined) {
      let scene = ChapterService.getScene(parseInt($routeParams.sceneid));
      // If we get to the page using the back button it's possible that the scene has been deleted or moved to another chapter. Let's go back again.
      if (!scene  || chapter.$loki !== scene.chapterid) {
        $window.history.back();
        return;
      }
  
      // edit breadcrumb items
      self.breadcrumbItems.push({
        label: scene.title,
        href: '/chapters/' + chapter.$loki + '/scenes/' + scene.$loki + '/view'
      });
      self.breadcrumbItems.push({
        label: 'jsp.scene.dialog.title.updateTitle'
      });

      self.title = scene.title;
      self.pageheadertitle = 'jsp.scene.dialog.title.updateTitle';

    } else {

      // create breadcrumb items
      self.breadcrumbItems.push({
        label: 'jsp.chapter.dialog.title.createScene'
      });

      self.name = null;
      self.pageheadertitle =
        'jsp.chapter.dialog.title.createScene';
    }
  };

  self.save = function(title) {
    if ($routeParams.sceneid !== undefined) {
      let scene = ChapterService.getScene(parseInt($routeParams.sceneid));
      scene.title = title;
      ChapterService.updateSceneTitle(scene);
    } else {
      ChapterService.insertScene({
        title: title,
        chapterid: parseInt($routeParams.chapterid)
      });
    }
  };
}
