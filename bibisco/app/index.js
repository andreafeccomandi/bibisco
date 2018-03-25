/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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
'use strict';
const electron = require('electron');
const app = electron.app;
const env = process.env.NODE_ENV || 'development';
const ipc = require('electron').ipcMain;

// prevent window being garbage collected
let mainWindow;

// add winston logger
const logger = initLogger();
ipc.on('logger-debug', function (event, arg) {
  logger.debug(arg);
});
ipc.on('logger-info', function (event, arg) {
  logger.info(arg);
});
ipc.on('logger-error', function (event, arg) {
  logger.error(arg);
});

// add debug features like hotkeys for triggering dev tools and reload
const isDev = require('electron-is-dev');
if (isDev) {
  logger.debug('Running in development -  global path:' + __dirname);
  require('electron-debug')();
} else {
  logger.debug('Running in production -  global path:' + __dirname);
}

// zipper/unzipper
var zip;
ipc.on('zipFolder', function (event, arg) {
  getZip().zipFolder(arg.folderToZip, arg.zippedFilePath, function () {
    mainWindow.webContents.send('master-process-callback', { callbackId: arg.callbackId });
  });
});
ipc.on('unzip', function (event, arg) {
  getZip().unzip(arg.zippedFilePath, arg.destinationFolder, function() {
    mainWindow.webContents.send('master-process-callback', { callbackId: arg.callbackId });
  });
});

ipc.on('getcontextinfo', function (event) {
  let contextInfo = {
    os: process.platform,
    appPath: __dirname
  };
  event.returnValue = contextInfo;
});

// add dialog
const {
  dialog
} = require('electron');
ipc.on('selectdirectory', function (event, arg) {
  dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory']
  },
  function (filenames) {
    if (filenames) {
      let params = [];
      params.push({directory: filenames[0]});
      mainWindow.webContents.send('master-process-callback', 
        { 
          callbackId: arg.callbackId,
          params: params
        });
    }
  });
});
ipc.on('selectfile', function (event, arg) {
  let filters;
  if (!arg.filefilter) {
    filters = [];
  } else {
    filters = [{
      name: 'filters',
      extensions: arg.filefilter
    }];
  }
  dialog.showOpenDialog({
    filters: filters,
    properties: ['openFile']
  },
  function (filenames) {
    if (filenames) {
      let params = [];
      params.push({ file: filenames[0] });
      mainWindow.webContents.send('master-process-callback',
        {
          callbackId: arg.callbackId,
          params: params
        });
    }
  });
});

function onClosed() {
  // dereference the window
  // for multiple windows store them in an array
  mainWindow = null;
}

function createMainWindow() {
  let icon = undefined;
  if (process.platform === 'linux') {
    icon = `${__dirname}/assets/icons/linux/bibisco-circle-hr.png`;
  } else if (process.platform === 'darwin') {
    icon = `${__dirname}/assets/icons/mac/icon.icns`;
  } else if (process.platform === 'win32') {
    icon = `${__dirname}/assets/icons/win/bibisco_circle_hr_MYa_icon.ico`;
  }
  const win = new electron.BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 1024,
    minHeight: 768,
    icon: icon,
    show: false
  });
  win.loadURL(`file://${__dirname}/index.html`, {
    'extraHeaders': 'pragma: no-cache\n'
  });
  win.once('ready-to-show', () => {
    win.show();
  });
  
  win.on('closed', onClosed);

  return win;
}

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (!mainWindow) {
    mainWindow = createMainWindow();
  }
});

