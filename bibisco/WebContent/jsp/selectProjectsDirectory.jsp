<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>
<script type="text/javascript">
	// init dialog callback
	function bibiscoSelectProjectsDirectoryInit(ajaxDialog, idCaller, config) {
		
		$('#bibiscoSelectProjectsDirectoryForm').validate({
			rules : {
				bibiscoSelectProjectsDirectorySelectedDirectory : {
					maxlength : 500,
					required : true
				}
			},
			highlight : function(label) {
				$(label).closest('.control-group').addClass('error');
			},

			onsubmit: true
		});
		
		$('#bibiscoSelectProjectsDirectoryButtonSelect').click(function() {
			var directory = bibiscoOpenDirectoryDialog();
			 $('#bibiscoSelectProjectsDirectorySelectedDirectory').val(directory);
		});
		
		$('#bibiscoSelectProjectsDirectoryASave').click(function() {
			$('#bibiscoSelectProjectsDirectoryForm').submit();
		});
		
		$('#bibiscoSelectProjectsDirectoryForm').submit(function() {
			if ($('#bibiscoSelectProjectsDirectoryForm').valid()) {
			
				$.ajax({
					type : 'POST',
					url : 'BibiscoServlet?action=saveProjectsDirectory',
					data : {
						directory: $('#bibiscoSelectProjectsDirectorySelectedDirectory').val()
					},
					beforeSend : function() {
						bibiscoOpenLoadingBanner();
					},
					success : function(data) {
						if (data == 'ok') {
							bibiscoCloseLoadingBannerSuccess();
							$('#bibiscoSelectProjectsDirectoryASave').tooltip('hide');
							ajaxDialog.close();
						} else {
							bibiscoCloseLoadingBannerError();
							bibiscoAlert("forbidden!");		
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
		$('#bibiscoSelectProjectsDirectoryASave').tooltip();		
	}
		
	
	// close dialog callback
	function bibiscoSelectProjectsDirectoryClose(ajaxDialog, idCaller) {

	}

	// before close dialog callback
	function bibiscoSelectProjectsDirectoryBeforeClose(ajaxDialog, idCaller) {

	}
</script>
<div class="bibiscoSelectProjectsDirectoryInfo">
<p><fmt:message key="jsp.selectProjectsDirectory.info.p.1" /></p>
<p><fmt:message key="jsp.selectProjectsDirectory.info.p.2" /></p>
<p><fmt:message key="jsp.selectProjectsDirectory.info.p.3" /></p>
<p><fmt:message key="jsp.selectProjectsDirectory.info.p.4" />
<ul>
<li><fmt:message key="jsp.selectProjectsDirectory.info.p.4.li.1" /></li>
<li><fmt:message key="jsp.selectProjectsDirectory.info.p.4.li.2" /></li>
<li><fmt:message key="jsp.selectProjectsDirectory.info.p.4.li.3" /></li>
</ul>
</p>
</div>
<div class="bibiscoSelectProjectsDirectory">
	<form id="bibiscoSelectProjectsDirectoryForm">
		<div class="control-group">
			<label for="bibiscoSelectProjectsDirectorySelectedDirectory"><fmt:message key="jsp.selectProjectsDirectory.info.p.5" /></label>
			<div class="input-append">		
				<input type="text" class="span4" name="bibiscoSelectProjectsDirectorySelectedDirectory" value="" id="bibiscoSelectProjectsDirectorySelectedDirectory" readonly="readonly" />
				<button id="bibiscoSelectProjectsDirectoryButtonSelect" class="btn" type="button"><fmt:message key="jsp.selectProjectsDirectory.button.select" /></button>
			</div>
		</div>
	</form>
</div>
<div class="bibiscoDialogFooter control-group">
	<table>
		<tr>
			<td>
			 <a id="bibiscoSelectProjectsDirectoryASave" title="<fmt:message key="jsp.common.button.save" />" class="btn btn-primary" href="#"><i class="icon-ok icon-white"></i></a>
			</td>
		</tr>
	</table>
</div>