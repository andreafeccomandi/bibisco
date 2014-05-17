<%@ page language="java" pageEncoding="UTF-8"%>
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
    	
		//rich text editor height
		var bibiscoRichTextEditorVerticalPadding = 200;
		var bibiscoRichTextEditorHeight = ajaxDialog.getHeight() - bibiscoRichTextEditorVerticalPadding;		
		bibiscoRichTextEditor = bibiscoRichTextEditorInit({text: secondaryCharacter.description, height: bibiscoRichTextEditorHeight, width: jsBibiscoRichTextEditorWidth});
		bibiscoRichTextEditor.unSaved = false;
		
    	// save button
    	$('#bibiscoSecondaryCharacterASave').click(function() {
    		bibiscoRichTextEditorSpellCheck(bibiscoRichTextEditor, true);
    			
        	$.ajax({
      		  type: 'POST',
      		  url: 'BibiscoServlet?action=saveSecondaryCharacter',
      		  data: { 	idCharacter: $('#bibiscoSecondaryCharacterIdSecondaryCharacter').val(),
      			  		taskStatus: bibiscoTaskStatusSelector.getSelected(), 
      			  		description: bibiscoRichTextEditor.getText()
      			  	},
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
    	$('#bibiscoSecondaryCharacterASave').tooltip();
    	
    	// close button
    	$('#bibiscoSecondaryCharacterAClose').tooltip();
    	
    	// images button
    	$('#bibiscoSecondaryCharacterAImages').tooltip();
    	$('#bibiscoSecondaryCharacterAImages').click(function() {
    		var ajaxDialogContent = { 
  				  idCaller: 'bibiscoSecondaryCharacterAImages',
  				  url: 'BibiscoServlet?action=openCarouselImage&idElement='+id+'&elementType=CHARACTERS',	    
  				  title: '<fmt:message key="jsp.carouselImage.dialog.title" /> ' +secondaryCharacter.name, 
  				  init: function (idAjaxDialog, idCaller) { return bibiscoCarouselImageInitCallback(idAjaxDialog, idCaller); },
  				  close: function (idAjaxDialog, idCaller) { return bibiscoCarouselImageCloseCallback(idAjaxDialog, idCaller); },
  				  beforeClose: function (idAjaxDialog, idCaller) { return bibiscoCarouselImageBeforeCloseCallback(idAjaxDialog, idCaller); },
  				  resizable: false, 
  				  width: 810, height: 650, positionTop: 40
      		};

   
    		bibiscoOpenAjaxDialog(ajaxDialogContent);
   
    	});
    	
		// update title scene button
    	$('.ui-dialog-title').attr('id', 'bibiscoSecondaryCharacterDialogTitle');
    	bibiscoSecondaryCharacterButtonUpdateTitleInit(config, secondaryCharacter.idCharacter, secondaryCharacter.position);
		
		//task status
    	var bibiscoTaskStatusSelector = bibiscoTaskStatusSelectorInit({value: secondaryCharacter.taskStatus, changeCallback: function() { bibiscoRichTextEditor.unSaved = true; } });
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
		bibiscoRichTextEditor.destroy();
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
	<table style="width: 100%">
		<tr>
			<td style="text-align: left;"><tags:bibiscoTaskStatusSelector/></td>
			<td style="text-align: right:;">
				<a id="bibiscoSecondaryCharacterAImages" title="<fmt:message key="jsp.secondaryCharacter.button.images" />" class="btn" style="margin-left: 5px;" href="#"><i class="icon-picture"></i></a>
				<a id="bibiscoSecondaryCharacterASave" title="<fmt:message key="jsp.common.button.save" />" class="btn btn-primary" style="margin-left: 5px;" href="#"><i class="icon-ok icon-white"></i></a> 
				<a id="bibiscoSecondaryCharacterAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" style="margin-left: 5px;" href="#"><i class="icon-remove"></i></a>
			</td>
		</tr>
	</table>
</div>