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
  component('stranddetail', {
    templateUrl: 'components/strands/strand-detail.html',
    controller: StrandDetailController
  });

function StrandDetailController($location, $rootScope, $routeParams, 
  ChapterService, StrandService, UtilService) {

  var self = this;

  self.$onInit = function() {

    self.strand = self.getStrand($routeParams.id);
    self.mode = $routeParams.mode;

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_architecture',
      href: '/architecture/params/focus=strands_' + self.strand.$loki
    });
    self.breadcrumbitems.push({
      label: self.strand.name
    });

    $rootScope.$emit('REGISTER_FOCUS', {
      page: 'architecture',
      element: 'strands_' + self.strand.$loki
    });

    self.deleteforbidden = self.isDeleteForbidden();
  };

  self.changeStatus = function(status) {
    self.strand.status = status;
    StrandService.update(self.strand);
  };

  self.changeTitle = function() {
    $location.path('/strands/' + self.strand.$loki + '/title');
  };

  self.delete = function() {
    StrandService.remove(self.strand
      .$loki);
    $location.path('/architecture');
  };

  self.edit = function () {
    $location.path('/strands/ ' + self.strand.$loki + '/edit');
  };

  self.getStrand = function(id) {
    return StrandService.getStrand(id);
  };

  self.savefunction = function() {
    StrandService.update(self.strand);
  };

  self.isDeleteForbidden = function () {

    let deleteForbidden = false;
    let id = self.strand.$loki;
    let chapters = ChapterService.getChapters();
    for (let i = 0; i < chapters.length && !deleteForbidden; i++) {
      let scenes = ChapterService.getScenes(chapters[i].$loki);
      for (let j = 0; j < scenes.length && !deleteForbidden; j++) {
        let revisions = scenes[j].revisions;
        for (let h = 0; h < revisions.length && !deleteForbidden; h++) {
          if (UtilService.array.contains(revisions[h].scenestrands, id)) {
            deleteForbidden = true;
          }
        }
      }
    }

    return deleteForbidden;
  };
}
