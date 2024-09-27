/*
 * right (C) 2014-2023 Andrea Feccomandi
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
      nextelementlabel: '@',
      nextelementlink: '<',
      nextelementtooltip: '@?',
      previouselementlabel: '@',
      previouselementlink: '<',
      previouselementtooltip: '@?',
      todaywords: '=?',
      totalwords: '=?',
      words: '='
    }
  });


function RichTextEditorController($document, $injector, $rootScope, 
  $scope, $timeout, $uibModal, $window, hotkeys, BibiscoPropertiesService, Chronicle, ContextService, 
  FullScreenService, ImageService, PopupBoxesService, ProjectService, SanitizeHtmlService, SupporterEditionChecker, 
  RichTextEditorPreferencesService, UtilService, UuidService, WordCharacterCountService) {

  let self = this;
  const { shell } = require('electron');
  const ipc = require('electron').ipcRenderer;
  const ZERO_WIDTH_SPACE = '\u200B';
  
  let SearchService = null;

  self.$onInit = function() {
    self.contenteditable = true;
    self.checkExit = {
      active: true
    };
    self.richtexteditorcontainer = document.getElementById('richtexteditorcontainer');
    self.richtexteditor = document.getElementById('richtexteditor');
    self.lastcursorposition = {start: 0, end: 0};

    // init OS
    if (ContextService.getOs() === 'darwin') {
      self.os = '_mac';
    } else {
      self.os = '';
    }

    // init styles, spell check, autocapitalize, autosave
    self.fontclass = RichTextEditorPreferencesService.getFontClass();
    self.indentclass = RichTextEditorPreferencesService.getIndentClass();
    self.linespacingclass = RichTextEditorPreferencesService.getLinespacingClass();
    self.paragraphspacingclass = RichTextEditorPreferencesService.getParagraphspacingClass();
    self.spellcheckenabled = RichTextEditorPreferencesService.isSpellCheckEnabled();
    self.autocapitalizeenabled = RichTextEditorPreferencesService.isAutocapitalizeEnabled();
    self.autosaveenabled = BibiscoPropertiesService.getProperty('autoSaveEnabled') === 'true';

    // init editor button states
    self.boldactive = false;
    self.italicactive = false;
    self.underlineactive = false;
    self.strikethroughactive = false;
    self.highlightactive = false;
    self.subscriptactive = false;
    self.superscriptactive = false;
    self.smalltextactive = false;
    self.aligncenteractive = false;
    self.alignleftactive = false;
    self.alignrightactive = false;
    self.justifyactive = false;
    self.orderedlistactive = false;
    self.unorderedlistactive = false;
    self.showfindreplacetoolbar = false;
    self.casesensitiveactive = false;
    self.wholewordactive = false;

    // init past without format flag
    self.pastewithoutformatenabled = false;

    // init meta text
    self.showMetatext = false;
    self.metatextConnectorType = null;
    self.metatextType = null;
    self.metatextId = null;
    self.metatextChangeFunction = null;
    self.metatextDeleteFunction = null;
    self.metatextIcon = null;
    self.metatextPlaceholder = null;
    self.preventCloseMetatextBoxOnScroll = false;
    
    // init comments
    self.commentsNumber = 0;

    //init notes
    self.notesNumber = 0;

    // init find & replace text
    self.initFindReplace();

    // init savecursorpositiononexit flag
    self.savecursorpositiononexit = true;

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

    // init highlight
    self.HIGHLIGHT_COMMENT = 'rgb(241, 228, 189)';
    self.HIGHLIGHT_AQUA = 'rgb(0, 255, 255)';
    self.HIGHLIGHT_LIME = 'rgb(0, 255, 0)';
    self.HIGHLIGHT_ORANGE = 'rgb(255, 165, 0)';
    self.HIGHLIGHT_PINK = 'rgb(255, 133, 250)';
    self.HIGHLIGHT_RED = 'rgb(255, 0, 0)';
    self.HIGHLIGHT_YELLOW = 'rgb(255, 255, 0)';
    self.selectedHighlightColor = self.HIGHLIGHT_YELLOW;

    // clear current match on project explorer selection
    $rootScope.$on('PROJECT_EXPLORER_SELECTED_ITEM', function () {
      self.currentmatch = 0;
      self.closeMetatextBox();
    });

    // check selection state to update comment if shown
    $rootScope.$on('TOGGLE_PROJECT_EXPLORER', function () {
      self.closeMetatextBox();
      $timeout(function(){
        self.checkselectionstate();
      }, 0);
    });

    // back from full screen listener
    self.backFromFullScreenListener = function(event){
      self.closeMetatextBox();
      $timeout(function(){
        self.checkselectionstate();
      }, 0);
    };
    $rootScope.$on('BACK_FROM_FULL_SCREEN_VIEW', self.backFromFullScreenListener);

    // replace misspelling listener
    self.replaceMisspellingListener = function(event){
      $rootScope.dirty = true;
      $scope.$apply();
    };
    ipc.on('REPLACE_MISSPELLING', self.replaceMisspellingListener);

    // ipc command listener
    self.editorCommandsExecutorListener = function(event, command, target){

      switch (command) {
      case 'BOLD':
        self.bold();
        break;  
      case 'ITALIC':
        self.italic();
        break;  
      case 'UNDERLINE':
        self.underline();
        break;        
      case 'STRIKE':
        self.strikethrough();
        break;        
      case 'HIGHLIGHT':
        self.highlight();
        break;  
      case 'ADD_LINK':
        self.addLink();
        break;
      case 'EDIT_LINK':
        self.addLink();
        break;
      case 'COMMENT':
        self.comment();
        break;  
      case 'ADD_NOTE':
        self.note();
        break; 
      case 'REMOVE_LINK':
        self.removeLink();
        break;
      case 'ADD_IMAGE':
        self.addImage();
        break;
      case 'EDIT_IMAGE': case 'DELETE_IMAGE':
        let imageNode = document.querySelector('[filename="'+target+'"]');
        if (imageNode) {
          if (command === 'EDIT_IMAGE') {
            SupporterEditionChecker.filterAction(function() {
              self.openImageDialogToEdit(imageNode);
            });
          } else if (command === 'DELETE_IMAGE') {
            imageNode.remove();
          }
        }
        break;
      default:
        break;
      }
      
    };
    ipc.on('EXECUTE_EDITOR_COMMAND', self.editorCommandsExecutorListener);

    // mousewheel event listener
    angular.element(self.richtexteditor).bind('mousewheel', function(){
      self.closeMetatextBox();
    });

    // resize event listener
    angular.element($window).bind('resize', function () {
      self.closeMetatextBox();
    });

    // click event listener
    richtexteditor.addEventListener('click', function(event) {
      let target = event.target;
    
      // click on anchor
      if (target.tagName === 'A') {
        event.preventDefault();
        let url = target.getAttribute('href');
        shell.openExternal(url);
      }

      if (target.tagName === 'SPAN') {
        // click on comment
        let commentId = target.getAttribute('data-commentid');
        if (commentId) {
          self.showCommentBox(commentId);
        }

        //click on note
        let noteId = target.getAttribute('data-noteid');
        if (noteId) {
          self.showNoteBox(noteId);
        }
      }
    });

    // double click event listener
    richtexteditor.addEventListener('dblclick', function (e) {
      let target = e.target || e.srcElement;
    
      // open edit image window
      if (target.nodeName === 'IMG') {
        SupporterEditionChecker.filterAction(function() {
          self.openImageDialogToEdit(target);
        });
      }
    }, false);

    // scroll event listener
    richtexteditorcontainer.addEventListener('scroll', function (e) {
      if (!self.preventCloseMetatextBoxOnScroll) {
        self.closeMetatextBox();
      }
    }, false);

    // initializations after the DOM is ready
    $timeout(function(){
      // init links
      self.initLinks();

      // init images
      self.initImages();

      // init comments number
      self.calculateCommentsNumber();

      // init notes number
      self.calculateNotesNumber();

      // manage initial position cursor
      self.manageInitialCursorPosition();

      // manage search on open
      self.manageSearchOnOpen();

      // manage selected text on open
      self.manageTextSelectedOnOpen();

      // notify 
      $rootScope.$emit('OPEN_RICH_TEXT_EDITOR');

    }, 0);
    
  };

  self.$onDestroy = function () {
    ipc.removeListener('REPLACE_MISSPELLING', self.replaceMisspellingListener);
    ipc.removeListener('EXECUTE_EDITOR_COMMAND', self.editorCommandsExecutorListener);
    ipc.removeListener('BACK_FROM_FULL_SCREEN_VIEW', self.backFromFullScreenListener);
  };

  self.manageInitialCursorPosition = function () {

    // I set the initial cursor position only if the opening does not result from selecting a search result 
    // and if the text has not been selected from reading mode.
    if (!$rootScope.richtexteditorSearchActiveOnOpen && !$rootScope.textSelected) {
      let cursorPosition = $rootScope.cursorPositionCache.get($rootScope.actualPath);
      if (!cursorPosition) {
        cursorPosition = {start: 0, end: 0};
      }
      self.setCursorPosition(cursorPosition);
    } else {
      $rootScope.projectExplorerCache.delete($rootScope.actualPath);
    }
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
    if (!self.autosaveenabled) {
      PopupBoxesService.locationChangeConfirm(event, $rootScope.dirty, self.checkExit,
        function() {
          self.characters = self.savedcharacters;
          self.content = self.savedcontent;
          self.words = self.savedwords;
        });
    }
  });

  $scope.$on('$locationChangeSuccess', function(event) {
    if (self.savecursorpositiononexit) {
      let cursorPosition = self.getCursorPosition();
      $rootScope.cursorPositionCache.set($rootScope.previousPath, cursorPosition);
    }
  });

  $rootScope.$on('INIT_RICH_TEXT_EDITOR_FOR_MAIN_CHARACTER_INTERVIEW', function () {
    self.savecursorpositiononexit = false;
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
    self.lastcursorposition = self.getCursorPosition();
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
    self.subscriptactive = false;
    self.superscriptactive = false;
    self.smalltextactive = false;
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
      combo: ['ctrl+m', 'command+m'],
      description: 'removeformat',
      callback: function () {
        event.preventDefault();
        self.removeformat();
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
      combo: ['ctrl+4', 'command+4'],
      description: 'en dash',
      callback: function() {
        self.ndash();
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
      combo: ['ctrl+7', 'command+7'],
      description: 'ldquo',
      callback: function() {
        self.ldquo();
      }
    })
    .add({
      combo: ['ctrl+8', 'command+8'],
      description: 'rdquo',
      callback: function() {
        self.rdquo();
      }
    })
    .add({
      combo: ['ctrl+9', 'command+9'],
      description: 'bdquo',
      callback: function() {
        self.bdquo();
      }
    })
    .add({
      combo: ['ctrl+alt+1', 'command+alt+1'],
      description: 'lsquo',
      callback: function() {
        self.lsquo();
      }
    })
    .add({
      combo: ['ctrl+alt+2', 'command+alt+2'],
      description: 'rsquo',
      callback: function() {
        self.rsquo();
      }
    })
    .add({
      combo: ['ctrl+alt+3', 'command+alt+3'],
      description: 'sbquo',
      callback: function() {
        self.sbquo();
      }
    })
    .add({
      combo: ['ctrl+alt+6', 'command+alt+6'],
      description: 'prime',
      callback: function() {
        self.prime();
      }
    })
    .add({
      combo: ['ctrl+alt+7', 'command+alt+7'],
      description: 'doubleprime',
      callback: function() {
        self.doubleprime();
      }
    })
    .add({
      combo: ['ctrl+alt+8', 'command+alt+8'],
      description: 'hellip',
      callback: function() {
        self.hellip();
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
    }).    
    add({
      combo: ['command+shift+v'], // In Windows we use the default behavior of the shortcut CTRL+SHIFT+V.
      description: 'pastewithoutformat',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.pastewithoutformat();
      }
    }).   
    add({
      combo: ['ctrl+shift+i', 'command+shift+i'],
      description: 'addimage',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.addImage();
      }
    }).  
    add({
      combo: ['ctrl+k', 'command+k'],
      description: 'link',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.addLink();
      }
    }).    
    add({
      combo: ['ctrl+shift+t', 'command+shift+t'],
      description: 'smalltext',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.smalltext();
      }
    }).    
    add({
      combo: ['ctrl+shift+p', 'command+shift+p'],
      description: 'supertext',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.superscript();
      }
    }).    
    add({
      combo: ['ctrl+shift+b', 'command+shift+b'],
      description: 'subtext',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.subscript();
      }
    }).
    add({
      combo: ['ctrl+shift+o', 'command+shift+o'],
      description: 'comment',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.comment();
      }
    })
    .add({
      combo: ['ctrl+alt+down', 'command+alt+down'],
      description: 'selectnextcomment',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.nextComment();
      }
    })
    .add({
      combo: ['ctrl+alt+up', 'command+alt+up'],
      description: 'selectpreviouscomment',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.previousComment();
      }
    })
    .add({
      combo: ['ctrl+alt+down', 'command+alt+down'],
      description: 'selectnextcomment',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.nextComment();
      }
    })
    .add({
      combo: ['ctrl+shift+alt+up', 'command+shift+alt+up'],
      description: 'selectpreviousnote',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.previousNote();
      }
    })
    .add({
      combo: ['ctrl+shift+alt+down', 'command+shift+alt+down'],
      description: 'selectnextnote',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.nextNote();
      }
    })
    .add({
      combo: ['ctrl+n', 'command+n'],
      description: 'comment',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        self.note();
      }
    });

  self.checkselectionstate = function(event) {

    if (event && event.type==='keyup' && (event.key === 'Shift' || event.key==='Alt' 
      || event.key==='Meta' || event.key === 'Control' || event.key === 'ArrowUp'
      || event.key === 'ArrowDown')) {
      return;
    } 

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

    let backcolor = $document[0].queryCommandValue('BackColor').toString();
    if (backcolor === self.HIGHLIGHT_COMMENT) {
      let spans = document.querySelectorAll('#richtexteditor span');
      spans.forEach(function(span) {
        let style = span.getAttribute('style');
        if (style && (style.indexOf('background-color: rgb(241, 228, 189)') > -1 || 
        style.indexOf('background-color:rgb(241, 228, 189)') > -1)) {
          span.outerHTML = span.innerHTML;
        } 
      });
    } else if (self.isTextHighlighted(backcolor)) {
      self.highlightactive = true;
      self.changeHighlightColor(backcolor);
    } else {
      self.highlightactive = false;
    }

    if (self.isTagActiveOnSelection('sub')) {
      self.subscriptactive = true;
    } else {
      self.subscriptactive = false;
    }
    
    if (self.isTagActiveOnSelection('sup')) {
      self.superscriptactive = true;
    } else {
      self.superscriptactive = false;
    }

    if (self.isTagActiveOnSelection('small')) {
      self.smalltextactive = true;
    } else {
      self.smalltextactive = false;
    }

    if (self.isTagActiveOnSelection('span', {'data-iscomment': 'true'})) {
      self.closeMetatextBox();

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
        self.showCommentBox(commentId);
      }
    } else {
      self.closeMetatextBox();
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

  self.showCommentBox = function(commentId) {
    self.showMetatext = true;
    self.metatextType = 'comment';
    self.metatextConnectorType = 'direct';
    self.metatextId = commentId;
    self.metatextChangeFunction = self.commentChanged;
    self.metatextDeleteFunction = self.deleteComment;
    self.metatextIcon = 'comment';
    self.metatextPlaceholder = 'comment_placeholder';
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

    $timeout(function() {
      printIframe.parentNode.removeChild(printIframe);
    });
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

  self.pastewithoutformat = function() {
    self.pastewithoutformatenabled = true;
    self.paste();
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

  self.isTextHighlighted = function(backcolor) {
    if (backcolor === self.HIGHLIGHT_AQUA ||
      backcolor === self.HIGHLIGHT_LIME ||
      backcolor === self.HIGHLIGHT_ORANGE ||
      backcolor === self.HIGHLIGHT_PINK ||
      backcolor === self.HIGHLIGHT_RED ||
      backcolor === self.HIGHLIGHT_YELLOW) {
      return true;
    } 
    return false;
  };

  self.highlight = function() {

    let backcolor = $document[0].queryCommandValue('BackColor').toString();
    if (self.isTextHighlighted(backcolor)) {
      $document[0].execCommand('hiliteColor', false, 'inherit');
    } else {
      $document[0].execCommand('hiliteColor', false, self.selectedHighlightColor);
    }
    self.manageFormat();
  };

  self.changeHighlightColor = function(color) {

    switch (color) {
    case self.HIGHLIGHT_YELLOW:
      self.selectedHighlightColor = self.HIGHLIGHT_YELLOW;
      break;
    case self.HIGHLIGHT_ORANGE:
      self.selectedHighlightColor = self.HIGHLIGHT_ORANGE;
      break;
    case self.HIGHLIGHT_RED:
      self.selectedHighlightColor = self.HIGHLIGHT_RED;
      break;
    case self.HIGHLIGHT_PINK:
      self.selectedHighlightColor = self.HIGHLIGHT_PINK;
      break;
    case self.HIGHLIGHT_LIME:
      self.selectedHighlightColor = self.HIGHLIGHT_LIME;
      break;
    case self.HIGHLIGHT_AQUA:
      self.selectedHighlightColor = self.HIGHLIGHT_AQUA;
      break;
            
    default:
      break;
    }
    $document[0].execCommand('hiliteColor', false, self.selectedHighlightColor);
  };

  self.subscript = function() {
    SupporterEditionChecker.filterAction(function() {
      self.toggleTag('sub');
      self.manageFormat();
    });
  };
  
  self.superscript = function() {
    SupporterEditionChecker.filterAction(function() {
      self.toggleTag('sup');
      self.manageFormat();
    });
  };

  self.smalltext = function() {
    SupporterEditionChecker.filterAction(function() {
      self.toggleTag('small');
      self.manageFormat();
    });
  };
   
  self.toggleTag = function(tag, attribs) {

    // Check tag status for selection
    let mode = self.isTagActiveOnSelection(tag, attribs) ? 'unwrap' : 'wrap';

    // Select all text nodes within the range.
    const textNodes = self.getTextNodesWithinSelection();

    // If there are no text nodes exit 
    // (it happens when a format button is clicked and the focus is not inside the text editor)
    if (!textNodes) return;

    // Set containing nodes to remove for unwrap mode
    const nodesToRemoveSet = new Set();
  
    // Process each selected text node.
    for (let i = 0; i < textNodes.length; i++) {
      const element = textNodes[i];
      if (mode === 'wrap') {
        self.wrapTag(textNodes[i], tag, attribs);
      } else if (mode === 'unwrap') {
        let nodeToRemove = self.unwrapTag(textNodes[i], tag);
        nodesToRemoveSet.add(nodeToRemove);
      }
    }

    // Remove nodes in unwrap mode
    if (mode === 'unwrap') {
      nodesToRemoveSet.forEach(function(node) {
        node.parentNode.removeChild(node);
      });
    }
  };

  self.getTextNodesWithinSelection = function() {
    const selection = window.getSelection();
    // Check if there is an active selection.
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);

    // Create a TreeWalker to navigate the selection
    const commonAncestorContainer = range.commonAncestorContainer;
    const treeWalker = document.createTreeWalker(
      commonAncestorContainer,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          // Include nodes within the selection range
          if (range.intersectsNode(node)) {
            return NodeFilter.FILTER_ACCEPT;
          } else {
            // Skip nodes outside the selection range
            return NodeFilter.FILTER_SKIP;
          }
        }
      }
    );

    // Select all text nodes within the range.
    const textNodes = [];
    let currentNode = treeWalker.currentNode;
    while (currentNode) {
      if (currentNode.nodeType === Node.TEXT_NODE) {
        const text = currentNode.nodeValue;
        let startOffset = 0;
        let endOffset = text.length;

        // If the node is the start container of the range, update startOffset
        if (currentNode === range.startContainer) {
          startOffset = range.startOffset;
        }

        // If the node is the end container of the range, update endOffset
        if (currentNode === range.endContainer) {
          endOffset = range.endOffset;
        }

        // Extract the text content within the range
        let selectedText = text.substring(startOffset, endOffset);
        selectedText = selectedText.replace(/[\n\r]/g, '');
        selectedText = selectedText.trim();

        if (selectedText || startOffset === endOffset) {
          textNodes.push({
            node: currentNode,
            text: selectedText,
            startOffset: startOffset,
            endOffset: endOffset
          });
        }
      }
      currentNode = treeWalker.nextNode();
    }

    return textNodes;
  };

  self.isTextNodeInsideTag = function(textNode, tagName, attribs) {
    const parentTextNode = textNode.parentNode;
    let nodeToCheck = parentTextNode;
    while (nodeToCheck) {
      if (nodeToCheck.nodeName.toLowerCase() === tagName.toLowerCase()) {
        if (attribs) {
          let allAttribsFound = true;
          for (let prop in attribs) {
            if (!nodeToCheck.hasAttribute(prop) || nodeToCheck.getAttribute(prop) !== attribs[prop]) {
              allAttribsFound = false;
            }
          }
          if (allAttribsFound) {
            return nodeToCheck;
          }
        } else {
          return nodeToCheck;
        }
      }
      nodeToCheck = nodeToCheck.parentNode;
    }
    return false;
  };

  self.isTagActiveOnSelection = function(tag, attribs) {
    let textNodes = self.getTextNodesWithinSelection();
    if (!textNodes || textNodes.length === 0) {
      return false;
    }
    for (let i = 0; i < textNodes.length; i++) {
      if (!self.isTextNodeInsideTag(textNodes[i].node, tag, attribs)) {
        return false;
      }
    }
    return true;
  };

  self.wrapTag = function(textNode, tagName, attribs) {

    if (self.isTextNodeInsideTag(tagName, attribs)) {
      return;
    }

    const parentTextNode = textNode.node.parentNode;

    // Create a new text node for the part before the string to be wrapped
    const preString = textNode.node.nodeValue.substring(0, textNode.startOffset);
    if (preString) {
      const preTextNode = document.createTextNode(preString);
      parentTextNode.insertBefore(preTextNode, textNode.node);
    }

    // Create a new text node containing the text to wrap
    let textToWrap = textNode.node.nodeValue.substring(textNode.startOffset, textNode.endOffset);
    if (!textToWrap) {
      textToWrap = ZERO_WIDTH_SPACE;
    }
    const textNodeToWrap = document.createTextNode(textToWrap);
    const wrapperNode = document.createElement(tagName);
    if (attribs) {
      for (let prop in attribs) {
        wrapperNode.setAttribute(prop, attribs[prop]);
      }
    }
    wrapperNode.appendChild(textNodeToWrap);
    parentTextNode.insertBefore(wrapperNode, textNode.node);
    
    // Create a new text node for the part after the string to be wrapped
    const postString = textNode.node.nodeValue.substring(textNode.endOffset);
    if (postString) {
      const postTextNode = document.createTextNode(postString);
      parentTextNode.insertBefore(postTextNode, textNode.node);
    }
    
    // Remove the original text node from the DOM
    parentTextNode.removeChild(textNode.node);

    // set caret at the end of wrapped text node
    self.setCaretAtTextNodeEnd(textNodeToWrap);    
  };

  self.unwrapTag = function(textNode, tagName) {

    // Initialize variables to track the nodes for unwrapping
    let unwrapNode = textNode.node.parentNode;
    let unwrapNodeChild = textNode.node;
   
    // Traverse up the DOM tree until reaching the desired tag or the root
    while (unwrapNode && (!unwrapNode.tagName || unwrapNode.tagName.toLowerCase() !== tagName.toLowerCase())) {
      unwrapNodeChild = unwrapNode; 
      unwrapNode = unwrapNode.parentNode;
    }

    if (!unwrapNode) return;

    // Find the ascending paths from textNode to unwrapNode and unwrapNodeChild
    let pathToUnwrapNode = self.findAscendingPathToNode(textNode.node, unwrapNode);
    let pathToUnwrapNodeChild = self.findAscendingPathToNode(textNode.node, unwrapNodeChild);
               
    // Get the parent node of the unwrapping node
    const unwrapNodeParent = unwrapNode.parentNode;

    // Clone the unwrapping node and extract the text before the target text
    let preUnWrapNodeClonedPathToTextNode = self.cloneNodePath(unwrapNode, pathToUnwrapNode);
    let preUnwrapNode = preUnWrapNodeClonedPathToTextNode.clonedNode;
    let preTextNode = preUnWrapNodeClonedPathToTextNode.lastClonedChildNode;
    let preTextNodeContent = preTextNode.textContent.substring(0, textNode.startOffset);
    if (preTextNodeContent) {
      preTextNode.textContent = preTextNodeContent;
      unwrapNodeParent.insertBefore(preUnwrapNode, unwrapNode);
    }

    // Clone the child node of the unwrapping node and set the target text
    let unWrappedNodeClonedPathToTextNode = self.cloneNodePath(unwrapNodeChild, pathToUnwrapNodeChild);
    let unwrappedNode = unWrappedNodeClonedPathToTextNode.clonedNode;
    let unwrappedTextNode = unWrappedNodeClonedPathToTextNode.lastClonedChildNode;
    let unwrappedTextNodeContent = unwrappedTextNode.textContent.substring(textNode.startOffset, textNode.endOffset);
    if (!unwrappedTextNodeContent) {
      unwrappedTextNodeContent = ZERO_WIDTH_SPACE;
    }
    unwrappedTextNode.textContent = unwrappedTextNodeContent;
    unwrapNodeParent.insertBefore(unwrappedNode, unwrapNode);

    // Clone the unwrapping node again and extract the text after the target text
    let postUnWrapNodeClonedPathToTextNode = self.cloneNodePath(unwrapNode, pathToUnwrapNode);
    let postUnwrapNode = postUnWrapNodeClonedPathToTextNode.clonedNode;
    let postTextNode = postUnWrapNodeClonedPathToTextNode.lastClonedChildNode;
    let postTextNodeContent = postTextNode.textContent.substring(textNode.endOffset);
    if (postTextNodeContent) {
      postTextNode.textContent = postTextNodeContent;
      unwrapNodeParent.insertBefore(postUnwrapNode, unwrapNode);
    }

    // set caret at the end of unwrapped text node
    self.setCaretAtTextNodeEnd(unwrappedTextNode);

    // return the unwrap node to remove
    return unwrapNode;
  };

  self.cloneNodePath = function(sourceNode, path) {

    // Clone the sourceNode
    let clonedNode = sourceNode.cloneNode();

    // Initialize variables to track current nodes in source and cloned trees
    let currentSourceNode = sourceNode;
    let currentClonedNode = clonedNode;

    // Traverse through the path to create the cloned node 
    for (let i = 0; i < path.length; i++) {
      const index = path[i];
      // Check if the current source node has child nodes and the specified index is valid
      if (currentSourceNode.childNodes && currentSourceNode.childNodes[index]) {
        // Clone the current source node and add it as a child to the current cloned node
        let childNodeToAdd = currentSourceNode.childNodes[index].cloneNode();
        currentClonedNode.appendChild(childNodeToAdd);
        // Move to the next child node in both source and cloned trees
        currentSourceNode = currentSourceNode.childNodes[index];
        currentClonedNode = childNodeToAdd;
      }
    }

    // Return the cloned node and the last cloned child node
    return {clonedNode: clonedNode, lastClonedChildNode: currentClonedNode};
  };

  // Function to find the path to the parent node
  self.findAscendingPathToNode = function(startingNode, targetNode) {
    const path = [];

    // Recursive function to find the path
    function findPathHelper(node) {
      if (node === targetNode) {
        return true;
      }

      const parent = node.parentNode;
      const siblings = parent.childNodes;

      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i] === node) {
          path.unshift(i); // Add the index of the child as part of the path
          return findPathHelper(parent, targetNode);
        }
      }

      return false;
    }

    // Find the path
    findPathHelper(startingNode, targetNode);

    return path;
  };

  self.findDescendantNode = function(root, path) {
    let currentNode = root;

    // Traverse through the path to find the descendant node
    for (let i = 0; i < path.length; i++) {
      const index = path[i];
      if (currentNode.childNodes && currentNode.childNodes[index]) {
        currentNode = currentNode.childNodes[index];
      } else {
        return null; // Path is invalid
      }
    }

    return currentNode;
  };

  self.setCaretAtTextNodeEnd = function(textNode) {
    const range = document.createRange();
    range.selectNodeContents(textNode);
    range.setStart(textNode, textNode.length);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  self.leftguillemet = function() {
    self.insertSpecialCharacter('«');
  };

  self.rightguillemet = function() {
    self.insertSpecialCharacter('»');
  };

  self.emdash = function() {
    self.insertSpecialCharacter('—');
  };

  self.ndash = function() {
    self.insertSpecialCharacter('–');
  };

  self.ldquo = function() {
    self.insertSpecialCharacter('“');
  };

  self.rdquo = function() {
    self.insertSpecialCharacter('”');
  };

  self.bdquo = function() {
    self.insertSpecialCharacter('„');
  };

  self.lsquo = function() {
    self.insertSpecialCharacter('‘');
  };

  self.rsquo = function() {
    self.insertSpecialCharacter('’');
  };

  self.sbquo = function() {
    self.insertSpecialCharacter('‚');
  };

  self.prime = function() {
    self.insertSpecialCharacter('′');
  };

  self.doubleprime = function() {
    self.insertSpecialCharacter('″');
  };

  self.hellip = function() {
    self.insertSpecialCharacter('…');
  };

  self.insertSpecialCharacter = function(character) {
    $document[0].execCommand('insertText', false, character);
    self.checkselectionstate();
    self.contentChanged();
  };

  self.removeformat = function() {
    $document[0].execCommand('removeFormat');
    self.checkselectionstate();
    self.contentChanged();
  };

  self.calculateCommentsNumber = function() {
    let commentsBeginningSpans = document.getElementsByClassName('comment-beginning');
    self.commentsNumber = commentsBeginningSpans ? commentsBeginningSpans.length : 0;
  };

  self.calculateNotesNumber = function() {
    let notesBeginningSpans = document.getElementsByClassName('footendnote');
    self.notesNumber = notesBeginningSpans ? notesBeginningSpans.length : 0;
  };

  self.comment = function() {
    SupporterEditionChecker.filterAction(function() {
      
      let textNodes = self.getTextNodesWithinSelection();
      if (!textNodes) return;
      
      // Check if we're inside a comment
      if (textNodes && textNodes.length > 0) {
        for (let i = 0; i < textNodes.length; i++) {
          let commentSpanNode = self.isTextNodeInsideTag(textNodes[i].node, 'span', {'data-iscomment': 'true'});
          if (commentSpanNode) {

            // Close current comment span
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            let newRange = document.createRange();
            newRange.selectNodeContents(commentSpanNode);
            range.setStartAfter(commentSpanNode);
            selection.removeAllRanges();
            selection.addRange(newRange);

            // Create a sibling span outside comment
            let siblingSpan = document.createElement('span');
            let siblingTextNode = document.createTextNode(ZERO_WIDTH_SPACE);
            siblingSpan.appendChild(siblingTextNode);
            range.insertNode(siblingSpan);
            self.setCaretAtTextNodeEnd(siblingTextNode);
            self.checkselectionstate();
            return;
          }
        }
      }

      // We're not inside a comment: I create a new comment
      let id = UuidService.generateUuid();
      for (let i = 0; i < textNodes.length; i++) {
        let classAttr = '';
        if (i===0) {
          classAttr += 'comment-beginning ';
        }
        classAttr += 'comment-enabled comment-'+id;
        if (i===textNodes.length-1) {
          classAttr += ' comment-end';
        }

        let attribs = {
          'class': classAttr,
          'data-iscomment': 'true',
          'data-commentid': id,
          'data-comment': '',
        };
        self.wrapTag(textNodes[i], 'span', attribs);
      }

      self.checkselectionstate();
      self.contentChanged();
      $timeout(function() {
        self.calculateCommentsNumber();
      }, 0);
    });
  };

  self.commentChanged = function(metatext) {
    let spanComments = document.getElementsByClassName('comment-' + self.metatextId);
    for (let i = 0; i < spanComments.length; i++) {
      spanComments[i].setAttribute('data-comment', metatext);
    }
    self.updateContentFromDom();
    self.contentChanged();
  };
  
  self.deleteComment = function() {
    let spanComments = document.getElementsByClassName('comment-' + self.metatextId);
    while (spanComments && spanComments.length > 0) {
      const commentChildNodes = spanComments[0].childNodes;
      const commentParentNode = spanComments[0].parentNode;
      for (let i = 0; i < commentChildNodes.length; i++) {
        let clonedChildNode = commentChildNodes[i].cloneNode(true); // clone the node and its content
        commentParentNode.insertBefore(clonedChildNode, spanComments[0]);
      }
      spanComments[0].remove();
    }  

    self.closeMetatextBox();
    self.updateContentFromDom();
    self.contentChanged();
    $timeout(function() {
      self.calculateCommentsNumber();
    }, 0);
  };

  self.scrollToComment = function(commentId) {
    let commentSpan = document.getElementsByClassName('comment-beginning comment-' + commentId)[0];
    let commentOffsetTop = commentSpan.offsetTop;
    self.richtexteditorcontainer.scrollTop = commentOffsetTop - 450;
  };

  self.previousComment = function() {
    self.goToComment('previous');
  };

  self.nextComment = function() {
    self.goToComment('next');
  };

  self.goToComment = function(direction) {
    if (self.commentsNumber > 0) {
      self.goToMetatext({
        direction: direction, 
        sourceclass: 'comment-beginning', 
        sourceattrid: 'data-commentid', 
        showfunction: self.showCommentBox,
        scrolltofunction: self.scrollToComment
      });
    }
  };

  self.scrollToNote = function(noteId) {
    let noteSpan = document.getElementsByClassName('footendnote note-' + noteId)[0];
    let noteOffsetTop = noteSpan.offsetTop;
    self.richtexteditorcontainer.scrollTop = noteOffsetTop - 450;
  };

  self.previousNote = function() {
    self.goToNote('previous');
  };

  self.nextNote = function() {
    self.goToNote('next');
  };

  self.goToNote = function(direction) {
    if (self.notesNumber > 0) {
      self.goToMetatext({
        direction: direction, 
        sourceclass: 'footendnote', 
        sourceattrid: 'data-noteid', 
        showfunction: self.showNoteBox,
        scrolltofunction: self.scrollToNote
      });
    }
  };

  self.goToMetatext = function(options) {
    let metatextSourceSpans = document.getElementsByClassName(options.sourceclass);
    
    // There are no metatext source 
    if (!metatextSourceSpans) return;

    // Get all comment ids
    let metatexts = [];
    let activeMetatextPosition = -1;
    for (let i = 0; i < metatextSourceSpans.length; i++) {
      let metatextId = metatextSourceSpans[i].getAttribute(options.sourceattrid);
      metatexts.push(metatextId);
      if (metatextId === self.metatextId) {
        activeMetatextPosition = i;
      }
    }

    let metatextToShowPosition = options.direction === 'next' ? activeMetatextPosition+1 : activeMetatextPosition-1;
    if (metatextToShowPosition < 0) {
      metatextToShowPosition = metatexts.length - 1;
    } else if (metatextToShowPosition > metatexts.length - 1) {
      metatextToShowPosition = 0;
    }
    
    self.preventCloseMetatextBoxOnScroll = true;
    options.scrolltofunction(metatexts[metatextToShowPosition]);
    $timeout(function() {
      self.preventCloseMetatextBoxOnScroll = false;
    }, 0);
    
    self.setCursorInElement(metatextSourceSpans[metatextToShowPosition]);
    options.showfunction(metatexts[metatextToShowPosition]);
  };

  self.note = function() {
    SupporterEditionChecker.filterAction(function() {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);

      let id = UuidService.generateUuid();
  
      // Create span note
      const spanNote = document.createElement('span');
      spanNote.setAttribute('class', 'footendnote note-'+id);
      spanNote.setAttribute('contenteditable', 'false');
      spanNote.setAttribute('data-isnote', 'true');
      spanNote.setAttribute('data-note', '');
      spanNote.setAttribute('data-noteid', id);
      range.collapse(false);
      range.insertNode(spanNote);
        
      if (BibiscoPropertiesService.getProperty('footendnoteTip') === 'true') {
        PopupBoxesService.showTip('footendnoteTip');
      }

      self.showNoteBox(id);
      $timeout(function() {
        self.calculateNotesNumber();
        let notebtn = document.getElementById('notebtn');
        notebtn.focus();
      }, 0);
    });
  };

  self.showNoteBox = function(noteId) {
    self.showMetatext = true;
    self.metatextType = 'note';
    self.metatextConnectorType = 'elbow';
    self.metatextId = noteId;
    self.metatextChangeFunction = self.noteChanged;
    self.metatextDeleteFunction = self.deleteNote;
    self.metatextIcon = 'asterisk';
    self.metatextPlaceholder = 'note_placeholder';
  };

  self.noteChanged = function(metatext) {
    let spanNotes = document.getElementsByClassName('note-' + self.metatextId);
    for (let i = 0; i < spanNotes.length; i++) {
      spanNotes[i].setAttribute('data-note', metatext);
    }
    self.updateContentFromDom();
    self.contentChanged();
    
    

  };
  
  self.deleteNote = function() {
    let spanNotes = document.getElementsByClassName('note-' + self.metatextId);
    while (spanNotes && spanNotes.length > 0) {
      spanNotes[0].remove();
    }
    self.closeMetatextBox();
    self.updateContentFromDom();
    self.contentChanged();

    $timeout(function() {
      self.calculateNotesNumber();
    }, 0);
  };

  self.closeMetatextBox = function() {
    self.showMetatext = false;
    self.metatextType = null;
    self.metatextConnectorType = null;
    self.metatextId = null;
    self.metatextChangeFunction = null;
    self.metatextDeleteFunction = null;
    self.metatextIcon = null;
    self.metatextPlaceholder = null;
  };
  
  self.setCursorInElement = function(element) {
    if (element) {
      let range = document.createRange();
      let selection = window.getSelection();
      if (selection) {
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      self.focus();
    } 
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
    self.enableEditingForNotes();
    $document[0].execCommand('justifyCenter');
    self.disableEditingForNotes();
    self.manageFormat();
    self.focus();
  };

  self.alignleft = function() {
    self.enableEditingForNotes();
    $document[0].execCommand('justifyLeft');
    self.disableEditingForNotes();
    self.manageFormat();
    self.focus();
  };

  self.alignright = function() {
    self.enableEditingForNotes();
    $document[0].execCommand('justifyRight');
    self.disableEditingForNotes();
    self.manageFormat();
    self.focus();
  };

  self.justify = function() {
    self.enableEditingForNotes();
    $document[0].execCommand('justifyFull');
    self.disableEditingForNotes();
    self.manageFormat();
    self.focus();
  };

  self.disableEditingForNotes = function() {
    const notes = document.querySelectorAll('span[data-isnote="true"]');
    for (let i = 0; i < notes.length; i++) {
      notes[i].setAttribute('contenteditable', 'false');
    }
  };

  self.enableEditingForNotes = function() {
    const notes = document.querySelectorAll('span[data-isnote="true"]');
    for (let i = 0; i < notes.length; i++) {
      notes[i].setAttribute('contenteditable', 'true');
    }
  };

  self.addImage = function () {
    SupporterEditionChecker.filterAction(function() {
      self.removeAllImagePlaceholders();
      let selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      let range = selection.getRangeAt(0);
      let img = document.createElement('img');
      img.src = '';
      img.style = 'display: none;';
      img.setAttribute('filename', 'IMG_PLACEHOLDER');
      range.insertNode(img);
      self.contentChanged();
      self.openImageDialogToInsert(img);
    });
  };

  self.openImageDialogToInsert = function (target) {
    let modalInstance = $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'richtexteditorimage',
      resolve: {
        editMode: function () {
          return false;
        },
        width: function () {
          return 0;
        },
        target: function () {
          return null;
        }
      },
      size: 'imagedetail',
    });

    $rootScope.$emit('OPEN_POPUP_BOX');

    modalInstance.result.then(function (form) {
      self.loadImageFileAsURL(form);
      self.removeBRNextToImg();
      self.setCursorAfterElement(target);
      self.contentChanged();
      if (BibiscoPropertiesService.getProperty('imageEditTip') === 'true') {
        PopupBoxesService.showTip('imageEditTip');
      }
      $rootScope.$emit('CLOSE_POPUP_BOX');

    }, function (form) { // CANCEL
      self.setCursorAfterElement(target);
      self.removeAllImagePlaceholders();
      $rootScope.$emit('CLOSE_POPUP_BOX');
    });
  };

  self.openImageDialogToEdit = function (target) {
    let modalInstance = $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'richtexteditorimage',
      resolve: {
        editMode: function() {
          return true;
        },
        width: function() {
          let widthperc = parseInt(target.getAttribute('widthperc'));
          return widthperc ? widthperc : 100;
        },
        position: function() {
          let position = target.getAttribute('position');
          return position ? position : 'center';
        },
        target: function() {
          return target;
        }
      },
      size: 'imagedetail',
    });

    $rootScope.$emit('OPEN_POPUP_BOX');

    modalInstance.result.then(function (form) {
      target.setAttribute('widthperc', form.width.toString());
      target.setAttribute('position', form.position);
      target.setAttribute('style', ImageService.calculateImageStyle(form.position, form.width));

      self.setCursorAfterElement(target);
      self.contentChanged();
      $rootScope.$emit('CLOSE_POPUP_BOX');

    }, function (form) { // CANCEL
      self.setCursorAfterElement(target);
      $rootScope.$emit('CLOSE_POPUP_BOX');
    });
  };

  self.get1stAnchorInSelection = function() {
    let selection = window.getSelection();

    if (selection.rangeCount > 0) {
      let range = selection.getRangeAt(0);
      let selectedText = range.toString();
        
      if (selectedText) {
        let div = document.createElement('div');
        div.innerHTML = selectedText;
            
        let anchors = div.querySelectorAll('a');
            
        if (anchors.length > 0) {
          return anchors[0];
        }
      }
    }
    return false;
  };

  self.getParentAnchor = function() {
    let selection = window.getSelection();
    if (selection.rangeCount > 0) {
      let range = selection.getRangeAt(0);
      let container = range.commonAncestorContainer;

      while (container) {
        if (container.tagName && container.tagName.toLowerCase() === 'a') {
          return container; 
        }
        container = container.parentNode;
      }
    }

    return null;
  };

  self.addLink = function () {
    SupporterEditionChecker.filterAction(function() {
      self.removeAllLinkPlaceholders();
  
      // check if there is already an anchor in the selection
      let anchor = self.getParentAnchor();
  
      // if the anchor is not there, I create a new anchor
      if (!anchor) {
        let selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        let range = selection.getRangeAt(0);
    
        if (!range) return;
    
        anchor = document.createElement('a');
        anchor.textContent = range.toString() ? range.toString() : null;
        anchor.href = 'LINK_PLACEHOLDER';
        anchor.target = '_blank';
        range.deleteContents();
        range.insertNode(anchor);
      }
      
      self.openLinkDialog(anchor);
    });
  };

  self.removeLink = function() {
    let anchor = self.getParentAnchor();
    if (anchor) {
      while (anchor.firstChild) {
        anchor.parentNode.insertBefore(anchor.firstChild, anchor);
      }
      anchor.parentNode.removeChild(anchor);
    }
  };

  self.openLinkDialog = function (target) {
    let href = target.getAttribute('href');
    let modalInstance = $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'richtexteditorlink',
      resolve: {
        text: function () {
          return target.textContent;
        },
        href: function () {
          return href === 'LINK_PLACEHOLDER' ? null : target.href ;
        }
      },
      size: 'imagedetail',
    });

    $rootScope.$emit('OPEN_POPUP_BOX');

    modalInstance.result.then(function (form) {
      target.textContent = form.text;
      target.href = form.href;
      self.setCursorAfterElement(target);
      self.contentChanged();
      $rootScope.$emit('CLOSE_POPUP_BOX');

    }, function (form) { // CANCEL
      self.setCursorAfterElement(target);
      self.removeAllLinkPlaceholders();
      $rootScope.$emit('CLOSE_POPUP_BOX');
    });
  };

  self.setCursorAfterElement = function(targetElement) {

    try {
      if (targetElement) {
        // create a selection range
        const range = document.createRange();
        
        // set the start point of the range after the target element
        range.setStartAfter(targetElement);
        
        // set the end point to the beginning of the range
        range.collapse(true);
        
        // get the current selection
        const selection = window.getSelection();
        
        // clear any existing selection
        selection.removeAllRanges();
        
        // Add the new range to the selection
        selection.addRange(range);
        
        // set the focus on the contenteditable element
        self.richtexteditor.focus();
      } 
    } catch (error) {
      LoggerService.error(error);
    }
  };
  
  self.removeBRNextToImg = function() {
    // Find all <img> elements on the page
    const images = $document[0].querySelectorAll('img');
  
    // Iterate through the images
    images.forEach((image) => {
      // Get the parent of the image
      const parentOfImage = image.parentNode;
  
      // Check if the parent contains a <br> element
      if (parentOfImage && parentOfImage.tagName === 'P') {
        const childElements = parentOfImage.childNodes;
  
        // Iterate through the child elements of the parent
        for (let i = 0; i < childElements.length; i++) {
          const childElement = childElements[i];
  
          // Check if the child element is a <br>
          if (childElement.tagName === 'BR') {
            // Remove the <br> from the parent
            parentOfImage.removeChild(childElement);
          }
        }
      }
    });
  };

  self.loadImageFileAsURL = function (data) {

    let selectedFile = data.path;
    if (selectedFile.length > 0) {
      ImageService.getImageFromUrl(selectedFile, function (imageFromUrl) {
        ImageService.addImageToProject(selectedFile, function (imagename) {
          try {
            let img = self.getImagePlaceholder();
            img.src = ImageService.getImageFullPath(imagename);
            img.setAttribute('widthperc', data.width.toString());
            img.setAttribute('widthheightratio', imageFromUrl.width / imageFromUrl.height);
            img.setAttribute('filename', imagename);
            img.setAttribute('position', data.position);
            img.setAttribute('style', ImageService.calculateImageStyle(data.position, data.width));
          } catch (error) {
            LoggerService.error('richtexteditor: error copying image file: ' + error);
          }
        });
      });
    }
  };
  
  self.getImagePlaceholder = function() {
    return document.querySelector('[filename="IMG_PLACEHOLDER"]');
  };

  self.removeAllImagePlaceholders = function() {
    // get all <img> elements in the document
    const images = document.getElementsByTagName('img');

    // loop through the <img> elements
    for (let i = images.length - 1; i >= 0; i--) {
      const img = images[i];
  
      // check if the image has a "filename" attribute with the value "IMG_PLACEHOLDER"
      if (img.getAttribute('filename') === 'IMG_PLACEHOLDER') {
        // remove the image from its parent node
        img.parentNode.removeChild(img);
      }
    }
  };

  self.removeAllLinkPlaceholders = function() {
    // get all <a> elements in the document
    const anchors = document.getElementsByTagName('a');

    // loop through the <a> elements
    for (let i = anchors.length - 1; i >= 0; i--) {
      const anchor = anchors[i];
  
      // check if the link has a "filename" attribute with the value "LINK_PLACEHOLDER"
      if (anchor.getAttribute('href') === 'LINK_PLACEHOLDER') {
        // remove the anchor from its parent node while keeping the contained text.
        let innerHTML = document.createTextNode(anchor.innerHTML);
        anchor.parentNode.replaceChild(innerHTML, anchor); 
      }
    }
  };

  self.initImages = function() {
    self.removeAllImagePlaceholders();
    self.content = ImageService.updateAllImageSrcToLocalPath(self.content);
  };

  self.initLinks = function() {
    self.removeAllLinkPlaceholders();
  };

  self.sanitizePaste = function($event) {
    if ($event.clipboardData) {
      $event.preventDefault();
      let sanitizedText;
      let texthtml = $event.clipboardData.getData('text/html');
      let textplain = $event.clipboardData.getData('text/plain');
      if (self.pastewithoutformatenabled || !texthtml) {
        sanitizedText = textplain.replace(/(?:\r\n|\r|\n)/g, '</p><p>');
      } else {
        sanitizedText = SanitizeHtmlService.sanitize(texthtml);
      }
      $timeout(function() {
        $document[0].execCommand('insertHTML', false, sanitizedText);
        self.pastewithoutformatenabled = false;
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
      self.closeMetatextBox();
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
      self.closeMetatextBox();
      $timeout(function() {
        self.checkselectionstate();
      }, 0);
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
        if (self.lastcursorposition.start <= self.matches[i].endIndex) {
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

  self.getCursorPosition = function() {
    try {
      let selection = window.getSelection();
      if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        let preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(self.richtexteditor);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        let start = preSelectionRange.toString().length;
        
        return {
          start: start,
          end: start + range.toString().length
        };
      }
    } catch (error) {
      LoggerService.error(error);
      return {start: 0, end: 0};
    }
  };
  
  self.setCursorPosition = function(position) {

    let charIndex = 0; 
    range = document.createRange();
    range.setStart(self.richtexteditor, 0);
    range.collapse(true);
    let nodeStack = [self.richtexteditor];
    let currentNode; 
    let foundStart = false; 
    let stop = false;

    while (!stop && (currentNode = nodeStack.pop())) {
      if (currentNode.nodeType === Node.TEXT_NODE) {
        let nextCharIndex = charIndex + currentNode.length;
        if (!foundStart && position.start >= charIndex && position.start <= nextCharIndex) {
          range.setStart(currentNode, position.start - charIndex);
          foundStart = true;
        }
        if (foundStart && position.end >= charIndex && position.end <= nextCharIndex) {
          range.setEnd(currentNode, position.end - charIndex);
          stop = true;
        }
        charIndex = nextCharIndex;
      } else {
        let childNodesLength = currentNode.childNodes.length;
        while (childNodesLength--) {
          nodeStack.push(currentNode.childNodes[childNodesLength]);
        }
      }
    }

    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    // Scroll the element to make the cursor position visible
    let boundingRect = range.getBoundingClientRect();
    let elementRect = self.richtexteditorcontainer.getBoundingClientRect();

    if ((boundingRect.top > 0 && elementRect.top > 0) && (boundingRect.top > elementRect.top || boundingRect.bottom > elementRect.bottom)) {
      range.startContainer.parentElement.scrollIntoView({block: 'nearest', inline: 'nearest'});
    }
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
    self.calculateCommentsNumber(); 
    self.calculateNotesNumber();
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
        $document[0].execCommand('insertText', false, charStr.toUpperCase());
        return false;
      }
    }
  };

  self.needToCapitalize = function() {
    try {
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
    } catch (error) {
      return false;
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
