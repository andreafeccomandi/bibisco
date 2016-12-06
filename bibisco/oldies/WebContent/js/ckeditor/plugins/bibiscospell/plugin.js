
CKEDITOR.plugins.add('bibiscospell', {
	
	init : function(editor) {
		
		// suggestion array
		var suggestions = [];
		
		// Add context menu support.
		if (editor.contextMenu) {
			// Register new context menu groups.
			editor.addMenuGroup('bibiscospellSuggestionGroup', 2);
			editor.addMenuGroup('bibiscospellIgnore', 3);
			
			// Enable the context menu only for an <spellerror> element with
			// attribute ignore <> true
			editor.contextMenu.addListener(function(element) {
				
				if(editor.config.spellCheckEnabled == false) {
					//spellCheck is not enabled: not show context menu
					return null;
				}
				
				var elementAscendant = null;
				if (element) {
					elementAscendant = element.getAscendant('spellerror', true);
				}
					
				if (elementAscendant == null) {
					// is not mispelled word: not show context menu
					return null;
				}
				
				if (elementAscendant.getAttribute('ignore') == 'true') {
					// is mispelled word but user wants to ignore it: not show context menu
					return null;
				}
				
				// remove previous suggestions
				for (m in suggestions) 	{
					delete editor._.menuItems[ m ];
					delete editor._.commands[ m ];
				}
				
				// populate array suggestion for actual word
				suggestions = [];
				if (elementAscendant.getAttribute('suggestions')) {
					suggestions = elementAscendant.getAttribute('suggestions').split('|');
				}
				
				// create command and menu item for suggestions
				var result = new Object();
				for (m in suggestions) {
					var suggestionId = 'bibiscospell_'+suggestions[m];
					
					// add command
					editor.addCommand(suggestionId, {
						word: suggestions[m],
						spellerrorspan: elementAscendant, 
						exec : function( editor, data ) { 
							
							// remove mispelled text node
							elementAscendant.getFirst().remove();
							
							// add word suggested to <spellerror> 
							elementAscendant.appendText(this.word);
							
							// remove <spellerror> element preserving children
							elementAscendant.remove(true);
						}
					});
										
					// add menu item
					editor.addMenuItem(suggestionId, {
						label : suggestions[m],
						command : suggestionId,
						group : 'bibiscospellSuggestionGroup'
					});
					
					// add property to result
					result[suggestionId] = CKEDITOR.TRISTATE_OFF;
				}
				
				delete editor._.menuItems[ 'bibiscospell_command_ignore' ];
				delete editor._.commands[ 'bibiscospell_command_ignore' ];
				
				// add ignore command
				editor.addCommand('bibiscospell_command_ignore', {
					spellerrorspan: elementAscendant, 
					exec : function( editor, data ) { 
						elementAscendant.setAttribute('ignore','true');
						elementAscendant.removeClass('spellerror');
					}
				});
				
				// add ignore menu item
				editor.addMenuItem('bibiscospell_command_ignore', {
					label : jsPluginBibiscospellCkeditor,
					command : 'bibiscospell_command_ignore', 
					group : 'bibiscospellIgnore' 
				});
				
				// show ignore command
				result['bibiscospell_command_ignore'] = CKEDITOR.TRISTATE_OFF;
				
				return result;
			});
		}
	}
});

