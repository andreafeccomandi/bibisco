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
  component('pageheader', {
    templateUrl: 'components/common/uielements/page-header/page-header.html',
    controller: PageHeaderController,
    bindings: {
      changegroupfilterfunction: '&',
      characters: '<',
      dblclickfunction: '&?',
      groupseditfunction: '&?',
      image: '@',
      imageaddenabled: '<',
      imageaddfunction: '&',
      imageseditfunction: '&',
      imageenabled: '<',
      headertitle: '@',
      headersubtitle: '@',
      noimageicon: '@',
      showgroupfilter: '<',
      showwordsgoalcounter: '<',
      subheader: '<',
      tags: '<',
      taskstatus: '<',
      taskstatuschangefunction: '&',
      taskstatusreadonly: '<',
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

    if (self.tags && self.tags.length > 19) {
      self.tags = self.tags.slice(0,20);
    } 
    self.tagscluster = self.calculateTagsCluster(); 
  };

  self.calculateTagsCluster = function() {

    if (self.tags && self.tags.length > 15) {
      return '16-20';
    } else if (self.tags && self.tags.length > 9) {
      return '10-15';
    } else {
      return '0-9';
    };
  };

  self.calculateStatusAndButtonsSpace = function() {
    
    let statusandbuttonsspace = 0;

    if (self.imageenabled) {
      statusandbuttonsspace += 115;
    }
    if (self.taskstatus) {
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

    if (self.showgroupfilter) {
      statusandbuttonsspace += 400;
    }

    return statusandbuttonsspace; 
  };

  self.executeimageaddfunction = function () {
    SupporterEditionChecker.filterAction(function() {
      self.imageaddfunction();
    });
  };

  self.executeimageseditfunction = function () {
    SupporterEditionChecker.filterAction(function() {
      self.imageseditfunction();
    });
  };

  $rootScope.$on('OPEN_POPUP_BOX', function () {
    self.confirmdialogopen = true;
  });

  $rootScope.$on('CLOSE_POPUP_BOX', function () {
    self.confirmdialogopen = false;
  });
}
