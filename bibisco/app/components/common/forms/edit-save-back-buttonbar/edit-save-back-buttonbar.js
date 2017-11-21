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
  component('editsavebackbuttonbar', {
    templateUrl: 'components/common/forms/edit-save-back-buttonbar/edit-save-back-buttonbar.html',
    controller: EditSaveBackButtonbarController,
    bindings: {
      autosaveenabled: '=',
      backfunction: '&',
      content: '=',
      dirty: '=',
      editbuttonvisible: '<',
      editmode: '=',
      savedcontent: '=',
      savefunction: '&'
    }
  });

function EditSaveBackButtonbarController($interval, $scope, $timeout, 
  hotkeys, RichTextEditorPreferencesService) {

  var self = this;

  self.$onInit = function () {
    self.autosaveenabled = RichTextEditorPreferencesService.isAutoSaveEnabled();
    self.saving = false;
    self.autosavefunctionpromise = $interval(function () {
      if (self.autosaveenabled && self.editmode && self.dirty) {
        self.save();
      }
    }, 60000);
  };

  self.$onDestroy = function () {
    $interval.cancel(self.autosavefunctionpromise);
  };

  self.enableeditmode = function () {
    self.editmode = true;
  };

  self.back = function () {
    self.content = self.savedcontent;
    if (self.editmode) {
      //  back to view mode
      self.editmode = false;
      self.dirty = false;
    } else {
      // back to previous page
      self.backfunction();
    }
  };

  self.save = function () {
    if (self.dirty) {
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
      callback: function () {
        self.executeSave();
      }
    });

  self.executeSave = function() {
    self.savefunction();
    self.saving = false;
    self.dirty = false;
    self.savedcontent = self.content;
  };
}
