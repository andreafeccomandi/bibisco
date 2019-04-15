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
  component('editsavebackbuttonbar', {
    templateUrl: 'components/common/forms/edit-save-back-buttonbar/edit-save-back-buttonbar.html',
    controller: EditSaveBackButtonbarController,
    bindings: {
      autosaveenabled: '=',
      backpath: '<',
      editbuttonvisible: '<',
      editfunction: '&',
      editmode: '<',
      savefunction: '&',
    }
  });

function EditSaveBackButtonbarController($interval, $rootScope, $scope, 
  $timeout, hotkeys, RichTextEditorPreferencesService) {

  var self = this;

  self.$onInit = function () {
    self.autosaveenabled = RichTextEditorPreferencesService.isAutoSaveEnabled();
    self.saving = false;
    self.autosavefunctionpromise = $interval(function () {
      if (self.autosaveenabled && self.editmode && $rootScope.dirty) {
        self.save();
      }
    }, 60000);
  };

  self.$onDestroy = function () {
    $interval.cancel(self.autosavefunctionpromise);
  };

  self.enableeditmode = function () {
    self.editfunction();
  };

  self.save = function () {
    if ($rootScope.dirty) {
      self.saving = true;
      $timeout(function () {
        self.executeSave();
      }, 250);
    }
  };

  hotkeys.bindTo($scope)
    .add({
      combo: ['ctrl+s', 'command+s'],
      description: 'save',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.executeSave();
      }
    })
    .add({
      combo: ['ctrl+e', 'command+e'],
      description: 'edit',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.enableeditmode();
      }
    });

  self.executeSave = function() {
    self.savefunction();
    self.saving = false;
    $rootScope.dirty = false;
    $rootScope.$emit('CONTENT_SAVED');
  };
}
