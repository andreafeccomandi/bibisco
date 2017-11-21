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
      showimageslabel: '@',
      taskstatus: '<',
      taskstatuschangefunction: '&',
      words: '=',
      wordscharactersenabled: '<'
    }
  });

function ElementDetailController($interval, $rootScope,PopupBoxesService) {
  var self = this;

  self.$onInit = function() {
    $rootScope.$emit(self.eventname);
    
    self.dirty = false;
    self.showprojectexplorer = false;
    self.savedcontent = self.content;

    self.actionitems = [];
    if (self.changetitleenabled) {
      self.actionitems.push({
        label: self.changetitlelabel,
        itemfunction: self.changetitlefunction
      });
    }
    if (self.deleteenabled) {
      self.actionitems.push({
        label: 'jsp.common.button.delete',
        itemfunction: function () {
          if (self.deleteforbidden) {
            PopupBoxesService.alert(self.deleteforbiddenmessage);
          } else {
            PopupBoxesService.confirm(self.deletefunction, self.deleteconfirmmessage);
          }
        }
      });
    }
  };

  self.$onChanges = function(changes) {
    if ((changes.revisionactive || changes.revisioncount) && self.editmode === false) {
      self.savedcontent = self.content;
    }
  };

  self.backtoview = function() {
    self.content = self.savedcontent;
  };

  self.back = function() {
    self.content = self.savedcontent;
    self.backfunction();
  };

  self.save = function() {
    self.savefunction();
    self.savedcontent = self.content;
  };
}
