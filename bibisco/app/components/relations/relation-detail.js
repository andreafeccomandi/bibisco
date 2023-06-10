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
  component('relationdetail', {
    templateUrl: 'components/relations/relation-detail.html',
    controller: RelationDetailController,
    bindings: {
      close: '&',
      dismiss: '&',
      resolve: '='
    },
  });

function RelationDetailController($scope, hotkeys, PopupBoxesService) {

  var self = this;

  self.$onInit = function() {

    self.name = self.resolve.name;
    self.color = self.resolve.color.toUpperCase();
    self.arrows = self.resolve.arrows;
    self.dashes = self.resolve.dashes;
    self.usedrelations = self.resolve.usedrelations;
    self.editMode = self.resolve.name ? true : false;

    self.arrowsgroup = [{
      icon: 'long-arrow-right',
      value: 'to'
    }, {
      icon: 'arrows-h',
      value: 'to, from'
    }];

    self.dashesgroup = [{
      icon: 'minus',
      value: false
    }, {
      icon: 'ellipsis-h',
      value: true
    }];
    
    hotkeys.bindTo($scope)
      .add({
        combo: ['enter', 'enter'],
        description: 'enter',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function ($event) {
          $event.preventDefault();
          self.save();
        }
      });
  };


  self.save = function () {
    self.relationDetailForm.$submitted = true;
    if (self.relationDetailForm.$valid) {
      self.close({
        $value: {
          action: 'edit',
          name: self.name,
          color: self.color,
          arrows: self.arrows,
          dashes: self.dashes
        }
      });
    } 
  };

  self.back = function() {
    self.dismiss({
      $value: 'cancel'
    });
  };

  self.delete = function () {
    PopupBoxesService.confirm(function() {
      self.close({
        $value: {
          action: 'delete'
        }
      });
    }, 'relations_delete_relation_confirm');    
  };
}
