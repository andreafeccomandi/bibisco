CKEDITOR.plugins.add( 'angledbracketright',
{
	requires : [ 'button' ],
	
	init: function( editor )
	{
		editor.addCommand( 'angledbracketright',
			{
				exec : function( editor )
				{    
					var timestamp = new Date();
					editor.insertHtml( '&raquo;' );
				}
			});
		
		editor.ui.addButton( 'angledbracketright',
		{
			label: 'Insert angledbracketright',
			command: 'angledbracketright'
		} );
	}
} );