app.on('ready', function() {
  mainWindow = createMainWindow();
  if (process.platform === 'darwin') {
    let menuTemplate;
    menuTemplate = [{
      label: 'bibisco',
      submenu: [{
        role: 'hide'
      }, {
        role: 'hideothers'
      }, {
        role: 'unhide'
      }, {
        type: 'separator'
      }, {
        role: 'undo'
      }, {
        role: 'redo'
      }, {
        type: 'separator'
      }, {
        role: 'cut'
      }, {
        role: 'copy'
      }, {
        role: 'paste'
      }, {
        role: 'delete'
      }, {
        role: 'selectall'
      }, {
        type: 'separator'
      }, {
        role: 'quit'
      }]
    }];
    const electronMenu = electron.Menu;
    const applicationMenu = electronMenu.buildFromTemplate(menuTemplate);
    electronMenu.setApplicationMenu(applicationMenu);
  }
});

function initLogger() {
  const logger = require('winston');
  logger.level = (env === 'development' ? 'debug' : 'info');
  logger.add(logger.transports.File, {
    filename: __dirname + '/logs/bibisco.log',
    json: false,
    maxsize: 1000000,
    maxFiles: 2,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    formatter: function(options) {
      var dateFormat = require('dateformat');
      // Return string will be passed to logger.
      return dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:l') + ' ' +
        options.level
          .toUpperCase() + ' ' + (options.message ? options.message : '') +
        (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON
          .stringify(
            options.meta) : '');
    }
  });

  return logger;
}

function getZip() {
  if (!zip) {
    zip = initZip();
  }

  return zip;
}

function initZip() {
  let fs = require('fs-extra');
  let path = require('path');
  let yazl = require('yazl');
  let yauzl = require('yauzl');
  let walkSync = require('walk-sync');

  return {
    zipFolder: function(folderToZip, zippedFilePath, callback) {
      logger.debug('Remote zipFolder start: ' + folderToZip);

      let zipfile = new yazl.ZipFile();
      let fileList = walkSync(folderToZip, {
        directories: false,
        globs: ['**/!(*.DS_Store)']
      });
      for (let i = 0; i < fileList.length; i++) {
        logger.debug('Processing ' + fileList[i]);
        zipfile.addFile(folderToZip + '/' + fileList[i],
          path.basename(folderToZip) + '/' +
          fileList[i]);
      }
      // call end() after all the files have been added
      zipfile.end();

      // pipe() can be called any time after the constructor
      zipfile.outputStream.pipe(fs.createWriteStream(zippedFilePath)).on(
        'close',
        function() {
          logger.info(zippedFilePath + ' done!');
          callback();
        });

      logger.debug('Remote zipFolder end');

    },
    unzip: function(zippedFilePath, destinationFolder, callback) {
      logger.debug('Remote unzip start: ' + zippedFilePath);
      yauzl.open(zippedFilePath, {
        lazyEntries: true
      }, function(err, zipfile) {
        // From documentation: https://github.com/thejoshwolfe/yauzl
        // The callback is given the arguments (err, zipfile).
        // An err is provided if the End of Central Directory Record cannot be
        // found, or if its metadata appears malformed. This kind of error
        // usually indicates that this is not a zip file.
        if (err) throw err;

        zipfile.readEntry();
        zipfile.on('close', function() {
          logger.debug('End extracting ' + zippedFilePath);
          callback();
        });
        zipfile.on('entry', function(entry) {
          logger.debug('Processing ' + entry.fileName);
          if (/\/$/.test(entry.fileName)) {
            // directory file names end with '/'
            fs.mkdirp(path.join(destinationFolder, entry.fileName),
              function(
                err) {
                if (err) throw err;
                zipfile.readEntry();
              });
          } else {
            // file entry
            zipfile.openReadStream(entry, function(err, readStream) {
              if (err) throw err;
              // ensure parent directory exists
              fs.mkdirp(path.join(destinationFolder, path.dirname(
                entry.fileName)),
              function(err) {
                if (err) throw err;
                readStream.pipe(fs.createWriteStream(path.join(
                  destinationFolder, entry.fileName)));
                readStream.on('end', function() {
                  zipfile.readEntry();
                });
              });
            });
          }
        });
      });
    }
  };
}

