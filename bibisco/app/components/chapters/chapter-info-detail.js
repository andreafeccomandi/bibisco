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
  component('chapterinfodetail', {
    templateUrl: 'components/chapters/chapter-info-detail.html',
    controller: ChapterInfoDetailController
  });

function ChapterInfoDetailController($location, $routeParams, ChapterService) {

  var self = this;

  self.$onInit = function() {

    self.chapterinfo = ChapterService.getChapterInfo($routeParams.chapterinfoid);
    self.chapter = ChapterService.getChapter($routeParams.chapterid);

    self.title = 'jsp.chapter.thumbnail.' + self.chapterinfo.type + '.title';
    self.subtitle = 'jsp.chapter.thumbnail.' + self.chapterinfo.type +
      '.description';

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.nav.li.chapters',
      href: '/project/chapters'
    });
    self.breadcrumbitems.push({
      label: '#' + self.chapter.position + ' ' + self.chapter.title,
      href: '/chapters/' + self.chapter.$loki
    });
    self.breadcrumbitems.push({
      label: self.title
    });

    self.editmode = false;
    self.showprojectexplorer = true;
  };

  self.back = function() {
    $location.path('/chapters/' + $routeParams.chapterid);
  };

  self.changeStatus = function(status) {
    self.chapterinfo.status = status;
    ChapterService.updateChapterInfo(self.chapterinfo);
  };

  self.savefunction = function() {
    ChapterService.updateChapterInfo(self.chapterinfo);
  };
}
