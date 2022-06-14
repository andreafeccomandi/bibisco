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
  component('elementtitleform', {
    templateUrl: 'components/common/uielements/element-title-form/element-title-form.html',
    controller: ElementTitleFormController,
    bindings: {
      breadcrumbitems: '<',
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

function ElementTitleFormController($rootScope, $scope, $window, PopupBoxesService) {
  var self = this;

  self.$onInit = function() {
    $rootScope.$emit(self.eventname);
    self.title = self.titlevalue;
    self.checkExit = {
      active: true
    };
  };

  self.save = function(isValid) {
    if (isValid) {
      self.savefunction({
        title: self.title
      });
      self.checkExit = {
        active: false
      };
      $window.history.back();
    }
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $scope.elementTitleForm.$dirty, self.checkExit);
  });
}
