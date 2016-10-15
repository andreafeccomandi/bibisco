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
		editor.addCommand( 'copyyzzz',
		{
			exec : function( editor ) {
				alert('polentona');
				var sel = editor.getSelection();
			    var ranges = sel.getRanges();
			    var el = new CKEDITOR.dom.element("div");
			    for (var i = 0, len = ranges.length; i < len; ++i) {
			        el.append(ranges[i].cloneContents());
			    }
			    CKEDITOR.ajax.send( 'BibiscoServlet?action=copyToClipboard', el.getHtml() );
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