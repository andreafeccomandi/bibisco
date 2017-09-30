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
component('detailfooterleftbuttonbar', {
  templateUrl: 'components/common/uielements/detail-footer/detail-footer-left-buttonbar.html',
  controller: DetailFooterLeftButtonbarController,
  bindings: {
    editmode: '<',
    imagesenabled: '<',
    showimagesfunction: '&',
    showprojectexplorer: '=',
    revisionactive: '<',
    revisioncount: '<',
    revisionenabled: '<',
    revisionfunction: '&',
    tagsenabled: '<',
    tagsfunction: '&',
    words: '<'
  }
});

function DetailFooterLeftButtonbarController($location, $translate,
  LoggerService, PopupBoxesService) {

  LoggerService.debug('Start DetailFooterLeftButtonbarController...');
  console.log('Start DetailFooterLeftButtonbarController...');

  var self = this;

  self.$onInit = function() {

    // load translations
    self.translations = $translate.instant([
      'revision_label',
      'revision_label_create_new_revision',
      'revision_label_delete_revision',
      'revision_confirm_new_revision_from_actual',
      'revision_confirm_delete_revision'
    ]);;

    // populate revisions
    self.revisions = [];
    self.revisionactual;

    for (let i = self.revisioncount; i > 0; i--) {
      let revision = {};
      let revisionkey = '' + i;
      let revisiondescription = self.translations.revision_label + ' ' + i;

      revision.key = revisionkey;
      revision.description = revisiondescription;
      self.revisions.push(revision);

      if (self.revisionactive == i) {
        self.revisionactual = {
          key: revisionkey,
          description: revisiondescription
        }
      }
    }
    self.revisions.push({
      key: 'new',
      description: self.translations.revision_label_create_new_revision
    });
    if (self.revisioncount > 1) {
      self.revisions.push({
        key: 'delete',
        description: self.translations.revision_label_delete_revision
      });
    }

    self.revisionselected = self.revisionactual;

  }

  self.toggleProjectExplorer = function() {
    self.showprojectexplorer = !self.showprojectexplorer;
  }

  self.selectrevision = function() {
    if (self.revisionselected.key == 'new') {
      PopupBoxesService.confirm(self.createrevisionfromactual,
        self.translations.revision_confirm_new_revision_from_actual,
        self.callrevisionfunction);
    } else if (self.revisionselected.key == 'delete') {
      PopupBoxesService.confirm(self.callrevisionfunction,
        self.translations.revision_confirm_delete_revision,
        self.restorerevisionactual);
    } else {
      self.callrevisionfunction();
    }
  }

  self.callrevisionfunction = function() {
    self.revisionfunction({
      'key': self.revisionselected.key
    });
  }

  self.createrevisionfromactual = function() {
    self.revisionfunction({
      'key': 'new-from-actual'
    });
  }

  self.restorerevisionactual = function() {
    self.revisionselected = self.revisionactual;
  }

  LoggerService.debug('End DetailFooterLeftButtonbarController...');
}
