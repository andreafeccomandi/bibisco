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


function RichTextViewerController(RichTextEditorPreferencesService) {

  let self = this;
  self.$onInit = function () {
    self.fontclass = RichTextEditorPreferencesService.getFontClass();
    self.indentclass = RichTextEditorPreferencesService.getIndentClass();
    self.linespacingclass = RichTextEditorPreferencesService.getLinespacingClass();
    self.paragraphspacingclass = RichTextEditorPreferencesService.getParagraphspacingClass();
  };

  self.dblclick = function (event) {
    if (self.dblclickontext) {
      self.dblclickontext({event: event});
    }
  };
}
