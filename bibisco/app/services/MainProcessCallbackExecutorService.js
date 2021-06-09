/*
 * Copyright (C) 2014-2021 Andrea Feccomandi
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

angular.module('bibiscoApp').service('MainProcessCallbackExecutorService', 
  function (UuidService) {
    'use strict';

    const ipc = require('electron').ipcRenderer;
    let callbacks = [];

    ipc.on('master-process-callback', function (event, arg) {
      let callback = callbacks[arg.callbackId];
      delete callbacks[arg.callbackId];
      callback.apply(this, arg.params);
    });

    return {
      register: function(callback) {
        let callbackId = UuidService.generateUuid();
        callbacks[callbackId] = callback;
        return callbackId;
      }
    };
  });
