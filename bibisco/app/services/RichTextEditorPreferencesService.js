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

angular.module('bibiscoApp').service('RichTextEditorPreferencesService',
  function(
    BibiscoPropertiesService) {
    'use strict';

    let font = BibiscoPropertiesService.getProperty('font');
    let fontsize = BibiscoPropertiesService.getProperty('font-size');
    let indentParagraphEnabled = BibiscoPropertiesService.getProperty('indentParagraphEnabled');
    let linespacing = BibiscoPropertiesService.getProperty('linespacing');
    let paragraphspacing = BibiscoPropertiesService.getProperty('paragraphspacing');
    let spellCheckEnabled = BibiscoPropertiesService.getProperty('spellCheckEnabled');
    let autoSaveEnabled = BibiscoPropertiesService.getProperty('autoSaveEnabled');

    return {
      getFont: function() {
        return font;
      },
      getFontClass: function() {
        return 'bibiscoRichTextEditor-bodyClass-' + font + fontsize;
      },
      getFontSize: function() {
        return fontsize;
      },
      getIndentClass: function() {
        return 'bibiscoRichTextEditor-bodyClass-indent-' +
          indentParagraphEnabled;
      },
      getLinespacingClass: function() {
        return 'bibiscoRichTextEditor-bodyClass-linespacing-' + linespacing;
      },
      getParagraphspacingClass: function() {
        return 'bibiscoRichTextEditor-bodyClass-paragraphspacing-' + paragraphspacing;
      },
      isAutoSaveEnabled: function() {
        return autoSaveEnabled === 'true';
      },
      isIndentParagraphEnabled: function() {
        return indentParagraphEnabled === 'true';
      },
      isSpellCheckEnabled: function() {
        return spellCheckEnabled === 'true';
      },
      save: function(properties) {
        font = properties.font;
        fontsize = properties.fontsize;
        indentParagraphEnabled = properties.indentParagraphEnabled;
        linespacing = properties.linespacing;
        paragraphspacing = properties.paragraphspacing;
        spellCheckEnabled = properties.spellCheckEnabled;
        autoSaveEnabled = properties.autoSaveEnabled;

        BibiscoPropertiesService.setProperty('font', properties.font);
        BibiscoPropertiesService.setProperty('font-size', properties.fontsize);
        BibiscoPropertiesService.setProperty('indentParagraphEnabled', properties.indentParagraphEnabled);
        BibiscoPropertiesService.setProperty('linespacing', properties.linespacing);  
        BibiscoPropertiesService.setProperty('paragraphspacing', properties.paragraphspacing);  
        BibiscoPropertiesService.setProperty('spellCheckEnabled', properties.spellCheckEnabled);
        BibiscoPropertiesService.setProperty('autoSaveEnabled', properties.autoSaveEnabled);
      }
    };
  });
