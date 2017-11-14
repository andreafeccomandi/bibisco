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
  $translate, ContextService, LoggerService, ProjectService) {
  'use strict';

  // config context menu and spell check
  const electronSpellchecker = require('electron-spellchecker');

  // Retrieve required properties
  const SpellCheckHandler = electronSpellchecker.SpellCheckHandler;
  const ContextMenuListener = electronSpellchecker.ContextMenuListener;
  const DictionarySync = electronSpellchecker.DictionarySync;

  var remote = require('electron').remote;
  var dictionarySync;
  var spellCheckHandler;
  var contextMenuBuilder;
  var contextMenuListener;

  return {
    create: async function() {

      // Configure DictionarySync
      dictionarySync = new DictionarySync(ContextService.getAppPath() +
        '/dictionaries');

      // Configure the spellcheckhandler
      spellCheckHandler = new SpellCheckHandler(dictionarySync);
      spellCheckHandler.attachToInput();
      spellCheckHandler.switchLanguage(ProjectService.getProjectInfo().language);

      // Create the builder with the configured spellhandler
      contextMenuBuilder = await this.createMenu();

      // Add context menu listener only on content editable
      contextMenuListener = new ContextMenuListener(function(info) {
        if (info.isEditable && info.inputFieldType === 'none') {
          contextMenuBuilder.showPopupMenu(info);
        }
      });
    },

    destroy: function() {
      contextMenuListener.unsubscribe();
      spellCheckHandler = null;
      dictionarySync = null;
      contextMenuBuilder = null;
    },

    getContextMenuStringTable: async function() {
      let translations = await $translate([
        'context_menu_add_dictionary',
        'context_menu_search_google',
        'context_menu_copy',
        'context_menu_cut',
        'context_menu_paste'
      ]);

      return {
        addToDictionary: function() {
          return translations.context_menu_add_dictionary;
        },
        cut: function() {
          return translations.context_menu_cut;
        },
        copy: function() {
          return translations.context_menu_copy;
        },
        paste: function() {
          return translations.context_menu_paste;
        }
      };
    },

    createMenu: async function() {

      let contextMenuStringTable = await this.getContextMenuStringTable();
      let stringTable = Object.assign({}, contextMenuStringTable);
      let _spellCheckHandler = spellCheckHandler;

      return {
        stringTable: stringTable,

        getWebContents: function() {
          let windowOrWebView = remote.getCurrentWebContents();
          let ctorName = Object.getPrototypeOf(windowOrWebView).constructor
            .name;
          if (ctorName === 'WebContents') {
            return windowOrWebView;
          } else {
            // NB: We do this because at the time a WebView is created, it doesn't
            // have a WebContents, we need to defer the call to getWebContents
            let webContents = 'webContents' in windowOrWebView ?
              windowOrWebView.webContents : windowOrWebView.getWebContents();
            return webContents;
          }
        },

        showPopupMenu: async function(contextInfo) {
          let menu = await this.buildMenuForTextInput(contextInfo);
          if (!menu) return;
          menu.popup(remote.getCurrentWindow(), {
            async: true
          });
        },

        buildMenuForTextInput: async function(menuInfo) {
          let menu = new remote.Menu();

          await this.addSpellingItems(menu, menuInfo);
          this.addCut(menu, menuInfo);
          this.addCopy(menu, menuInfo);
          this.addPaste(menu, menuInfo);

          return menu;
        },

        addSpellingItems: async function(menu, menuInfo) {
          let target = this.getWebContents();
          if (!menuInfo.misspelledWord || menuInfo.misspelledWord.length <
            1) {
            return menu;
          }

          // Ensure that we have a spell-checker for this language
          if (!_spellCheckHandler.currentSpellchecker) {
            return menu;
          }

          // Ensure that we have valid corrections for that word
          let corrections = await _spellCheckHandler.getCorrectionsForMisspelling(
            menuInfo.misspelledWord);
          if (corrections && corrections.length > 0) {
            corrections.forEach((correction) => {
              let item = new remote.MenuItem({
                label: correction,
                click: () => target.replaceMisspelling(
                  correction)
              });

              menu.append(item);
            });
          }

          this.addSeparator(menu);

          // Gate learning words based on OS support. At some point we can manage a
          // custom dictionary for Hunspell, but today is not that day
          if (process.platform === 'darwin') {
            let learnWord = new remote.MenuItem({
              label: this.stringTable.addToDictionary(),
              click: async function() {
                target.replaceMisspelling(menuInfo.selectionText);

                try {
                  _spellCheckHandler.currentSpellchecker.add(
                    menuInfo.misspelledWord);
                } catch (e) {
                  LoggerService.error(e.message);
                }
              }
            });

            menu.append(learnWord);
          }

          return menu;
        },

        addCut: function(menu, menuInfo) {
          let target = this.getWebContents();
          menu.append(new remote.MenuItem({
            label: this.stringTable.cut(),
            accelerator: 'CommandOrControl+X',
            enabled: menuInfo.editFlags.canCut,
            click: () => target.cut()
          }));

          return menu;
        },

        addCopy: function(menu, menuInfo) {
          let target = this.getWebContents();
          menu.append(new remote.MenuItem({
            label: this.stringTable.copy(),
            accelerator: 'CommandOrControl+C',
            enabled: menuInfo.editFlags.canCopy,
            click: () => target.copy()
          }));

          return menu;
        },

        addPaste: function(menu, menuInfo) {
          let target = this.getWebContents();
          menu.append(new remote.MenuItem({
            label: this.stringTable.paste(),
            accelerator: 'CommandOrControl+V',
            enabled: menuInfo.editFlags.canPaste,
            click: () => target.paste()
          }));

          return menu;
        },

        addSeparator: function(menu) {
          menu.append(new remote.MenuItem({
            type: 'separator'
          }));
          return menu;
        },

        setAlternateStringFormatter: function(stringTable) {
          this.stringTable = Object.assign(this.stringTable,
            stringTable);
        }
      };
    },
  };
});
