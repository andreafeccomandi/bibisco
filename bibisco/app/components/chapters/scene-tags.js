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
component('scenetags', {
  templateUrl: 'components/chapters/scene-tags.html',
  controller: SceneTitleController
});

function SceneTitleController($location, $routeParams, ChapterService,
  LoggerService) {
  LoggerService.debug('Start SceneTitleController...');

  var self = this;

  self.$onInit = function() {

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.nav.li.chapters'
    });

    let chapter = ChapterService.getChapter($routeParams.chapterid);
    self.breadcrumbitems.push({
      labelvalue: '#' + chapter.position + ' ' + chapter.title
    });

    let scene = ChapterService.getScene($routeParams.sceneid);
    self.breadcrumbitems.push({
      labelvalue: scene.title
    });
    self.breadcrumbitems.push({
      label: 'jsp.scene.title.tags'
    });


    self.title = scene.title;
    self.pageheadertitle =
      'jsp.scene.dialog.title.updateTitle';

    self.dirty = true;

  }

  self.save = function() {
    alert('Save tags!');
  }

  self.back = function() {
    $location.path('/chapters/' + $routeParams.chapterid + '/scenes/' +
      $routeParams.sceneid)
  }

  LoggerService.debug('End SceneTitleController...');
}
