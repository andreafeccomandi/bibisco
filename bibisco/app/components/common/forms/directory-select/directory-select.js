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
  component('directoryselect', {
    templateUrl: 'components/common/forms/directory-select/directory-select.html',
    controller: DirectorySelectController,
    bindings: {
      customerrormessage: '<?',
      defaultpath: '<?',
      model: '=',
      field: '<',
      name: '@',
      onselectdirectory: '&',
      forbiddendirectory: '<',
      placeholder: '@'
    }
  });


function DirectorySelectController($timeout, MainProcessCallbackExecutorService) {

  const ipc = require('electron').ipcRenderer;
  let self = this;

  self.dismissLoader = function() {
    self.opening = false;
  };

  self.$onInit = function () {
    self.opening = false;
    ipc.on('SYSTEM_DIALOG_OPEN', self.dismissLoader);
  };

  self.$onDestroy = function () {
    ipc.removeListener('SYSTEM_DIALOG_OPEN', self.dismissLoader);
  };

  self.opendirectorydialog = function() {
    self.opening = true;
    $timeout(function () {
      let callbackId = MainProcessCallbackExecutorService.register(self.onselectdirectory);
      ipc.send('selectdirectory', {
        callbackId: callbackId,
        defaultPath: self.defaultpath
      });
    }, 0);
  };

  // show errors
  self.hasError = function() {
    return self.field.$$parentForm.$submitted && self.field.$invalid;
  };
}
