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
const env = process.env.NODE_ENV || 'development';

// add os info
global.os = process.platform;

// add absolute path
global.appPath = __dirname;

// add winston logger
global.logger = initLogger();

// add debug features like hotkeys for triggering dev tools and reload
const isDev = require('electron-is-dev');
if (isDev) {
  logger.debug('Running in development -  global path:' + global.appPath);
  require('electron-debug')();
} else {
  logger.debug('Running in production -  global path:' + global.appPath);
  //require('electron-debug')();
}


// zipper/unzipper
var zip;
global.getzip = function () {
  if (!zip) {
    zip = initZip();
  }
  return zip;
};

// project db connection
var projectdbconnection;
global.getprojectdbconnection = function() {
  if (!projectdbconnection) {
    projectdbconnection = initProjectDbConnection();
  }
  return projectdbconnection;
};

// bibisco db connection
var bibiscodbconnection;
global.getbibiscodbconnection = function() {
  if (!bibiscodbconnection) {
    bibiscodbconnection = initBibiscoDbConnection();
  }
  return bibiscodbconnection;
};

// add dialog
const {
  dialog
} = require('electron');
global.dialog = dialog;


// prevent window being garbage collected
let mainWindow;

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
    filename: './logs/bibisco.log',
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


function initProjectDbConnection() {
  logger.info('initProjectDbConnection()');
  let fs = require('fs-extra');
  let loki = require('lokijs');
  let LokiFsSyncAdapter = require('./adapters/lokijs/loki-fs-sync-adapter.js');

  return {
    // add function to create project db
    create: function(dbName, dbPath) {
      fs.mkdirSync(dbPath);
      fs.mkdirSync(dbPath + '/images' );
      var projectdbfilepath = dbPath + '/' + dbName + '.json';
      var projectdb = new loki(projectdbfilepath, {
        adapter: new LokiFsSyncAdapter()
      });
      projectdb.saveDatabase(function() {
        logger.info('Database ' + projectdbfilepath + ' created!');
      });

      return projectdb;
    },

    // add function to load project db
    load: function(dbName, dbPath) {
      var projectdbfilepath = dbPath + '/' + dbName + '.json';
      var projectdb = new loki(projectdbfilepath, {
        adapter: new LokiFsSyncAdapter()
      });
      projectdb.loadDatabase({}, function() {
        logger.info('Database ' + projectdbfilepath + ' loaded!');
      });
      return projectdb;
    }
  };
}

function initBibiscoDbConnection() {

  let path = require('path');
  let loki = require('lokijs');
  let LokiFsSyncAdapter = require('./adapters/lokijs/loki-fs-sync-adapter.js');

  return {
    // add function to load bibisco db
    load: function() {
      let bibiscodbpath = path.join(global.appPath, path.join('db','bibisco.json'));  
      logger.debug('bibisco db path: ' + bibiscodbpath);
      var bibiscodb = new loki(bibiscodbpath, {
        adapter: new LokiFsSyncAdapter()
      });
      bibiscodb.loadDatabase({}, function() {
        logger.debug('bibisco.json db loaded');
      });
      return bibiscodb;
    }
  };
}
