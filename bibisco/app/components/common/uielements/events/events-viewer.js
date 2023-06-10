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
  component('eventsviewer', {
    templateUrl: 'components/common/uielements/events/events-viewer.html',
    controller: EventsViewerController,
    bindings: {
      breadcrumbitems: '<',
      editfunction: '&',
      id: '<',
      insertbuttonstyle: '@',
      insertfunction: '&',
      lastsave: '<',
      noprofileimageicon: '@',
      pageheadertitle: '@',
      pageheadercustomtitle: '<',
      profileimage: '@',
      profileimageenabled: '<',
      subtitle: '@',
      type: '@'
    }
  });

function EventsViewerController($rootScope, $translate, TimelineService) {

  var self = this;

  self.$onInit = function() {

    // hide menu
    $rootScope.$emit('SHOW_ELEMENT_EVENTS');

    if (!self.insertbuttonstyle) {
      self.insertbuttonstyle = 'primary';
    }

    self.title;
    if (self.pageheadercustomtitle) {
      self.title = $translate.instant(self.pageheadercustomtitle);
    } else {
      self.title = $translate.instant('events_viewer_title') + ' ' + self.pageheadertitle;
    }

    // hotkeys
    self.hotkeys = ['ctrl+n', 'command+n'];

    // load events
    this.loadEvents();
  };

  self.delete = function(eventid) {
    TimelineService.deleteEvent(self.type, self.id, eventid);
    this.loadEvents();
  };

  self.loadEvents = function() {
    self.timeline = TimelineService.getTimeline({
      type: self.type,
      id: self.id
    });   
  };

}
