<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="tags" tagdir="/WEB-INF/tags"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
$(function() {
	
	// exit project
	$('#bibiscoProjectAExitProject').click(function() {
		$.ajax({
			type : 'POST',
			url : 'BibiscoServlet?action=exitProject',
			data : {
				name : name
			},
			beforeSend : function() {
				bibiscoOpenLoadingBanner();
			},
			success : function(data) {
				$('body').html(data);
				bibiscoCloseLoadingBannerSuccess();
			},
			error : function() {
				bibiscoCloseLoadingBannerError();
			}
		});
	});
	
	// update project name button
	$('#bibiscoProjectButtonUpdateTitle').click(function() {		
		
		var actualProjectName = $('#bibiscoProjectSpanTitle').html();
		
		var ajaxDialogContent = { 
			  idCaller: 'bibiscoProjectButtonUpdateTitle',
			  url: 'jsp/changeProjectName.jsp',	    
			  title: "<fmt:message key="jsp.project.dialog.title.updateTitle" />", 
			  init: function (idAjaxDialog, idCaller) { return bibiscoChangeProjectNameInit(idAjaxDialog, idCaller, actualProjectName); },
			  close: function (idAjaxDialog, idCaller) { return bibiscoChangeProjectNameClose(idAjaxDialog, idCaller); },
			  beforeClose: function (idAjaxDialog, idCaller) { return bibiscoChangeProjectNameBeforeClose(idAjaxDialog, idCaller); },
			  resizable: false, modal: true, 
			  width: 500, height: 210, positionTop: 100
		};

		bibiscoOpenAjaxDialog(ajaxDialogContent);		
	});
	
	// suggestions
	$('#bibiscoProjectSuggestions').click(function() {
			var ajaxDialogContent = { 
				  idCaller: 'bibiscoProjectSuggestions',
				  url: 'jsp/suggestions.jsp',	    
				  title: "<fmt:message key="jsp.project.dialog.title.suggestions" />", 
				  init: function (idAjaxDialog, idCaller) { return bibiscoSuggestionsInit(idAjaxDialog, idCaller); },
				  close: function (idAjaxDialog, idCaller) { },
				  beforeClose: function (idAjaxDialog, idCaller) { return bibiscoSuggestionsBeforeClose(idAjaxDialog, idCaller); },
				  resizable: false, modal: true, 
				  width: 500, height: 450, positionTop: 100
			};

			bibiscoOpenAjaxDialog(ajaxDialogContent);	
	});
	
	$('#bibiscoProjectButtonUpdateTitle').tooltip();
	$('#bibiscoProjectAExitProject').tooltip()
	
});

</script>
<div>
	<div class="row-fluid">
		<div class="span12">
			<div class="row-fluid page-header">
				<div class="span8">
					<h1 id="bibiscoProjectH1Title"><span id="bibiscoProjectSpanTitle"><c:out value="${project.name}"></c:out></span>&nbsp;&nbsp;<button id="bibiscoProjectButtonUpdateTitle" title="<fmt:message key="jsp.project.button.updateTitle" />" class="btn btn-mini"><i class="icon-pencil"></i></button>
	    			</h1>
	    		</div>
	    		<div class="span4 pagination-right">
	    			<a id="bibiscoProjectAExitProject" title="<fmt:message key="jsp.project.a.exitProject.tooltip" />" class="btn bibiscoHeaderButton" href="#"><i class="icon-chevron-up icon-white"></i><fmt:message key="jsp.project.a.exitProject" /></a>
	    		</div>
	    	</div>
		</div>
	</div>
	<div class="row-fluid">
	<div class="span12">
    	<div class="hero-unit bibiscoProjectMotivational">
				<h1 class="bibiscoNotSelectableText"><fmt:message key="jsp.project.h1" /></h1>
				<p class="bibiscoNotSelectableText">
					<a href="#" class="btn btn-large btn-primary" id="bibiscoProjectSuggestions"><fmt:message key="jsp.project.button.bibiscoProjectSuggestions" /></a>
				</p>
		</div>  	  	
    </div>
    <div class="row-fluid">
    
    </div>
</div>
</div>
