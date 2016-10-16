CKEDITOR.plugins.add( 'dialogsymbols',
{
	
	init: function( editor )
	{
		// angledbracketleft command
		editor.addCommand( 'angledbracketleft',
			{
				exec : function( editor ) {    
					editor.insertHtml( '&laquo;' );
				}
			});
		
		// angledbracketright command
		editor.addCommand( 'angledbracketright',
			{
				exec : function( editor ) {    
					editor.insertHtml( '&raquo;' );
				}
			});
		
		// angledbracketright command
		editor.addCommand( 'longdash',
			{
				exec : function( editor ) {    
					editor.insertHtml( '&mdash;' );
				}
			});
		
		// copy command
		editor.addCommand( 'bibiscoCopy',
		{
			exec : function( editor ) {
			    CKEDITOR.ajax.send( 'BibiscoServlet?action=copyToClipboard', editor.getSelection().getSelectedText() );
			}
		});
		
		// paste command
		editor.addCommand( 'pasteez',
		{
			exec : function( editor ) {    
				editor.insertHtml( 'onironauta' );
			}
		});
	}
} );