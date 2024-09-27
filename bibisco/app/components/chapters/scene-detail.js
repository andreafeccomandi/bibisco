/*
 * Copyright (C) 2014-2024 Andrea Feccomandi
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

function SceneDetailController($location, $rootScope, $routeParams,
  $scope, $window, BibiscoPropertiesService, ChapterService, hotkeys, ImageService, NavigationService, 
  PopupBoxesService, ProjectService, SupporterEditionChecker) {
  
  let self = this;

  self.$onInit = function() {

    self.breadcrumbitems = [];
    self.chapter = ChapterService.getChapter(parseInt($routeParams.chapterid));
    self.scene = ChapterService.getScene(parseInt($routeParams.sceneid));

    // If we get to the page using the back button it's possible that the scene has been deleted or moved to another chapter. Let's go back again.
    if (!self.chapter || !self.scene || self.chapter.$loki !== self.scene.chapterid) {
      $window.history.back();
      return;
    }
    
    $rootScope.$emit('SHOW_ELEMENT_DETAIL');
    
    self.includeSupporterEditionItems = SupporterEditionChecker.isSupporterOrTrial();
    self.mode = NavigationService.calculateMode($routeParams.mode); 
    self.fromtimeline = $rootScope.actualPath.indexOf('timeline') !== -1;
    
  
    self.scenerevision = self.scene.revisions[self.scene.revision];
    self.title = '#' + self.scene.position + ' ' + self.scene.title;
    self.chapterpath = '/chapters/' + self.chapter.$loki;

    self.todaywords = ChapterService.getWordsWrittenLast30Days()[29].words;
    self.totalwords = ChapterService.getTotalWordsAndCharacters().words;
    let projectInfo = ProjectService.getProjectInfo();

    self.includeSupporterEditionItems ? self.wordsGoal = projectInfo.wordsGoal : null;
    self.includeSupporterEditionItems ? self.wordsPerDayGoal = projectInfo.wordsPerDayGoal : null;

    // common element detail flags
    self.autosaveenabled;
    $rootScope.dirty = false;
    self.editmode = (self.mode === 'edit');

    // breadcrumbs
    self.breadcrumbitems.push({
      label: 'common_chapters',
      href: '/chapters'
    });
    self.breadcrumbitems.push({
      label: ChapterService.getChapterPositionDescription(self.chapter.position) + ' ' + self.chapter.title,
      href: self.chapterpath
    });
    self.breadcrumbitems.push({
      label: self.scene.title
    });

    // groups
    self.grouptags = [];
    if (SupporterEditionChecker.isSupporterOrTrial()) {
      let groups = ChapterService.getSceneGroups(parseInt($routeParams.sceneid));
      for (let i = 0; i < groups.length; i++) {
        self.grouptags.push({label: groups[i].name, color: groups[i].color});
      }
    }
    
    // dropdown menu actions
    self.actionitems = [];
    self.actionitems.push({
      label: 'jsp.scene.button.updateTitle',
      itemfunction: self.changetitle
    });
    self.actionitems.push({
      label: 'jsp.scene.button.moveSceneToAnotherChapter',
      itemfunction: self.moveSceneToAnotherChapter,
      supportersonly: true
    });
    self.actionitems.push({
      label: 'jsp.common.button.delete',
      itemfunction: function () {
        PopupBoxesService.confirm(self.delete, 'jsp.chapter.delete.scene.confirm');
      }
    });

    // saved content
    self.content = self.scenerevision.text;

    // empty content
    self.emptyContent = !(self.scenerevision.characters > 0 || ImageService.textContainsImages(self.scenerevision.text));

    let chapterscenes = ChapterService.getScenes(parseInt($routeParams.chapterid));
    
    // previous scene
    let previousposition = self.scene.position - 1;
    if (previousposition > 0) {
      self.previouselementlink='/chapters/'+$routeParams.chapterid+'/scenes/'+chapterscenes[previousposition-1].$loki+'/'+self.mode;
      self.previouselementtooltip='#' + previousposition + ' ' + chapterscenes[previousposition-1].title;
    }

    // next scene
    let nextposition = self.scene.position + 1;
    if (nextposition <= chapterscenes.length) {
      self.nextelementlink='/chapters/'+$routeParams.chapterid+'/scenes/'+chapterscenes[nextposition-1].$loki+'/'+self.mode;
      self.nextelementtooltip='#' + nextposition + ' ' + chapterscenes[nextposition-1].title;
    }

    // calculate tip
    self.tip = BibiscoPropertiesService.getProperty('richTextEditorTip') === 'true' ? 'richTextEditorTip' : 'sceneTip';
  };

  self.changerevision = function(action, revision) {
    let sceneid = parseInt($routeParams.sceneid);
    if (action === 'new-from-actual') {
      self.scene = ChapterService.insertSceneRevisionFromActual(sceneid);
    } else if (action === 'new-from-scratch') {
      self.scene = ChapterService.insertSceneRevisionFromScratch(sceneid);
    } else if (action === 'change') {
      self.scene = ChapterService.changeSceneRevision(sceneid, revision);
    } else if (action === 'delete') {
      self.scene = ChapterService.deleteActualSceneRevision(sceneid);
    }

    self.scenerevision = self.scene.revisions[self.scene.revision];
    self.content = self.scenerevision.text;
    if (self.content === '') {
      self.content = '<p><br></p>';
    }
    self.emptyContent = !(self.scenerevision.characters > 0 || ImageService.textContainsImages(self.scenerevision.text));

    if (self.mode === 'view' && (action === 'new-from-actual' || action === 'new-from-scratch')) {
      self.edit();
    }
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
      .$loki + '/edit').replace();
  };

  self.read = function () {
    $location.path(self.getRootPath() + '/chapters/' + self.chapter.$loki + '/scenes/' + self.scene
      .$loki + '/view').replace();
  };

  self.moveSceneToAnotherChapter = function() {
    SupporterEditionChecker.filterAction(function() {
      $location.path(self.getRootPath() + '/chapters/' + self.chapter.$loki + '/scenes/' + self.scene
        .$loki + '/move');
    });
  };

  self.delete = function() {
    ChapterService.removeScene(self.scene.$loki);
    $window.history.back();
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
