CKEDITOR.plugins.add( 'angledbracketleft',
{
	requires : [ 'button' ],
	
	init: function( editor )
	{
		editor.addCommand( 'angledbracketleft',
			{
				exec : function( editor )
				{    
					var timestamp = new Date();
					editor.insertHtml( '&laquo;' );
				}
			});
		
		editor.ui.addButton( 'angledbracketleft',
		{
			label: 'Insert angledbracketleft',
			command: 'angledbracketleft'
		} );
	}
} );