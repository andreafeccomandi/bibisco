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
  component('chapterinfodetail', {
    templateUrl: 'components/chapters/chapter-info-detail.html',
    controller: ChapterInfoDetailController
  });

function ChapterInfoDetailController($location, $routeParams, ChapterService) {

  var self = this;

  self.$onInit = function() {

    self.chapter = ChapterService.getChapter($routeParams.chapterid);
    self.mode = $routeParams.mode;

    self.chapterinfo;
    if ($routeParams.type === 'reason') {
      self.chapterinfo = self.chapter.reason;
      self.title = 'common_chapter_reason';
      self.subtitle = 'jsp.chapter.thumbnail.reason.description';
    } else if ($routeParams.type === 'notes') {
      self.chapterinfo = self.chapter.notes;
      self.title = 'common_chapter_notes';
      self.subtitle = 'common_notes_description';
    }

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_chapters',
      href: '/chapters/params/focus=chapters_' + self.chapter.$loki
    });
    self.breadcrumbitems.push({
      label: '#' + self.chapter.position + ' ' + self.chapter.title,
      href: '/chapters/' + $routeParams.chapterid + '/params/focus=chapterinfo_' + $routeParams.type
    });
    self.breadcrumbitems.push({
      label: self.title
    });

    self.showprojectexplorer = true;
  };

  self.changeStatus = function(status) {
    self.chapterinfo.status = status;
    ChapterService.update(self.chapter);
  };

  self.edit = function () {
    $location.path('/chapters/' + $routeParams.chapterid + '/chapterinfos/' + $routeParams.type + '/edit');
  };

  self.savefunction = function() {
    self.chapterinfo.lastsave = (new Date()).toJSON();
    ChapterService.update(self.chapter);
  };
}
