/*
 * Copyright (C) 2014-2019 Andrea Feccomandi
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
      eventname: '@',
      exitpath: '@',
      pageheadertitle: '@',
      savefunction: '&',
      titlelabel: '@',
      titlemandatory: '<',
      titlemaxlength: '@',
      titlevalue: '@'
    }
  });

function ElementTitleFormController($location, $rootScope, $scope, $timeout, 
  $window, PopupBoxesService) {
  var self = this;

  self.$onInit = function() {
    $rootScope.$emit(self.eventname);
    self.title = self.titlevalue;
    self.checkExitActive = true;
  };

  self.save = function(isValid) {
    if (isValid) {
      self.savefunction({
        title: self.title
      });
      self.checkExitActive = false;
      $location.path(self.exitpath);
    }
  };

  $scope.$on('$locationChangeStart', function (event) {

    if (self.checkExitActive && $scope.elementTitleForm.$dirty) {
      event.preventDefault();
      let wannaGoPath = $location.path();
      self.checkExitActive = false;

      PopupBoxesService.confirm(function () {
        $timeout(function () {
          if (wannaGoPath === $rootScope.previousPath) {
            $window.history.back();
          } else {
            $location.path(wannaGoPath);
          }
        }, 0);
      },
      'js.common.message.confirmExitWithoutSave',
      function () {
        self.checkExitActive = true;
      });
    }
  });
}
