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
  component('eventsevent', {
    templateUrl: 'components/common/uielements/events/events-event.html',
    controller: EventsEventController,
    bindings: {
      breadcrumbitems: '<',
      eventid: '<',
      id: '<',
      noprofileimageicon: '@',
      profileimage: '@',
      profileimageenabled: '<',
      type: '@'
    }
  });

function EventsEventController($rootScope, $scope, $window, PopupBoxesService, ProjectService, TimelineService) {

  let self = this;

  self.$onInit = function() {
    self.mode = self.eventid ? 'edit' : 'insert';
    
    if (ProjectService.getProjectInfo().lastScenetimeTag) {
      self.lastdatetimeselected = new Date(ProjectService.getProjectInfo().lastScenetimeTag);
    } else {
      self.lastdatetimeselected = new Date();
    }

    if (self.mode==='edit') {
      let eventelement = TimelineService.getEvent(self.type, self.id, self.eventid);
      self.event = eventelement.event;
      self.time = eventelement.time;
      self.timegregorian = eventelement.timegregorian;
    } else {
      self.event = null;
      self.time = null;
      self.timegregorian = true;
    }

    if (self.mode==='edit') {
      self.title = 'events_edit_event_title';
    } else {
      self.title = 'events_add_event_title';
    }

    // hide menu
    $rootScope.$emit('ADD_ELEMENT_EVENT');

    self.checkExit = {
      active: true
    };
  };

  self.save = function(isValid) {
    if (isValid) {
      if (self.eventid) {
        TimelineService.editEvent(self.type, self.id, self.eventid, self.time, self.timegregorian, self.event);
      } else {
        TimelineService.addEvent(self.type, self.id, self.time, self.timegregorian, self.event);
      }
      self.checkExit = {
        active: false
      };
      $window.history.back();
    }
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $scope.eventsEventForm.$dirty, self.checkExit);
  });
}
