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
  component('pageheader', {
    templateUrl: 'components/common/uielements/page-header/page-header.html',
    controller: PageHeaderController,
    bindings: {
      characters: '<',
      image: '@',
      imageaddenabled: '<',
      imageenabled: '<',
      imagefunction: '&',
      headertitle: '@',
      headersubtitle: '@',
      noimageicon: '@',
      showwordsgoalcounter: '<',
      subheader: '<',
      taskstatus: '<',
      taskstatuschangefunction: '&',
      taskstatusreadonly: '<',
      taskstatusshow: '<',
      words: '<'
    }
  });


function PageHeaderController($rootScope, BibiscoPropertiesService, ImageService, SupporterEditionChecker) {
  var self = this;

  self.$onInit = function () {

    if (self.image) {
      self.fullpathimage = ImageService.getImageFullPath(self.image);
    }

    self.theme = BibiscoPropertiesService.getProperty('theme');
    self.confirmdialogopen = false;

    self.statusandbuttonsspace = self.calculateStatusAndButtonsSpace();
  };

  self.calculateStatusAndButtonsSpace = function() {
    
    let statusandbuttonsspace = 0;

    if (self.imageenabled) {
      statusandbuttonsspace += 115;
    }
    if (self.taskstatusshow) {
      if (self.taskstatusreadonly) {
        statusandbuttonsspace += 50;
      } else {
        statusandbuttonsspace += 220;
      }
    }
    if (!isNaN(self.words)) {
      statusandbuttonsspace += 130;
    }
    if (self.showwordsgoalcounter) {
      statusandbuttonsspace += 130;
    }

    return statusandbuttonsspace; 
  };

  self.executeimagefunction = function () {
    SupporterEditionChecker.filterAction(function() {
      self.imagefunction();
    });
  };

  $rootScope.$on('OPEN_POPUP_BOX', function () {
    self.confirmdialogopen = true;
  });

  $rootScope.$on('CLOSE_POPUP_BOX', function () {
    self.confirmdialogopen = false;
  });
}
