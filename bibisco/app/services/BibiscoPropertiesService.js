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

angular.module('bibiscoApp').service('BibiscoPropertiesService', function (
  BibiscoDbConnectionService, LoggerService) {
  'use strict';

  const version = '4.0.0-CE';

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

      // version 4.0.0
      if (!this.getProperty('imageEditTip')) {
        this.setProperty('imageEditTip', 'true');
        LoggerService.debug('Added imageEditTip property');
      }
      if (!this.getProperty('pagenumberposition')) {
        this.setProperty('pagenumberposition', 'footer');
        LoggerService.debug('Added pagenumberposition property');
      }
      if (!this.getProperty('pagenumberalignment')) {
        this.setProperty('pagenumberalignment', 'center');
        LoggerService.debug('Added pagenumberalignment property');
      }
      if (!this.getProperty('showfirstpagenumber')) {
        this.setProperty('showfirstpagenumber', 'false');
        LoggerService.debug('Added showfirstpagenumber property');
      }
      if (!this.getProperty('pagenumberformat')) {
        this.setProperty('pagenumberformat', 'number');
        LoggerService.debug('Added pagenumberformat property');
      }
      if (!this.getProperty('tocformat')) {
        this.setProperty('tocformat', 'none');
        LoggerService.debug('Added tocformat property');
      }
      if (!this.getProperty('toctitle')) {
        this.setProperty('toctitle', '');
        LoggerService.debug('Added toctitle property');
      }
      if (!this.getProperty('exporthighlightedtext')) {
        this.setProperty('exporthighlightedtext', 'false');
        LoggerService.debug('Added exporthighlightedtext property');
      }
      if (!this.getProperty('exportpath')) {
        this.setProperty('exportpath', '');
        LoggerService.debug('Added exportpath property');
      }
      if (!this.getProperty('footendnoteTip')) {
        this.setProperty('footendnoteTip', 'true');
        LoggerService.debug('Added footendnoteTip property');
      }
      if (!this.getProperty('docxnoteexport')) {
        this.setProperty('docxnoteexport', 'footnote');
        LoggerService.debug('Added docxnoteexport property');
      }
      if (!this.getProperty('pdfnoteexport')) {
        this.setProperty('pdfnoteexport', 'chapterend');
        LoggerService.debug('Added pdfnoteexport property');
      }
      if (!this.getProperty('txtnoteexport')) {
        this.setProperty('txtnoteexport', 'chapterend');
        LoggerService.debug('Added txtnoteexport property');
      }
      if (!this.getProperty('epubnoteexport')) {
        this.setProperty('epubnoteexport', 'chapterend');
        LoggerService.debug('Added epubnoteexport property');
      }
      if (!this.getProperty('bookendtitle')) {
        this.setProperty('bookendtitle', '');
        LoggerService.debug('Added bookendtitle property');
      }
      if (!this.getProperty('exportcomments')) {
        this.setProperty('exportcomments', 'false');
        LoggerService.debug('Added exportcomments property');
      }
      if (!this.getProperty('exportscenetitle')) {
        this.setProperty('exportscenetitle', 'false');
        LoggerService.debug('Added exportscenetitle property');
      }
      if (!this.getProperty('scenetitleformat')) {
        this.setProperty('scenetitleformat', 'title');
        LoggerService.debug('Added scenetitleformat property');
      }
      if (!this.getProperty('scenetitleposition')) {
        this.setProperty('scenetitleposition', 'left');
        LoggerService.debug('Added scenetitleposition property');
      }
      if (!this.getProperty('exportunansweredquestions')) {
        this.setProperty('exportunansweredquestions', 'false');
        LoggerService.debug('Added exportunansweredquestions property');
      }
      if (!this.getProperty('exportfontsize')) {
        this.setProperty('exportfontsize', 12);
        LoggerService.debug('Added exportfontsize property');
      }
      if (!this.getProperty('chapteredittitleTip')) {
        this.setProperty('chapteredittitleTip', 'true');
        LoggerService.debug('Added chapteredittitleTip property');
      }
      if (!this.getProperty('characteredittitleTip')) {
        this.setProperty('characteredittitleTip', 'true');
        LoggerService.debug('Added characteredittitleTip property');
      }
      if (!this.getProperty('interviewfreetextTip')) {
        this.setProperty('interviewfreetextTip', 'true');
        LoggerService.debug('Added interviewfreetextTip property');
      }
      if (!this.getProperty('shortcutTip')) {
        this.setProperty('shortcutTip', 'true');
        LoggerService.debug('Added shortcutTip property');
      }
      if (!this.getProperty('autoOpenProjectExplorerOnTextEdit')) {
        this.setProperty('autoOpenProjectExplorerOnTextEdit', 'true');
        LoggerService.debug('Added autoOpenProjectExplorerOnTextEdit property');
      }
      if (!this.getProperty('defaultElementOpeningMode')) {
        this.setProperty('defaultElementOpeningMode', 'edit');
        LoggerService.debug('Added defaultElementOpeningMode property');
      }
      if (!this.getProperty('showElementAfterInsertion')) {
        this.setProperty('showElementAfterInsertion', 'true');
        LoggerService.debug('Added showElementAfterInsertion property');
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
