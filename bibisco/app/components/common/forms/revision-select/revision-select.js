/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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
  component('revisionselect', {
    templateUrl: 'components/common/forms/revision-select/revision-select.html',
    controller: RevisionSelectController,
    bindings: {
      revisionactive: '<',
      revisioncount: '<',
      revisionenabled: '<',
      revisionfunction: '&'
    }
  });

function RevisionSelectController($location, $translate, PopupBoxesService) {

  var self = this;

  self.$onInit = function() {

    // load translations
    self.translations = $translate.instant([
      'revision_label',
      'revision_label_create_new_revision',
      'revision_label_delete_revision',
      'revision_confirm_new_revision_from_actual',
      'revision_confirm_delete_revision'
    ]);

    // populate revisions
    self.revisions = [];
    self.revisionactual;
    self.revisionselected;

    for (let i = self.revisioncount - 1; i > -1; i--) {
      let revision = self.createRevisionItem(i);
      self.revisions.push(revision);

      if (self.revisionactive === i) {
        self.revisionactual = revision;
        self.revisionselected = revision;
      }
    }

    // add new revision command
    self.revisions.push({
      key: 'new',
      description: self.translations.revision_label_create_new_revision
    });

    // add delete revision command
    if (self.revisioncount > 1) {
      self.addDeleteRevisionCommand();
    }
  };

  self.selectRevision = function() {
    if (self.revisionselected.key === 'new') {
      self.restoreRevisionActual();
      PopupBoxesService.confirm(self.createRevisionFromActual,
        self.translations.revision_confirm_new_revision_from_actual,
        self.createRevisionFromScratch);
    } else if (self.revisionselected.key === 'delete') {
      self.restoreRevisionActual();
      PopupBoxesService.confirm(self.deleteRevision,
        self.translations.revision_confirm_delete_revision);
    } else {
      self.changeRevision();
    }
  };

  self.addDeleteRevisionCommand = function() {
    self.revisions.push({
      key: 'delete',
      description: self.translations.revision_label_delete_revision
    });
  };

  self.removeDeleteRevisionCommand = function() {
    self.revisions.pop();
  };

  self.deleteRevision = function() {

    self.revisionfunction({
      'action': 'delete',
      'revision': self.revisionactual.key
    });

    let revisionToDelete = self.revisionselected.key;

    for (let i = 0; i < self.revisioncount; i++) {
      let revisionitem = self.revisions[i].key;
      if (revisionitem > revisionToDelete) {
        self.revisions[i] = self.createRevisionItem(revisionitem - 1);
      }
    }
    let revisionItemToDeletePosition = self.revisioncount - revisionToDelete - 1;
    self.revisions.splice(revisionItemToDeletePosition, 1);
    self.revisioncount--;
    self.revisionselected = self.revisions[0];
    self.revisionactual = self.revisions[0];

    if (self.revisioncount === 1) {
      self.removeDeleteRevisionCommand();
    }
  };

  self.addRevision = function() {
    self.revisioncount++;

    let newrevision = self.createRevisionItem(self.revisioncount-1);
    self.revisions.unshift(newrevision);
    self.revisionselected = newrevision;
    self.revisionactual = newrevision;

    if (self.revisioncount === 2) {
      self.addDeleteRevisionCommand();
    }
  };

  self.createRevisionItem = function(revisionNumber) {
    return {
      key: revisionNumber,
      description: self.translations.revision_label + ' ' + (revisionNumber+1)
    };
  };

  self.changeRevision = function() {
    self.revisionfunction({
      'action': 'change',
      'revision': self.revisionselected.key
    });
    self.revisionactual = self.revisionselected;
  };

  self.createRevisionFromActual = function() {
    self.revisionfunction({
      'action': 'new-from-actual',
      'revision': self.revisionactual.key
    });
    self.addRevision();
  };

  self.createRevisionFromScratch = function() {
    self.revisionfunction({
      'action': 'new-from-scratch'
    });
    self.addRevision();
  };

  self.restoreRevisionActual = function() {
    self.revisionselected = self.revisionactual;
  };
}
