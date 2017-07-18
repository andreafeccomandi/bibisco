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

angular.module('bibiscoApp').service('ContextMenuSpellCheckService', function(
  LocaleService) {
  'use strict';

  // config context menu and spell check
  const electronSpellchecker = require('electron-spellchecker');

  // Retrieve required properties
  const SpellCheckHandler = electronSpellchecker.SpellCheckHandler;
  const ContextMenuListener = electronSpellchecker.ContextMenuListener;
  const ContextMenuBuilder = electronSpellchecker.ContextMenuBuilder;

  // Configure the spellcheckhandler
  var spellCheckHandler = new SpellCheckHandler();

  // Create the builder with the configured spellhandler
  var contextMenuBuilder = new ContextMenuBuilder(spellCheckHandler);

  return {
    activate: function() {
      spellCheckHandler.attachToInput();
      spellCheckHandler.switchLanguage(LocaleService.getCurrentLocale());

      contextMenuBuilder.setAlternateStringFormatter({
        addToDictionary: () => `Aggiungi al dizionario`,
        lookUpDefinition: ({
          word
        }) => `Look Up "${word}"`,
        searchGoogle: () => `Cerca con Google`,
        cut: () => `Taglia`,
        copy: () => `Copia`,
        paste: () => `Incolla`,
        inspectElement: () => `Inspect Element`,
      });

      // Add context menu listener on text input filed
      var contextMenuListener = new ContextMenuListener((info) => {
        if (info.isEditable || (info.inputFieldType && info.inputFieldType !==
            'none')) {
          contextMenuBuilder.showPopupMenu(info);
        }
      });
    },

    updateLocale: function() {
      spellCheckHandler.switchLanguage(LocaleService.getCurrentLocale());
      contextMenuBuilder.setAlternateStringFormatter({
        addToDictionary: () => `Aggiungi al dizionario - cambiato`,
        lookUpDefinition: ({
          word
        }) => `Look Up "${word}"`,
        searchGoogle: () => `Cerca con Google`,
        cut: () => `Taglia`,
        copy: () => `Copia`,
        paste: () => `Incolla`,
        inspectElement: () => `Inspect Element`,
      });
    }
  };
});
