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
  component('interviewviewer', {
    templateUrl: 'components/characters/interview-viewer.html',
    controller: InterviewViewerController,
    bindings: {
      characters: '=',
      maincharacter: '<',
      nextelementlabel: '@',
      nextelementlink: '<',
      previouselementlabel: '@',
      previouselementlink: '<',
      type: '<',
      words: '='
    }
  });


function InterviewViewerController($injector, $location, $scope, $window, hotkeys, ImageService, RichTextEditorPreferencesService) {

  let self = this;

  self.$onInit = function() {
    self.fontclass = RichTextEditorPreferencesService.getFontClass();
    self.indentclass = RichTextEditorPreferencesService.getIndentClass();
    self.linespacingclass = RichTextEditorPreferencesService.getLinespacingClass();
    self.paragraphspacingclass = RichTextEditorPreferencesService.getParagraphspacingClass();

    let questions = self.maincharacter[self.type].questions;
    for (let i  = 0; i < questions.length; i++) {
      questions[i].text = ImageService.updateAllImageSrcToLocalPath(questions[i].text);
    }
    let characters = 0;
    let words = 0;
    for (let i = 0; i < questions.length; i++) {
      characters = characters + questions[i].characters;
      words = words + questions[i].words;
    }

    self.characters = characters;
    self.words = words;

    if (self.type === 'custom') {
      let CustomQuestionService = $injector.get('CustomQuestionService');
      self.customQuestions = CustomQuestionService.getCustomQuestions();
    }

    // init meta text
    self.showMetatext = false;
    self.metatextType = null;
    self.metatextConnectorType = null;
    self.metatextId = null;
    self.metatextIcon = null;

    // click event listener
    self.interviewviewer = document.getElementById('interviewviewer');
    self.interviewviewer.addEventListener('click', function(event) {
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
    angular.element(self.interviewviewer).bind('mousewheel', function(){
      self.closeMetatextBox();
    });

    // resize event listener
    angular.element($window).bind('resize', function () {
      self.closeMetatextBox();
    });

    hotkeys.bindTo($scope)
      .add({
        combo: ['up'],
        description: 'scrollup',
        callback: function () {
          document.getElementById('interviewviewercontainer').scrollTop -= 100;
        }
      })
      .add({
        combo: ['down'],
        description: 'scrolldown',
        callback: function() {
          document.getElementById('interviewviewercontainer').scrollTop += 100;
        }
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

  self.editquestion = function(index) {
    $location.path('/maincharacters/' + self.maincharacter.$loki + '/infowithquestion/' + self.type +'/edit/question/' + index);
  };
}
