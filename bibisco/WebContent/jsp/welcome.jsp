<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="tags" tagdir="/WEB-INF/tags"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">

	$(function() {
			
	// hide menu
	$('#bibiscoMenuUl').hide();
	
	var step = ${wizardStep};
	if (step == 1) {
		$('.bibiscoStartWizardStep2').hide();
	} else {
		$('.bibiscoStartWizardStep1').hide();
	}
		
	$('#bibiscoStartWizardNext').click(function() {
		 $('#bibiscoStartWizardFormStep1').submit();
	});
	
	$('#bibiscoStartWizardFinish').click(function() {
		$('#bibiscoStartWizardFormStep2').submit();
	});
			
	// preselect bibisco locale
	var bibiscoLocale = '<%=LocaleManager.getInstance().getLocale().toString()%>';
	var option = $('option[value="'+bibiscoLocale+'"]');
	if (option) {
		option.attr('selected','selected');
	}
	
	// select language
	$("#bibiscoWelcomeSelectLanguage").select2({
	    formatResult: formatWelcomeSelectLanguage,
	    formatSelection: formatWelcomeSelectLanguage,
	    escapeMarkup: function(m) { return m; }
	});

	// format select option
	function formatWelcomeSelectLanguage(state) {
		var originalOption = state.element;
		return state.text;
	}
	
	$('#bibiscoStartWizardFormStep2').validate({
		rules : {
			bibiscoStartWizardSelectedDirectory : {
				maxlength : 500,
				required : true
			}
		},
		highlight : function(label) {
			$(label).closest('.control-group').addClass('error');
		},

		onsubmit: true
	});
	
	$('#bibiscoStartWizardFormStep2').submit(function() {
		if ($('#bibiscoStartWizardFormStep2').valid()) {
		
			$.ajax({
				type : 'POST',
				url : 'BibiscoServlet?action=saveProjectsDirectory',
				data : {
					directory: $('#bibiscoStartWizardSelectedDirectory').val()
				},
				beforeSend : function() {
					bibiscoOpenLoadingBanner();
				},
				success : function(data) {
					if (data == 'ok') {
						bibiscoProjectsDirectoryEmpty = false;
						bibiscoCloseLoadingBannerSuccess();
						$('#bibiscoSelectProjectsDirectoryASave').tooltip('hide');
						window.location.href = 'BibiscoServlet?action=completeWizardStep2';
					} else {
						bibiscoCloseLoadingBannerError();
						bibiscoAlert("<fmt:message key="jsp.welcome.step2.forbidden.message"/>");		
					}
				},
				error : function() {		
					bibiscoCloseLoadingBannerError();
				}
			});
		}
		
		return false;
	});
	
	$('#bibiscoStartWizardSelectProjectsDirectoryButton').click(function() {
		var directory = bibiscoOpenDirectoryDialog();
		 $('#bibiscoStartWizardSelectedDirectory').val(directory);
	});
	
});
	


</script>
<%@ include file="menu.jsp" %>
<div class="row-fluid">
	<div class="span12">
    	<div class="hero-unit bibiscoWelcomeMotivational">
				<h1 class="bibiscoNotSelectableText"><fmt:message key="jsp.welcome.h1" /></h1>
				<div class="bibiscoStartWizardStep1">
				<form action="BibiscoServlet" id="bibiscoStartWizardFormStep1" method="post">
				<input type="hidden" name="action" value="completeWizardStep1" />
					<p class="bibiscoNotSelectableText"><fmt:message key="jsp.welcome.step1.p.1" /></p>
					<div class="controls bibiscoLanguageSelectLanguage">
						<select class="selectpicker" name="locale" id="bibiscoWelcomeSelectLanguage">
							<option value="en_US"><fmt:message key="jsp.language.form.selectLanguage.option.en" /></option>
							<option value="es_ES"><fmt:message key="jsp.language.form.selectLanguage.option.es" /></option>					
							<option value="it_IT"><fmt:message key="jsp.language.form.selectLanguage.option.it" /></option>
							<!--  <option value="de_DE"><fmt:message key="jsp.language.form.selectLanguage.option.de" /></option>
							<option value="fr_FR"><fmt:message key="jsp.language.form.selectLanguage.option.fr" /></option>
							<option value="pt_BR"><fmt:message key="jsp.language.form.selectLanguage.option.pt" /></option>
							-->	
						</select>					
					</div>
					<div class="bibiscoWizardButtons">
						<a href="#" class="btn btn-large btn-primary" id="bibiscoStartWizardNext"><fmt:message key="jsp.welcome.a.next" /></a>				
					</div>
				</form>
				</div>
				<div class="bibiscoStartWizardStep2">
					<form id="bibiscoStartWizardFormStep2">
					<input type="hidden" name="action" value="completeWizardStep2" />
					<p class="bibiscoNotSelectableText"><fmt:message key="jsp.welcome.step2.p.1" /></p>
					<div class="input-append">		
						<input type="text" class="span8" name="bibiscoStartWizardSelectedDirectory" value="" id="bibiscoStartWizardSelectedDirectory" readonly="readonly" />
						<button id="bibiscoStartWizardSelectProjectsDirectoryButton" class="btn" type="button"><fmt:message key="jsp.welcome.step2.button.select" /></button>
					</div>	
					<div class="bibiscoStartWizardNotes">
						<p class="bibiscoNotSelectableText"><span class="label label-info"><fmt:message key="jsp.welcome.step2.label.2" /></span>&nbsp;&nbsp;<fmt:message key="jsp.welcome.step2.p.2" /></p>
						<p class="bibiscoNotSelectableText"><span class="label label-success"><fmt:message key="jsp.welcome.step2.label.3" /></span>&nbsp;&nbsp;<fmt:message key="jsp.welcome.step2.p.3" /></p>
					</div>
					<div class="bibiscoWizardButtons">
						<a href="BibiscoServlet?action=start" class="btn btn-large" id="bibiscoStartWizardPrevious" ><fmt:message key="jsp.welcome.a.previous" /></a>
						<a href="#" class="btn btn-large btn-primary" id="bibiscoStartWizardFinish"><fmt:message key="jsp.welcome.a.finish" /></a>
					</div>	
					</form>			
				</div>
		</div>  	  	
    </div>
</div>

