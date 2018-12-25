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


function RichTextEditorController($document, $location, $rootScope, $scope, $timeout, 
  $uibModal, $window, hotkeys, ContextService, PopupBoxesService, SanitizeHtmlService,
  SearchService, RichTextEditorPreferencesService, WordCharacterCountService) {

  var self = this;
  self.$onInit = function() {
    self.contenteditable = true;
    self.checkExitActive = true;
    
    // saved content
    self.savedcontent = self.content;
    self.savedcharacters = self.characters;
    self.savedwords = self.words;

    // init content
    if (self.content === '') {
      self.content = '<p><br></p>';
    }
    
    // set <p> as default paragraph separator
    $document[0].execCommand('defaultParagraphSeparator', false, 'p');

    // init words and characters
    self.countWordsAndCharacters();

    // focus on editor
    self.richtexteditorcontainer = document.getElementById('richtexteditorcontainer');
    self.richtexteditor = document.getElementById('richtexteditor');
    self.focus();
  };

  $scope.$on('$locationChangeStart', function(event) {
    
    if (self.checkExitActive && $rootScope.dirty) {
      event.preventDefault();
      let wannaGoPath = $location.path();
      self.checkExitActive = false;

      PopupBoxesService.confirm(function () {
        self.characters = self.savedcharacters;
        self.content = self.savedcontent;
        self.words = self.savedwords;
        $timeout(function () {
          if (wannaGoPath === $rootScope.previousPath) {
            $window.history.back();
          } else {
            $location.path(wannaGoPath);
          }
        }, 0);
      },
      'js.common.message.confirmExitWithoutSave',
      function() {
        self.checkExitActive = true;
      });
    }
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

  self.focus = function() {
    setTimeout(function () {
      self.richtexteditor.focus();
    }, 0);
  };

  if (ContextService.getOs() === 'darwin') {
    self.os = '_mac';
  } else {
    self.os = '';
  }

  self.fontclass = RichTextEditorPreferencesService.getFontClass();
  self.indentclass = RichTextEditorPreferencesService.getIndentClass();
  self.spellcheckenabled = RichTextEditorPreferencesService.isSpellCheckEnabled();

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

  self.showfindreplacetoolbar = false;

  hotkeys.bindTo($scope)
    .add({
      combo: ['ctrl+Y', 'command+y'],
      description: 'redo',
      callback: function() {
        self.redo();
      }
    })
    .add({
      combo: ['command+u'],
      description: 'underline',
      callback: function() {
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
      callback: function () {
        self.toggleFindReplaceToolbar();
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
    $document[0].execCommand('undo');
    $rootScope.dirty = true;
    self.focus();
    self.countWordsAndCharacters();
  };

  self.redo = function() {
    $document[0].execCommand('redo');
    $rootScope.dirty = true;
    self.focus();
    self.countWordsAndCharacters();
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

  self.bold = function() {
    $document[0].execCommand('bold');
    $rootScope.dirty = true;
    self.checkselectionstate();
  };

  self.italic = function() {
    $document[0].execCommand('italic');
    $rootScope.dirty = true;
    self.checkselectionstate();
  };

  self.underline = function() {
    $document[0].execCommand('underline');
    $rootScope.dirty = true;
    self.checkselectionstate();
  };

  self.strikethrough = function() {
    $document[0].execCommand('strikeThrough');
    $rootScope.dirty = true;
    self.checkselectionstate();
  };

  self.highlight = function() {
    if ($document[0].queryCommandValue('BackColor').toString() ===
      'rgb(255, 255, 0)') {
      $document[0].execCommand('hiliteColor', false, 'inherit');
    } else {
      $document[0].execCommand('hiliteColor', false, 'rgb(255, 255, 0)');
    }
    $rootScope.dirty = true;
    self.checkselectionstate();
  };

  self.leftguillemet = function() {
    $document[0].execCommand('insertText', false, '«');
    $rootScope.checkselectionstate();
  };

  self.rightguillemet = function() {
    $document[0].execCommand('insertText', false, '»');
    self.checkselectionstate();
  };

  self.emdash = function() {
    $document[0].execCommand('insertText', false, '—');
    self.checkselectionstate();
  };

  self.orderedlist = function() {
    $document[0].execCommand('insertOrderedList');
    self.checkselectionstate();
  };

  self.unorderedlist = function() {
    $document[0].execCommand('insertUnorderedList');
    self.checkselectionstate();
  };

  self.aligncenter = function() {
    $document[0].execCommand('justifyCenter');
    self.checkselectionstate();
    $rootScope.dirty = true;
    self.focus();
  };

  self.alignleft = function() {
    $document[0].execCommand('justifyLeft');
    self.checkselectionstate();
    $rootScope.dirty = true;
    self.focus();
  };

  self.alignright = function() {
    $document[0].execCommand('justifyRight');
    self.checkselectionstate();
    $rootScope.dirty = true;
    self.focus();
  };

  self.justify = function() {
    $document[0].execCommand('justifyFull');
    self.checkselectionstate();
    $rootScope.dirty = true;
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

  self.toggleFindReplaceToolbar = function () {
    self.showfindreplacetoolbar = !self.showfindreplacetoolbar;
  };

  self.find = function () {
    let matches = SearchService.search(self.richtexteditor, 'caffè', 'alù');
    if (matches && matches.length > 0) {
      let currentCursorPosition = self.getCurrentCursorPosition();
      let found = false;
      for (let i = 0; i < matches.length; i++) {
        if (currentCursorPosition <= matches[i].endIndex) {
          self.selectMatch(matches[i].startIndex, matches[i].endIndex);
          found = true;
          break;
        }
      }
      if (!found) {
        self.selectMatch(matches[0].startIndex, matches[0].endIndex);
      }        
    }
  }; 

  self.selectMatch = function (start, end) {
    
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
          self.richtexteditorcontainer.scrollTop + rangeTop - 300;
      }
    }
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

  self.opensettings = function() {
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

  self.contentChanged = function() {
    self.countWordsAndCharacters();
    $rootScope.dirty = true;
  };

  self.countWordsAndCharacters = function() {
    let result = WordCharacterCountService.count(self.content);
    self.words = result.words;
    self.characters = result.characters;
  };
}
