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

angular.module('bibiscoApp').service('LocaleService', function($translate,
  $rootScope, tmhDynamicLocale, BibiscoPropertiesService, ContextService, 
  FileSystemService, LoggerService) {
  'use strict';

  const ipc = require('electron').ipcRenderer;

  // get preferredLanguage from bibiscodb
  var currentLocale = BibiscoPropertiesService.getProperty('locale');
  LoggerService.debug('storedLocale = [' + currentLocale + ']');

  if (!currentLocale) {
    // is the first access, I calculate preferred locale
    currentLocale = calculatePreferredLocale($translate.preferredLanguage(),
      LoggerService);
  }
  // asking angular-translate to load and apply proper translations
  $translate.use(currentLocale);

  // asking angular-dynamic-locale to load and apply proper AngularJS $locale setting
  tmhDynamicLocale.set(currentLocale);

  // EVENTS
  // on successful applying translations by angular-translate
  $rootScope.$on('$translateChangeSuccess', function(event, data) {
    
    // sets "lang" attribute to html
    document.documentElement.setAttribute('lang', data.language); 

    // context menu translations
    $translate(['context_menu_add_dictionary',
      'context_menu_bold',
      'context_menu_italic',
      'context_menu_underline',
      'context_menu_strike',
      'context_menu_highlight',
      'context_menu_add_link',
      'context_menu_edit_link',
      'context_menu_remove_link',
      'context_menu_add_note',
      'context_menu_add_image',
      'context_menu_edit_image',
      'context_menu_delete_image',
      'context_menu_comment',
      'context_menu_copy',
      'context_menu_cut',
      'context_menu_paste']).then(function (translations) {
      ipc.send('setContextMenuStringTable', {
        addToDictionary: translations.context_menu_add_dictionary,
        bold: translations.context_menu_bold,
        italic: translations.context_menu_italic,
        underline: translations.context_menu_underline,
        strike: translations.context_menu_strike,
        highlight: translations.context_menu_highlight,
        addLink: translations.context_menu_add_link,
        editLink: translations.context_menu_edit_link,
        removeLink: translations.context_menu_remove_link,
        comment: translations.context_menu_comment,
        addNote: translations.context_menu_add_note,
        addImage: translations.context_menu_add_image,
        editImage: translations.context_menu_edit_image,
        deleteImage: translations.context_menu_delete_image,
        cut: translations.context_menu_cut,
        copy: translations.context_menu_copy,
        paste: translations.context_menu_paste
      });

    }, function (translationIds) {
      ipc.send('setContextMenuStringTable', {
        addToDictionary: 'Add to dictionary',
        bold: 'Bold',
        italic: 'Italic',
        underline: 'Underline',
        strike: 'Strikethrough',
        highlight: 'Highlight',
        addLink: 'Add link',
        editLink: 'Edit link',
        removeLink: 'Remove link',
        addNote: 'Add note',
        addImage: 'Add image',
        editImage: 'Edit image',
        deleteImage: 'Delete image',
        cut: 'Cut',
        copy: 'Copy',
        paste: 'Paste'
      });
    });
  });

  return {
    getCurrentLocale: function() {
      return currentLocale;
    },
    setCurrentLocale: function(locale) {

      // updating current locale
      currentLocale = locale;

      // asking angular-translate to load and apply proper translations
      $translate.use(currentLocale);

      // asking angular-dynamic-locale to load and apply proper AngularJS $locale setting
      tmhDynamicLocale.set(currentLocale);

      $rootScope.$emit('LOCALE_CHANGED', {
        locale: currentLocale
      });
    },
    getLocales: function() {
      return {
        'cs': 'Český',
        'de': 'Deutsch',
        'en-ca': 'English (Canada)',
        'en-gb': 'English (UK)',
        'en-us': 'English (USA)',
        'es': 'Español',
        'fr': 'Français',
        'it': 'Italiano',
        'nl': 'Nederlands',
        'pl': 'Polski',
        'pt-br': 'Português (Brasil)',
        'pt-pt': 'Português (Portugal)',
        'ru': 'Русский',
        'sl': 'Slovenski jezik',
        'sr': 'Srpski',
        'tr': 'Türkçe',
        'uk': 'Українська'
      };
    },
    getResourceFilePath: function(language) {

      let resourceSuffix = 'en';
      if (language === 'ca-es') {
        resourceSuffix = 'ca-es';
      } else if (language === 'cs') {
        resourceSuffix = 'cs';
      } else if (language === 'da-dk') {
        resourceSuffix = 'da-dk';
      } else if (language === 'de') {
        resourceSuffix = 'de';
      } else if (language.startsWith('es')) {
        resourceSuffix = 'es';
      } else if (language === 'fr') {
        resourceSuffix = 'fr';
      } else if (language === 'it') {
        resourceSuffix = 'it';
      } else if (language === 'nb-no') {
        resourceSuffix = 'no';
      } else if (language === 'nl') {
        resourceSuffix = 'nl';
      } else if (language === 'pl') {
        resourceSuffix = 'pl';
      } else if (language === 'ru') {
        resourceSuffix = 'ru';
      } else if (language === 'sr') {
        resourceSuffix = 'sr';
      } else if (language === 'sv') {
        resourceSuffix = 'sv';
      } else if (language === 'tr') {
        resourceSuffix = 'tr';
      } else if (language === 'uk') {
        resourceSuffix = 'uk';
      } else if (language === 'pt-pt') {
        resourceSuffix = 'pt-pt';
      } else if (language === 'pt-br') {
        resourceSuffix = 'pt-br';
      } 

      let resourcesDirPath = FileSystemService.concatPath(ContextService.getAppPath(), 'resources');
      let resourcesFilePath = FileSystemService.concatPath(resourcesDirPath, 'locale-'+resourceSuffix+'.json');

      return resourcesFilePath;
    },    
  };
});

function calculatePreferredLocale(preferredLanguage, LoggerService) {

  let preferredLocale;

  preferredLanguage = preferredLanguage.toLowerCase().replace(/_/g, '-');

  if (preferredLanguage.startsWith('cs')) {
    preferredLocale = 'cs';
  } else if (preferredLanguage.startsWith('de')) {
    preferredLocale = 'de';
  } else if (preferredLanguage.startsWith('es')) {
    preferredLocale = 'es';
  } else if (preferredLanguage.startsWith('fr')) {
    preferredLocale = 'fr';
  } else if (preferredLanguage.startsWith('it')) {
    preferredLocale = 'it';
  } else if (preferredLanguage.startsWith('nl')) {
    preferredLocale = 'nl';
  } else if (preferredLanguage.startsWith('pl')) {
    preferredLocale = 'pl';
  } else if (preferredLanguage.startsWith('ru')) {
    preferredLocale = 'ru';
  }  else if (preferredLanguage.startsWith('sl')) {
    preferredLocale = 'sl';
  } else if (preferredLanguage.startsWith('sr')) {
    preferredLocale = 'sr';
  } else if (preferredLanguage.startsWith('tr')) {
    preferredLocale = 'tr';
  } else if (preferredLanguage === 'pt-pt') {
    preferredLocale = 'pt-pt';
  } else if (preferredLanguage === 'pt-br') {
    preferredLocale = 'pt-br';
  } else if (preferredLanguage === 'en-ca') {
    preferredLocale = 'en-ca';
  } else if (preferredLanguage === 'en-gb') {
    preferredLocale = 'en-gb';
  } else {
    preferredLocale = 'en-us';
  }

  LoggerService.debug('calculatePreferredLocale - input: ' +
    preferredLanguage + ' - output: ' + preferredLocale);

  return preferredLocale;
}
