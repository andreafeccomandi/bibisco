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
  component('projecttitle', {
    templateUrl: 'components/project-home/project-title.html',
    controller: projectTitleController
  });

function projectTitleController(ProjectService) {

  var self = this;

  self.$onInit = function() {

    self.breadcrumbItems = [];
    self.breadcrumbItems.push({
      label: 'common_project',
      href: '/projecthome'
    });
    self.breadcrumbItems.push({
      label: 'jsp.changeProjectName.label.projectName'
    });

    self.name = ProjectService.getProjectInfo().name;
  };

  self.save = function(title) {
    ProjectService.updateProjectName(title);
  };
}
