<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
//<![CDATA[
           
    var bibiscoRichTextEditor;    
           
    <!-- INIT DIALOG CALLBACK -->
    function bibiscoThumbnailInitCallback(ajaxDialog, idCaller, type, id) {
    	
    	var richTextEditorTaskStatus = ${richTextEditorTaskStatus};
    	
    	//task status
    	var bibiscoTaskStatusSelector = bibiscoTaskStatusSelectorInit({value: richTextEditorTaskStatus.taskStatus, changeCallback: function() { bibiscoRichTextEditor.unSaved = true; } });
    	$('#bibiscoRichTextEditorTaskStatusDialogEmDescription').html(richTextEditorTaskStatus.description);
    	    	
    	var bibiscoRichTextEditorVerticalPadding = 250;
    	bibiscoRichTextEditor = bibiscoRichTextEditorInit({
    		text: richTextEditorTaskStatus.text, 
    		height: (ajaxDialog.getHeight() - bibiscoRichTextEditorVerticalPadding), 
    		width: jsBibiscoRichTextEditorWidth,
	    	save: {
				url: 'BibiscoServlet?action=thumbnailAction&thumbnailAction=save&id='+id
						+'&family='+type,
				successCallback: function() {
					bibiscoUpdateTaskStatus(idCaller, bibiscoTaskStatusSelector.getSelected());
				},
				extraData: function() {
					return {
						taskStatus: bibiscoTaskStatusSelector.getSelected()
					}
				}
			}
    	});
    	
    	
    	// save button
    	$('#bibiscoRichTextEditorTaskStatusDialogASave').click(function() {
    		bibiscoRichTextEditor.save();
    	});	  
    	$('#bibiscoRichTextEditorTaskStatusDialogASave').tooltip();
    	
    	// close button
    	$('#bibiscoRichTextEditorTaskStatusDialogAClose').tooltip();
	
    }     
    
 	// close dialog callback
	function bibiscoThumbnailCloseCallback(ajaxDialog, idCaller, type) {
		bibiscoRichTextEditor.close();
    }
	
	// before close dialog callback
	function bibiscoThumbnailBeforeCloseCallback(ajaxDialog, idCaller, type) {
		
		$('#bibiscoRichTextEditorTaskStatusDialogAClose').tooltip('hide');
		if (bibiscoRichTextEditor.unSaved) {
			bibiscoRichTextEditorSpellCheck(bibiscoRichTextEditor, true);
			bibiscoConfirm(jsCommonMessageConfirmExitWithoutSave, function(result) {
			    if (result) {
			    	bibiscoRichTextEditor.unSaved = false;
			    	ajaxDialog.close();
			    } 
			});
			return false;
		} else {
			return true;	
		}

    }
	
//]]>           
</script>


<%@ taglib prefix="tags" tagdir="/WEB-INF/tags"%>
<div class="bibiscoDialogContent">

<!-- START -->
<div class="bibiscoRichTextEditorTaskStatusDialog">
<div class="row-fluid">
	<div class="span12 bibiscoRichTextEditorTaskStatusDialogDescriptionRow">
		<div id="bibiscoRichTextEditorTaskStatusDialogDivDescription" class="bibiscoNotSelectableText bibiscoRichTextEditorTaskStatusDialogDescription"><em id="bibiscoRichTextEditorTaskStatusDialogEmDescription"></em></div>
	</div>
</div>
<hr/>
</div>


<!-- STOP -->
<div id="bibiscoRichTextEditorTaskStatusDialogDivRichTextEditor">
<tags:bibiscoRichTextEditor /></div>
</div>
<div class="bibiscoDialogFooter control-group">
	<table>
	   <tr>
		<td>
			<tags:bibiscoTaskStatusSelector />
		</td>
		<td>
		<a id="bibiscoRichTextEditorTaskStatusDialogASave" title="<fmt:message key="jsp.common.button.save" />" class="btn btn-primary" href="#"><i class="icon-ok icon-white"></i></a>
	    <a id="bibiscoRichTextEditorTaskStatusDialogAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" href="#"><i class="icon-remove"></i></a>
		</td>
	</tr></table>
</div>