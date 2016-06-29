<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
//<![CDATA[
          
    var bibiscoRichTextEditor;    
	
    <!-- INIT DIALOG CALLBACK -->
    function bibiscoStrandInitCallback(ajaxDialog, idCaller, type, id, config) {
    	 
    	var strand = ${strand};
    	
    	// id strand
    	$('#bibiscoStrandIdStrand').val(strand.idStrand);
 
    	//task status
    	var bibiscoTaskStatusSelector = bibiscoTaskStatusSelectorInit({value: strand.taskStatus, changeCallback: function() { bibiscoRichTextEditor.unSaved = true; } });
    	
		//rich text editor height
		var bibiscoRichTextEditorVerticalPadding = 200;
		var bibiscoRichTextEditorHeight = ajaxDialog.getHeight() - bibiscoRichTextEditorVerticalPadding;
		bibiscoRichTextEditor = bibiscoRichTextEditorInit({
			showTip: true,
			text: strand.description, 
			height: bibiscoRichTextEditorHeight, 
			width: jsBibiscoRichTextEditorWidth,
			save: {
				url: 'BibiscoServlet?action=saveStrand&id='+strand.idStrand,
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
		bibiscoRichTextEditor.unSaved = false;
		
		
    	// save button
    	$('#bibiscoStrandASave').click(function() {
    		bibiscoRichTextEditor.save();	
    	});	  
    	$('#bibiscoStrandASave').tooltip();
    	
    	// close button
    	$('#bibiscoStrandAClose').tooltip();
    	
		// update title scene button
    	$('.ui-dialog-title').attr('id', 'bibiscoStrandDialogTitle');
    	bibiscoStrandButtonUpdateTitleInit(config, strand.idStrand, strand.position);
 
    }     
    
	function bibiscoStrandButtonUpdateTitleInit(config, idStrand, position) {
    	
    	$('#bibiscoStrandDialogTitle').append("&nbsp;<button id=\"bibiscoStrandButtonUpdateTitle\" title=\"<fmt:message key="jsp.strand.button.updateTitle" />\" class=\"btn btn-mini\"><i class=\"icon-pencil\"></i></button>");
    	$('#bibiscoStrandButtonUpdateTitle').tooltip();
    	$('#bibiscoStrandButtonUpdateTitle').click(function() {
    		openThumbnailUpdateTitle('bibiscoStrandButtonUpdateTitle', config, idStrand, position);
    	});
    }
 	// close dialog callback
	function bibiscoStrandCloseCallback(ajaxDialog, idCaller, type) {
 		bibiscoRichTextEditor.close();
		$('#bibiscoStrandAClose').tooltip('hide');
    }
	
	// before close dialog callback
	function bibiscoStrandBeforeCloseCallback(ajaxDialog, idCaller, type) {
		
		$('#bibiscoStrandAClose').tooltip('hide');
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

<input type="hidden" id="bibiscoStrandIdStrand" />
<div class="bibiscoDialogContent">
	<tags:bibiscoRichTextEditor />
</div>
<div class="bibiscoDialogFooter control-group">
	<table>
		<tr>
			<td><tags:bibiscoTaskStatusSelector/></td>
			<td>  
				<a id="bibiscoStrandASave" title="<fmt:message key="jsp.common.button.save" />" class="btn btn-primary" href="#"><i class="icon-ok icon-white"></i></a> 
				<a id="bibiscoStrandAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" href="#"><i class="icon-remove"> </i> </a>
			</td>
		</tr>
	</table>
</div>