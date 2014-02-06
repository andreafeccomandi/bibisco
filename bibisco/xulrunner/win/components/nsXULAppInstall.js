/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
//@line 41 "e:\builds\moz2_slave\rel-m-rel-xr-w32-bld\build\xulrunner\setup\nsXULAppInstall.js"

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

const nsIFile             = Components.interfaces.nsIFile;
const nsIINIParser        = Components.interfaces.nsIINIParser;
const nsIINIParserFactory = Components.interfaces.nsIINIParserFactory;
const nsILocalFile        = Components.interfaces.nsILocalFile;
const nsISupports         = Components.interfaces.nsISupports;
const nsIXULAppInstall    = Components.interfaces.nsIXULAppInstall;
const nsIZipReader        = Components.interfaces.nsIZipReader;

function getDirectoryKey(aKey) {
  try {
    return Components.classes["@mozilla.org/file/directory_service;1"].
      getService(Components.interfaces.nsIProperties).
      get(aKey, nsIFile);
  }
  catch (e) {
    throw "Couln't get directory service key: " + aKey;
  }
}

function createINIParser(aFile) {
  return Components.manager.
    getClassObjectByContractID("@mozilla.org/xpcom/ini-parser-factory;1",
                               nsIINIParserFactory).
    createINIParser(aFile);
}

function copy_recurse(aSource, aDest) {
  var e = aSource.directoryEntries;

  while (e.hasMoreElements()) {
    var f = e.getNext().QueryInterface(nsIFile);
    var leaf = f.leafName;

    var ddest = aDest.clone();
    ddest.append(leaf);

    if (f.isDirectory()) {
      copy_recurse(f, ddest);
    }
    else {
      if (ddest.exists())
        ddest.remove(false);

      f.copyTo(aDest, leaf);
    }
  }
}

const PR_WRONLY = 0x02;
const PR_CREATE_FILE = 0x08;
const PR_TRUNCATE = 0x20;

function openFileOutputStream(aFile) {
  var s = Components.classes["@mozilla.org/network/file-output-stream;1"].
    createInstance(Components.interfaces.nsIFileOutputStream);
  s.init(aFile, PR_WRONLY | PR_CREATE_FILE | PR_TRUNCATE, 0644, 0);
  return s;
}

/**
 * An extractor implements the following prototype:
 * readonly attribute nsIINIPaser iniParser;
 * void copyTo(in nsILocalFile root);
 */

function directoryExtractor(aFile) {
  this.mDirectory = aFile;
}

directoryExtractor.prototype = {
  mINIParser : null,

  get iniParser() {
    if (!this.mINIParser) {
      var iniFile = this.mDirectory.clone();
      iniFile.append("application.ini");

      this.mINIParser = createINIParser(iniFile);
    }
    return this.mINIParser;
  },

  copyTo : function de_copyTo(aDest) {
    // Assume the root already exists
    copy_recurse(this.mDirectory, aDest);
  }
};

function zipExtractor(aFile) {
  this.mZipReader = Components.classes["@mozilla.org/libjar/zip-reader;1"].
    createInstance(nsIZipReader);
  this.mZipReader.open(aFile);
  this.mZipReader.test(null);
}

zipExtractor.prototype = {
  mINIParser : null,

  get iniParser() {
    if (!this.mINIParser) {
      // XXXbsmedberg: this is not very unique, guessing could be a problem
      var f = getDirectoryKey("TmpD");
      f.append("application.ini");
      f.createUnique(nsIFile.NORMAL_FILE_TYPE, 0600);

      try {
        this.mZipReader.extract("application.ini", f);
        this.mINIParser = createINIParser(f);
      }
      catch (e) {
        try {
          f.remove();
        }
        catch (ee) { }

        throw e;
      }
      try {
        f.remove();
      }
      catch (e) { }
    }
    return this.mINIParser;
  },

  copyTo : function ze_CopyTo(aDest) {
    var entries = this.mZipReader.findEntries(null);
    while (entries.hasMore()) {
      var entryName = entries.getNext();

      this._installZipEntry(this.mZipReader, entryName, aDest);
    }
  },

  _installZipEntry : function ze_installZipEntry(aZipReader, aZipEntry,
                                                 aDestination) {
    var file = aDestination.clone();

    var dirs = aZipEntry.split(/\//);
    var isDirectory = /\/$/.test(aZipEntry);

    var end = dirs.length;
    if (!isDirectory)
      --end;

    for (var i = 0; i < end; ++i) {
      file.append(dirs[i]);
      if (!file.exists()) {
        file.create(nsIFile.DIRECTORY_TYPE, 0755);
      }
    }

    if (!isDirectory) {
      file.append(dirs[end]);
      aZipReader.extract(aZipEntry, file);
    }
  }
};

function createExtractor(aFile) {
  if (aFile.isDirectory())
    return new directoryExtractor(aFile);

  return new zipExtractor(aFile);
}

function AppInstall() {
}

AppInstall.prototype = {
  classID: Components.ID("{00790a19-27e2-4d9a-bef0-244080feabfd}"),

  /* nsISupports */
  QueryInterface : XPCOMUtils.generateQI([nsIXULAppInstall]),

  /* nsIXULAppInstall */
  installApplication : function ai_IA(aAppFile, aDirectory, aLeafName) {
    var extractor = createExtractor(aAppFile);
    var iniParser = extractor.iniParser;

    var appName = iniParser.getString("App", "Name");

    // vendor is optional
    var vendor;
    try {
      vendor = iniParser.getString("App", "Vendor");
    }
    catch (e) { }

    if (aDirectory == null) {
//@line 235 "e:\builds\moz2_slave\rel-m-rel-xr-w32-bld\build\xulrunner\setup\nsXULAppInstall.js"
      aDirectory = getDirectoryKey("ProgF");
      if (vendor)
        aDirectory.append(vendor);
//@line 251 "e:\builds\moz2_slave\rel-m-rel-xr-w32-bld\build\xulrunner\setup\nsXULAppInstall.js"
    }
    else {
      aDirectory = aDirectory.clone();
    }

    if (!aDirectory.exists()) {
      aDirectory.create(nsIFile.DIRECTORY_TYPE, 0755);
    }

    if (aLeafName == "") {
//@line 265 "e:\builds\moz2_slave\rel-m-rel-xr-w32-bld\build\xulrunner\setup\nsXULAppInstall.js"
      aLeafName = appName;
//@line 270 "e:\builds\moz2_slave\rel-m-rel-xr-w32-bld\build\xulrunner\setup\nsXULAppInstall.js"
    }

    aDirectory.append(aLeafName);
    if (!aDirectory.exists()) {
      aDirectory.create(nsIFile.DIRECTORY_TYPE, 0755);
    }

//@line 341 "e:\builds\moz2_slave\rel-m-rel-xr-w32-bld\build\xulrunner\setup\nsXULAppInstall.js"
    extractor.copyTo(aDirectory);

    var xulrunnerBinary = getDirectoryKey("GreD");
    xulrunnerBinary.append("xulrunner-stub.exe");

    xulrunnerBinary.copyTo(aDirectory, appName.toLowerCase() + ".exe");
//@line 348 "e:\builds\moz2_slave\rel-m-rel-xr-w32-bld\build\xulrunner\setup\nsXULAppInstall.js"
  }
};

const NSGetFactory = XPCOMUtils.generateNSGetFactory([AppInstall]);
