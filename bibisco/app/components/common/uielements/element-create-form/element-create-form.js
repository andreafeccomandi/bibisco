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
  component('elementcreateform', {
    templateUrl: 'components/common/uielements/element-create-form/element-create-form.html',
    controller: ElementCreateFormController,
    bindings: {
      breadcrumbitems: '<',
      elementbasepath: '@',
      eventname: '@',
      colorenabled: '<',
      groupenabled: '<',
      groupids: '<',
      noprofileimageicon: '@',
      pageheadertitle: '@',
      profileimage: '@',
      profileimageenabled: '<',
      savefunction: '&',
      showdetailaftercreation: '<',
      showdetailaftercreationfunction: '&?',
      titlelabel: '@',
      titlemandatory: '<',
      titlemaxlength: '@'
    }
  });

function ElementCreateFormController($injector, $location, $rootScope, $scope, $window, hotkeys, 
  PopupBoxesService, SupporterEditionChecker, UtilService) {
  let self = this;
  let GroupService = null;

  self.$onInit = function() {
    $rootScope.$emit(self.eventname);
    
    // groups
    self.groupsmembership = null;
    if (self.groupenabled && SupporterEditionChecker.isSupporterOrTrial()) {
      self.initGroupsMembership();
    }
    self.color = null;

    self.deregisterInsertElementListener = $rootScope.$on('INSERT_ELEMENT', function (event, args) {
      if (self.showdetailaftercreation) {
        if (self.showdetailaftercreationfunction) {
          self.showdetailaftercreationfunction({id: args.id});
        } else {
          $location.path(self.elementbasepath + args.id + '/default').replace();
        }
      } else {
        $window.history.back();
      }
    });
    
    self.checkExit = {
      active: true
    };

    hotkeys.bindTo($scope)
      .add({
        combo: ['enter', 'enter'],
        description: 'enter',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'],
        callback: function ($event) {
          $event.preventDefault();
          $scope.elementCreateForm.$submitted = true;
          self.save($scope.elementCreateForm.$valid);
        }
      });
  };

  self.initGroupsMembership = function() {
    self.groupsmembership = [];
    self.groupids = self.groupids ? self.groupids : [];
    let groups = self.getGroupService().getGroups();
    for (let i = 0; i < groups.length; i++) {
      let selected = UtilService.array.indexOf(self.groupids, groups[i].$loki) !== -1 ? true : false;
      self.groupsmembership.push({
        id: groups[i].$loki,
        name: groups[i].name,
        selected: selected
      });
    }
    
    // sort by name
    self.groupsmembership.sort(function(a, b) {
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    });
  };

  self.toggleGroup = function(id) {
    for (let i = 0; i < self.groupsmembership.length; i++) {
      if (self.groupsmembership[i].id ===  id) {
        self.groupsmembership[i].selected = !self.groupsmembership[i].selected;
        break;
      }
    }
  };

  self.getGroupService = function () {
    if (!GroupService) {
      GroupService = $injector.get('GroupService');
    }
    return GroupService;
  },


  self.save = function(isValid) {
    if (isValid) {
      let selectedgroups = [];
      if (self.groupsmembership && self.groupsmembership.length > 0) {
        for (let i = 0; i < self.groupsmembership.length; i++) {
          if(self.groupsmembership[i].selected) {
            selectedgroups.push(self.groupsmembership[i].id);
          }
        }
      }
      self.savefunction({
        title: self.title,
        groups: selectedgroups,
        color: self.color
      });
      self.checkExit = {
        active: false
      };
    }
  };

  self.$onDestroy = function () {
    self.deregisterInsertElementListener();
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $scope.elementCreateForm.$dirty, self.checkExit);
  });
}
