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
  component('scenetitle', {
    templateUrl: 'components/chapters/scene-title.html',
    controller: SceneTitleController
  });

function SceneTitleController($location, $routeParams, ChapterService) {

  var self = this;

  self.$onInit = function() {

    let chapter = ChapterService.getChapter($routeParams.chapterid);

    // common breadcrumb root
    self.breadcrumbItems = [];
    self.breadcrumbItems.push({
      label: 'common_chapters',
      href: '/project/chapters?focus=chapters_' + chapter.$loki
    });
    self.breadcrumbItems.push({
      label: '#' + chapter.position + ' ' + chapter.title,
      href: '/chapters/' + chapter.$loki
    });

    if ($routeParams.sceneid !== undefined) {
      let scene = ChapterService.getScene($routeParams.sceneid);

      // edit breadcrumb items
      self.breadcrumbItems.push({
        label: scene.title,
        href: '/chapters/' + chapter.$loki + '/scenes/' + scene.$loki + '/view'
      });
      self.breadcrumbItems.push({
        label: 'jsp.scene.dialog.title.updateTitle'
      });

      self.exitpath = '/chapters/' + chapter.$loki + '/scenes/' + scene.$loki + '/view';
      self.title = scene.title;
      self.pageheadertitle = 'jsp.scene.dialog.title.updateTitle';

    } else {

      // create breadcrumb items
      self.breadcrumbItems.push({
        label: 'jsp.chapter.dialog.title.createScene'
      });

      self.exitpath = '/chapters/' + chapter.$loki;
      self.name = null;
      self.pageheadertitle =
        'jsp.chapter.dialog.title.createScene';
    }
  };

  self.save = function(title) {
    if ($routeParams.sceneid !== undefined) {
      let scene = ChapterService.getScene($routeParams.sceneid);
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
