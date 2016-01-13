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
		
	$('#bibiscoProjectsACreateProject').click(function() {
		var ajaxDialogContent = { 
				  idCaller: 'bibiscoChaptersACreateProject',
				  url: 'jsp/createProject.jsp',
				  title: '<fmt:message key="jsp.projects.dialog.title.createProject" />', 
				  init: function (idAjaxDialog, idCaller) { return bibiscoCreateProjectFormInit(idAjaxDialog, idCaller); },
				  close: function (idAjaxDialog, idCaller) { return bibiscoCreateProjectFormClose(idAjaxDialog, idCaller); },
				  beforeClose: function (idAjaxDialog, idCaller) { return bibiscoCreateProjectFormBeforeClose(idAjaxDialog, idCaller); },
				  resizable: false,  modal: true,
				  width: 500, height: 300, positionTop: 100
		  };
		  
		  bibiscoOpenAjaxDialog(ajaxDialogContent);
	});
	
	
	$('#bibiscoProjectsAOpenProject').click(function() {

		var ajaxDialogContent = { 
				  idCaller: 'bibiscoProjectsAOpenProject',
				  url: 'BibiscoServlet?action=selectProject',
				  title: '<fmt:message key="jsp.projects.dialog.title.openProject" />', 
				  init: function (idAjaxDialog, idCaller) { return bibiscoSelectProjectInit(idAjaxDialog, idCaller); },
				  close: function (idAjaxDialog, idCaller) { return bibiscoSelectProjectClose(idAjaxDialog, idCaller); },
				  beforeClose: function (idAjaxDialog, idCaller) { return bibiscoSelectProjectBeforeClose(idAjaxDialog, idCaller); },
				  resizable: false,  modal: true,
				  width: 530, height: 375, positionTop: 100
		  };
		  
		  bibiscoOpenAjaxDialog(ajaxDialogContent);
	});
	
	$('#bibiscoProjectsAImportProject').click(function() {
		var ajaxDialogContent = { 
				  idCaller: 'bibiscoProjectsAImportProject',
				  url: 'jsp/importProject.jsp',
				  title: '<fmt:message key="jsp.projects.dialog.title.importProject" />', 
				  init: function (idAjaxDialog, idCaller) { return bibiscoImportProjectInit(idAjaxDialog, idCaller); },
				  close: function (idAjaxDialog, idCaller) { return bibiscoImportProjectClose(idAjaxDialog, idCaller); },
				  beforeClose: function (idAjaxDialog, idCaller) { return bibiscoImportProjectBeforeClose(idAjaxDialog, idCaller); },
				  resizable: false, modal: true, 
				  width: 500, height: 260, positionTop: 100
		  };
		  
		  bibiscoOpenAjaxDialog(ajaxDialogContent);
	});
	
	
	$('#bibiscoProjectsAChangeLanguage').click(function() {
		 var ajaxDialogContent = { 
				  idCaller: 'start',
				  url : 'jsp/language.jsp',
				  title: '<fmt:message key="jsp.projects.dialog.title.changeLanguage"/>',  
				  init: function (idAjaxDialog, idCaller) { return bibiscoLanguageInit(idAjaxDialog, idCaller); },
				  close: function (idAjaxDialog, idCaller) { return bibiscoLanguageClose(idAjaxDialog, idCaller); },
				  beforeClose: function (idAjaxDialog, idCaller) { return bibiscoLanguageBeforeClose(idAjaxDialog, idCaller); }, 
				  resizable: false, modal: true,
				  width: 600, height: 240, positionTop: 100
		  };
		  
		  bibiscoOpenAjaxDialog(ajaxDialogContent);
	});
		
	<c:choose>
	 <c:when test="${projectsDirectoryEmpty}">
	  bibiscoOpenAjaxDialog({ 
		  idCaller: 'bibiscoStartProjectsDirectoryEmptyCondition',
		  url : 'jsp/selectProjectsDirectory.jsp',
		  title: '<fmt:message key="jsp.start.dialog.title.selectProjectsDirectory"/>',  
		  init: function (idAjaxDialog, idCaller) { return bibiscoSelectProjectsDirectoryInit(idAjaxDialog, idCaller); },
		  close: function (idAjaxDialog, idCaller) { return bibiscoSelectProjectsDirectoryClose(idAjaxDialog, idCaller); },
		  beforeClose: function (idAjaxDialog, idCaller) { return bibiscoSelectProjectsDirectoryBeforeClose(idAjaxDialog, idCaller); }, 
		  resizable: false,  modal: true,
		  width: 550, height: 470, positionTop: 100
  		});
	 </c:when>
	 <c:when test="${not empty webMessage}">bibiscoAlert('${webMessage.message}');</c:when>
	</c:choose>	 
	
	// open default browser
    $('.bibiscoDefaultBrowserUrl').click(function() {
        bibiscoOpenDefaultBrowser($(this).html());
    });
});

</script>
<%@ include file="menu.jsp" %>
<div class="row-fluid">
	<div class="span12">
    	<div class="hero-unit bibiscoStartMotivational">
				<h1 class="bibiscoNotSelectableText"><fmt:message key="jsp.start.h1" /></h1>
				<p class="bibiscoNotSelectableText">
					<c:if test="${not empty projectList}">
						<a href="#" class="btn btn-large btn-primary" id="bibiscoProjectsAOpenProject"><fmt:message key="jsp.start.button.openProject" /></a>
						<a href="#" class="btn btn-large" id="bibiscoProjectsACreateProject"><fmt:message key="jsp.start.button.createProject" /></a>
						<a href="#" class="btn btn-large" id="bibiscoProjectsAImportProject"><fmt:message key="jsp.start.button.importProject" /></a>				
					</c:if>
					<c:if test="${empty projectList}">
						<a href="#" class="btn btn-large btn-primary" id="bibiscoProjectsACreateProject"><fmt:message key="jsp.start.button.createFirstProject" /></a>
						<a href="#" class="btn btn-large" id="bibiscoProjectsAImportProject"><fmt:message key="jsp.start.button.importFirstProject" /></a>				
					</c:if>	
					<a href="#" class="btn btn-large" id="bibiscoProjectsAChangeLanguage"><fmt:message key="jsp.start.button.changeLanguage" /></a>
				</p>
		</div>  	  	
    </div>
</div>

