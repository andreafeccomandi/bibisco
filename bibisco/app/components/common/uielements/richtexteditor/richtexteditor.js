/*
 * Copyright (C) 2014-2019 Andrea Feccomandi
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
  component('richtexteditor', {
    templateUrl: 'components/common/uielements/richtexteditor/richtexteditor.html',
    controller: RichTextEditorController,
    bindings: {
      autosaveenabled: '=',
      characters: '=',
      content: '=',
      words: '='
    }
  });


function RichTextEditorController($document, $injector, $rootScope, 
  $scope, $timeout, $uibModal, hotkeys, Chronicle, ContextService, 
  PopupBoxesService, SanitizeHtmlService, SupporterEditionChecker, 
  RichTextEditorPreferencesService, WordCharacterCountService) {

  var self = this;
  var electron = require('electron');
  var SearchService = null;

  self.$onInit = function() {
    self.contenteditable = true;
    self.checkExit = {
      active: true
    };
    self.exitfullscreenmessage = false;

    // init OS
    if (ContextService.getOs() === 'darwin') {
      self.os = '_mac';
    } else {
      self.os = '';
    }

    // init styles and spell check
    self.fontclass = RichTextEditorPreferencesService.getFontClass();
    self.indentclass = RichTextEditorPreferencesService.getIndentClass();
    self.spellcheckenabled = RichTextEditorPreferencesService.isSpellCheckEnabled();

    // init editor button states
    self.boldactive = false;
    self.italicactive = false;
    self.underlineactive = false;
    self.strikethroughactive = false;
    self.highlightactive = false;
    self.aligncenteractive = false;
    self.alignleftactive = false;
    self.alignrightactive = false;
    self.justifyactive = false;
    self.orderedlistactive = false;
    self.unorderedlistactive = false;
    self.showfindreplacetoolbar = false;
    self.casesensitiveactive = false;
    self.wholewordactive = false;

    // init find & replace text
    self.initFindReplace();

    // saved content
    self.savedcontent = self.content;
    self.savedcharacters = self.characters;
    self.savedwords = self.words;

    // init content
    if (self.content === '') {
      self.content = '<p><br></p>';
    } else {
      // replace &nbsp; with spaces
      self.content = self.content.replace(/&nbsp;/g, ' ');
    }

    // record changes on self.content
    self.chronicle = Chronicle.record('content', this, true);
    
    // set <p> as default paragraph separator
    $document[0].execCommand('defaultParagraphSeparator', false, 'p');

    // init words and characters
    self.countWordsAndCharacters();

    // focus on editor
    self.richtexteditorcontainer = document.getElementById('richtexteditorcontainer');
    self.richtexteditor = document.getElementById('richtexteditor');
    self.lastcursorposition = 0;
    self.focus();

    // manage search on open
    self.manageSearchOnOpen();

    // clear current match on project explorer selection
    $rootScope.$on('PROJECT_EXPLORER_SELECTED_ITEM', function () {
      self.currentmatch = 0;
    });

    // notify 
    $rootScope.$emit('OPEN_RICH_TEXT_EDITOR');
  };

  self.manageSearchOnOpen = function () {
    if ($rootScope.richtexteditorSearchActiveOnOpen) {
      self.showfindreplacetoolbar = true;
      self.texttofind = $rootScope.text2search;
      self.casesensitiveactive = $rootScope.searchCasesensitiveactive;
      self.wholewordactive = $rootScope.searchWholewordactive;
      self.executeFind(new DOMParser().parseFromString(self.content, 'text/html'));
      if (self.matches) {
        $timeout(function(){
          self.nextMatch();
        }, 0);
      }
    }
  };

  self.initFindReplace = function() {
    self.casesensitiveactive = false;
    self.currentmatch = 0;
    self.matches = null;
    self.texttofind = null;
    self.texttoreplace = null;
    self.totalmatch = 0;
    self.wholewordactive = false;
  };

  $scope.$on('$locationChangeStart', function(event) {
    PopupBoxesService.locationChangeConfirm(event, $rootScope.dirty, self.checkExit,
      function() {
        self.characters = self.savedcharacters;
        self.content = self.savedcontent;
        self.words = self.savedwords;
      });
  });

  $rootScope.$on('INIT_RICH_TEXT_EDITOR', function () {
    self.focus();
  });

  $rootScope.$on('REPLACE_MISSPELLING', function () {
    $rootScope.dirty = true;
    $scope.$apply();
  });

  $rootScope.$on('OPEN_POPUP_BOX', function () {
    self.contenteditable = false;
  });

  $rootScope.$on('CLOSE_POPUP_BOX', function () {
    self.contenteditable = true;
    self.focus();
  });

  $rootScope.$on('CONTENT_SAVED', function () {
    self.savedcontent = self.content;
    self.savedcharacters = self.characters;
    self.savedwords = self.words;
  });

  self.blur = function() {
    self.disablestylebuttons();
    self.lastcursorposition = self.getCurrentCursorPosition();
    $timeout(function(){
      if (self.currentmatch && !self.isTextSelected()) {
        self.currentmatch = 0;
      }
    },0);
  };

  self.focus = function() {
    setTimeout(function () {
      self.richtexteditor.focus();
    }, 0);
  };

  self.disablestylebuttons = function() {
    self.boldactive = false;
    self.italicactive = false;
    self.underlineactive = false;
    self.strikethroughactive = false;
    self.highlightactive = false;
    self.aligncenteractive = false;
    self.alignleftactive = false;
    self.alignrightactive = false;
    self.justifyactive = false;
    self.orderedlistactive = false;
    self.unorderedlistactive = false;
  };

  hotkeys.bindTo($scope)
    .add({
      combo: ['ctrl+Z', 'command+z'],
      description: 'undo',
      callback: function (event) {
        event.preventDefault();
        self.undo();
      }
    })
    .add({
      combo: ['ctrl+Y', 'command+y'],
      description: 'redo',
      callback: function(event) {
        event.preventDefault();
        self.redo();
      }
    })
    .add({
      combo: ['ctrl+B', 'command+b'],
      description: 'bold',
      callback: function () {
        event.preventDefault();
        self.bold();
      }
    })
    .add({
      combo: ['ctrl+P', 'command+p'],
      description: 'print',
      callback: function () {
        event.preventDefault();
        self.print();
      }
    })
    .add({
      combo: ['ctrl+I', 'command+i'],
      description: 'italic',
      callback: function () {
        event.preventDefault();
        self.italic();
      }
    })
    .add({
      combo: ['ctrl+U', 'command+u'],
      description: 'underline',
      callback: function() {
        event.preventDefault();
        self.underline();
      }
    })
    .add({
      combo: ['ctrl+1', 'command+1'],
      description: 'left guillemet',
      callback: function() {
        self.leftguillemet();
      }
    })
    .add({
      combo: ['ctrl+2', 'command+2'],
      description: 'right guillemet',
      callback: function() {
        self.rightguillemet();
      }
    })
    .add({
      combo: ['ctrl+3', 'command+3'],
      description: 'em dash',
      callback: function() {
        self.emdash();
      }
    })
    .add({
      combo: ['ctrl+5', 'command+5'],
      description: 'strikethrough',
      callback: function() {
        self.strikethrough();
      }
    })
    .add({
      combo: ['ctrl+6', 'command+6'],
      description: 'highlight',
      callback: function() {
        self.highlight();
      }
    })
    .add({
      combo: ['ctrl+F', 'command+f'],
      description: 'find',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.toggleFindReplaceToolbar();
      }
    })
    .add({
      combo: ['alt+down', 'alt+down'],
      description: 'selectnextmatch',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.nextMatch();
      }
    })
    .add({
      combo: ['alt+up', 'alt+up'],
      description: 'selectpreviousmatch',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.previousMatch();
      }
    })
    .add({
      combo: ['ctrl+D', 'command+d'],
      description: 'fullscreen',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.fullscreen();
      }
    });

  self.checkselectionstate = function() {

    if ($document[0].queryCommandState('bold')) {
      self.boldactive = true;
    } else {
      self.boldactive = false;
    }

    if ($document[0].queryCommandState('italic')) {
      self.italicactive = true;
    } else {
      self.italicactive = false;
    }

    if ($document[0].queryCommandState('underline')) {
      self.underlineactive = true;
    } else {
      self.underlineactive = false;
    }

    if ($document[0].queryCommandState('strikeThrough')) {
      self.strikethroughactive = true;
    } else {
      self.strikethroughactive = false;
    }

    if ($document[0].queryCommandValue('BackColor').toString() ===
      'rgb(255, 255, 0)') {
      self.highlightactive = true;
    } else {
      self.highlightactive = false;
    }

    if ($document[0].queryCommandState('justifyCenter')) {
      self.aligncenteractive = true;
    } else {
      self.aligncenteractive = false;
    }

    if ($document[0].queryCommandState('justifyLeft')) {
      self.alignleftactive = true;
    } else {
      self.alignleftactive = false;
    }

    if ($document[0].queryCommandState('justifyRight')) {
      self.alignrightactive = true;
    } else {
      self.alignrightactive = false;
    }

    if ($document[0].queryCommandState('justifyFull')) {
      self.justifyactive = true;
    } else {
      self.justifyactive = false;
    }

    if ($document[0].queryCommandState('insertOrderedList')) {
      self.orderedlistactive = true;
    } else {
      self.orderedlistactive = false;
    }

    if ($document[0].queryCommandState('insertUnorderedList')) {
      self.unorderedlistactive = true;
    } else {
      self.unorderedlistactive = false;
    }
  };

  self.undo = function() {
    self.chronicle.undo();
    $timeout(function () { 
      self.contentChanged(); 
    }, 0);
  };

  self.redo = function() {
    self.chronicle.redo();
    $timeout(function () { 
      self.contentChanged(); 
    }, 0);
  };

  self.print = function() {
    var printMe = document.getElementById('richtexteditor');
    var printIframe = document.createElement('iframe');
    printIframe.name = 'print_iframe';
    document.body.appendChild(printIframe);
    var printIframeWindow = window.frames['print_iframe'];
    var printDocument = printIframeWindow.document;
    printDocument.write('<html><body></body></html>');
    printDocument.body.innerHTML = printMe.innerHTML;
    printIframeWindow.print();
    printIframe.parentNode.removeChild(printIframe);
  };

  self.copy = function() {
    $document[0].execCommand('copy');
    $rootScope.dirty = true;
  };

  self.cut = function() {
    $document[0].execCommand('cut');
    $rootScope.dirty = true;
  };

  self.paste = function() {
    $timeout(function() {
      $document[0].execCommand('paste');
      $rootScope.dirty = true;
    });
  };

  self.manageFormat = function () {
    $rootScope.dirty = true;
    self.checkselectionstate();

    if (self.currentmatch) {
      self.updateContentFromDom();
      $timeout(function () {
        self.moveToCurrentMatch();
      }, 0);
    } 
  };

  self.bold = function () {
    $document[0].execCommand('bold');
    self.manageFormat();
  };

  self.italic = function() {
    $document[0].execCommand('italic');
    self.manageFormat();
  };

  self.underline = function() {
    $document[0].execCommand('underline');
    self.manageFormat();
  };

  self.strikethrough = function() {
    $document[0].execCommand('strikeThrough');
    self.manageFormat();
  };

  self.highlight = function() {
    if ($document[0].queryCommandValue('BackColor').toString() ===
      'rgb(255, 255, 0)') {
      $document[0].execCommand('hiliteColor', false, 'inherit');
    } else {
      $document[0].execCommand('hiliteColor', false, 'rgb(255, 255, 0)');
    }
    self.manageFormat();
  };

  self.leftguillemet = function() {
    $document[0].execCommand('insertText', false, '«');
    self.checkselectionstate();
    self.contentChanged();
  };

  self.rightguillemet = function() {
    $document[0].execCommand('insertText', false, '»');
    self.checkselectionstate();
    self.contentChanged();
  };

  self.emdash = function() {
    $document[0].execCommand('insertText', false, '—');
    self.checkselectionstate();
    self.contentChanged();
  };

  self.orderedlist = function() {
    $document[0].execCommand('insertOrderedList');
    self.manageFormat();
  };

  self.unorderedlist = function() {
    $document[0].execCommand('insertUnorderedList');
    self.manageFormat();
  };

  self.aligncenter = function() {
    $document[0].execCommand('justifyCenter');
    self.manageFormat();
    self.focus();
  };

  self.alignleft = function() {
    $document[0].execCommand('justifyLeft');
    self.manageFormat();
    self.focus();
  };

  self.alignright = function() {
    $document[0].execCommand('justifyRight');
    self.manageFormat();
    self.focus();
  };

  self.justify = function() {
    $document[0].execCommand('justifyFull');
    self.manageFormat();
    self.focus();
  };

  self.sanitizePaste = function($event) {
    let text;
    let sanitizedText;
    if ($event.clipboardData) {
      text = $event.clipboardData.getData('text/html');
      if (text) {
        sanitizedText = SanitizeHtmlService.sanitize(text);
      } else {
        sanitizedText = $event.clipboardData.getData('text/plain');
        sanitizedText = sanitizedText.replace(/(?:\r\n|\r|\n)/g, '</p><p>');
      }
      $event.preventDefault();
      $timeout(function() {
        $document[0].execCommand('insertHTML', false, sanitizedText);
      });
    }
  };

  self.focusOnText2Find = function() {
    $timeout(function () {
      try {
        document.getElementById('richtexteditortexttofind').focus();
      } catch (error) {
        console.log(error);
      }
    });
  };

  self.toggleFindReplaceToolbar = function() {
    self.supporterEditionFilterAction(function() {
      self.showfindreplacetoolbar = !self.showfindreplacetoolbar;
      if (self.showfindreplacetoolbar) {
        self.focusOnText2Find();
      } else {
        self.initFindReplace();
      }
    });
  };

  self.fullscreen = function () {
    self.supporterEditionFilterAction(function () {
      $rootScope.fullscreen = true;
      $timeout(function () {
        var window = electron.remote.getCurrentWindow();
        if (window.isFullScreen()) {
          $rootScope.previouslyFullscreen = true;
        } else {
          window.setFullScreen(true);
          $rootScope.previouslyFullscreen = false;
        }
        self.exitfullscreenmessage = true;
        self.focus();
        $timeout(function () {
          self.exitfullscreenmessage = false;
        }, 2000);
      },0);
    });
  };

  self.supporterEditionFilterAction = function (action) {
    if (!SupporterEditionChecker.check()) {
      SupporterEditionChecker.showSupporterMessage();
    } else {
      $injector.get('IntegrityService').ok();
      action();
    }
  };

  self.toggleCaseSensitive = function() {
    self.casesensitiveactive = !self.casesensitiveactive;
    self.find();
    self.focusOnText2Find();
  };

  self.toggleWholeWord = function () {
    self.wholewordactive = !self.wholewordactive;
    self.find();
    self.focusOnText2Find();
  };

  self.texttofindChange = function() {
    self.content = self.content.replace(/&nbsp;/g, ' ');
    self.find();
  };

  self.find = function () {
    self.executeFind(self.richtexteditor);
  }; 

  self.executeFind = function (dom) {

    self.matches = null;

    if (self.texttofind) {
      self.matches = self.getSearchService().find(dom, self.texttofind,
        self.casesensitiveactive, self.wholewordactive);
      if (self.matches && self.matches.length > 0) {
        self.totalmatch = self.matches.length;
      } else {
        self.totalmatch = 0;
      }
      self.currentmatch = 0;
    }
  }; 

  self.previousMatch = function() {
    self.moveToNextMatch('previous');
  };

  self.nextMatch = function() {
    self.moveToNextMatch('next');
  };

  self.clearCurrentMatch = function () {
    self.currentmatch = 0;
  };

  self.calculateFirstMatch = function(direction) {
    if (self.matches && self.matches.length > 0) {
      let found = false;
      for (let i = 0; i < self.matches.length; i++) {
        if (self.lastcursorposition <= self.matches[i].endIndex) {
          self.currentmatch = (i + 1);
          self.selectMatch(self.matches[i].startIndex, self.matches[i].endIndex);
          found = true;
          break;
        }
      }
      if (!found) {
        self.currentmatch = 1;
      }
    } 
  };

  self.calculateNextMatch = function (direction) {
    if (direction === 'previous') {
      self.currentmatch = self.currentmatch - 1;
    } else {
      self.currentmatch = self.currentmatch + 1;
    }
    if (self.currentmatch === 0) {
      self.currentmatch = self.totalmatch;
    } else if (self.currentmatch === (self.totalmatch + 1)) {
      self.currentmatch = 1;
    }
  };

  self.moveToNextMatch = function(direction) {
    if (!self.matches || self.matches.length === 0)  {
      return;
    }
    if (self.currentmatch) {
      self.calculateNextMatch(direction);
    } else {
      self.calculateFirstMatch(direction);
    }

    self.moveToCurrentMatch();
  };

  self.moveToCurrentMatch = function() {
    self.selectMatch(self.matches[self.currentmatch - 1].startIndex,
      self.matches[self.currentmatch - 1].endIndex);

    self.checkselectionstate();
  };

  self.selectMatch = function (start, end) {
    $timeout(function () {
      if (end-start>0) {
        let selection = window.getSelection();
        let range = self.createRange(self.richtexteditor, { 
          start: start, end: end
        });
        if (range) {
          selection.removeAllRanges();
          selection.addRange(range);
          let rangeTop = self.getRangeTop(range);
          self.richtexteditorcontainer.scrollTop = 
            self.richtexteditorcontainer.scrollTop + rangeTop - 450;
        }
      }
    }, 0);
  };

  self.createRange = function (node, chars, range) {
    if (!range) {
      range = document.createRange();
    }

    if (chars.end === 0) {
      range.setEnd(node, chars.end);

    } else if (node && chars.end > 0) {
      if (node.nodeType === Node.TEXT_NODE) {

        // manage start
        if (chars.start > -1 && chars.start < node.textContent.length) {
          range.selectNode(node);
          range.setStart(node, chars.start);
          chars.start = -1;
        } else {
          chars.start -= node.textContent.length;
        }

        // manage end
        if (node.textContent.length < chars.end) {
          chars.end -= node.textContent.length;
        } else {
          range.setEnd(node, chars.end);
          chars.end = 0;
        }

      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          range = self.createRange(node.childNodes[i], chars, range);
          if (chars.end === 0) {
            break;
          }
        }
      }
    }

    return range;
  };
  
  self.getRangeTop = function(range) {
    let result = 0;
    
    if (range) {
      let rects = range.getClientRects();
      if (rects.length > 0) {
        rect = rects[0];
        result = rect.top;
      }
    } 

    return result;
  };

  self.replaceNext = function() {
    if (self.currentmatch) {
      self.getSearchService().replace(self.richtexteditor, self.texttofind,
        self.texttoreplace, self.casesensitiveactive, self.wholewordactive,
        self.currentmatch);
      self.updateContentFromDom();
      self.contentChanged();
      self.focus();
      $timeout(function () {
        self.nextMatch();
      }, 0);
      
    } else {
      self.nextMatch();
    }
  }; 

  self.updateContentFromDom = function() {
    self.content = self.richtexteditor.innerHTML;
  };

  self.replaceAll = function () {
    self.getSearchService().replace(self.richtexteditor, self.texttofind,
      self.texttoreplace, self.casesensitiveactive, self.wholewordactive);
    self.updateContentFromDom();
    self.contentChanged();
  }; 

  self.getCurrentCursorPosition = function() {

    let caretOffset = 0;
    try {
      if (window.getSelection()) {
        let range = window.getSelection().getRangeAt(0);
        let preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(self.richtexteditor);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
    } catch (error) {
      console.log(error);
    }

    return caretOffset;
  };

  self.isTextSelected = function() {

    let result = false;
    try {
      let selection = window.getSelection();
      if (selection) {
        result = selection.type !== 'None';
      }
    } catch (error) {
      console.log(error);
    }
    return result;
  };

  self.opensettings = function() {

    self.currentmatch = 0;
    var modalInstance = $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'richtexteditorsettings',
      size: 'richtexteditorsettings'
    });

    $rootScope.$emit('OPEN_POPUP_BOX');

    modalInstance.result.then(function() {
      // save
      self.fontclass = RichTextEditorPreferencesService.getFontClass();
      self.indentclass = RichTextEditorPreferencesService.getIndentClass();
      self.spellcheckenabled = RichTextEditorPreferencesService.isSpellCheckEnabled();
      self.content = self.content + ' '; // force change text to enable/disabled spellcheck
      self.autosaveenabled = RichTextEditorPreferencesService.isAutoSaveEnabled();
      $rootScope.$emit('CLOSE_POPUP_BOX');
    }, function () {
      $rootScope.$emit('CLOSE_POPUP_BOX');

    });
  };

  self.clickoneditor = function() {
    self.currentmatch = 0;
  };

  self.contentChanged = function() {
    self.countWordsAndCharacters(); 
    if (self.texttofind) {
      self.find();
    }
    $rootScope.dirty = true;
  };

  self.countWordsAndCharacters = function() {
    let result = WordCharacterCountService.count(self.content);
    self.words = result.words;
    self.characters = result.characters;
  };

  self.getSearchService = function() {
    if (!SearchService) {
      $injector.get('IntegrityService').ok();
      SearchService = $injector.get('SearchService');
    }

    return SearchService;
  };
}
