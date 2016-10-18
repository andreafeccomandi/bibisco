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
		editor.addCommand( 'bibiscoPaste',
		{
			exec : function( editor ) {
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
				    if (xhr.readyState == XMLHttpRequest.DONE) {
				        editor.insertHtml(xhr.responseText);
				    }
				}
				xhr.open('GET', 'BibiscoServlet?action=pasteFromClipboard', true);
				xhr.send(null);
			}
		});
	}
} );