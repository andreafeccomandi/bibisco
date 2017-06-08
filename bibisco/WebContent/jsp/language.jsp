<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>
<script type="text/javascript">
	// init dialog callback
	function bibiscoLanguageInit(ajaxDialog, idCaller, config) {
		
		if (idCaller == 'bibiscoSettingsALanguage') {
			$('#bibiscoLanguageFormInputFrom').val('settings');	
		} else {
			$('#bibiscoLanguageFormInputFrom').val('start');	
		}

		$('#bibiscoLanguageASave').click(function() {
			$('#bibiscoLanguageForm').submit();
		});
		
		$('#bibiscoLanguageForm').submit(function() {
			bibiscoOpenLoadingBanner();
		});

		// tooltip
		$('#bibiscoLanguageASave').tooltip();
		$('#bibiscoLanguageAClose').tooltip();
		
		// preselect bibisco locale
		var bibiscoLocale = '<%=LocaleManager.getInstance().getLocale().toString()%>';
		var option = $('option[value="'+bibiscoLocale+'"]');
		if (option) {
			option.attr('selected','selected');
		}
		
		// select language
		$("#bibiscoLanguageSelectLanguage").select2({
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
	
	
	// close dialog callback
	function bibiscoLanguageClose(ajaxDialog, idCaller) {
		$('#bibiscoLanguageAClose').tooltip('hide');
	}

	// before close dialog callback
	function bibiscoLanguageBeforeClose(ajaxDialog, idCaller) {

	}
</script>

<div class="bibiscoLanguage">
	<form id="bibiscoLanguageForm" action="BibiscoServlet">
		<input type="hidden" name="action" value="saveLocale" />
		<input type="hidden" name="from" value="" id="bibiscoLanguageFormInputFrom"/>
		<div class="control-group">
			<label id="bibiscoLanguageSelectBibiscoLanguageLabel" class="control-label" for="bibiscoLanguageSelectBibiscoLanguage"><fmt:message key="jsp.language.form.selectLanguage.label" /></label>
			<div class="controls bibiscoLanguageSelectLanguage">
				<select class="selectpicker" name="locale" id="bibiscoLanguageSelectLanguage">
					<option value="cs_CZ"><fmt:message key="jsp.language.form.selectLanguage.option.cs" /></option>
					<option value="de_DE"><fmt:message key="jsp.language.form.selectLanguage.option.de" /></option>
					<option value="en_CA"><fmt:message key="jsp.language.form.selectLanguage.option.en_CA" /></option>
					<option value="en_UK"><fmt:message key="jsp.language.form.selectLanguage.option.en_UK" /></option>
					<option value="en_US"><fmt:message key="jsp.language.form.selectLanguage.option.en_US" /></option>
					<option value="es_ES"><fmt:message key="jsp.language.form.selectLanguage.option.es" /></option>					
					<option value="fr_FR"><fmt:message key="jsp.language.form.selectLanguage.option.fr" /></option>	
					<option value="it_IT"><fmt:message key="jsp.language.form.selectLanguage.option.it" /></option>
					<option value="pl_PL"><fmt:message key="jsp.language.form.selectLanguage.option.pl" /></option>
					<option value="pt_BR"><fmt:message key="jsp.language.form.selectLanguage.option.pt" /></option>
					<option value="ru_RU"><fmt:message key="jsp.language.form.selectLanguage.option.ru" /></option>
				</select>
			</div>
		</div>
	</form>
</div>
<div class="bibiscoDialogFooter control-group">
	<table>
		<tr>
			<td>
			 <a id="bibiscoLanguageASave" title="<fmt:message key="jsp.common.button.save" />" class="btn btn-primary" href="#"><i class="icon-ok icon-white"></i></a>
			 <a id="bibiscoLanguageAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" href="#"><i class="icon-remove"></i></a>
			</td>
		</tr>
	</table>
</div>
