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
  component('fileselect', {
    templateUrl: 'components/common/forms/file-select/file-select.html',
    controller: FileSelectController,
    bindings: {
      defaultpath: '<?',
      filefilter: '<',
      onselectfile: '&'
    }
  });


function FileSelectController($timeout, MainProcessCallbackExecutorService) {

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

  self.openfiledialog = function() {
    self.opening = true;
    $timeout(function () {
      let callbackId = MainProcessCallbackExecutorService.register(self.onselectfile);
      ipc.send('selectfile', {
        callbackId: callbackId,
        defaultPath: self.defaultpath,
        filefilter: self.filefilter
      });
    }, 0);
  };
}
