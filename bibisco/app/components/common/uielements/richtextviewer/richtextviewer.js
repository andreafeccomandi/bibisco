/*
 * Copyright (C) 2014-2024 Andrea Feccomandi
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
  component('richtextviewer', {
    templateUrl: 'components/common/uielements/richtextviewer/richtextviewer.html',
    controller: RichTextViewerController,
    bindings: {
      dblclickontext: '&',
      content: '<',
      nextelementlabel: '@',
      nextelementlink: '<',
      nextelementtooltip: '@?',
      previouselementlabel: '@',
      previouselementlink: '<',
      previouselementtooltip: '@?',
    }
  });


function RichTextViewerController($scope, $window, hotkeys, ImageService, RichTextEditorPreferencesService) {

  let self = this;
  const { shell } = require('electron');

  self.$onInit = function () {

    self.richtextviewer = document.getElementById('richtextviewer');
    self.richtextviewercontainer =  document.getElementById('richtextviewercontainer');
    self.fontclass = RichTextEditorPreferencesService.getFontClass();
    self.indentclass = RichTextEditorPreferencesService.getIndentClass();
    self.linespacingclass = RichTextEditorPreferencesService.getLinespacingClass();
    self.paragraphspacingclass = RichTextEditorPreferencesService.getParagraphspacingClass();
    self.content = ImageService.updateAllImageSrcToLocalPath(self.content);

    // init meta text
    self.showMetatext = false;
    self.metatextType = null;
    self.metatextConnectorType = null;
    self.metatextId = null;
    self.metatextIcon = null;

    // click event listener
    self.richtextviewer.addEventListener('click', function(event) {
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

    // mousewheel event listener
    angular.element(self.richtextviewer).bind('mousewheel', function(){
      self.closeMetatextBox();
    });
    
    // resize event listener
    angular.element($window).bind('resize', function () {
      self.closeMetatextBox();
    });
  };

  self.closeMetatextBox = function() {
    self.showMetatext = false;
    self.metatextType = null;
    self.metatextConnectorType = null;
    self.metatextId = null;
    self.metatextIcon = null;
  };

  self.showCommentBox = function(commentId) {
    self.showMetatext = true;
    self.metatextType = 'comment';
    self.metatextConnectorType = 'direct';
    self.metatextId = commentId;
    self.metatextIcon = 'comment';
  };

  self.showNoteBox = function(noteId) {
    self.showMetatext = true;
    self.metatextType = 'note';
    self.metatextConnectorType = 'elbow';
    self.metatextId = noteId;
    self.metatextIcon = 'asterisk';
  };

  self.dblclick = function (event) {
    if (self.dblclickontext) {
      self.dblclickontext({event: event});
    }
  };
}
