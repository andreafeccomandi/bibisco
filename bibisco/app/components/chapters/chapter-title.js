/*
 * Copyright (C) 2014-2021 Andrea Feccomandi
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
  component('chaptertitle', {
    templateUrl: 'components/chapters/chapter-title.html',
    controller: ChapterTitleController
  });

function ChapterTitleController($location, $rootScope, $scope, $routeParams, ChapterService, PopupBoxesService) {
  var self = this;

  self.$onInit = function() {

    $rootScope.$emit('SHOW_ELEMENT_TITLE');

    self.checkExit = {
      active: true
    };

    // common breadcrumb root
    self.breadcrumbItems = [];

    if ($routeParams.id !== undefined) {
      let chapter = ChapterService.getChapter($routeParams.id);

      // edit breadcrumb items
      self.breadcrumbItems.push({
        label: 'common_chapters',
        href: '/chapters/params/focus=chapters_' + chapter.$loki
      });
      self.breadcrumbItems.push({
        label: ChapterService.getChapterPositionDescription(chapter.position) + ' ' + chapter.title,
        href: '/chapters/' + chapter.$loki
      });
      self.breadcrumbItems.push({
        label: 'jsp.chapter.dialog.title.updateTitle'
      });

      self.exitpath = '/chapters/' + chapter.$loki;
      self.title = chapter.title;
      self.pageheadertitle =
        'jsp.chapter.dialog.title.updateTitle';
    } else {
      self.breadcrumbItems.push({
        label: 'common_chapters',
        href: '/chapters'
      });

      // check if I'm creating prologue, epilogue or regular chapter
      self.creatingPrologue = $location.path().includes('prologue') ? true : false;
      self.creatingEpilogue = $location.path().includes('epilogue') ? true : false;
      self.creatingChapter = (self.creatingPrologue || self.creatingEpilogue) ? false : true;

      // select label
      let label;
      if (self.creatingPrologue) {
        label = 'create_prologue_title';
      } else if (self.creatingEpilogue) {
        label = 'create_epilogue_title';
      } else {
        label = 'jsp.chapters.dialog.title.createChapter';
      }

      // create breadcrumb items
      self.breadcrumbItems.push({
        label: label
      });

      // manage part selection
      self.showPartSelect = false;
      self.selectedPart = null;
      if (ChapterService.getPartsCount()>0 && self.creatingChapter) {
        self.showPartSelect = true;
        let parts = ChapterService.getParts();
        self.selectItems = [];
        for (let i = 0; i < parts.length; i++) {
          let partItem = {
            key: parts[i].$loki,
            title: '#' + parts[i].position + ' ' + parts[i].title
          };
          self.selectItems.push(partItem);
        }
        self.selectedPart = self.selectItems[parts.length-1];
      }

      self.exitpath = '/chapters';
      self.title = '';
      self.pageheadertitle = label;
    }
  };

  self.save = function(isValid) {
    if (isValid) {
      
      if ($routeParams.id !== undefined) {
        let chapter = ChapterService.getChapter(
          $routeParams.id);
        chapter.title = self.title;
        ChapterService.update(chapter);
      } else if (self.creatingChapter) {
        let partId = self.selectedPart ? self.selectedPart.key : null;
        ChapterService.insert({
          title: self.title
        }, partId);
      } else if (self.creatingPrologue) {
        ChapterService.insertPrologue({
          title: self.title
        });
      } else if (self.creatingEpilogue) {
        ChapterService.insertEpilogue({
          title: self.title
        });
      }

      self.checkExit = {
        active: false
      };
      $location.path(self.exitpath);
    }
  };


  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $scope.elementTitleForm.$dirty, self.checkExit);
  });
}
