<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>
<script type="text/javascript">
function bibiscoSuggestionsInit(idAjaxDialog, idCaller) {
		
	// hide all suggestions
	$('div.bibiscoSuggestions').hide();
		
	// show first suggestion
	$('div.bibiscoSuggestions[data-suggestion="0"]').show();
	
	// hide back button
	$('#bibiscoSuggestionsABack').hide();
	
	// tooltip
	$('#bibiscoSuggestionsAClose').tooltip();
	$('#bibiscoSuggestionsABack').tooltip();
	$('#bibiscoSuggestionsAForward').tooltip();

	//back button
	$('#bibiscoSuggestionsABack').click(function() {
		showSuggestion(getActualSuggestion() - 1);
	});

	//forward button
	$('#bibiscoSuggestionsAForward').click(function() {
		showSuggestion(getActualSuggestion() + 1);
	});
	
	// initialize scrollbar
	$('#bibiscoSuggestionsDiv').jScrollPane({
		autoReinitialise: true, animateScroll: true, verticalGutter: 30
	}).data('jsp');
}

function bibiscoSuggestionsBeforeClose(idAjaxDialog, idCaller) {
	$('#bibiscoSuggestionsAClose').tooltip('hide');
}

function showSuggestion(i) {
	
	var totalSuggestions = parseInt($('#bibiscoSuggestionsDiv').attr('data-total-suggestions'));
	
	// calculate suggestion
	var j = i % totalSuggestions;
	
	// hide all suggestions
	$('div.bibiscoSuggestions').hide();
		
	// show suggestion
	$('div.bibiscoSuggestions[data-suggestion="'+j+'"]').show();
	
	// update actual suggestion
	$('#bibiscoSuggestionsDiv').attr('data-actual-suggestion', j);
	
	// show/hide back and previous buttons
	if (j==0) {
		$('#bibiscoSuggestionsABack').hide();
		$('#bibiscoSuggestionsAForward').show();
	} else if (j==(totalSuggestions-1)) {
		$('#bibiscoSuggestionsABack').show();
		$('#bibiscoSuggestionsAForward').hide();
	} else {
		$('#bibiscoSuggestionsABack').show();
		$('#bibiscoSuggestionsAForward').show();
	}
}

function getActualSuggestion() {
	return parseInt($('#bibiscoSuggestionsDiv').attr('data-actual-suggestion'));
}

	
</script>

<div id="bibiscoSuggestionsDiv" data-actual-suggestion="0" data-total-suggestions="6" style="width: 100%; height: 350px; overflow: scroll;" >
	<div class="bibiscoSuggestions" data-suggestion="0">
	<jsp:include page="suggestions/${language}/characters.html" />
	</div>
	<div class="bibiscoSuggestions" data-suggestion="1" >
	<jsp:include page="suggestions/${language}/conflict.html" />
	</div>
	<div class="bibiscoSuggestions" data-suggestion="2" >
	<jsp:include page="suggestions/${language}/premise.html" />
	</div>
	<div class="bibiscoSuggestions" data-suggestion="3" >
	<jsp:include page="suggestions/${language}/setting.html" />
	</div>
	<div class="bibiscoSuggestions" data-suggestion="4">
	<jsp:include page="suggestions/${language}/fabula.html" />
	</div>
	<div class="bibiscoSuggestions" data-suggestion="5">
	<jsp:include page="suggestions/${language}/pointofview.html" />
	</div>
</div>

<div class="bibiscoDialogFooter control-group">
	<table style="width: 100%">
		<tr>
			<td style="text-align: right;">
				<a id="bibiscoSuggestionsABack" title="<fmt:message key="jsp.suggestions.button.back" />" class="btn" style="margin-left: 5px;" href="#"><i class="icon-chevron-left"></i></a>
				<a id="bibiscoSuggestionsAForward" title="<fmt:message key="jsp.suggestions.button.forward" />" class="btn btn-primary" style="margin-left: 5px;" href="#"><i class="icon-chevron-right"></i></a>
				<a id="bibiscoSuggestionsAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" style="margin-left: 5px;" href="#"><i class="icon-remove"></i></a></td>
		</tr>
	</table>
</div>