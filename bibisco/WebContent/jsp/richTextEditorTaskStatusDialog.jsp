<%@ page language="java" pageEncoding="UTF-8"%>
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
    	var bibiscoRichTextEditorVerticalPadding = 250;
    	bibiscoRichTextEditor = bibiscoRichTextEditorInit({text: richTextEditorTaskStatus.text, height: (ajaxDialog.getHeight() - bibiscoRichTextEditorVerticalPadding), width: jsBibiscoRichTextEditorWidth});
    	
    	var bibiscoTaskStatusSelector = bibiscoTaskStatusSelectorInit({value: richTextEditorTaskStatus.taskStatus, changeCallback: function() { bibiscoRichTextEditor.unSaved = true; } });
    	$('#bibiscoRichTextEditorTaskStatusDialogEmDescription').html(richTextEditorTaskStatus.description);
    	
    	// save button
    	$('#bibiscoRichTextEditorTaskStatusDialogASave').click(function() {
    		bibiscoRichTextEditorSpellCheck(bibiscoRichTextEditor, true);
        	$.ajax({
      		  type: 'POST',
      		  url: 'BibiscoServlet?action=thumbnailAction&thumbnailAction=save&family='+type+'&id='+id,
      		  data: { taskStatus: bibiscoTaskStatusSelector.getSelected(), text: bibiscoRichTextEditor.getText() },
      		  beforeSend:function(){
      			  bibiscoOpenLoadingBanner();
      		  },
      		  success:function(data){
      			  $('#'+idCaller+' div.bibiscoTagTaskStatusDiv').html(bibiscoGetBibiscoTaskStatus(bibiscoTaskStatusSelector.getSelected()));
      			  $('#'+idCaller+' div.bibiscoTagTaskStatusDiv span').tooltip();
      			  bibiscoCloseLoadingBannerSuccess();
      			  bibiscoRichTextEditor.unSaved = false;
      		  },
      		  error:function(){
      			  bibiscoCloseLoadingBannerError();
      		  }
      		});
    	});	  
    	$('#bibiscoRichTextEditorTaskStatusDialogASave').tooltip();
    	
    	// close button
    	$('#bibiscoRichTextEditorTaskStatusDialogAClose').tooltip();
	
    }     
    
 	// close dialog callback
	function bibiscoThumbnailCloseCallback(ajaxDialog, idCaller, type) {
		bibiscoRichTextEditor.destroy();
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