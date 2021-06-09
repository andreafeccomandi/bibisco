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
  component('tip', {
    templateUrl: 'components/project-home/tips/tip.html',
    controller: TipController,
    bindings: {
      even: '<',
      icon: '@',
      paragraphs: '<',
      type: '@'
    }
  });

function TipController($translate) {
  var self = this;

  self.$onInit = function () {
    self.paragraphshtml = [];
    for (let i = 1; i <= self.paragraphs; i++) {
      self.paragraphshtml.push($translate.instant('jsp.suggestions.'+self.type+'.p'+i));
    }
  };
}
