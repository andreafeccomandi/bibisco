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
    function bibiscoSecondaryCharacterInitCallback(ajaxDialog, idCaller, type, id, config) {
    	
    	var secondaryCharacter = ${secondaryCharacter};
    	
    	// id character
    	$('#bibiscoSecondaryCharacterIdSecondaryCharacter').val(secondaryCharacter.idCharacter);
    	
    	//task status
    	var bibiscoTaskStatusSelector = bibiscoTaskStatusSelectorInit({value: secondaryCharacter.taskStatus, changeCallback: function() { bibiscoRichTextEditor.unSaved = true; } });
    	
		// rich text editor height
		var bibiscoRichTextEditorVerticalPadding = 200;
		var bibiscoRichTextEditorHeight = ajaxDialog.getHeight() - bibiscoRichTextEditorVerticalPadding;		
		bibiscoRichTextEditor = bibiscoRichTextEditorInit({
			text: secondaryCharacter.description, 
			height: bibiscoRichTextEditorHeight, 
			width: jsBibiscoRichTextEditorWidth,
			save: {
				url: 'BibiscoServlet?action=saveSecondaryCharacter&id='+secondaryCharacter.idCharacter,
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
    	$('#bibiscoSecondaryCharacterASave').click(function() {
    		bibiscoRichTextEditor.save();	
    	});	  
    	$('#bibiscoSecondaryCharacterASave').tooltip();
    	
    	// close button
    	$('#bibiscoSecondaryCharacterAClose').tooltip();
    	
    	// images button
    	$('#bibiscoSecondaryCharacterAImages').tooltip();
    	$('#bibiscoSecondaryCharacterAImages').click(function() {
    		var ajaxDialogContent = { 
  				  idCaller: 'bibiscoSecondaryCharacterAImages',
  				  url: 'BibiscoServlet?action=openCarouselImage&idElement='+id+'&elementType=CHARACTERS',	    
  				  title: "<fmt:message key="jsp.carouselImage.dialog.title" /> " +secondaryCharacter.name, 
  				  init: function (idAjaxDialog, idCaller) { return bibiscoCarouselImageInitCallback(idAjaxDialog, idCaller); },
  				  close: function (idAjaxDialog, idCaller) { return bibiscoCarouselImageCloseCallback(idAjaxDialog, idCaller); },
  				  beforeClose: function (idAjaxDialog, idCaller) { return bibiscoCarouselImageBeforeCloseCallback(idAjaxDialog, idCaller); },
  				  resizable: false, modal: true, 
  				  width: 810, height: 650, positionTop: 40
      		};

   
    		bibiscoOpenAjaxDialog(ajaxDialogContent);
   
    	});
    	
		// update title scene button
    	$('.ui-dialog-title').attr('id', 'bibiscoSecondaryCharacterDialogTitle');
    	bibiscoSecondaryCharacterButtonUpdateTitleInit(config, secondaryCharacter.idCharacter, secondaryCharacter.position);
    }     
    
    function bibiscoSecondaryCharacterButtonUpdateTitleInit(config, idSecondaryCharacter, position) {
    	
    	$('#bibiscoSecondaryCharacterDialogTitle').append("&nbsp;<button id=\"bibiscoSecondaryCharacterButtonUpdateTitle\" title=\"<fmt:message key="jsp.character.button.updateTitle" />\" class=\"btn btn-mini\"><i class=\"icon-pencil\"></i></button>");
    	$('#bibiscoSecondaryCharacterButtonUpdateTitle').tooltip();
    	$('#bibiscoSecondaryCharacterButtonUpdateTitle').click(function() {
    		openThumbnailUpdateTitle('bibiscoSecondaryCharacterButtonUpdateTitle', config, idSecondaryCharacter, position);
    	});
    }
    
 	// close dialog callback
	function bibiscoSecondaryCharacterCloseCallback(ajaxDialog, idCaller, type) {
		bibiscoRichTextEditor.close();
    }
	
	// before close dialog callback
	function bibiscoSecondaryCharacterBeforeCloseCallback(ajaxDialog, idCaller, type) {
		
		$('#bibiscoSecondaryCharacterAClose').tooltip('hide');
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

<input type="hidden" id="bibiscoSecondaryCharacterIdSecondaryCharacter" />
<div class="bibiscoDialogContent">
	<tags:bibiscoRichTextEditor />
</div>
<div class="bibiscoDialogFooter control-group">
	<table>
		<tr>
			<td><tags:bibiscoTaskStatusSelector/></td>
			<td>
				<a id="bibiscoSecondaryCharacterAImages" title="<fmt:message key="jsp.secondaryCharacter.button.images" />" class="btn" href="#"><i class="icon-picture"></i></a>
				<a id="bibiscoSecondaryCharacterASave" title="<fmt:message key="jsp.common.button.save" />" class="btn btn-primary" href="#"><i class="icon-ok icon-white"></i></a> 
				<a id="bibiscoSecondaryCharacterAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" href="#"><i class="icon-remove"></i></a>
			</td>
		</tr>
	</table>
</div>