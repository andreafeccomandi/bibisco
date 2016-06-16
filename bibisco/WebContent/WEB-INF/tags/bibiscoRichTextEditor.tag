
<%@tag import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<c:set var="req" value="${pageContext.request}" />
<c:set var="baseURL" value="${req.scheme}://${req.serverName}:${req.serverPort}${req.contextPath}" />
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
    
    function bibiscoRichTextEditorInit(bibiscoRichTextEditorConfig) {
            
        var contentsCss = getContentsCss(${richTextEditorSettings.spellCheckEnabled});
        
        // rich text editor configuration
        var config = {
            language : '<%=LocaleManager.getInstance().getLocale().getLanguage()%>',
            toolbarStartupExpanded : false,
            disableContextMenu : false,
            removePlugins : 'elementspath,resize,scayt,liststyle',
            height : (bibiscoRichTextEditorConfig.height-15) + 'px',
            width : bibiscoRichTextEditorConfig.width + 'px',
            extraPlugins : 'onchange,highlightText,bibiscospell,dialogsymbols', 
            keystrokes : [
                [ CKEDITOR.CTRL + 90 /*Z*/, 'undo' ],
                [ CKEDITOR.CTRL + 89 /*Y*/, 'redo' ],
                [ CKEDITOR.CTRL + CKEDITOR.SHIFT + 90 /*Z*/, 'redo' ],
                [ CKEDITOR.CTRL + 80 /*P*/, 'print' ],
                [ CKEDITOR.CTRL + 66 /*B*/, 'bold' ],
                [ CKEDITOR.CTRL + 73 /*I*/, 'italic' ],
                [ CKEDITOR.CTRL + 85 /*U*/, 'underline' ],
                [ CKEDITOR.CTRL + 83 /*S*/, 'strike' ],
                [ CKEDITOR.CTRL + 72 /*H*/, 'highlightText' ],
                [ CKEDITOR.CTRL + 49 /*1*/, 'angledbracketleft' ],
                [ CKEDITOR.CTRL + 50 /*2*/, 'angledbracketright' ],
                [ CKEDITOR.CTRL + 51 /*3*/, 'longdash' ],
            ],
            toolbar : [],
            bodyClass : 'richTextEditor bibiscoRichTextEditor-bodyClass-${richTextEditorSettings.font}${richTextEditorSettings.size}', 
            contentsCss : contentsCss,
            spellCheckEnabled: ${richTextEditorSettings.spellCheckEnabled},
            autoSaveEnabled: true
        };
        
        // create instance of rich text editor
        $('#bibiscoTagRichTextEditorTextarea').ckeditor(config);

        // create variable that refers to rich text editor instance
        var bibiscoRichTextEditor = $('#bibiscoTagRichTextEditorTextarea').ckeditorGet();

        // create rich text editor change listener
        $('#bibiscoTagRichTextEditorTextarea').ckeditor(function(element) {
            this.on('change', function() {
                if (this.checkDirty()) {
                    this.contentChanged = true;
                    this.unSaved = true;
                    if (bibiscoRichTextEditorConfig.changeCallback) {
                        bibiscoRichTextEditorConfig.changeCallback();
                    }
                }
            });            
            
            $(element).bind('setData.ckeditor', function() {
                bibiscoRichTextEditor.document.on('keyup', function(event) {
                    var keyCode = event.data.$.keyCode;
                    if (keyCode == '13' || keyCode == '32') {
                        bibiscoRichTextEditorSpellCheck(bibiscoRichTextEditor);
                    }
                    bibiscoCharacterWordCount(bibiscoRichTextEditor.getText());
                });
                
                bibiscoRichTextEditor.document.on('keydown', function(e) {
                   
                });
            });
        });
        
        // initialize change status variables
        bibiscoRichTextEditor.contentChanged = false;
        bibiscoRichTextEditor.unSaved = false;

        // create function for get text from rich text editor
        bibiscoRichTextEditor.getText = function() {
            var contentWithStyle = $('#bibiscoTagRichTextEditorTextarea').val();
            return contentWithStyle;
        }
        
        // create function for get words counts
        bibiscoRichTextEditor.getWordCount = function() {
            return $('#bibiscoTagRichTextEditorSpanWordCount').text();
        }
        
        // create function for get characters counts
        bibiscoRichTextEditor.getCharacterCount = function() {
            return $('#bibiscoTagRichTextEditorSpanCharacterCount').text();
        }
          
        // create function for set text into rich text editor
        bibiscoRichTextEditor.setText = function(text) {
            if (!text) {
                text = '';
            }
            $('#bibiscoTagRichTextEditorTextarea').val(text);
            
            // set  word and character count
            bibiscoCharacterWordCount(text);
        }
        
        // create function for stop autosave
        bibiscoRichTextEditor.stopAutoSave = function() {
        	clearInterval(this.autoSave);
        }

        // on instance ready initialize buttons
        bibiscoRichTextEditor.on('instanceReady', function(ev) {

            initializeButton('undo', 'bibiscoTagRichTextEditorButtonUndo');
            initializeButton('redo', 'bibiscoTagRichTextEditorButtonRepeat');
            <c:if test="${OS == 'win' || OS == 'linux32' || OS == 'linux64'}">
                initializeButton('copy', 'bibiscoTagRichTextEditorButtonCopy');
                initializeButton('cut', 'bibiscoTagRichTextEditorButtonCut');
                initializeButton('paste', 'bibiscoTagRichTextEditorButtonPaste');
            </c:if>
            initializeButton('print', 'bibiscoTagRichTextEditorButtonPrint');
            initializeButton('bold', 'bibiscoTagRichTextEditorButtonBold');
            initializeButton('italic', 'bibiscoTagRichTextEditorButtonItalic');
            initializeButton('underline', 'bibiscoTagRichTextEditorButtonUnderline');
            initializeButton('strike', 'bibiscoTagRichTextEditorButtonStrikethrough');
            initializeButton('highlightText', 'bibiscoTagRichTextEditorButtonHighlightText');
            initializeButton('angledbracketleft', 'bibiscoTagRichTextEditorButtonAngledbracketleft');
            initializeButton('angledbracketright', 'bibiscoTagRichTextEditorButtonAngledbracketright');
            initializeButton('longdash', 'bibiscoTagRichTextEditorButtonLongdash');
            initializeButton('justifyleft', 'bibiscoTagRichTextEditorButtonAlignLeft');
            initializeButton('justifycenter', 'bibiscoTagRichTextEditorButtonAlignCenter');
            initializeButton('justifyright', 'bibiscoTagRichTextEditorButtonAlignRight');
            initializeButton('justifyblock', 'bibiscoTagRichTextEditorButtonAlignJustify');
            initializeButton('numberedlist', 'bibiscoTagRichTextEditorButtonNumberList');
            initializeButton('bulletedlist', 'bibiscoTagRichTextEditorButtonBulletList');
                                    
            // editor settings button
            $('#bibiscoTagRichTextEditorButtonSettings').click(function() {
                 var ajaxDialogContent = { 
                          idCaller: 'bibiscoTagRichTextEditorButtonSettings',
                          url : 'jsp/richTextEditorSettings.jsp',
                          title: "<fmt:message key="tag.bibiscoRichTextEditor.dialog.richTextEditorSettings.title"/>", 
                          init: function (idAjaxDialog, idCaller) { return bibiscoRichTextEditorSettingsInit(idAjaxDialog, idCaller); },
                          close: function (idAjaxDialog, idCaller) { return bibiscoRichTextEditorSettingsClose(idAjaxDialog, idCaller); },
                          beforeClose: function (idAjaxDialog, idCaller) { return bibiscoRichTextEditorSettingsBeforeClose(idAjaxDialog, idCaller); },
                          resizable: false, modal: true, 
                          width: 600, height: 440
                  };
                  
                  bibiscoOpenAjaxDialog(ajaxDialogContent);
            });

                    
            $('#bibiscoTagRichTextEditorButtonSettings').tooltip();
            
            // set initial text         
            var initialText = '';
            if (bibiscoRichTextEditorConfig.text) {
                initialText = bibiscoRichTextEditorConfig.text;
            } 
            bibiscoRichTextEditor.setText(initialText);
            
            // <p> settings             
            ev.editor.dataProcessor.writer.setRules( 'p',
               {
                   indent : false,
                   breakBeforeOpen : false,
                   breakAfterOpen : false,
                   breakBeforeClose : false,
                   breakAfterClose : false
               });
            // <div> settings             
            ev.editor.dataProcessor.writer.setRules( 'div',
               {
                   indent : false,
                   breakBeforeOpen : false,
                   breakAfterOpen : false,
                   breakBeforeClose : false,
                   breakAfterClose : false
               });
           // <ul> settings
           ev.editor.dataProcessor.writer.setRules( 'ul',
               {
                   indent : false,
                   breakBeforeOpen : false,
                   breakAfterOpen : false,
                   breakBeforeClose : false,
                   breakAfterClose : false
               });
            // <ol> settings
            ev.editor.dataProcessor.writer.setRules( 'ol',
             {
                 indent : false,
                 breakBeforeOpen : false,
                 breakAfterOpen : false,
                 breakBeforeClose : false,
                 breakAfterClose : false
             });
            // <li> settings
            ev.editor.dataProcessor.writer.setRules( 'li',
            {
                indent : false,
                breakBeforeOpen : false,
                breakAfterOpen : false,
                breakBeforeClose : false,
                breakAfterClose : false
            });
            // <spellerror> settings
            ev.editor.dataProcessor.writer.setRules( 'spellerror',
            {
                indent : false,
                breakBeforeOpen : false,
                breakAfterOpen : false,
                breakBeforeClose : false,
                breakAfterClose : false
            });
            // <span> settings
            ev.editor.dataProcessor.writer.setRules( 'span',
            {
                indent : false,
                breakBeforeOpen : false,
                breakAfterOpen : false,
                breakBeforeClose : false,
                breakAfterClose : false
            });
            
            // set allowed tag on paste
            ev.editor.on('paste', function(evt) {
                evt.data['html'] = strip_tags(evt.data['html'], 
                        '<strike><em><u><strong><p><ul><li><ol>' // allowed list
                     );
            });
            
            // spell check after paste
            ev.editor.on('afterPaste', function(evt) {
                bibiscoRichTextEditorSpellCheck(evt.editor, false);
            });    
            
            // character word count after every command exec
            ev.editor.on('afterCommandExec', function(evt) {
                bibiscoCharacterWordCount(bibiscoRichTextEditor.getText());
            });
            
            // if mac os remove copy/cut/paste from context menu
            <c:if test="${OS == 'mac'}">
	            ev.editor.removeMenuItem('copy');
	            ev.editor.removeMenuItem('cut');
	            ev.editor.removeMenuItem('paste');
            </c:if>
             
            // editor is initialized: let's show it!
            $('#bibiscoTagRichTextEditorTextareaContainer').show();
            $('#bibiscoTagRichTextEditorDivToolbar').show();
            
            
            // save
            bibiscoRichTextEditor.save = function() {
            	bibiscoRichTextEditorHumanSave(bibiscoRichTextEditorConfig.save);
            }
            
            // autosave
            bibiscoRichTextEditor.autoSave = setInterval(function() { 
            	if (bibiscoRichTextEditor.config.autoSaveEnabled) {
            		bibiscoRichTextEditorAutoSave(bibiscoRichTextEditorConfig.save);
                }
            }, 60000);
            
            // close
            bibiscoRichTextEditor.close = function() {
            	bibiscoRichTextEditor.stopAutoSave();
         		bibiscoRichTextEditor.destroy();
            }
        });
        
        return bibiscoRichTextEditor;
    }

    // initialize button
    function initializeButton(command, idButton) {
        $('#' + idButton).click(function(e) {
            bibiscoRichTextEditor.execCommand(command);
            return false;
        });

        var initialState = bibiscoRichTextEditor.getCommand(command).state;
        bibiscoRichTextEditor.getCommand(command).oldState = initialState;
        if (initialState == 0) {
            bibiscoDisableButton(idButton);
        }
        bibiscoRichTextEditor.getCommand(command).on('state', function() {
            var button = $('#' + idButton);
            if (this.state != this.oldState) {
                if (this.oldState == 0) {
                    bibiscoEnableButton(idButton);
                } else if (this.state == 0) {
                    button.removeClass('active');
                    bibiscoDisableButton(idButton);
                } else {
                    button.button('toggle');
                }
            }
            this.oldState = this.state;
        });
        
        $('#' + idButton).tooltip();
    }
    
    function bibiscoRichTextEditorUpdateSettings(pBodyClass, pSpellCheckEnabled) {
    
        // update body class
        bibiscoRichTextEditor.document.getBody().removeClass(bibiscoRichTextEditor.config.bodyClass);
        bibiscoRichTextEditor.config.bodyClass = pBodyClass;
        bibiscoRichTextEditor.document.getBody().addClass(pBodyClass);
        
        // update spellcheck
        var spellErrorCssURL = '${baseURL}' + '/css/bibiscoSpellError.css';
        if (bibiscoRichTextEditor.config.spellCheckEnabled != pSpellCheckEnabled) {
            var linkTags= bibiscoRichTextEditor.document.$.getElementsByTagName('link');
            for (var i=0;i<linkTags.length;i++) {
                var linkTag = linkTags[i];
                if (linkTag.getAttribute('href') == '#') {
                    linkTag.setAttribute('href',spellErrorCssURL);  
                } else if (linkTag.getAttribute('href') == spellErrorCssURL) {
                    linkTag.setAttribute('href','#');
                }
            }   
        }
        
        bibiscoRichTextEditor.config.spellCheckEnabled = pSpellCheckEnabled;
        bibiscoRichTextEditor.config.contentsCss = getContentsCss(pSpellCheckEnabled);
    }
    
    function bibiscoRichTextEditorHumanSave(saveConfig) {
    	bibiscoRichTextEditorSave(true, saveConfig);
    }
    
    function bibiscoRichTextEditorAutoSave(saveConfig) {
    	bibiscoRichTextEditorSave(false, saveConfig);
    }
    
	function bibiscoRichTextEditorSave(humanSave, saveConfig) {
    	
    	if (humanSave) {
			bibiscoRichTextEditorSpellCheck(bibiscoRichTextEditor, true);
    	}
    	
    	var data;
    	if (saveConfig.extraData) {
    		data = saveConfig.extraData();
    	} else {
    		data = {};
    	}
    	
    	data.text = bibiscoRichTextEditor.getText();
    	data.wordCount = bibiscoRichTextEditor.getWordCount();
    	data.characterCount = bibiscoRichTextEditor.getCharacterCount();
    	
    	$.ajax({
  		  type: 'POST',
  		  url: saveConfig.url,
  		  data: data,
  		  beforeSend:function(){
  			  if (humanSave) {
  			  	bibiscoOpenLoadingBanner();
  			  }
  		  },
  		  success:function(data){
  			  if(saveConfig.successCallback) {  
  				saveConfig.successCallback();
  			  }
	  		  if (humanSave) {
	  			bibiscoCloseLoadingBannerSuccess();
	  		  }
  			  bibiscoRichTextEditor.unSaved = false;
  		  },
  		  error:function(){
  			if (humanSave) {
  			  bibiscoCloseLoadingBannerError();
  			}
  		  }
  		});
	}
    
    function getContentsCss(spellCheckEnabled) {
        
        var baseURL = '${baseURL}';
        var baseCssURL = baseURL + '/css/bibiscoRichTextEditorContents.css';
        var spellErrorCssURL = baseURL + "/css/bibiscoSpellError.css";
        
        if(spellCheckEnabled) {
            spellErrorCssURL = baseURL + '/css/bibiscoSpellError.css';
        } else {
            spellErrorCssURL = '#';
        }
        
        var contentsCss = [baseCssURL, spellErrorCssURL];
        
        return contentsCss;
    }

    function strip_tags (input, allowed) {
       // http://phpjs.org/functions/strip_tags (http://kevin.vanzonneveld.net)
       allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
       var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
          commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
         
       var styleAttribute = /style="[a-zA-Z0-9=:_!?&%'/;\.\s\(\)\-\,]*"/gi;   
          
       return input.replace(commentsAndPhpTags, '').replace(styleAttribute, '').replace(tags, function ($0, $1) {
          return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
       });
    }
    
    function bibiscoCharacterWordCount(text2parse) {
                
        $.ajax({
            type: 'POST',
            async: true,
            url: 'BibiscoServlet?action=characterWordCount',
            data: { 
              text: text2parse
            },
            error:function(jqXHR, textStatus, errorThrown) {},
            success:function(characterWordCount){
                $('#bibiscoTagRichTextEditorSpanWordCount').html(characterWordCount.words);
                $('#bibiscoTagRichTextEditorSpanCharacterCount').html(characterWordCount.characters);
            },
          });
    }
        
