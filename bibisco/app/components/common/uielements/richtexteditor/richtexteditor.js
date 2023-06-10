/*
 * Copyright (C) 2014-2023 Andrea Feccomandi
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
      todaywords: '=?',
      totalwords: '=?',
      words: '='
    }
  });


function RichTextEditorController($document, $injector, $rootScope, 
  $scope, $timeout, $uibModal, $window, hotkeys, BibiscoPropertiesService, Chronicle, ContextService, 
  FullScreenService, PopupBoxesService, ProjectService, SanitizeHtmlService, SupporterEditionChecker, 
  RichTextEditorPreferencesService, UtilService, UuidService, WordCharacterCountService) {

  let self = this;
  const ipc = require('electron').ipcRenderer;
  const COMMENT_HEIGHT = 150;
  const COMMENT_WIDTH = 250+3; // width + space between comment box and editor
  let SearchService = null;

  self.$onInit = function() {
    self.contenteditable = true;
    self.checkExit = {
      active: true
    };

    // init OS
    if (ContextService.getOs() === 'darwin') {
      self.os = '_mac';
    } else {
      self.os = '';
    }

    // init styles, spell check and autocapitalize
    self.fontclass = RichTextEditorPreferencesService.getFontClass();
    self.indentclass = RichTextEditorPreferencesService.getIndentClass();
    self.linespacingclass = RichTextEditorPreferencesService.getLinespacingClass();
    self.paragraphspacingclass = RichTextEditorPreferencesService.getParagraphspacingClass();
    self.spellcheckenabled = RichTextEditorPreferencesService.isSpellCheckEnabled();
    self.autocapitalizeenabled = RichTextEditorPreferencesService.isAutocapitalizeEnabled();

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

    // init comment status
    self.showComment = false;
    self.commentPositionTop = null;
    self.commentPositionLeft = null;
    self.commentLineTop = null;
    self.commentLineLeft = null;
    self.commentLineWidth = null;
    self.commentText = null;
    self.activeCommentId = null;

    // init commentLineTopOffset
    self.commentLineTopOffset = self.calculateCommentLineTopOffset();

    // init find & replace text
    self.initFindReplace();

    // saved content
    self.savedcontent = self.content;
    self.savedcharacters = self.characters;
    self.savedwords = self.words;

    // today and total offset
    if (!self.todaywords) {self.todaywords = 0;};
    if (!self.totalwords) {self.totalwords = 0;};
    self.todayOffset = self.todaywords - self.words;
    self.totalOffset = self.totalwords - self.words;
  
    // word count mode
    self.wordCountMode = ProjectService.getProjectInfo().wordCountMode;

    // init content
    if (!self.content || self.content === '') {
      self.content = '<p><br></p>';
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
    self.focusOn1stParagraph();

    // manage search on open
    self.manageSearchOnOpen();

    // manage selected text on open
    self.manageTextSelectedOnOpen();

    // clear current match on project explorer selection
    $rootScope.$on('PROJECT_EXPLORER_SELECTED_ITEM', function () {
      self.currentmatch = 0;
    });

    // check selection state to update comment if shown
    $rootScope.$on('TOGGLE_PROJECT_EXPLORER', function () {
      $timeout(function(){
        self.checkselectionstate();
      }, 0);
    });

    // hide comment on project explorer selection
    $rootScope.$on('PROJECT_EXPLORER_SELECTED_ITEM', function () {
      self.showComment = false;
      self.activeCommentId = null;
    });

    // register replace misspelling listener
    self.replaceMisspellingListener = function(event){
      $rootScope.dirty = true;
      $scope.$apply();
    };
    ipc.on('REPLACE_MISSPELLING', self.replaceMisspellingListener);

    angular.element(self.richtexteditor).bind('mousewheel', function(){
      self.checkselectionstate();
    });
    angular.element($window).bind('resize', function () {
      self.checkselectionstate();
    });

    // notify 
    $rootScope.$emit('OPEN_RICH_TEXT_EDITOR');
  };

  self.$onDestroy = function () {
    ipc.removeListener('REPLACE_MISSPELLING', self.replaceMisspellingListener);
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

  self.manageTextSelectedOnOpen = function () {
    if ($rootScope.textSelected) {
      let matches = self.getSearchService().find(new DOMParser().parseFromString(self.content, 'text/html'), 
        $rootScope.textSelected, false, false);
      if (matches && matches.length > 0) {
        self.selectMatch(matches[0].startIndex, matches[0].endIndex);
      } 
    }
    $rootScope.textSelected = null;
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
    $timeout(function(){
      self.focusOn1stParagraph();
    }, 0);
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

  self.focusOn1stParagraph = function() {

    $timeout(function(){
      let firstParagraph = self.richtexteditor.querySelector('p');
      if (firstParagraph) {
        let range = document.createRange();
        let selection = window.getSelection();
        range.selectNodeContents(firstParagraph);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        self.focus();
      }
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
      combo: ['ctrl+z', 'command+z'],
      description: 'undo',
      callback: function (event) {
        event.preventDefault();
        self.undo();
      }
    })
    .add({
      combo: ['ctrl+y', 'command+y'],
      description: 'redo',
      callback: function(event) {
        event.preventDefault();
        self.redo();
      }
    })
    .add({
      combo: ['ctrl+b', 'command+b'],
      description: 'bold',
      callback: function () {
        event.preventDefault();
        self.bold();
      }
    })
    .add({
      combo: ['ctrl+p', 'command+p'],
      description: 'print',
      callback: function () {
        event.preventDefault();
        self.print();
      }
    })
    .add({
      combo: ['ctrl+i', 'command+i'],
      description: 'italic',
      callback: function () {
        event.preventDefault();
        self.italic();
      }
    })
    .add({
      combo: ['ctrl+u', 'command+u'],
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
      combo: ['ctrl+f', 'command+f'],
      description: 'find',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        event.preventDefault();
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
      combo: ['f11', 'command+l'],
      description: 'fullscreen',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.fullscreen();
      }
    }).
    add({
      combo: ['ctrl+shift+l', 'command+shift+l'],
      description: 'alignleft',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.alignleft();
      }
    }).
    add({
      combo: ['ctrl+shift+r', 'command+shift+r'],
      description: 'alignright',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.alignright();
      }
    }).
    add({
      combo: ['ctrl+shift+c', 'command+shift+c'],
      description: 'aligncenter',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.aligncenter();
      }
    }).
    add({
      combo: ['ctrl+shift+j', 'command+shift+j'],
      description: 'justify',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.justify();
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

    if ($document[0].queryCommandValue('BackColor').toString() === 'rgb(241, 228, 189)') {
      self.showComment = false;
      self.activeCommentId = null;
      
      let node = angular.element(window.getSelection().anchorNode);
      let commentId = null;
      
      // I cycle until I find a node that has a comment or until I get to the root node of the richtexteditor
      // How is it possible that the selection is detected but I get to the root of the Richtexteditor? 
      // It happens when I am deleting the node that contains the comment!
      while (!commentId && !(node.prop('tagName') && node.prop('tagName').toLowerCase() === 'richtexteditor')) {
        if (node.prop('tagName') && node.prop('tagName').toLowerCase() === 'span' && node.hasClass('comment-enabled')) {
          commentId = node.attr('data-commentid');
        } else {
          node = node.parent();
        }
      }

      if (commentId) {
        let editorPosition = self.richtexteditorcontainer.getBoundingClientRect();
        let spanComments = document.getElementsByClassName('comment-' + commentId);
        for (let i = 0; i < spanComments.length; i++) {
          const spanCommentPosition = spanComments[i].getBoundingClientRect();
          if (spanCommentPosition.top > editorPosition.top && spanCommentPosition.top < editorPosition.bottom) {
  
            if (spanCommentPosition.top + COMMENT_HEIGHT > editorPosition.bottom) {
              self.commentPositionTop = editorPosition.bottom - COMMENT_HEIGHT;
            } else {
              self.commentPositionTop = spanCommentPosition.top;
            }
            self.commentPositionLeft = editorPosition.left - COMMENT_WIDTH;
            self.commentLineTop = spanCommentPosition.top + self.commentLineTopOffset;
            self.commentLineLeft = editorPosition.left - 3;
            self.commentLineWidth = spanCommentPosition.left-editorPosition.left;
          
            self.showComment = true;
            self.activeCommentId = commentId;
            self.commentText = angular.element(spanComments[i]).attr('data-comment');
            break;
          }
        }
      }
    
    } else {
      self.showComment = false;
      self.activeCommentId = null;
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
    let printMe = document.getElementById('richtexteditor');
    let printIframe = document.createElement('iframe');
    printIframe.name = 'print_iframe';
    document.body.appendChild(printIframe);
    let printIframeWindow = window.frames['print_iframe'];
    let printDocument = printIframeWindow.document;
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

  self.comment = function() {

    SupporterEditionChecker.filterAction(function() {
      let id = UuidService.generateUuid();
      $document[0].execCommand('hiliteColor', false, 'rgb(23, 4, 75)');
  
      let richtexteditor = angular.element($document[0].getElementById('richtexteditor'));
      let commentSpans = richtexteditor.find('span');
      let spanFound = false;
      for (let i = 0; i < commentSpans.length; i++) {
        const span = angular.element(commentSpans[i]);
        if (span.css('background-color') === 'rgb(23, 4, 75)') {
          spanFound = true;
          span.removeAttr('style');
          span.attr('class', 'comment-enabled ' + 'comment-'+id);
          span.attr('data-commentid', id);
          span.attr('data-comment', '');
        }
      }
      if (!spanFound) {
        PopupBoxesService.alert('comment_empty_text');
      }
      self.checkselectionstate();
    });
  };

  self.commentChanged = function() {
    let spanComments = document.getElementsByClassName('comment-' + self.activeCommentId);
    for (let i = 0; i < spanComments.length; i++) {
      angular.element(spanComments[i]).attr('data-comment', self.commentText);
    }
  };
  
  self.deleteComment = function(id) {
    let spanComments = document.getElementsByClassName('comment-' + self.activeCommentId);
    for (let i = 0; i < spanComments.length; i++) {
      const span = angular.element(spanComments[i]);
      span.replaceWith(span.html()); // remove wrapping element
    }    
    self.showComment = false;
    self.activeCommentId = null;
  };

  self.calculateCommentLineTopOffset = function() {
    let zoomLevel = BibiscoPropertiesService.getProperty('zoomLevel');
    let offset;
    if (zoomLevel === 100) {
      offset = 21;
    } else if (zoomLevel === 115) {
      offset = 23;
    } else if (zoomLevel === 130) {
      offset = 25;
    }
    return offset;
  },

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
    SupporterEditionChecker.filterAction(function() {
      self.showComment = false;
      self.activeCommentId = null;
      self.showfindreplacetoolbar = !self.showfindreplacetoolbar;
      if (self.showfindreplacetoolbar) {
        self.focusOnText2Find();
      } else {
        self.initFindReplace();
      }
    });
  };

  self.fullscreen = function () {
    SupporterEditionChecker.filterAction(function() {
      FullScreenService.fullScreen();
    });
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
    let modalInstance = $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'richtexteditorsettings',
      resolve: {
        context: function () {
          return 'richtexteditor';
        }
      },
      size: 'richtexteditorsettings'
    });

    $rootScope.$emit('OPEN_POPUP_BOX');

    modalInstance.result.then(function() {
      // save
      self.fontclass = RichTextEditorPreferencesService.getFontClass();
      self.indentclass = RichTextEditorPreferencesService.getIndentClass();
      self.linespacingclass = RichTextEditorPreferencesService.getLinespacingClass();
      self.paragraphspacingclass = RichTextEditorPreferencesService.getParagraphspacingClass();
      self.spellcheckenabled = RichTextEditorPreferencesService.isSpellCheckEnabled();
      self.autocapitalizeenabled = RichTextEditorPreferencesService.isAutocapitalizeEnabled();
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
    let result = WordCharacterCountService.count(self.content, self.wordCountMode);
    self.words = result.words;
    self.characters = result.characters;
    self.todaywords = self.words + self.todayOffset;
    self.totalwords = self.words + self.totalOffset;

  };

  self.getSearchService = function() {
    if (!SearchService) {
      SearchService = $injector.get('SearchService');
    }

    return SearchService;
  };

  self.nextMatchByEnter = function(event) {
    event.preventDefault();
    self.nextMatch();
  };

  self.checkCapitalize = function(evt) {
    if (self.autocapitalizeenabled && evt.which) {
      let charStr = String.fromCharCode(evt.which);
      if (!self.isWhiteSpace(charStr) && !self.isDeviceControl(charStr) && self.needToCapitalize()) {
        evt.preventDefault();
        self.insertTextAtCursor(charStr.toUpperCase());
        return false;
      }
    }
  };

  self.needToCapitalize = function() {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const node = range.startContainer;
    const offset = range.startOffset;
    const text = node.textContent.slice(0, offset);
  
    let index = text.length - 1;
    while (index > 0 && self.isWhiteSpace(text.charAt(index))) {
      index--;
    }
    return index === -1 || text.charAt(index) === '.' 
      || text.charAt(index) === '?' || text.charAt(index) === '!'
      || text.charAt(index) === '¿' || text.charAt(index) === '¡';
  },

  self.insertTextAtCursor = function(text) {
    let sel, range, textNode;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0).cloneRange();
        range.deleteContents();
        textNode = document.createTextNode(text);
        range.insertNode(textNode);
  
        // Move caret to the end of the newly inserted text node
        range.setStart(textNode, textNode.length);
        range.setEnd(textNode, textNode.length);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else if (document.selection && document.selection.createRange) {
      range = document.selection.createRange();
      range.pasteHTML(text);
    }
  },

  self.isWhiteSpace = function(char) {
    return UtilService.array.contains(UtilService.string.WHITE_SPACES, char);
  };

  self.isDeviceControl = function(char) {
    const deviceControlRange = /^[\u0000-\u001F\u007F]$/;
    return deviceControlRange.test(char);
  };
}
