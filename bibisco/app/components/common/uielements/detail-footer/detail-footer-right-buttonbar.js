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
  component('detailfooterrightbuttonbar', {
    templateUrl: 'components/common/uielements/detail-footer/detail-footer-right-buttonbar.html',
    controller: DetailFooterRightButtonbarController,
    bindings: {
      autosaveenabled: '<',
      backfunction: '&',
      changetitleenabled: '<',
      changetitlefunction: '&',
      changetitlelabel: '@',
      deleteconfirmmessage: '@',
      deleteenabled: '<',
      deleteforbidden: '<',
      deleteforbiddenmessage: '@',
      deletefunction: '&',
      dirty: '=',
      editmode: '=',
      savefunction: '&',
      words: '<'
    }
  });


function DetailFooterRightButtonbarController($timeout, PopupBoxesService) {

  var self = this;

  self.$onInit = function() {
    self.saving = false;
  };

  self.delete = function() {
    if (self.deleteforbidden) {
      PopupBoxesService.alert(self.deleteforbiddenmessage);
    } else {
      PopupBoxesService.confirm(self.deletefunction, self.deleteconfirmmessage);
    }
  };

  self.enableeditmode = function() {
    self.editmode = true;
  };

  self.save = function() {
    if (self.dirty) {
      self.saving = true;
      $timeout(function() {
        self.savefunction();
        self.saving = false;
      }, 250);
    }
  };
}