</script>
<div id="bibiscoTagRichTextEditorDivToolbar" class="btn-toolbar bibiscoNotSelectableText bibiscoTagRichTextEditorToolbar">
    <div class="btn-group">
        <button class="btn" id="bibiscoTagRichTextEditorButtonUndo" title="<fmt:message key="tag.bibiscoRichTextEditor.undo"/>">
            <i class="icon-undo"></i>
        </button>
        <button class="btn" id="bibiscoTagRichTextEditorButtonRepeat" title="<fmt:message key="tag.bibiscoRichTextEditor.redo"/>">
            <i class="icon-repeat"></i>
        </button>
    </div>
    <div class="btn-group">
        <button class="btn" id="bibiscoTagRichTextEditorButtonPrint" title="<fmt:message key="tag.bibiscoRichTextEditor.print"/>">
            <i class="icon-print"></i>
        </button>
    </div>
   
    <c:if test="${OS == 'win' || OS == 'linux32' || OS == 'linux64'}">
	    <div class="btn-group">
	        <button class="btn" id="bibiscoTagRichTextEditorButtonCopy" title="<fmt:message key="tag.bibiscoRichTextEditor.copy"/>">
	            <i class="icon-copy"></i>
	        </button>
	        <button class="btn" id="bibiscoTagRichTextEditorButtonCut" title="<fmt:message key="tag.bibiscoRichTextEditor.cut"/>">
	            <i class="icon-cut"></i>
	        </button>
	        <button class="btn" id="bibiscoTagRichTextEditorButtonPaste" title="<fmt:message key="tag.bibiscoRichTextEditor.paste"/>">
	            <i class="icon-paste"></i>
	        </button>
	    </div>
    </c:if>
    <div class="btn-group" data-toggle="buttons-checkbox">
        <button class="btn" id="bibiscoTagRichTextEditorButtonBold" title="<fmt:message key="tag.bibiscoRichTextEditor.bold"/>">
            <i class="icon-bold"></i>
        </button>
        <button class="btn" id="bibiscoTagRichTextEditorButtonItalic" title="<fmt:message key="tag.bibiscoRichTextEditor.italic"/>">
            <i class="icon-italic"></i>
        </button>
        <button class="btn" id="bibiscoTagRichTextEditorButtonUnderline" title="<fmt:message key="tag.bibiscoRichTextEditor.underline"/>">
            <i class="icon-underline"></i>
        </button>
        <button class="btn" id="bibiscoTagRichTextEditorButtonStrikethrough" title="<fmt:message key="tag.bibiscoRichTextEditor.strike"/>">
            <i class="icon-strikethrough"></i>
        </button>
        <button class="btn" id="bibiscoTagRichTextEditorButtonHighlightText" title="<fmt:message key="tag.bibiscoRichTextEditor.highlightText"/>">
            <i class="icon-pencil"></i>
        </button>
    </div>
    <div class="btn-group">
       <button class="btn" id="bibiscoTagRichTextEditorButtonAngledbracketleft" title="<fmt:message key="tag.bibiscoRichTextEditor.angledbracketleft"/>">
           <strong>&laquo;</strong>
        </button>
        <button class="btn" id="bibiscoTagRichTextEditorButtonAngledbracketright" title="<fmt:message key="tag.bibiscoRichTextEditor.angledbracketright"/>" >
           <strong>&raquo;</strong>
        </button>
        <button class="btn" id="bibiscoTagRichTextEditorButtonLongdash" title="<fmt:message key="tag.bibiscoRichTextEditor.longdash"/>">
           <strong>&mdash;</strong>
        </button>
    </div>
    <div class="btn-group" data-toggle="buttons-checkbox">
        <button class="btn" id="bibiscoTagRichTextEditorButtonNumberList" title="<fmt:message key="tag.bibiscoRichTextEditor.numberedlist"/>">
            <i class="icon-list-ol"></i>
        </button>
        <button class="btn" id="bibiscoTagRichTextEditorButtonBulletList" title="<fmt:message key="tag.bibiscoRichTextEditor.bulletedlist"/>">
            <i class="icon-list"></i>
        </button>
    </div>
    <div class="btn-group" data-toggle="buttons-checkbox">
        <button class="btn" id="bibiscoTagRichTextEditorButtonAlignLeft" title="<fmt:message key="tag.bibiscoRichTextEditor.justifyleft"/>">
            <i class="icon-align-left"></i>
        </button>
        <button class="btn" id="bibiscoTagRichTextEditorButtonAlignCenter" title="<fmt:message key="tag.bibiscoRichTextEditor.justifycenter"/>">
            <i class="icon-align-center"></i>
        </button>
        <button class="btn" id="bibiscoTagRichTextEditorButtonAlignRight" title="<fmt:message key="tag.bibiscoRichTextEditor.justifyright"/>">
            <i class="icon-align-right"></i>
        </button>
        <button class="btn" id="bibiscoTagRichTextEditorButtonAlignJustify" title="<fmt:message key="tag.bibiscoRichTextEditor.justifyblock"/>">
            <i class="icon-align-justify"></i>
        </button>
    </div>
    <div class="btn-group">
        <button class="btn" id="bibiscoTagRichTextEditorButtonSettings" title="<fmt:message key="tag.bibiscoRichTextEditor.dialog.richTextEditorSettings.title"/>">
            <i class="icon-cog"></i>
        </button>
    </div>
</div>
<div id="bibiscoTagRichTextEditorTextareaContainer" class="bibiscoRichTextEditorWordCharacterCount" >
<textarea id="bibiscoTagRichTextEditorTextarea"></textarea>
<p class="bibiscoNotSelectableText bibiscoRichTextEditorWordCharacterCount">
<fmt:message key="jsp.common.span.words"/>: <span id="bibiscoTagRichTextEditorSpanWordCount"></span>, <fmt:message key="jsp.common.span.characters"/>: <span id="bibiscoTagRichTextEditorSpanCharacterCount"></span>
</p>
</div>

