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

angular.module('bibiscoApp').service('BibiscoPropertiesService', function (
  BibiscoDbConnectionService, LoggerService) {
  'use strict';

  const version = '3.0.2-CE';

  return {
    getProperty: function(name) {
      if (name === 'version') {
        return version;
      }
      let properties = BibiscoDbConnectionService.getBibiscoDb().getCollection('properties');
      let property = properties.findOne({
        'name': name
      });
      return property ? property.value : null;
    },
    setProperty: function(name, value) {
      let properties = BibiscoDbConnectionService.getBibiscoDb().getCollection('properties');
      let property = properties.findOne({
        'name': name
      });

      if (property) {
        property.value = value;
        return properties.update(property);
      } else {
        property = {};
        property.name = name;
        property.value = value;
        return properties.insert(property);
      }
    },

    // Version initialization started from version 2.3.0
    initializeCurrentVersion: function() {
      LoggerService.info('initializeCurrentVersion: ' + version);
      this.setProperty(version, true);

      // version 2.4.0
      if (!this.getProperty('zoomLevel')) {
        this.setProperty('zoomLevel', 100);
        LoggerService.debug('Added zoomLevel property');
      }
      if (!this.getProperty('linespacing')) {
        this.setProperty('linespacing', 14);
        LoggerService.debug('Added linespacing property');
      }
      if (!this.getProperty('paragraphspacing')) {
        this.setProperty('paragraphspacing', 'medium');
        LoggerService.debug('Added paragraphspacing property');
      }
      if (!this.getProperty('chaptertitleformat')) {
        this.setProperty('chaptertitleformat', 'numbertitle');
        LoggerService.debug('Added chaptertitleformat property');
      }
      if (!this.getProperty('chaptertitleposition')) {
        this.setProperty('chaptertitleposition', 'left');
        LoggerService.debug('Added chaptertitleposition property');
      }
      if (!this.getProperty('sceneseparator')) {
        this.setProperty('sceneseparator', 'blank_line');
        LoggerService.debug('Added sceneseparator property');
      }

      BibiscoDbConnectionService.saveDatabase();
    },
    isCurrentVersionInitialized: function () {
      return this.getProperty(version) ? true : false;
    },
    isPreviousVersionInstalled: function () {
      let savedProjectsDirectory = this.getProperty('projectsDirectory');
      let savedBackupDirectory = this.getProperty('backupDirectory');
      return savedProjectsDirectory && savedBackupDirectory;
    },
    getCurrentVersionInitializationDate: function () {
      let properties = BibiscoDbConnectionService.getBibiscoDb().getCollection('properties');
      let property = properties.findOne({
        'name': version
      });
      return property ? property.meta.created : null;
    }
  };
});
