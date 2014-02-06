//@line 39 "e:\builds\moz2_slave\rel-m-rel-xr-w32-bld\build\toolkit\content\findUtils.js"
var gPromptService;
var gFindBundle;

function nsFindInstData() {}
nsFindInstData.prototype =
{
  // set the next three attributes on your object to override the defaults
  browser : null,

  get rootSearchWindow() { return this._root || this.window.content; },
  set rootSearchWindow(val) { this._root = val; },

  get currentSearchWindow() {
    if (this._current)
      return this._current;

    var focusedWindow = this.window.document.commandDispatcher.focusedWindow;
    if (!focusedWindow || focusedWindow == this.window)
      focusedWindow = this.window.content;

    return focusedWindow;
  },
  set currentSearchWindow(val) { this._current = val; },

  get webBrowserFind() { return this.browser.webBrowserFind; },

  init : function() {
    var findInst = this.webBrowserFind;
    // set up the find to search the focussedWindow, bounded by the content window.
    var findInFrames = findInst.QueryInterface(Components.interfaces.nsIWebBrowserFindInFrames);
    findInFrames.rootSearchFrame = this.rootSearchWindow;
    findInFrames.currentSearchFrame = this.currentSearchWindow;
  
    // always search in frames for now. We could add a checkbox to the dialog for this.
    findInst.searchFrames = true;
  },

  window : window,
  _root : null,
  _current : null
}

// browser is the <browser> element
// rootSearchWindow is the window to constrain the search to (normally window.content)
// currentSearchWindow is the frame to start searching (can be, and normally, rootSearchWindow)
function findInPage(findInstData)
{
  // is the dialog up already?
  if ("findDialog" in window && window.findDialog)
    window.findDialog.focus();
  else
  {
    findInstData.init();
    window.findDialog = window.openDialog("chrome://global/content/finddialog.xul", "_blank", "chrome,resizable=no,dependent=yes", findInstData);
  }
}

function findAgainInPage(findInstData, reverse)
{
  if ("findDialog" in window && window.findDialog)
    window.findDialog.focus();
  else
  {
    // get the find service, which stores global find state, and init the
    // nsIWebBrowser find with it. We don't assume that there was a previous
    // Find that set this up.
    var findService = Components.classes["@mozilla.org/find/find_service;1"]
                           .getService(Components.interfaces.nsIFindService);

    var searchString = findService.searchString;
    if (searchString.length == 0) {
      // no previous find text
      findInPage(findInstData);
      return;
    }

    findInstData.init();
    var findInst = findInstData.webBrowserFind;
    findInst.searchString  = searchString;
    findInst.matchCase     = findService.matchCase;
    findInst.wrapFind      = findService.wrapFind;
    findInst.entireWord    = findService.entireWord;
    findInst.findBackwards = findService.findBackwards ^ reverse;

    var found = findInst.findNext();
    if (!found) {
      if (!gPromptService)
        gPromptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService()
                                   .QueryInterface(Components.interfaces.nsIPromptService);                                     
      if (!gFindBundle)
        gFindBundle = document.getElementById("findBundle");
          
      gPromptService.alert(window, gFindBundle.getString("notFoundTitle"), gFindBundle.getString("notFoundWarning"));
    }      

    // Reset to normal value, otherwise setting can get changed in find dialog
    findInst.findBackwards = findService.findBackwards; 
  }
}

function canFindAgainInPage()
{
    var findService = Components.classes["@mozilla.org/find/find_service;1"]
                           .getService(Components.interfaces.nsIFindService);
    return (findService.searchString.length > 0);
}

