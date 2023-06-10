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
  component('strandgroupsmembership', {
    templateUrl: 'components/strands/strand-groupsmembership.html',
    controller: StrandGroupsmembershipController
  });

function StrandGroupsmembershipController($routeParams, $window, StrandService) {

  let self = this;

  self.$onInit = function() {

    self.breadcrumbitems = [];
    let strand = StrandService.getStrand(parseInt($routeParams.id));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!strand) {
      $window.history.back();
      return;
    }
    self.breadcrumbitems.push({
      label: 'common_architecture',
      href: '/architecture'
    });
    self.breadcrumbitems.push({
      label: strand.name,
      href: '/strands/ ' + strand.$loki + '/view'
    });
    self.breadcrumbitems.push({
      label: 'groups_membership'
    });
    
    self.id = strand.$loki;
    self.pageheadertitle = strand.name;
    self.profileimage = strand.profileimage;
  };
}
