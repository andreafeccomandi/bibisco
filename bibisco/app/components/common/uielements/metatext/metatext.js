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
  component('metatext', {
    templateUrl: 'components/common/uielements/metatext/metatext.html',
    controller: MetatextController,
    bindings: {
      changefunction: '&',
      closefunction: '&',
      connectortype: '<',
      deletefunction: '&',
      editorid: '@',
      editorcointainerid: '@',
      icon: '<',
      id: '<',
      placeholder: '<',
      readonly: '<',
      showmetatext: '<',
      type: '<',
    }
  });

function MetatextController(BibiscoPropertiesService) {

  let self = this;
  const METATEXT_BOX_HEIGHT = 150;
  const COMMENT_WIDTH = 250+10; // width + space between comment box and editor

  self.$onInit = function() {
    self.resettMetatextBox();
    self.lineTopOffset = self.calculateLineTopOffset();
  };

  self.$onChanges = function() {
    if (self.showmetatext) {
      self.showMetatextBox();
    } else {
      self.resettMetatextBox();
    }
  };

  self.closeMetatextBox = function() {
    self.closefunction();
  };

  self.resettMetatextBox = function() {
    self.text = null;
    self.positionTop = null;
    self.positionLeft = null;
    self.lineTop = null;
    self.lineLeft = null;
    self.lineWidth = null;
  };

  self.calculateLineTopOffset = function() {
    let zoomLevel = BibiscoPropertiesService.getProperty('zoomLevel');
    let offset;
    if (zoomLevel === 100) {
      offset = 21;
    } else if (zoomLevel === 115) {
      offset = 23;
    } else if (zoomLevel === 130) {
      offset = 25;
    }
    return offset;
  };

  self.showMetatextBox = function() {

    let editorcointainer = document.getElementById(self.editorcointainerid);
    let editor = document.getElementById(self.editorid);

    if (!editorcointainer || !editor) {
      return;
    }

    // I use the container editor to determine the top and bottom visibility of comment box
    let editorContainerPosition = editorcointainer.getBoundingClientRect();
    // I use the container editor to determine the left position of comment box
    let editorPosition = editor.getBoundingClientRect();

    let spanMetatextSources = document.getElementsByClassName(self.type + '-' + self.id);
    for (let i = 0; i < spanMetatextSources.length; i++) {
      const spanMetatextSourcePosition = spanMetatextSources[i].getBoundingClientRect();
      if (spanMetatextSourcePosition.top > editorContainerPosition.top 
        && spanMetatextSourcePosition.top < editorContainerPosition.bottom) {

        if (spanMetatextSourcePosition.top + METATEXT_BOX_HEIGHT > editorContainerPosition.bottom) {
          self.positionTop = editorContainerPosition.bottom - METATEXT_BOX_HEIGHT;
        } else {
          self.positionTop = spanMetatextSourcePosition.top;
        }
        self.positionLeft = editorPosition.left - COMMENT_WIDTH;
        self.lineTop = spanMetatextSourcePosition.top + self.lineTopOffset + 5;
        self.lineLeft = editorPosition.left - 7;
        self.lineWidth = spanMetatextSourcePosition.left-editorPosition.left;
        self.text = angular.element(spanMetatextSources[i]).attr('data-'+self.type);
        break;
      }
    }
  };

}