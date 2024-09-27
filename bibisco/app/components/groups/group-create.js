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
  component('groupcreate', {
    templateUrl: 'components/groups/group-create.html',
    controller: GroupCreateController
  });

function GroupCreateController($location, $routeParams, $window, BibiscoPropertiesService, GroupService, 
  ObjectService, LocationService, MainCharacterService, SecondaryCharacterService, StrandService) {

  let self = this;

  self.$onInit = function() {

    // common bradcrumb root
    self.breadcrumbitems = [];

    self.showdetailaftercreation = false;
    self.elementbasepath = null;

    // creation from groups
    self.creationFromGroups = $location.path().startsWith('/groups') ? true : false;
    if (self.creationFromGroups) {
      self.breadcrumbitems.push({
        label: 'groups',
        href: '/groups'
      });
      self.showdetailaftercreation = BibiscoPropertiesService.getProperty('showElementAfterInsertion') === 'true';
      self.elementbasepath = '/groups/';
    }

    // creation from main characters
    self.creationFromMainCharacters = $location.path().startsWith('/maincharacters') ? true : false;
    if (self.creationFromMainCharacters) {
      self.mainCharacter = MainCharacterService.getMainCharacter(parseInt($routeParams.id));

      // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
      if (!self.mainCharacter) {
        $window.history.back();
        return;
      }
      self.breadcrumbitems.push({
        label: 'common_characters',
        href: '/characters'
      });
      self.breadcrumbitems.push({
        label: self.mainCharacter.name,
        href: '/maincharacters/' + self.mainCharacter.$loki
      });
      self.breadcrumbitems.push({
        label: 'groups_membership',
        href: '/maincharacters/' + self.mainCharacter.$loki + '/groupsmembership'
      });
    }

    // creation from secondary characters
    self.creationFromSecondaryCharacters = $location.path().startsWith('/secondarycharacters') ? true : false;
    if (self.creationFromSecondaryCharacters) {
      self.secondaryCharacter = SecondaryCharacterService.getSecondaryCharacter(parseInt($routeParams.id));

      // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
      if (!self.secondaryCharacter) {
        $window.history.back();
        return;
      }
      self.breadcrumbitems.push({
        label: 'common_characters',
        href: '/characters'
      });
      self.breadcrumbitems.push({
        label: self.secondaryCharacter.name,
        href: '/secondarycharacters/' + self.secondaryCharacter.$loki
      });
      self.breadcrumbitems.push({
        label: 'groups_membership',
        href: '/secondarycharacters/' + self.secondaryCharacter.$loki + '/groupsmembership'
      });
    }

    // creation from locations
    self.creationFromLocations = $location.path().startsWith('/locations') ? true : false;
    if (self.creationFromLocations) {
      self.location = LocationService.getLocation(parseInt($routeParams.id));

      // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
      if (!self.location) {
        $window.history.back();
        return;
      }
      let locationName = LocationService.calculateLocationName(location);
      self.breadcrumbitems.push({
        label: 'common_locations',
        href: '/locations'
      });
      self.breadcrumbitems.push({
        label: locationName,
        href: '/locations/ ' + location.$loki + '/default'
      });
      self.breadcrumbitems.push({
        label: 'groups_membership',
        href: '/locations/' + self.location.$loki + '/groupsmembership'
      });
    }

    // creation from objects
    self.creationFromObjects = $location.path().startsWith('/objects') ? true : false;
    if (self.creationFromObjects) {
      self.object = ObjectService.getObject(parseInt($routeParams.id));

      // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
      if (!self.object) {
        $window.history.back();
        return;
      }
      self.breadcrumbitems.push({
        label: 'objects',
        href: '/objects'
      });
      self.breadcrumbitems.push({
        label: self.object.name,
        href: '/objects/ ' + self.object.$loki + '/default'
      });
      self.breadcrumbitems.push({
        label: 'groups_membership',
        href: '/objects/ ' + self.object.$loki + '/groupsmembership'
      });
    }

    // creation from strands
    self.creationFromStrands = $location.path().startsWith('/strands') ? true : false;
    if (self.creationFromStrands) {
      self.strand = StrandService.getStrand(parseInt($routeParams.id));

      // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
      if (!self.strand) {
        $window.history.back();
        return;
      }
      self.breadcrumbitems.push({
        label: 'strands',
        href: '/strands'
      });
      self.breadcrumbitems.push({
        label: self.strand.name,
        href: '/strands/ ' + self.strand.$loki + '/default'
      });
      self.breadcrumbitems.push({
        label: 'groups_membership',
        href: '/strands/ ' + self.strand.$loki + '/groupsmembership'
      });
    }
  
    // create breadcrumb groups
    self.breadcrumbitems.push({
      label: 'group_create_title'
    });
  
    self.profileimageenabled = false;
    self.name = null;
    self.color = null;
    self.pageheadertitle = 'group_create_title';
    
  };

  self.save = function(title, groupids, color) {
    let group = GroupService.insert({
      name: title,
      color: color
    });
    if (self.creationFromGroups) {
      return;
    }
    if (self.creationFromMainCharacters) {
      group.groupcharacters.push('m_'+ self.mainCharacter.$loki);
    } else if (self.creationFromSecondaryCharacters) {
      group.groupcharacters.push('s_'+ self.secondaryCharacter.$loki);
    } else if (self.creationFromLocations) {
      group.grouplocations.push(self.location.$loki);
    } else if (self.creationFromObjects) {
      group.groupobjects.push(self.object.$loki);
    } else if (self.creationFromStrands) {
      group.groupstrands.push(self.strand.$loki);
    }
    GroupService.update(group);
  };
}
