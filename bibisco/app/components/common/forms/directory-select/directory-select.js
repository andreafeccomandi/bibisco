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
  component('directoryselect', {
    templateUrl: 'components/common/forms/directory-select/directory-select.html',
    controller: DirectorySelectController,
    bindings: {
      model: '=',
      field: '<',
      name: '@',
      onselectdirectory: '&',
      forbiddendirectory: '<',
      placeholder: '@'
    }
  });


function DirectorySelectController(MainProcessCallbackExecutorService) {

  const ipc = require('electron').ipcRenderer;
  var self = this;

  self.projectsdirectory = null;
  self.opendirectorydialog = function() {
    let callbackId = MainProcessCallbackExecutorService.register(self.onselectdirectory);
    ipc.send('selectdirectory', {
      callbackId: callbackId
    });
  };

  // show errors
  self.hasError = function() {
    return self.field.$$parentForm.$submitted && self.field.$invalid;
  };
}
