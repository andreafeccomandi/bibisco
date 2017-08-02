/*
 * Copyright (C) 2014-2017 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.gnu.org/licenses/gpl-2.0.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY.
 * See the GNU General Public License for more details.
 *
 */
angular.
module('bibiscoApp').
component('detailviewcontent', {
  templateUrl: 'components/common/uielements/detail-content/detail-view-content.html',
  controller: DetailViewContentController,
  bindings: {
    content: '@'
  }
});


function DetailViewContentController(LoggerService, RichTextEditorPreferencesService) {

  LoggerService.debug('Start DetailViewContentController...');

  var self = this;
  self.fontclass = RichTextEditorPreferencesService.getFontClass();
  self.indentclass = RichTextEditorPreferencesService.getIndentClass();

  LoggerService.debug('End DetailViewContentController...');
}
