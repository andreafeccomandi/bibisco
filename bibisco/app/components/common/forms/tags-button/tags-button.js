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
  component('tagsbutton', {
    templateUrl: 'components/common/forms/tags-button/tags-button.html',
    controller: TagsButtonController,
    bindings: {
      showtagsfunction: '&',
      showtagslabel: '@',
      visible: '<'
    }
  });

function TagsButtonController($scope, $translate, hotkeys, SupporterEditionChecker) {

  var self = this;

  self.$onInit = function () {
    self.tooltip = $translate.instant(self.showtagslabel);
  };

  hotkeys.bindTo($scope)
    .add({
      combo: ['ctrl+t', 'command+t'],
      description: 'showtags',
      callback: function () {
        self.showtagsfunction();
      }
    });

  self.showtags = function() {
    SupporterEditionChecker.filterAction(function() {
      self.showtagsfunction();
    });
  };
}
