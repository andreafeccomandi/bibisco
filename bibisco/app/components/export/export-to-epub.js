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
  component('exporttoepub', {
    templateUrl: 'components/export/export-to-epub.html',
    controller: ExportToEpub
  });

function ExportToEpub($location, $rootScope, $scope, $timeout, $translate, BibiscoPropertiesService,
  BibiscoDbConnectionService, ContextService, EPubExporterService, ExportService, FileSystemService, 
  PopupBoxesService, ProjectService) {

  let self = this;

  self.$onInit = function() {

    // load translations
    self.translations = $translate.instant([
      'common_chapter',
      'chapter_title_format_chapter_label_number_suffix',
    ]);

    $rootScope.$emit('EXPORT_SELECT_DIRECTORY');
    self.pageheadertitle = 'jsp.export.title.epub';
    
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_export',
      href: '/export'
    });
    self.breadcrumbitems.push({
      label: self.pageheadertitle
    });

    self.saving = false;
    
    self.exportpath = BibiscoPropertiesService.getProperty('exportpath');
    self.exportpathchanged = false;
    self.exportdefaultpath = self.exportpath ? self.exportpath : ContextService.getDownloadsDirectoryPath();

    let projectInfo = ProjectService.getProjectInfo();
    self.author = projectInfo.author;
    self.publisher = projectInfo.publisher;
    self.copyright = projectInfo.copyright;
    self.rights = projectInfo.rights;
    self.isbn = projectInfo.isbn;
    self.website = projectInfo.website;
    self.coverImage = ProjectService.getSelectedCoverImageName();

    self.chaptertitleformat = BibiscoPropertiesService.getProperty('chaptertitleformat');
    self.chaptertitleexample = ExportService.calculateChapterTitleExample(self.chaptertitleformat);
    self.chaptertitleformatgroup = [{
      label: 'chapter_title_format_number_title',
      value: 'numbertitle'
    }, {
      label: 'chapter_title_format_only_number',
      value: 'number'
    }, {
      label: 'chapter_title_format_only_title',
      value: 'title'
    }, {
      label: '"' + self.translations.common_chapter + '" ' + self.translations.chapter_title_format_chapter_label_number_suffix,
      value: 'labelnumber'
    }];

    self.chaptertitleposition = BibiscoPropertiesService.getProperty('chaptertitleposition');
    self.chaptertitlepositiongroup = [{
      label: 'common_left',
      value: 'left'
    }, {
      label: 'common_center',
      value: 'center'
    }];

    self.sceneseparator = BibiscoPropertiesService.getProperty('sceneseparator');
    self.sceneseparatorgroup = [{
      label: 'blank_line',
      value: 'blank_line'
    }, {
      label: 'three_asterisks',
      value: 'three_asterisks'
    }, {
      label: 'three_dots',
      value: 'three_dots'
    }];

    self.exportscenetitle = BibiscoPropertiesService.getProperty('exportscenetitle');
    self.exportscenetitlegroup = [{
      label: 'jsp.common.button.enabled',
      value: 'true'
    }, {
      label: 'jsp.common.button.disabled',
      value: 'false'
    }];

    self.scenetitleposition = BibiscoPropertiesService.getProperty('scenetitleposition');
    self.scenetitlepositiongroup = [{
      label: 'common_left',
      value: 'left'
    }, {
      label: 'common_center',
      value: 'center'
    }];

    self.scenetitleformat = BibiscoPropertiesService.getProperty('scenetitleformat');
    self.scenetitleexample = ExportService.calculateChapterTitleExample(self.scenetitleformat);
    self.scenetitleformatgroup = [{
      label: 'chapter_title_format_number_title',
      value: 'numbertitle'
    }, {
      label: 'chapter_title_format_only_number',
      value: 'number'
    }, {
      label: 'chapter_title_format_only_title',
      value: 'title'
    }];

    self.footendnotemode = BibiscoPropertiesService.getProperty('epubnoteexport');
    self.footendnotegroup = [{
      label: 'note_export_chapterendnote',
      value: 'chapterend'
    },{
      label: 'note_export_bookendnote',
      value: 'bookend'
    }];
    self.bookendtitle = BibiscoPropertiesService.getProperty('bookendtitle');

    self.indent = BibiscoPropertiesService.getProperty('indentParagraphEnabled');
    self.indentgroup = [{
      label: 'jsp.common.button.enabled',
      value: 'true'
    }, {
      label: 'jsp.common.button.disabled',
      value: 'false'
    }];
    self.linespacing = BibiscoPropertiesService.getProperty('linespacing');
    self.linespacinggroup = [{
      label: '1',
      value: 10
    }, {
      label: '1.3',
      value: 13
    }, {
      label: '1.4',
      value: 14
    }, {
      label: '1.5',
      value: 15
    }, {
      label: '2',
      value: 20
    }];
    self.paragraphspacing = BibiscoPropertiesService.getProperty('paragraphspacing');
    self.paragraphspacinggroup = [{
      label: '0',
      value: 'none'
    }, {
      label: '0.5',
      value: 'small'
    }, {
      label: '1',
      value: 'medium'
    }, {
      label: '1.5',
      value: 'large'
    }, {
      label: '2',
      value: 'double'
    }];

    self.advancedsettings = false;

    self.checkExit = {
      active: true
    };
  };


  self.showadvancedsettings = function() {
    self.advancedsettings = true;
  };
  
  self.hideadvancedsettings = function() {
    self.advancedsettings = false;
  };

  self.updateEpubMetadata = function() {
    ProjectService.updateEpubMetadata({
      author: self.author,
      publisher: self.publisher,
      copyright: self.copyright,
      rights: self.rights,
      isbn: self.isbn,
      website: self.website
    });
  };

  self.updateCommonExportMetadata = function() {
    BibiscoPropertiesService.setProperty('chaptertitleformat', self.chaptertitleformat);
    BibiscoPropertiesService.setProperty('chaptertitleposition', self.chaptertitleposition);
    BibiscoPropertiesService.setProperty('sceneseparator', self.sceneseparator);
    BibiscoPropertiesService.setProperty('exportscenetitle', self.exportscenetitle);
    BibiscoPropertiesService.setProperty('scenetitleformat', self.scenetitleformat);
    BibiscoPropertiesService.setProperty('scenetitleposition', self.scenetitleposition);
    BibiscoPropertiesService.setProperty('exportpath', self.exportpath);
    BibiscoPropertiesService.setProperty('epubnoteexport', self.footendnotemode);
    BibiscoPropertiesService.setProperty('bookendtitle', self.bookendtitle);
    BibiscoPropertiesService.setProperty('indentParagraphEnabled', self.indent);
    BibiscoPropertiesService.setProperty('linespacing', self.linespacing);
    BibiscoPropertiesService.setProperty('paragraphspacing', self.paragraphspacing);
    BibiscoDbConnectionService.saveDatabase();
  };

  self.getCoverImageName = function() {
    let coverImage = ProjectService.getProjectInfo().coverImage;

    if (coverImage) {
      return coverImage.name;
    } else {
      return null;
    }
  };

  self.export = function(isValid) {
    if (isValid && !self.forbiddenDirectory) {
      self.checkExit = {
        active: false
      };
      self.saving = true;
      $timeout(function () {
        self.updateEpubMetadata();
        self.updateCommonExportMetadata();
        EPubExporterService.export(self.exportpath, self.exportCallback);
      }, 250);
    }
  },

  self.exportCallback = function() {
    $timeout(function () {
      $location.path('/export');
    }, 0);
  };

  self.selectCoverImage = function () {
    self.updateEpubMetadata();
    $location.path('/exporttoepub/images');
  };

  self.selectProjectsDirectory = function (directory) {
    self.exportpathchanged = true;
    self.exportpath = directory;
    if (FileSystemService.canWriteDirectory(directory)) {
      self.forbiddenDirectory = false;
    } else {
      self.forbiddenDirectory = true;
    }
    
    $scope.$apply();
  };

  self.changechaptertitleformat = function(selected) {
    self.chaptertitleexample = ExportService.calculateChapterTitleExample(selected);
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $scope.exportToEpubForm.$dirty || self.exportpathchanged, self.checkExit);
  });
}
