<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="tags" tagdir="/WEB-INF/tags"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
$(function() {
	
	$('#bibiscoExportAArchive').click(function() {
		exportProject('ARCHIVE');		
	});
	
	$('#bibiscoExportAWord').click(function() {
		exportProject('WORD');
	});
	
	$('#bibiscoExportAPDF').click(function() {
		exportProject('PDF');
	});
	
	$('#bibiscoExportAArchive').popover({placement	: 'bottom', content: "<fmt:message key="jsp.export.button.bibiscoExportAArchive.popover" />"});
	$('#bibiscoExportAWord').popover({placement	: 'bottom', content: "<fmt:message key="jsp.export.button.bibiscoExportAWord.popover" />"});

});

$('#bibiscoProjectsAChangeProjectsDirectory').click(function() {
	 
});

function exportProject(type) {
	
	var config = {
			idProject: '${project.idProject}',
			type: type
	}

	var ajaxDialogContent = {
			idCaller: 'bibiscoExportProject',
			url : 'jsp/exportProjectDirectory.jsp',
			title: "<fmt:message key="jsp.export.dialog.title.exportProjectDirectory"/>",  
			init: function (idAjaxDialog, idCaller, type) { return bibiscoExportProjectDirectoryInit(idAjaxDialog, idCaller,config); },
			close: function (idAjaxDialog, idCaller) { 
				return bibiscoExportProjectDirectoryClose(idAjaxDialog, idCaller); 
			},
			beforeClose: function (idAjaxDialog, idCaller) {
				return bibiscoExportProjectDirectoryBeforeClose(idAjaxDialog, idCaller); 
			},
			resizable: false,  modal: true,
			width: 750, height: 200, positionTop: 100
	 };
	  
	 bibiscoOpenAjaxDialog(ajaxDialogContent);
}

</script>
<div>
	<div class="row-fluid">
		<div class="span12">
			<div class="row-fluid page-header">
				<div class="span12">
					<h1 id="bibiscoExportH1Title"><fmt:message key="jsp.export.h1" /></h1>
	    		</div>
	    	</div>
	    	<div class="hero-unit bibiscoExportButtonArea">
				<p>
					<a id="bibiscoExportAPDF" class="btn btn-primary btn-large" href="#"><fmt:message key="jsp.export.a.pdf" /></a>
					<a id="bibiscoExportAWord" class="btn btn-large" href="#"><fmt:message key="jsp.export.a.word" /></a>
					<a id="bibiscoExportAArchive" class="btn btn-large" href="#"><fmt:message key="jsp.export.a.archive" /></a>
				</p>
			</div>  
	    	
		</div>
	</div>
	
</div>
