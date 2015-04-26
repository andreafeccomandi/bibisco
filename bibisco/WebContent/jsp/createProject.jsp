<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
	// init dialog callback
	function bibiscoCreateProjectFormInit(ajaxDialog, idCaller) {
				
		$('#bibiscoCreateProjectForm').validate({
			rules : {
				bibiscoCreateProjectName : {
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
		
		$('#bibiscoCreateProjectForm').submit(function() {
			bibiscoCreateProjectFormSubmit(ajaxDialog);
			return false;
		});

		$('#bibiscoCreateProjectFormASave').click(function() {
			bibiscoCreateProjectFormSubmit(ajaxDialog);
		});

		// tooltip
		$('#bibiscoCreateProjectFormASave').tooltip();
		$('#bibiscoCreateProjectFormAClose').tooltip();
		
		// init title value
		$('#bibiscoCreateProjectName').focus();
		
		// preselect bibisco locale
		var bibiscoLocale = '<%=LocaleManager.getInstance().getLocale().toString()%>';
		var option = $('option[value="'+bibiscoLocale+'"]');
		if (option) {
			option.attr('selected','selected');
		}
		
		// select language
		$("#bibiscoCreateProjectSelectLanguage").select2({
    	    formatResult: formatCreateProjectSelectLanguage,
    	    formatSelection: formatCreateProjectSelectLanguage,
    	    escapeMarkup: function(m) { return m; }
    	});
		
	}

	// format select option
	function formatCreateProjectSelectLanguage(state) {
		var originalOption = state.element;
		return state.text;
	}

	function bibiscoCreateProjectFormSubmit(ajaxDialog) {
		if ($('#bibiscoCreateProjectForm').valid()) {
			bibiscoConfirm('<fmt:message key="jsp.createProject.save.confirm" />', function(result) {
			    if (result) {
			    	var name = $('#bibiscoCreateProjectName').val();
					var language = $('#bibiscoCreateProjectSelectLanguage').val();

					$.ajax({
						type : 'POST',
						url : 'BibiscoServlet?action=createProject',
						data : {
							name : name,
							language : language
						},
						beforeSend : function() {
							bibiscoBlockUI();
							bibiscoOpenLoadingBanner();
						},
						success : function(data) {
							$('#bibiscoThumbnailTitleFormASave').tooltip('hide');
							$('body').html(data);
							bibiscoCloseLoadingBannerSuccess();
							ajaxDialog.close();
						},
						error : function() {
							bibiscoCloseLoadingBannerError();
						}
					});
			    } 
			});
		}

	}

	// close dialog callback
	function bibiscoCreateProjectFormClose(ajaxDialog, idCaller) {
		$('#bibiscoCreateProjectFormAClose').tooltip('hide');
	}

	// before close dialog callback
	function bibiscoCreateProjectFormBeforeClose(ajaxDialog, idCaller) {

	}
</script>

<div class="bibiscoCreateProject">
	<form id="bibiscoCreateProjectForm">
		<div class="control-group">
			<label id="bibiscoCreateProjectNameLabel" class="control-label" for="bibiscoCreateProjectName"><fmt:message key="jsp.createProject.form.label.name" /></label>
			<div class="controls">
				<input type="text" class="span5" name="bibiscoCreateProjectName" id="bibiscoCreateProjectName" maxlength="50">
			</div>
			<label id="bibiscoCreateProjectSelectLanguageLabel" class="control-label" for="bibiscoCreateProjectSelectLanguage"><fmt:message key="jsp.createProject.form.label.language" /></label>
			<div class="controls">
				<select class="selectpicker" name="bibiscoCreateProjectSelectLanguage" id="bibiscoCreateProjectSelectLanguage">
					<option value="ca_ES"><fmt:message key="jsp.createProject.form.selectLanguage.option.ca_ES" /></option>
					<option value="da_DK"><fmt:message key="jsp.createProject.form.selectLanguage.option.da_DK" /></option>
					<option value="de_DE"><fmt:message key="jsp.createProject.form.selectLanguage.option.de_DE" /></option>
					<option value="en_AU"><fmt:message key="jsp.createProject.form.selectLanguage.option.en_AU" /></option>
					<option value="en_CA"><fmt:message key="jsp.createProject.form.selectLanguage.option.en_CA" /></option>
					<option value="en_GB"><fmt:message key="jsp.createProject.form.selectLanguage.option.en_GB" /></option>
					<option value="en_US"><fmt:message key="jsp.createProject.form.selectLanguage.option.en_US" /></option>
					<option value="en_ZA"><fmt:message key="jsp.createProject.form.selectLanguage.option.en_ZA" /></option>
					<option value="es_AR"><fmt:message key="jsp.createProject.form.selectLanguage.option.es_AR" /></option>
					<option value="es_ES"><fmt:message key="jsp.createProject.form.selectLanguage.option.es_ES" /></option>
					<option value="es_MX"><fmt:message key="jsp.createProject.form.selectLanguage.option.es_MX" /></option>
					<option value="es_VE"><fmt:message key="jsp.createProject.form.selectLanguage.option.es_VE" /></option>
					<option value="fr_FR"><fmt:message key="jsp.createProject.form.selectLanguage.option.fr_FR" /></option>
					<option value="it_IT"><fmt:message key="jsp.createProject.form.selectLanguage.option.it_IT" /></option>
					<option value="nl_NL"><fmt:message key="jsp.createProject.form.selectLanguage.option.nl_NL" /></option>
					<option value="no_NO"><fmt:message key="jsp.createProject.form.selectLanguage.option.no_NO" /></option>
					<option value="pt_BR"><fmt:message key="jsp.createProject.form.selectLanguage.option.pt_BR" /></option>
					<option value="pt_PT"><fmt:message key="jsp.createProject.form.selectLanguage.option.pt_PT" /></option>
					<option value="sv_SE"><fmt:message key="jsp.createProject.form.selectLanguage.option.sv_SE" /></option>	
				</select>
			</div>
		</div>
	</form>
</div>
<div class="bibiscoDialogFooter control-group">
	<table>
		<tr>
			<td><a id="bibiscoCreateProjectFormASave" title="<fmt:message key="jsp.common.button.save" />" class="btn btn-primary" href="#"><i
					class="icon-ok icon-white"></i></a> <a id="bibiscoCreateProjectFormAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" href="#"><i
					class="icon-remove"></i></a></td>
		</tr>
	</table>
</div>