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
  component('groupfilter', {
    templateUrl: 'components/common/uielements/group-filter/group-filter.html',
    controller: GroupFilterController,
    bindings: {
      changegroupfilterfunction: '&'
    }
  });

function GroupFilterController($rootScope, $translate, GroupService) {

  var self = this;

  self.$onInit = function() {

    let groups = GroupService.getGroups();

    if (groups && groups.length > 0) {
      self.showFilter = true;
      self.groups = [];    
      let all_groups = {
        key: 'all',
        name: $translate.instant('all_groups')
      };
      self.groups.push(all_groups);
      self.groupselected = $rootScope.groupFilter ? $rootScope.groupFilter : all_groups;

      // sort by name
      groups.sort(function (a, b) {
        return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0);
      });
        
      for (let i = 0; i < groups.length; i++) {
        self.groups.push({
          key: groups[i].$loki,
          name: groups[i].name,
          color: groups[i].color
        });
      }
    } else {
      self.showFilter = false;
    }
  };

  self.selectGroup = function() {
    $rootScope.groupFilter = self.groupselected;
    self.changegroupfilterfunction();
  };

}
