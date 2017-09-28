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
component('scenedetail', {
  templateUrl: 'components/chapters/scene-detail.html',
  controller: SceneDetailController,
  bindings: {

  }
});

function SceneDetailController($rootScope, $routeParams, $location,
  ChapterService, LoggerService, SceneService) {
  LoggerService.debug('Start SceneDetailController...');

  var self = this;

  self.$onInit = function() {

    $rootScope.$emit('SHOW_ELEMENT_DETAIL');

    self.chapter = ChapterService.getChapter($routeParams.chapterid);
    self.scene = SceneService.getScene($routeParams.sceneid);

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.nav.li.chapters',
      href: '/project/chapters'
    });
    self.breadcrumbitems.push({
      labelvalue: '#' + self.chapter.position + ' ' + self.chapter.title,
      href: '/chapters/' + self.chapter.$loki
    });
    self.breadcrumbitems.push({
      labelvalue: self.scene.title
    });

    self.revisionactive = '2';
    self.revisioncount = 3;

    self.editmode = false;
  };

  self.back = function() {
    $location.path('/chapters/' + self.chapter.$loki)
  }

  self.changerevision = function(key) {
    alert('Change revision: ' + key);
  }

  self.changeStatus = function(status) {
    self.scene.status = status;
    SceneService.update(self.scene);
  }

  self.changetitle = function() {
    $location.path('/chapters/' + self.chapter.$loki + '/scenes/' + self.scene
      .$loki + '/title');
  }

  self.delete = function() {
    SceneService.remove(self.scene.$loki);
    $location.path('/chapters/' + self.chapter.$loki)
  }

  self.save = function() {
    alert('save ' + self.scene.$loki);
  }

  self.tags = function() {
    alert('tags of scene ' + self.scene.$loki);
  }

  LoggerService.debug('End SceneDetailController...');
}
