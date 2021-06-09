/*
 * Copyright (C) 2014-2021 Andrea Feccomandi
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
      content: '<',
      nextelementlabel: '@',
      nextelementlink: '<',
      nextelementtooltip: '@?',
      previouselementlabel: '@',
      previouselementlink: '<',
      previouselementtooltip: '@?',
    }
  });


function RichTextViewerController($injector, $location, RichTextEditorPreferencesService, SupporterEditionChecker) {

  var self = this;
  self.$onInit = function () {
    self.isSupporterEdition = self.checkSupporterEdition();
    self.fontclass = RichTextEditorPreferencesService.getFontClass();
    self.indentclass = RichTextEditorPreferencesService.getIndentClass();
  };

  self.gotopreviouslement = function () {
    if (self.isSupporterEdition) {
      $location.path(self.previouselementlink);
    } else {
      SupporterEditionChecker.showSupporterMessage();
    }
  };

  self.gotonextlement = function () {
    if (self.isSupporterEdition) {
      $location.path(self.nextelementlink);
    } else {
      SupporterEditionChecker.showSupporterMessage();
    }
  };

  self.checkSupporterEdition = function() {
    if (SupporterEditionChecker.check()) {
      $injector.get('IntegrityService').ok();
      return true;
    } else {
      return false;
    }
  };
}
