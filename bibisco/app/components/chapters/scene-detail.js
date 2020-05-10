/*
 * Copyright (C) 2014-2020 Andrea Feccomandi
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
  component('scenedetail', {
    templateUrl: 'components/chapters/scene-detail.html',
    controller: SceneDetailController,
    bindings: {

    }
  });

function SceneDetailController($injector, $location, $rootScope, $routeParams,
  $scope, ChapterService, hotkeys, PopupBoxesService, ProjectService, SupporterEditionChecker) {
  var self = this;

  self.$onInit = function() {

    $rootScope.$emit('SHOW_ELEMENT_DETAIL');
    
    self.isSupporterEdition = self.checkSupporterEdition();
    self.mode = $routeParams.mode;
    self.fromtimeline = $rootScope.actualPath.indexOf('timeline') !== -1;
    
    self.chapter = ChapterService.getChapter($routeParams.chapterid);
    self.scene = ChapterService.getScene($routeParams.sceneid);
    self.scenerevision = self.scene.revisions[self.scene.revision];
    self.title = '#' + self.scene.position + ' ' + self.scene.title;
    self.deleteforbidden = false; //TODO
    self.chapterpath = '/chapters/' + self.chapter.$loki + '/params/focus=scenes_' + self.scene.$loki;

    self.todaywords = ChapterService.getWordsWrittenLast30Days()[29].words;
    self.totalwords = ChapterService.getTotalWordsAndCharacters().words;
    let projectInfo = ProjectService.getProjectInfo();

    self.isSupporterEdition ? self.wordsGoal = projectInfo.wordsGoal : null;
    self.isSupporterEdition ? self.wordsPerDayGoal = projectInfo.wordsPerDayGoal : null;

    // common element detail flags
    self.autosaveenabled;
    $rootScope.dirty = false;
    self.editmode = (self.mode === 'edit');
    self.calculateBackPath();

    // breadcrumbs
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_chapters',
      href: '/chapters/params/focus=chapters_' + self.chapter.$loki
    });
    self.breadcrumbitems.push({
      label: '#' + self.chapter.position + ' ' + self.chapter.title,
      href: self.chapterpath
    });
    self.breadcrumbitems.push({
      label: self.scene.title
    });

    // dropdown menu actions
    self.actionitems = [];
    self.actionitems.push({
      label: 'jsp.scene.button.updateTitle',
      itemfunction: self.changetitle
    });
    self.actionitems.push({
      label: 'jsp.scene.button.moveSceneToAnotherChapter',
      itemfunction: self.moveSceneToAnotherChapter
    });
    self.actionitems.push({
      label: 'jsp.common.button.delete',
      itemfunction: function () {
        PopupBoxesService.confirm(self.delete, 'jsp.chapter.delete.scene.confirm');
      }
    });

    // saved content
    self.content = self.scenerevision.text;
  };

  self.calculateBackPath = function() {
    if (self.editmode && self.fromtimeline) {
      self.backpath = '/timeline/chapters/' + self.chapter.$loki + '/scenes/' + self.scene
        .$loki + '/view';
    } else if (!self.editmode && !self.fromtimeline) {
      self.backpath = self.chapterpath;
    } else if (!self.editmode && self.fromtimeline) {
      self.backpath = '/timeline';
    }
  };

  self.changerevision = function(action, revision) {
    if (action === 'new-from-actual') {
      self.scene = ChapterService.insertSceneRevisionFromActual($routeParams.sceneid);
      self.edit();
    } else if (action === 'new-from-scratch') {
      self.scene = ChapterService.insertSceneRevisionFromScratch($routeParams.sceneid);
      self.edit();
    } else if (action === 'change') {
      self.scene = ChapterService.changeSceneRevision($routeParams.sceneid, revision);
    } else if (action === 'delete') {
      self.scene = ChapterService.deleteActualSceneRevision($routeParams.sceneid);
    }

    self.scenerevision = self.scene.revisions[self.scene.revision];
    self.content = self.scenerevision.text;
  };

  self.changeStatus = function(status) {
    self.scene.status = status;
    ChapterService.updateScene(self.scene);
  };

  self.getRootPath = function () {
    if (self.fromtimeline) {
      return '/timeline';
    } else { 
      return '';
    }
  };

  self.changetitle = function() {
    $location.path(self.getRootPath() + '/chapters/' + self.chapter.$loki + '/scenes/' + self.scene
      .$loki + '/title');
  };

  self.edit = function () {
    $location.path(self.getRootPath() + '/chapters/' + self.chapter.$loki + '/scenes/' + self.scene
      .$loki + '/edit');
  };

  self.moveSceneToAnotherChapter = function() {
    if (self.isSupporterEdition) {
      $location.path(self.getRootPath() + '/chapters/' + self.chapter.$loki + '/scenes/' + self.scene
        .$loki + '/move');
    } else {
      SupporterEditionChecker.showSupporterMessage();
    }
    
  };

  self.checkSupporterEdition = function() {
    if (SupporterEditionChecker.check()) {
      $injector.get('IntegrityService').ok();
      return true;
    } else {
      return false;
    }
    
  };

  self.delete = function() {
    ChapterService.removeScene(self.scene.$loki);
    if (self.fromtimeline) {
      $location.path('/timeline/');
    } else {
      $location.path('/chapters/' + self.chapter.$loki);
    }
  };

  self.save = function() {
    self.scenerevision.text = self.content;
    self.scene.revisions[self.scene.revision] = self.scenerevision;
    ChapterService.updateScene(self.scene);
  };

  self.tags = function() {
    $location.path(self.getRootPath() + '/chapters/' + self.chapter.$loki + '/scenes/' + self.scene
      .$loki + '/tags');
  };

  hotkeys.bindTo($scope)
    .add({
      combo: ['ctrl+t', 'command+t'],
      description: 'tags',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.tags();
      }
    });
}
