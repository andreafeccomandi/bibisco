<%@ page language="java" pageEncoding="UTF-8"%>
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
	
	$('#bibiscoExportAArchive').popover({placement	: 'bottom', content: '<fmt:message key="jsp.export.button.bibiscoExportAArchive.popover" />'});
	$('#bibiscoExportAWord').popover({placement	: 'bottom', content: '<fmt:message key="jsp.export.button.bibiscoExportAWord.popover" />'});
});

function exportProject(type) {
	var idProject = '${project.idProject}';
	
	$.ajax({
		type : 'POST',
		url : 'BibiscoServlet?action=exportProject',
		data : {
			idProject : idProject,
			type: type
		},
		beforeSend : function() {
			bibiscoBlockUI();
			bibiscoOpenLoadingBanner();
		},
		success : function(data) {
			bibiscoCloseLoadingBannerSuccess();
			bibiscoUnblockUI();
			var message = '<fmt:message key="jsp.export.alert.archive.text"/>';
			for (i=0;i<data.files.length;i++) {
				message = message + '<br><strong>' + data.files[i].filepath + '</strong>';
			}
			bibiscoAlert(message);
		},
		error : function() {
			bibiscoCloseLoadingBannerError();
		}
	});
}

</script>
<div>
	<div class="row-fluid">
		<div class="span12">
			<div class="row-fluid page-header">
				<div class="span12" style="float: left;">
					<h1 id="bibiscoExportH1Title"><fmt:message key="jsp.export.h1" /></h1>
	    		</div>
	    	</div>
	    	<div class="hero-unit" style="margin-top: 30px; margin-left: 30px; margin-right: 150px; padding-top: 20px; padding-bottom: 35px; padding-left: 40px;">
				<p style="margin-top: 16px;">
					<a id="bibiscoExportAPDF" class="btn btn-primary" href="#" style="margin-right: 10px;"><fmt:message key="jsp.export.a.pdf" /></a>
					<a id="bibiscoExportAWord" class="btn" href="#" style="margin-right: 10px;"><fmt:message key="jsp.export.a.word" /></a>
					<a id="bibiscoExportAArchive" class="btn" href="#"><fmt:message key="jsp.export.a.archive" /></a>
				</p>
			</div>  
	    	
		</div>
	</div>
	
</div>
