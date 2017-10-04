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

function SceneDetailController($location, $rootScope, $routeParams,
  ChapterService, LoggerService, SceneService) {
  LoggerService.debug('Start SceneDetailController...');

  var self = this;

  self.$onInit = function() {

    $rootScope.$emit('SHOW_ELEMENT_DETAIL');

    self.chapter = ChapterService.getChapter($routeParams.chapterid);
    self.scene = SceneService.getScene($routeParams.sceneid);
    self.title = '#' + self.scene.position + ' ' + self.scene.title;

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

    self.editmode = false;
  };

  self.back = function() {
    $location.path('/chapters/' + self.chapter.$loki)
  }

  self.changerevision = function(action, revision) {
    if (action == 'new-from-actual') {
      self.scene = SceneService.createRevisionFromActual($routeParams.sceneid);
      self.editmode = true;
    } else if (action == 'new-from-scratch') {
      self.scene = SceneService.createRevisionFromScratch($routeParams.sceneid);
      self.editmode = true;
    } else if (action == 'change') {
      self.scene = SceneService.changeRevision($routeParams.sceneid, revision);
    } else if (action == 'delete') {
      self.scene = SceneService.deleteActualRevision($routeParams.sceneid);
    }
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
    SceneService.update(self.scene);
  }

  self.tags = function() {
    alert('tags of scene ' + self.scene.$loki);
  }

  LoggerService.debug('End SceneDetailController...');
}
