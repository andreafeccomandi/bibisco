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
  component('scenetitle', {
    templateUrl: 'components/chapters/scene-title.html',
    controller: SceneTitleController
  });

function SceneTitleController($location, $routeParams, ChapterService) {

  var self = this;

  self.$onInit = function() {

    // common breadcrumb root
    self.breadcrumbItems = [];
    self.breadcrumbItems.push({
      label: 'jsp.projectFromScene.nav.li.chapters'
    });

    let chapter = ChapterService.getChapter($routeParams.chapterid);
    self.breadcrumbItems.push({
      label: '#' + chapter.position + ' ' + chapter.title
    });

    if ($routeParams.sceneid !== null) {
      let scene = ChapterService.getScene($routeParams.sceneid);

      // edit breadcrumb items
      self.breadcrumbItems.push({
        label: scene.title
      });
      self.breadcrumbItems.push({
        label: 'jsp.scene.dialog.title.updateTitle'
      });

      self.exitpath = '/chapters/' + $routeParams.chapterid + '/scenes/' +
        $routeParams.sceneid;
      self.title = scene.title;
      self.pageheadertitle =
        'jsp.scene.dialog.title.updateTitle';
    } else {

      // create breadcrumb items
      self.breadcrumbItems.push({
        label: 'jsp.chapter.dialog.title.createScene'
      });

      self.exitpath = '/chapters/' + $routeParams.chapterid;
      self.name = null;
      self.pageheadertitle =
        'jsp.chapter.dialog.title.createScene';
    }
  };

  self.save = function(title) {
    if ($routeParams.sceneid !== null) {
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
