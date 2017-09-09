/*
 * Copyright (C) 2014-2017 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.gnu.org/licenses/gpl-2.0.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY.
 * See the GNU General Public License for more details.
 *
 */
angular.
module('bibiscoApp').
component('strandtitle', {
  templateUrl: 'components/strands/strand-title.html',
  controller: StrandTitleController
});

function StrandTitleController($location, $routeParams,
  StrandService, LoggerService) {
  LoggerService.debug('Start StrandTitleController...');

  var self = this;

  self.$onInit = function() {

    // common bradcrumb root
    self.breadcrumbItems = [];
    self.breadcrumbItems.push({
      label: 'jsp.projectFromScene.nav.li.architecture'
    });

    if ($routeParams.operation == 'edit') {
      let strand = StrandService.getStrand(
        $routeParams.id);

      // edit breadcrumb items
      self.breadcrumbItems.push({
        labelvalue: strand.name
      });
      self.breadcrumbItems.push({
        label: 'jsp.architecture.strand.dialog.title.updateTitle'
      });

      self.exitpath = "/strand/" + $routeParams.id;
      self.name = strand.name;
      self.pageheadertitle =
        'jsp.architecture.strand.dialog.title.updateTitle';
    } else {

      // create breadcrumb items
      self.breadcrumbItems.push({
        label: 'jsp.architecture.strand.dialog.title.createStrand'
      });

      self.exitpath = "/project/architecture";
      self.name = null;
      self.pageheadertitle =
        'jsp.architecture.strand.dialog.title.createStrand';
    }
  }

  self.save = function(title) {
    if ($routeParams.operation == 'edit') {
      let strand = StrandService.getStrand(
        $routeParams.id);
      strand.name = title;
      strand.lastsave = (new Date()).toJSON();
      StrandService.update(strand);
    } else {
      StrandService.insert({
        characters: 0,
        description: '',
        name: title,
        lastsave: (new Date()).toJSON(),
        words: 0
      });
    }
  }

  LoggerService.debug('End StrandTitleController...');
}
