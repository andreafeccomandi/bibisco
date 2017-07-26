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

angular.module('bibiscoApp').service('ContextMenuService', function(
  ContextService, ProjectService) {
  'use strict';

  // config context menu and spell check
  const electronSpellchecker = require('electron-spellchecker');

  // Retrieve required properties
  const SpellCheckHandler = electronSpellchecker.SpellCheckHandler;
  const ContextMenuListener = electronSpellchecker.ContextMenuListener;
  const ContextMenuBuilder = electronSpellchecker.ContextMenuBuilder;
  const DictionarySync = electronSpellchecker.DictionarySync;

  var dictionarySync;
  var spellCheckHandler;
  var contextMenuBuilder;
  var contextMenuListener;

  return {
    create: function() {

      // Configure DictionarySync
      dictionarySync = new DictionarySync(ContextService.getAppPath() +
        '/dictionaries');

      // Configure the spellcheckhandler
      spellCheckHandler = new SpellCheckHandler(dictionarySync);
      spellCheckHandler.attachToInput();
      spellCheckHandler.switchLanguage(ProjectService.getProjectInfo().language);

      // Create the builder with the configured spellhandler
      contextMenuBuilder = new ContextMenuBuilder(spellCheckHandler);
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

      // Add context menu listener only on content editable
      contextMenuListener = new ContextMenuListener(function(info) {
        if (info.isEditable && info.inputFieldType == 'none') {
          contextMenuBuilder.showPopupMenu(info);
        }
      });
    },
    destroy: function() {
      contextMenuListener.unsubscribe();
      spellCheckHandler = null;
      dictionarySync = null;
      contextMenuBuilder = null;
    }
  };
});
