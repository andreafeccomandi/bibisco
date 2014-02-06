/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'highlightText',
{
	requires : [ 'styles', 'button' ],

	init : function( editor )
	{
		// All buttons use the same code to register. So, to avoid
		// duplications, let's use this tool function.
		var addButtonCommand = function( buttonName, buttonLabel, commandName, styleDefiniton )
		{
			var style = new CKEDITOR.style( styleDefiniton );

			editor.attachStyleStateChange( style, function( state )
				{
					!editor.readOnly && editor.getCommand( commandName ).setState( state );
				});

			editor.addCommand( commandName, new CKEDITOR.styleCommand( style ) );

			editor.ui.addButton( buttonName,
				{
					label : buttonLabel,
					command : commandName
				});
		};

		var config = editor.config,
			lang = editor.lang;

		addButtonCommand( 'HighlightText'		, lang.bold		, 'highlightText'		, config.coreStyles_highlightText );
	}
});

// Basic Inline Styles.

/**
 * The style definition that applies the <strong>bold</strong> style to the text.
 * @type Object
 * @default <code>{ element : 'strong', overrides : 'b' }</code>
 * @example
 * config.coreStyles_bold = { element : 'b', overrides : 'strong' };
 * @example
 * config.coreStyles_bold =
 *     {
 *         element : 'span',
 *         attributes : { 'class' : 'Bold' }
 *     };
 */
CKEDITOR.config.coreStyles_highlightText = { element : 'span',  attributes : { 'class' : 'highlightText' } };

