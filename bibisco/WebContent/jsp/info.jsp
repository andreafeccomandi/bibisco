<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
$(function() {
    
    // GNU GPL License
    $('#bibiscoInfoLicense').click(function() {
    	var ajaxDialogContent = { 
                idCaller: 'bibiscoInfoLicense',
                url: 'jsp/license.jsp',       
                title: 'GNU GPL License', 
                init: function (idAjaxDialog, idCaller) { return bibiscoLicenseInit(idAjaxDialog, idCaller); },
                close: function (idAjaxDialog, idCaller) { },
                beforeClose: function (idAjaxDialog, idCaller) { return bibiscoLicenseBeforeClose(idAjaxDialog, idCaller); },
                resizable: false, 
                width: 500, height: 450, positionTop: 100
          };

          bibiscoOpenAjaxDialog(ajaxDialogContent);    
    });
    
    // link to official website
    $('.defaultBrowserUrl').click(function() {
        bibiscoOpenDefaultBrowser($(this).html());
    }); 
});

</script>

<div class="row-fluid notSelectableText">
	<div class="span12">
		<div class="row-fluid  page-header">
			<div class="span8">
    			<h1><fmt:message key="jsp.info.h1"/></h1>
    		</div>
    	</div>
	</div>
</div>
<div class="row-fluid notSelectableText">
     <div class="span3">   
     <h3><fmt:message key="jsp.info.h3.about"/></h3>
     <h5><fmt:message key="jsp.info.h5.version"/></h5>
     <p><fmt:message key="jsp.info.p.versionnumber"/></p>
     <h5><fmt:message key="jsp.info.h5.author"/></h5>
     <p><fmt:message key="jsp.info.p.author"/></p>
     <h5><fmt:message key="jsp.info.h5.credits"/></h5>
     <p><fmt:message key="jsp.info.p.credits.1"/></p>
     <p><fmt:message key="jsp.info.p.credits.2"/></p>
     </div>
     <div class="span3">
     <h3><fmt:message key="jsp.info.h3.license"/></h3>
     <p><fmt:message key="jsp.info.p.license"/></p>
     <p><fmt:message key="jsp.info.p.license.copyright"/></p>
     <p><fmt:message key="jsp.info.p.license.warranty"/></p>
     <a id="bibiscoInfoLicense" class="btn"><fmt:message key="jsp.info.a.seelicense"/></a>
     </div>
     <div class="span3">
     <h3><fmt:message key="jsp.info.h3.project"/></h3>
     <p><fmt:message key="jsp.info.p.project.1"/></p>
     <p><fmt:message key="jsp.info.p.project.2"/></p>
     <h5><fmt:message key="jsp.info.h5.website"/></h5>
     <p class="defaultBrowserUrl"><fmt:message key="jsp.info.p.websiteurl"/></p>
     </div>
 </div>

			
		