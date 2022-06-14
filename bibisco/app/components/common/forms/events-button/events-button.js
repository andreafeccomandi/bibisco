/*
 * Copyright (C) 2014-2022 Andrea Feccomandi
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
  component('eventsbutton', {
    templateUrl: 'components/common/forms/events-button/events-button.html',
    controller: EventsButtonController,
    bindings: {
      showeventsfunction: '&',
      showeventslabel: '@',
      visible: '<'
    }
  });

function EventsButtonController($injector, $scope, $timeout, $translate, hotkeys, SupporterEditionChecker) {

  var self = this;

  self.$onInit = function () {
    self.tooltip = $translate.instant(self.showeventslabel);
  };

  hotkeys.bindTo($scope)
    .add({
      combo: ['ctrl+k', 'command+k'],
      description: 'showevents',
      callback: function () {
        self.showeventsfunction();
      }
    });

  self.showevents = function() {
    SupporterEditionChecker.filterAction(function() {
      self.showeventsfunction();
    });
  };
}
