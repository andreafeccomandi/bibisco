<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
	// init dialog callback
	function bibiscoImportProjectInit(ajaxDialog, idCaller) {

		$('#bibiscoImportProjectForm').validate({
			rules : {
				document_file : {
					required : true,
					accept: "bibisco"
				}
			},
			messages: { document_file: '<fmt:message key="jsp.importProject.form.input.file.validationMessage" />' },
			highlight : function(label) {
				$(label).closest('.control-group').addClass('error');
			},
			
			onsubmit: true
		});
		
		$('#bibiscoImportProject').submit(function() {
			bibiscoImportProjectSubmit();			
			return false;
		});

		$('#bibiscoImportProjectASave').click(function() {
			bibiscoImportProjectSubmit()
		});

		// tooltip
		$('#bibiscoImportProjectASave').tooltip();
		$('#bibiscoImportProjectAClose').tooltip();
		
		// init title value
		$('#bibiscoImportProjectInputTitle').focus();
	}
	
	
	
	function bibiscoImportProjectSubmit() {
		$('#bibiscoImportProjectForm').submit();
	}
	
	
	// close dialog callback
	function bibiscoImportProjectClose(ajaxDialog, idCaller) {
		$('#bibiscoImportProjectAClose').tooltip('hide');
	}

	// before close dialog callback
	function bibiscoImportProjectBeforeClose(ajaxDialog, idCaller) {

	}
	
	// import project callback
	function bibiscoImportProjectCallback(idImage, imageDescription) {
		
		// close save button tooltip
		$('#bibiscoImportProjectASave').tooltip('hide');
		
		// close dialog
		$('#bibiscoImportProjectAClose').click();
	}
	
	function bibiscoImportProjectCallback(idProject, archiveFileValid, alreadyPresent, confirmMessage) {
		
		if(archiveFileValid) {
			// archive file is valid
			if (alreadyPresent) {
				bibiscoConfirm(confirmMessage, function(result) {
				    if (result) {
				    	bibiscoImportProject(idProject, alreadyPresent);
				    } 
				});
			} else {
				bibiscoImportProject(idProject, alreadyPresent);
			}	
		} else {
			// archive file is not valid
			bibiscoAlert('<fmt:message key="jsp.importProject.form.input.file.validationMessage" />');
		}
		
		
		
	}
	
	function bibiscoImportProject(idProject, alreadyPresent) {
		$.ajax({
			type : 'POST',
			url : 'BibiscoServlet?action=importProject',
			data : {
				idProject: idProject,
				alreadyPresent: alreadyPresent
			},
			beforeSend : function() {
				bibiscoBlockUI();
				bibiscoOpenLoadingBanner();
			},
			success : function(data) {
				$('body').html(data);
				bibiscoCloseLoadingBannerSuccess();
				ajaxDialog.close();
			},
			error : function() {
				bibiscoUnblockUI();
				bibiscoCloseLoadingBannerError();
			}
		});
	}
</script>

<div class="bibiscoImportProject">
	<form id="bibiscoImportProjectForm" method="post" enctype="multipart/form-data" target="upload_target" action="BibiscoServlet">
		<input type="hidden" name="action" value="importProjectArchiveFile">
		<div class="control-group">
			<label id="bibiscoImportProjectInputFileLabel" class="control-label" for="bibiscoImportProjectInputFile"><fmt:message key="jsp.importProject.label.file" /></label>
			<div class="controls">
				<input id="document_file" type="file" name="document_file" >
			</div>
		</div>
	</form>
</div>
<div class="bibiscoDialogFooter control-group">
	<table>
		<tr>
			<td>
				<a id="bibiscoImportProjectASave" title="<fmt:message key="jsp.common.button.save" />" class="btn btn-primary" href="#"><i	class="icon-ok icon-white"></i></a> 
			    <a id="bibiscoImportProjectAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" href="#"><i class="icon-remove"></i></a>
			</td>
		</tr>
	</table>
</div>
<iframe id="upload_target" name="upload_target" src="#" class="bibiscoImportProjectIFrameUploadTarget"></iframe> 