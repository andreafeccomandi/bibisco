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
  component('richtexteditorimage', {
    templateUrl: 'components/common/uielements/richtexteditor/richtexteditor-image.html',
    controller: RichtexteditorImageController,
    bindings: {
      close: '&',
      dismiss: '&',
      resolve: '='
    },
  });

function RichtexteditorImageController($scope, $timeout, hotkeys) {

  let self = this;

  const MAX_IMAGE_WIDTH = 600; // The maximum number of pixels for the width of an image that occupies the entire available horizontal space of an A4 sheet of paper with a one-inch margin.

  self.$onInit = function () {
    self.width = self.resolve.width;
    self.editMode = self.resolve.editMode;
    self.target = self.resolve.target;
    self.title = self.resolve.editMode ? 'edit_image' : 'add_image';

    self.imageposition = self.resolve.position ? self.resolve.position : 'center';
    self.imagepositiongroup = [{
      label: 'common_left',
      value: 'left'
    }, {
      label: 'common_center',
      value: 'center'
    }, {
      label: 'common_right',
      value: 'right'
    }];

    self.imagename;
    self.imagepath;

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

    /* set action on elements.
     * timeout is needed to let the document to be fully loaded */
    $timeout(function () {

      try {

        if (!self.editMode) {
          el = document.getElementById('imageDetailFile');
          // set "change" event for "file" element when input changes programmatically (if I exec: input.value=xxx, this descriptor will be activated)
          const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value');
          Object.defineProperty(el, 'value', {
            set: function (filepath) {
              // recover image dimensions
              let img = new Image();
              img.src = filepath; 
              img.onload = function() {
                // set width
                if (img.width > MAX_IMAGE_WIDTH) {
                  self.width = 100;
                } else {
                  self.width = Math.round((img.width / MAX_IMAGE_WIDTH)*100);
                }
              };
              return descriptor.set.apply(this, arguments);
            },
            get: function () {
              return descriptor.get.apply(this);
            }
          });
        } 
        
      } catch (error) {
        // if something wrong, close the window
        self.back();
      }

    }, 100);
  };

  self.focusOnNameField = function () {
    $timeout(function () {
      document.getElementById('imageDetailWidth').focus();
    }, 0);
  };

  self.save = function () {
    $scope.imageDetailForm.$submitted = true;
    if ($scope.imageDetailForm.$valid) {
      self.close({
        $value: {
          action: (self.editMode ? 'edit' : 'insert'),
          width: self.width,
          name: self.imagename,
          path: self.imagepath,
          position: self.imageposition
        }
      });
    }
  };

  self.back = function () {
    self.dismiss({
      $value: {
        action: (self.editMode ? 'edit' : 'insert')
      }
    });
  };

}
