<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="tags" tagdir="/WEB-INF/tags"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
$(function() {
	
	$('#bibiscoSettingsALanguage').click(function() {
		 var ajaxDialogContent = { 
				  idCaller: 'bibiscoSettingsALanguage',
				  url : 'jsp/language.jsp',
				  title: "<fmt:message key="jsp.settings.dialog.title.language"/>",  
				  init: function (idAjaxDialog, idCaller) { return bibiscoLanguageInit(idAjaxDialog, idCaller); },
				  close: function (idAjaxDialog, idCaller) { return bibiscoLanguageClose(idAjaxDialog, idCaller); },
				  beforeClose: function (idAjaxDialog, idCaller) { return bibiscoLanguageBeforeClose(idAjaxDialog, idCaller); }, 
				  resizable: false,  modal: true,
				  width: 600, height: 240, positionTop: 100
		  };
		  
		  bibiscoOpenAjaxDialog(ajaxDialogContent);
	});
	
	$('#bibiscoSettingsARichTextEditorSettings').click(function() {
		 var ajaxDialogContent = { 
				  idCaller: "bibiscoSettingsARichTextEditorSettings",
				  url : "jsp/richTextEditorSettings.jsp",
				  title: "<fmt:message key="jsp.settings.dialog.title.richTextEditorSettings"/>", 
				  init: function (idAjaxDialog, idCaller) { return bibiscoRichTextEditorSettingsInit(idAjaxDialog, idCaller); },
				  close: function (idAjaxDialog, idCaller) { return bibiscoRichTextEditorSettingsClose(idAjaxDialog, idCaller); },
				  beforeClose: function (idAjaxDialog, idCaller) { return bibiscoRichTextEditorSettingsBeforeClose(idAjaxDialog, idCaller); },
				  resizable: false,  modal: true,
				  width: 600, height: 540, positionTop: 100
		  };
		  
		  bibiscoOpenAjaxDialog(ajaxDialogContent);
	});
	
});



</script>
<div>
	<div class="row-fluid">
		<div class="span12">
			<div class="row-fluid page-header">
				<div class="span12">
					<h1 id="bibiscoSettingsH1Title"><fmt:message key="jsp.settings.h1" /></h1>
	    		</div>
	    	</div>
	    	<div class="hero-unit bibiscoSettingsButtonArea">
				<p>
					<a id="bibiscoSettingsARichTextEditorSettings" class="btn btn-primary btn-large" href="#"><fmt:message key="jsp.settings.a.richTextEditorSettings" /></a>
					<a id="bibiscoSettingsALanguage" class="btn btn-large" href="#"><fmt:message key="jsp.settings.a.language" /></a>
				</p>
			</div>  
	    	
		</div>
	</div>
	
</div>
