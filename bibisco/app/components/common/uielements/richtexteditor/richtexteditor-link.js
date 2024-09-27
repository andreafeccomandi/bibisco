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
  component('richtexteditorlink', {
    templateUrl: 'components/common/uielements/richtexteditor/richtexteditor-link.html',
    controller: RichtexteditorImageController,
    bindings: {
      close: '&',
      dismiss: '&',
      resolve: '='
    },
  });

function RichtexteditorImageController($scope, $timeout, hotkeys) {

  let self = this;

  self.$onInit = function () {
    self.title = self.resolve.href ? 'edit_link' : 'add_link';
    self.linktext = self.resolve.text;
    self.linkhref = self.resolve.href;

    hotkeys.bindTo($scope)
      .add({
        combo: ['enter', 'enter'],
        description: 'enter',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function ($event) {
          $event.preventDefault();
          self.save();
        }
      });
  };

  self.save = function () {
    $scope.linkDetailForm.$submitted = true;
    if ($scope.linkDetailForm.$valid) {
      self.close({
        $value: {
          href: self.linkhref,
          text: self.linktext,
        }
      });
    }
  };

  self.back = function () {
    self.dismiss({
      $value: {
      }
    });
  };
}
