/*
 * @file Zoom plugin for CKEditor
 * Copyright (C) 2008-2009 Alfonso Martínez de Lizarrondo
 *
 * == BEGIN LICENSE ==
 *
 * Licensed under the terms of any of the following licenses at your
 * choice:
 *
 *  - GNU General Public License Version 2 or later (the "GPL")
 *    http://www.gnu.org/licenses/gpl.html
 *
 *  - GNU Lesser General Public License Version 2.1 or later (the "LGPL")
 *    http://www.gnu.org/licenses/lgpl.html
 *
 *  - Mozilla Public License Version 1.1 or later (the "MPL")
 *    http://www.mozilla.org/MPL/MPL-1.1.html
 *
 * == END LICENSE ==
 *
 */

CKEDITOR.plugins.add( 'zoom',
{
	requires : [ 'richcombo' ],

	init : function( editor )
	{
		var config = editor.config,
			lang = editor.lang.stylesCombo;

		// Check for IE or support for CSS Transforms


		editor.ui.addRichCombo( 'Zoom',
			{
				label : "100 %",
				title : 'Zoom',
				multiSelect : false,
				className : 'zoom',
				width : '35px',
				panelStyles : {
					width : '70px',
					'height': '160px',
					'max-height': '160px'
				}, // height style disappears

				panel :
				{
					css : [ CKEDITOR.getUrl( editor.skinPath + 'editor.css' ) ].concat( config.contentsCss ),
					voiceLabel : lang.panelVoiceLabel
				},

				init : function()
				{
					var zoomOptions = [50, 75, 100, 125, 150, 200, 400],
						zoom;

					this.startGroup( 'Zoom level' );
					// Loop over the Array, adding all items to the
					// combo.
					for ( i = 0 ; i < zoomOptions.length ; i++ )
					{
						zoom = zoomOptions[ i ];
						// value, html, text
						this.add( zoom, zoom + " %", zoom + " %" );
					}
					// Default value on first click
					this.setValue(100, "100 %");
				},

				onClick : function( value )
				{
					/*var body = editor.document.getBody().$;
					var prefix = "Moz";

					body.style.MozTransformOrigin = "top left";
					body.style.MozTransform = "scale(" + (value/100)  + ")";

					body.style.WebkitTransformOrigin = "top left";
					body.style.WebkitTransform = "scale(" + (value/100)  + ")";

					body.style.OTransformOrigin = "top left";
					body.style.OTransform = "scale(" + (value/100)  + ")";

					body.style.TransformOrigin = "top left";
					body.style.Transform = "scale(" + (value/100)  + ")";
					// IE
					body.style.zoom = value/100;*/
				}
			});
		// End of richCombo element

	} //Init
} );

