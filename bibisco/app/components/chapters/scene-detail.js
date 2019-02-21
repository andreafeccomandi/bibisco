/*
 * Copyright (C) 2014-2019 Andrea Feccomandi
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
  $scope, ChapterService, hotkeys, PopupBoxesService, SupporterEditionChecker) {
  var self = this;

  self.$onInit = function() {

    $rootScope.$emit('SHOW_ELEMENT_DETAIL');
    
    self.mode = $routeParams.mode;
    self.chapter = ChapterService.getChapter($routeParams.chapterid);
    self.scene = ChapterService.getScene($routeParams.sceneid);
    self.scenerevision = self.scene.revisions[self.scene.revision];
    self.title = '#' + self.scene.position + ' ' + self.scene.title;
    self.deleteforbidden = false; //TODO

    // common element detail flags
    self.autosaveenabled;
    $rootScope.dirty = false;
    self.editmode = (self.mode === 'edit');
    self.showprojectexplorer = false;

    // breadcrumbs
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_chapters',
      href: '/chapters/params/focus=chapters_' + self.chapter.$loki
    });
    self.breadcrumbitems.push({
      label: '#' + self.chapter.position + ' ' + self.chapter.title,
      href: '/chapters/' + self.chapter.$loki + '/params/focus=scenes_' + self.scene.$loki
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

  self.changetitle = function() {
    $location.path('/chapters/' + self.chapter.$loki + '/scenes/' + self.scene
      .$loki + '/title');
  };

  self.edit = function () {
    $location.path('/chapters/' + self.chapter.$loki + '/scenes/' + self.scene
      .$loki + '/edit');
  };

  self.moveSceneToAnotherChapter = function() {
    if (SupporterEditionChecker.check()) {
      $injector.get('IntegrityService').ok();
      $location.path('/chapters/' + self.chapter.$loki + '/scenes/' + self.scene
        .$loki + '/move');
    } else {
      SupporterEditionChecker.showSupporterMessage();
    }
    
  };

  self.delete = function() {
    ChapterService.removeScene(self.scene.$loki);
    $location.path('/chapters/' + self.chapter.$loki);
  };

  self.save = function() {
    self.scenerevision.text = self.content;
    self.scene.revisions[self.scene.revision] = self.scenerevision;
    ChapterService.updateScene(self.scene);
  };

  self.tags = function() {
    $location.path('/chapters/' + self.chapter.$loki + '/scenes/' + self.scene
      .$loki + '/tags');
  };

  hotkeys.bindTo($scope)
    .add({
      combo: ['ctrl+t', 'command+t'],
      description: 'tags',
      callback: function () {
        self.tags();
      }
    });
}
