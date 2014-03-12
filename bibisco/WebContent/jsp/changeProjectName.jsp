<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
	// init dialog callback
	function bibiscoChangeProjectNameInit(ajaxDialog, idCaller, actualProjectName) {
		
		$('#bibiscoChangeProjectName').validate({
			rules : {
				bibiscoChangeProjectNameInputTitle : {
					minlength : 2,
					maxlength : 50,
					required : true
				}
			},
			highlight : function(label) {
				$(label).closest('.control-group').addClass('error');
			},
			
			onsubmit: false
		});
		
		$('#bibiscoChangeProjectName').submit(function() {
			bibiscoChangeProjectNameSubmit(ajaxDialog);			
			return false;
		});

		$('#bibiscoChangeProjectNameASave').click(function() {
			bibiscoChangeProjectNameSubmit(ajaxDialog)
		});

		// tooltip
		$('#bibiscoChangeProjectNameASave').tooltip();
		$('#bibiscoChangeProjectNameAClose').tooltip();
		
		// init title value
		$('#bibiscoChangeProjectNameInputTitle').val(actualProjectName);
		$('#bibiscoChangeProjectNameInputTitle').focus();
	}
	
	
	
	function bibiscoChangeProjectNameSubmit(ajaxDialog) {
		if ($('#bibiscoChangeProjectName').valid()) {

			var title = $('#bibiscoChangeProjectNameInputTitle').val();
					
			$.ajax({
				type : 'POST',
				url : 'BibiscoServlet?action=changeProjectName',
				data : {
					title : title
				},
				beforeSend : function() {
					bibiscoOpenLoadingBanner();
				},
				success : function(data) {
					$('#bibiscoChangeProjectNameASave').tooltip('hide');
					$('#bibiscoProjectSpanTitle').html(title);
					bibiscoCloseLoadingBannerSuccess();
					ajaxDialog.close();
				},
				error : function() {
					bibiscoCloseLoadingBannerError();
				}
			});			
		}

	}
	
	
	// close dialog callback
	function bibiscoChangeProjectNameClose(ajaxDialog, idCaller) {
		$('#bibiscoChangeProjectNameAClose').tooltip('hide');
	}

	// before close dialog callback
	function bibiscoChangeProjectNameBeforeClose(ajaxDialog, idCaller) {

	}
</script>

<div style="margin-top: 10px;">
	<form id="bibiscoChangeProjectName">
		<div class="control-group">
			<label id="bibiscoChangeProjectNameInputTitleLabel" class="control-label" for="bibiscoChangeProjectNameInputTitle"><fmt:message key="jsp.changeProjectName.label.projectName" /></label>
			<div class="controls">
				<input type="text" class="span5" name="bibiscoChangeProjectNameInputTitle" id="bibiscoChangeProjectNameInputTitle">
			</div>
		</div>
	</form>
</div>
<div class="bibiscoDialogFooter control-group">
	<table style="width: 100%">
		<tr>
			<td style="text-align: right;"><a id="bibiscoChangeProjectNameASave" title="<fmt:message key="jsp.common.button.save" />" class="btn btn-primary" style="margin-left: 5px;" href="#"><i
					class="icon-ok icon-white"></i></a> <a id="bibiscoChangeProjectNameAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" style="margin-left: 5px;" href="#"><i
					class="icon-remove"></i></a></td>
		</tr>
	</table>
</div>