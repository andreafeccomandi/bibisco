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
  component('elementdetail', {
    templateUrl: 'components/common/uielements/element-detail/element-detail.html',
    controller: ElementDetailController,
    bindings: {
      backfunction: '&',
      breadcrumbitems: '<',
      changetitleenabled: '<',
      changetitlefunction: '&',
      changetitlelabel: '@',
      characters: '=',
      content: '=',
      deleteconfirmmessage: '@',
      deleteenabled: '<',
      deleteforbidden: '<',
      deleteforbiddenmessage: '@',
      deletefunction: '&',
      editmode: '=',
      eventname: '@',
      headertitle: '@',
      headersubtitle: '@',
      imagesenabled: '<',
      lastsave: '<',
      savefunction: '&',
      showimagesfunction: '&',
      revisionactive: '<',
      revisioncount: '<',
      revisionenabled: '<',
      revisionfunction: '&',
      tagsenabled: '<',
      tagsfunction: '&',
      tagslabel: '@',
      taskstatus: '<',
      taskstatuschangefunction: '&',
      words: '=',
      wordscharactersenabled: '<'
    }
  });

function ElementDetailController($interval, $rootScope,
  RichTextEditorPreferencesService) {
  var self = this;

  self.$onInit = function() {
    $rootScope.$emit(self.eventname);
    self.savedcontent = self.content;

    self.autosavefunctionpromise = $interval(function() {
      if (self.autosaveenabled && self.editmode && self.dirty) {
        self.save();
      }
    }, 60000);
  };

  self.$onChanges = function(changes) {

    if ((changes.revisionactive || changes.revisioncount) && self.editmode === false) {
      self.savedcontent = self.content;
    }
  };

  self.$onDestroy = function() {
    $interval.cancel(self.autosavefunctionpromise);
  };

  self.dirty = false;
  self.showprojectexplorer = false;
  self.autosaveenabled = RichTextEditorPreferencesService.isAutoSaveEnabled();

  self.back = function() {
    self.content = self.savedcontent;
    if (self.editmode) {
      self.editmode = false;
      self.dirty = false;
    } else {
      self.backfunction();
    }
  };

  self.save = function() {
    self.savefunction();
    self.dirty = false;
    self.savedcontent = self.content;
  };
}
