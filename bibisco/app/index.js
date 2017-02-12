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
'use strict';
const electron = require('electron');

const app = electron.app;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// add winston logger
const logger = require('winston');
logger.level = 'debug';
logger.add(logger.transports.File, {
	filename: "./logs/bibisco.log",
	json: false,
	maxsize: 1000000,
  maxFiles: 3,
	handleExceptions: true,
  humanReadableUnhandledException: true,
  formatter: function(options) {
		var dateFormat = require('dateformat');
    // Return string will be passed to logger.
    return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:l")+ ' ' + options.level.toUpperCase() +' '+ (options.message ? options.message : '') +
      (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
  }
});
global.logger = logger;

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 800,
		height: 600
	});

	win.loadURL(`file://${__dirname}/index.html`,{"extraHeaders" : "pragma: no-cache\n"});
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});
