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
				var xhr = new XMLHttpRequest();
	 			var params = "text="+editor.getSelection().getSelectedText();
	 			xhr.open("POST", 'BibiscoServlet?action=copyToClipboard', true);
	 			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	 			xhr.setRequestHeader("Content-length", params.length);
	 			xhr.send(params);
			}
		});
		
		// cut command
		editor.addCommand( 'bibiscoCut',
		{
			exec : function( editor ) {
				var xhr = new XMLHttpRequest();
	 			var params = "text="+editor.getSelection().getSelectedText();
	 			xhr.open("POST", 'BibiscoServlet?action=copyToClipboard', true);
	 			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	 			xhr.setRequestHeader("Content-length", params.length);
	 			xhr.send(params);
	 	
	 			var range = editor.getSelection().getRanges()[ 0 ];
	 			range.deleteContents();
	 			range.select(); // Select emptied range to place the caret in its place.
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