/*
 * Copyright (C) 2014-2021 Andrea Feccomandi
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
  component('projectauthor', {
    templateUrl: 'components/project-home/project-author.html',
    controller: projectAuthorController
  });

function projectAuthorController(ProjectService) {

  var self = this;

  self.$onInit = function() {
    self.breadcrumbItems = [];
    self.breadcrumbItems.push({
      label: 'common_project',
      href: '/projecthome'
    });
    self.breadcrumbItems.push({
      label: 'common_author'
    });

    self.name = ProjectService.getProjectInfo().name;
    self.author = ProjectService.getProjectInfo().author;
  };

  self.save = function(author) {
    ProjectService.updateProjectAuthor(author);
  };
}
