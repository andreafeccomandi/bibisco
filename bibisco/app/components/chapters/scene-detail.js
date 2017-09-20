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
    backfunction: '&',
    breadcrumbitems: '<',
    changetitlefunction: '&',
    changetitlelabel: '@',
    characters: '=',
    content: '=',
    deleteconfirmmessage: '@',
    deleteforbidden: '<',
    deleteforbiddenmessage: '@',
    deletefunction: '&',
    editmode: '=',
    eventname: '@',
    headertitle: '@',
    headersubtitle: '@',
    lastsave: '<',
    savefunction: '&',
    taskstatus: '<',
    taskstatuschangefunction: '&',
    words: '='
  }
});

function SceneDetailController($rootScope, LoggerService,
  RichTextEditorPreferencesService) {
  LoggerService.debug('Start SceneDetailController...');

  var self = this;

  self.$onInit = function() {
    $rootScope.$emit(self.eventname);
  };

  self.dirty = false;
  self.showprojectexplorer = false;
  self.autosaveenabled = RichTextEditorPreferencesService.isAutoSaveEnabled();

  LoggerService.debug('End SceneDetailController...');
}
