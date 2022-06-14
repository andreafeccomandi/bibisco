/*
 * Copyright (C) 2014-2022 Andrea Feccomandi
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

angular.module('bibiscoApp').service('BackupService', function(BibiscoPropertiesService,
  CollectionUtilService, FileSystemService, LoggerService, ProjectDbConnectionService) {
  'use strict';

  return {

    getCollection: function() {
      return ProjectDbConnectionService.getProjectDb().getCollection(
        'backups');
    },
    getBackup: function(id) {
      return this.getCollection().get(id);
    },
    getLastBackup() {
      let backupsCount = this.getBackupsCount();
      return backupsCount>0 ? this.getCollection().data[backupsCount-1] : null;
    },
    getBackupsCount: function() {
      return this.getBackups().length;
    },
    getBackups: function() {
      return CollectionUtilService.getDataSortedByPosition(this.getCollection());
    },
    insert: function(backup) {
      CollectionUtilService.insert(this.getCollection(), backup);
    },
    remove: function(id) {
      CollectionUtilService.remove(this.getCollection(), id);
    },
    removeOldestBackup: function() {
      let backupsCount = this.getBackupsCount();
      if (backupsCount>0) {
        let oldestBackup = this.getBackups()[0];
        CollectionUtilService.remove(this.getCollection(), oldestBackup.$loki);
        let backupPath = BibiscoPropertiesService.getProperty('backupDirectory');
        let fullpath = FileSystemService.concatPath(backupPath, oldestBackup.filename);
        FileSystemService.deleteFile(fullpath);
      }
    }
  };
});
