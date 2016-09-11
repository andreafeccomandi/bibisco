<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ page import="com.bibisco.manager.ContextManager"%>
<%@ page import="com.bibisco.manager.PropertiesManager"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">

	// init dialog callback
	function bibiscoExportProjectDirectoryInit(ajaxDialog, idCaller, config) {
		
		$('#bibiscoExportProjectDirectoryForm').validate({
			rules : {
				bibiscoExportProjectDirectorySelectedDirectory : {
					maxlength : 500
					//, required : true
				}
			},
			highlight : function(label) {
				$(label).closest('.control-group').addClass('error');
			},

			onsubmit: true
		});
		
		$('#bibiscoExportProjectDirectoryButtonSelect').click(function() {
			var directory = bibiscoOpenDirectoryDialog();
			if(directory && directory != $('#bibiscoExportProjectDirectorySelectedDirectory').val()) {
			 	$('#bibiscoExportProjectDirectorySelectedDirectory').val(directory);
			} 
		});
		
		$('#bibiscoExportProjectDirectoryASave').click(function() {
			$('#bibiscoExportProjectDirectoryForm').submit();
		});
		
		$('#bibiscoExportProjectDirectoryForm').submit(function() {
			if ($('#bibiscoExportProjectDirectoryForm').valid()) {
			
				$.ajax({
					type : 'POST',
					url : 'BibiscoServlet?action=exportProject',
					data : {
						idProject : config.idProject,
						type: config.type,
						directory: $('#bibiscoExportProjectDirectorySelectedDirectory').val()
					},
					beforeSend : function() {
						bibiscoBlockUI();
						bibiscoOpenLoadingBanner();
					},
					success : function(data) {

						if (data.directoryStatus == 'FORBIDDEN') {
							bibiscoUnblockUI();
							bibiscoCloseLoadingBannerError();
							bibiscoAlert("<fmt:message key="jsp.common.message.forbidden.directory" />");		
						} else if (data.directoryStatus == 'INVALID') {
							bibiscoUnblockUI();
							bibiscoCloseLoadingBannerError();
							bibiscoAlert("<fmt:message key="jsp.common.message.invalid.directory" />");	
						} else {
							bibiscoCloseLoadingBannerSuccess();
							bibiscoUnblockUI();
							ajaxDialog.close();
							var message = '<fmt:message key="jsp.export.alert.archive.text"/>';
							for (i=0;i<data.files.length;i++) {
								message = message + '<br><strong>' + data.files[i].filepath + '</strong>';
							}
							bibiscoAlert(message);
						}
					},
					error : function() {
						bibiscoCloseLoadingBannerError();
					}
				});
			}
			
			return false;
		});

		// tooltip
		$('#bibiscoExportProjectDirectoryASave').tooltip();		
		$('#bibiscoExportProjectDirectoryAClose').tooltip();
	}
		
	
	// close dialog callback
	function bibiscoExportProjectDirectoryClose(ajaxDialog, idCaller) {
		$('#bibiscoExportProjectDirectoryASave').tooltip('hide');
		$('#bibiscoExportProjectDirectoryAClose').tooltip('hide');
	}

	// before close dialog callback
	function bibiscoExportProjectDirectoryBeforeClose(ajaxDialog, idCaller) {

	}
	
</script>
<div class="bibiscoExportProjectDirectory">
	<form id="bibiscoExportProjectDirectoryForm">
		<div class="control-group">
			<label id="bibiscoExportProjectDirectorySelectedDirectoryLabel" class="control-label" for="bibiscoExportProjectDirectorySelectedDirectory"><fmt:message key="jsp.export.dialog.exportProjectDirectory.label" /></label>
			<div class="input-append">		
				<input type="text" class="span6" name="bibiscoExportProjectDirectorySelectedDirectory" value="" id="bibiscoExportProjectDirectorySelectedDirectory" readonly="readonly" />
				<button id="bibiscoExportProjectDirectoryButtonSelect" class="btn" type="button"><fmt:message key="jsp.common.button.select" /></button>
			</div>
		</div>
	</form>
</div>
<div class="bibiscoDialogFooter control-group">
	<table>
		<tr>
			<td>
			 <a id="bibiscoExportProjectDirectoryASave" title="<fmt:message key="jsp.common.button.save" />" class="btn btn-primary" href="#"><i class="icon-ok icon-white"></i></a>
			 <a id="bibiscoExportProjectDirectoryAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" href="#"><i class="icon-remove"></i></a>
			</td>
		</tr>
	</table>
</div>