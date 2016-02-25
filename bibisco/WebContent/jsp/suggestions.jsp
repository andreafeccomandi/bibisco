<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
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
	$('#bibiscoSuggestionsDiv').perfectScrollbar();   
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
	
	// update scrollbar
	$('#bibiscoSuggestionsDiv').perfectScrollbar('update');   
}

function getActualSuggestion() {
	return parseInt($('#bibiscoSuggestionsDiv').attr('data-actual-suggestion'));
}

	
</script>

<div id="bibiscoSuggestionsDiv" class="bibiscoSuggestionsCarousel bibiscoScrollable" data-actual-suggestion="0" data-total-suggestions="6" >
	<div class="bibiscoSuggestions" data-suggestion="0">
	<h4><fmt:message key="jsp.suggestions.characters.h4" /></h4>
	<p><fmt:message key="jsp.suggestions.characters.p1" /></p>
	<p><fmt:message key="jsp.suggestions.characters.p2" /></p>
	<p><fmt:message key="jsp.suggestions.characters.p3" /></p>
	<p><fmt:message key="jsp.suggestions.characters.p4" /></p>
	</div>
	<div class="bibiscoSuggestions" data-suggestion="1" >
	<h4><fmt:message key="jsp.suggestions.conflict.h4" /></h4>
	<p><fmt:message key="jsp.suggestions.conflict.p1" /></p>
	<p><fmt:message key="jsp.suggestions.conflict.p2" /></p>
	<p><fmt:message key="jsp.suggestions.conflict.p3" /></p>
	<p><fmt:message key="jsp.suggestions.conflict.p4" /></p>
	</div>
	<div class="bibiscoSuggestions" data-suggestion="2" >
	<h4><fmt:message key="jsp.suggestions.premise.h4" /></h4>
	<p><fmt:message key="jsp.suggestions.premise.p1" /></p>
	<p><fmt:message key="jsp.suggestions.premise.p2" /></p>
	<p><fmt:message key="jsp.suggestions.premise.p3" /></p>
	<p><fmt:message key="jsp.suggestions.premise.p4" /></p>
	</div>
	<div class="bibiscoSuggestions" data-suggestion="3" >
	<h4><fmt:message key="jsp.suggestions.setting.h4" /></h4>
	<p><fmt:message key="jsp.suggestions.setting.p1" /></p>
	<p><fmt:message key="jsp.suggestions.setting.p2" /></p>
	<p><fmt:message key="jsp.suggestions.setting.p3" /></p>
	</div>
	<div class="bibiscoSuggestions" data-suggestion="4">
	<h4><fmt:message key="jsp.suggestions.fabula.h4" /></h4>
	<p><fmt:message key="jsp.suggestions.fabula.p1" /></p>
	<p><fmt:message key="jsp.suggestions.fabula.p2" /></p>
	<p><fmt:message key="jsp.suggestions.fabula.p3" /></p>
	</div>
	<div class="bibiscoSuggestions" data-suggestion="5">
	<h4><fmt:message key="jsp.suggestions.pointofview.h4" /></h4>
	<p><fmt:message key="jsp.suggestions.pointofview.p1" /></p>
	<p><fmt:message key="jsp.suggestions.pointofview.p2" /></p>
	<p><fmt:message key="jsp.suggestions.pointofview.p3" /></p>
	<p><fmt:message key="jsp.suggestions.pointofview.p4" /></p>
	<p><fmt:message key="jsp.suggestions.pointofview.p5" /></p>
	<p><fmt:message key="jsp.suggestions.pointofview.p6" /></p>
	<p><fmt:message key="jsp.suggestions.pointofview.p7" /></p>
	</div>
</div>

<div class="bibiscoDialogFooter control-group">
	<table>
		<tr>
			<td>
				<a id="bibiscoSuggestionsABack" title="<fmt:message key="jsp.suggestions.button.back" />" class="btn" href="#"><i class="icon-chevron-left"></i></a>
				<a id="bibiscoSuggestionsAForward" title="<fmt:message key="jsp.suggestions.button.forward" />" class="btn btn-primary" href="#"><i class="icon-chevron-right"></i></a>
				<a id="bibiscoSuggestionsAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" href="#"><i class="icon-remove"></i></a></td>
		</tr>
	</table>
</div>