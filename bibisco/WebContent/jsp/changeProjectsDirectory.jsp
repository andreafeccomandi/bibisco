<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ page import="com.bibisco.manager.ContextManager"%>
<%@ page import="com.bibisco.manager.PropertiesManager"%>
<%@ page import="com.bibisco.manager.ProjectManager"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>
<script type="text/javascript">

	var projectDirectoryChanged = false;

	// init dialog callback
	function bibiscoChangeProjectsDirectoryInit(ajaxDialog, idCaller, config) {
		
		$('#bibiscoChangeProjectsDirectoryForm').validate({
			rules : {
				bibiscoChangeProjectsDirectorySelectedDirectory : {
					maxlength : 500,
					required : true
				}
			},
			highlight : function(label) {
				$(label).closest('.control-group').addClass('error');
			},

			onsubmit: true
		});
		
		$('#bibiscoChangeProjectsDirectoryButtonSelect').click(function() {
			var directory = bibiscoOpenDirectoryDialog();
			if(directory && directory != $('#bibiscoChangeProjectsDirectorySelectedDirectory').val()) {
				projectDirectoryChanged = true;
			 	$('#bibiscoChangeProjectsDirectorySelectedDirectory').val(directory);
			} 
		});
		
		$('#bibiscoChangeProjectsDirectoryASave').click(function() {
			$('#bibiscoChangeProjectsDirectoryForm').submit();
		});
		
		$('#bibiscoChangeProjectsDirectoryForm').submit(function() {
			if ($('#bibiscoChangeProjectsDirectoryForm').valid()) {
			
				if (projectDirectoryChanged) {
				
					$.ajax({
						type : 'POST',
						url : 'BibiscoServlet?action=saveProjectsDirectory',
						data : {
							directory: $('#bibiscoChangeProjectsDirectorySelectedDirectory').val()
						},
						beforeSend : function() {
							bibiscoBlockUI();
							bibiscoOpenLoadingBanner();
						},
						success : function(data) {
							if (data == 'ok') {
								bibiscoCloseLoadingBannerSuccess();
								window.location.href='BibiscoServlet?action=start'
							} else if (data == 'forbidden') {
								bibiscoUnblockUI();
								bibiscoCloseLoadingBannerError();
								bibiscoAlert("<fmt:message key="jsp.common.message.forbidden.directory" />");		
							} else if (data == 'invalid') {
								bibiscoUnblockUI();
								bibiscoCloseLoadingBannerError();
								bibiscoAlert("<fmt:message key="jsp.common.message.invalid.directory" />");	
							} 
						},
						error : function() {
							bibiscoCloseLoadingBannerError();
						}
					});
				} else {
					ajaxDialog.close();
				}
			}
			
			return false;
		});

		// tooltip
		$('#bibiscoChangeProjectsDirectoryASave').tooltip();		
		$('#bibiscoChangeProjectsDirectoryAClose').tooltip();
	}
		
	
	// close dialog callback
	function bibiscoChangeProjectsDirectoryClose(ajaxDialog, idCaller) {
		$('#bibiscoChangeProjectsDirectoryASave').tooltip('hide');
		$('#bibiscoChangeProjectsDirectoryAClose').tooltip('hide');
	}

	// before close dialog callback
	function bibiscoChangeProjectsDirectoryBeforeClose(ajaxDialog, idCaller) {

	}
	
</script>
<div class="bibiscoChangeProjectsDirectory">
	<form id="bibiscoChangeProjectsDirectoryForm">
		<div class="control-group">
			<label id="bibiscoChangeProjectsDirectorySelectedDirectoryLabel" class="control-label" for="bibiscoChangeProjectsDirectorySelectedDirectory"><fmt:message key="jsp.changeProjectsDirectory.label" /></label>
			<div class="input-append">		
				<input type="text" class="span6" name="bibiscoChangeProjectsDirectorySelectedDirectory" value="<%=PropertiesManager.getInstance().getProperty("projectsDirectory")%>" id="bibiscoChangeProjectsDirectorySelectedDirectory" readonly="readonly" />
				<button id="bibiscoChangeProjectsDirectoryButtonSelect" class="btn" type="button"><fmt:message key="jsp.common.button.select" /></button>
			</div>
		</div>
	</form>
</div>
<div class="bibiscoChangeProjectsDirectoryInfo">
<p><span class="label label-important"><fmt:message key="jsp.changeProjectsDirectory.p.label.1"/></span>&nbsp;&nbsp;<fmt:message key="jsp.changeProjectsDirectory.p.1" /></p>
</div>
<div class="bibiscoDialogFooter control-group">
	<table>
		<tr>
			<td>
			 <a id="bibiscoChangeProjectsDirectoryASave" title="<fmt:message key="jsp.common.button.save" />" class="btn btn-primary" href="#"><i class="icon-ok icon-white"></i></a>
			 <a id="bibiscoChangeProjectsDirectoryAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" href="#"><i class="icon-remove"></i></a>
			</td>
		</tr>
	</table>
</div>