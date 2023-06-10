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
  component('elementtitleform', {
    templateUrl: 'components/common/uielements/element-title-form/element-title-form.html',
    controller: ElementTitleFormController,
    bindings: {
      breadcrumbitems: '<',
      exitpath: '@',
      eventname: '@',
      noprofileimageicon: '@',
      pageheadertitle: '@',
      profileimage: '@',
      profileimageenabled: '<',
      savefunction: '&',
      titlelabel: '@',
      titlemandatory: '<',
      titlemaxlength: '@',
      titlevalue: '@'
    }
  });

function ElementTitleFormController($location, $rootScope, $scope, $window, hotkeys, PopupBoxesService) {
  let self = this;

  self.$onInit = function() {
    $rootScope.$emit(self.eventname);
    self.title = self.titlevalue;
    
    self.checkExit = {
      active: true
    };

    hotkeys.bindTo($scope)
      .add({
        combo: ['enter', 'enter'],
        description: 'enter',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'],
        callback: function ($event) {
          $event.preventDefault();
          $scope.elementTitleForm.$submitted = true;
          self.save($scope.elementTitleForm.$valid);
        }
      });
  };

  self.save = function(isValid) {
    if (isValid) {
      self.savefunction({
        title: self.title
      });
      self.checkExit = {
        active: false
      };
      if (self.exitpath) {
        $location.path(self.exitpath);
      } else {
        $window.history.back();
      }
    }
  };


  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $scope.elementTitleForm.$dirty, self.checkExit);
  });
}
