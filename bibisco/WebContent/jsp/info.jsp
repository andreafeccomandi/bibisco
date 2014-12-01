<%@ page language="java" pageEncoding="UTF-8"%>
<%@page import="com.bibisco.manager.VersionManager"%>
<%@page import="com.bibisco.manager.ConfigManager"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>
<c:set var="versionNumber" value="<%=VersionManager.getInstance().getVersion()%>" scope="request"/>
<c:set var="baseURL" value="<%=ConfigManager.getInstance().getMandatoryProperty("web/@uri")%>" scope="request"/>
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
                resizable: false, modal: true, 
                width: 500, height: 450, positionTop: 100
          };

          bibiscoOpenAjaxDialog(ajaxDialogContent);    
    });
    
    // link to official website
    $('.defaultBrowserUrl').click(function() {
        bibiscoOpenDefaultBrowser($(this).html());
    }); 
    
    // donate with PayPal
   	$('#bibiscoInfoDonatePayPal').click(function() {
        bibiscoOpenDefaultBrowser('${baseURL}/donatePayPal');
    }); 
    
    
    // donate with Flattr
    $('#bibiscoInfoDonateFlattr').click(function() {
        bibiscoOpenDefaultBrowser('${baseURL}/donateFlattr');
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
     <p>${versionNumber}</p>
     <h5><fmt:message key="jsp.info.h5.author"/></h5>
     <p><fmt:message key="jsp.info.p.author"/></p>
     <h5><fmt:message key="jsp.info.h5.credits"/></h5>
     <p><fmt:message key="jsp.info.p.credits.1"/></p>
     <p><fmt:message key="jsp.info.p.credits.2"/></p>
     <p><fmt:message key="jsp.info.p.credits.3"/></p>
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
     <h5>Facebook</h5>
     <p class="defaultBrowserUrl">https://www.facebook.com/bibisco.official.page</p>
     <h5>Twitter</h5>
     <p class="defaultBrowserUrl">https://twitter.com/bibiscotweet</p>
     <h5>Email</h5>
     <p class="defaultBrowserUrl">mailto:info@bibisco.com</p>
     </div>
     <div class="span3">   
     <h3><fmt:message key="jsp.info.h3.donations"/></h3>
     <p><fmt:message key="jsp.info.p.donations.1"/></p>
     <p><fmt:message key="jsp.info.p.donations.2"/></p>
     <p><a id="bibiscoInfoDonatePayPal" class="btn"><fmt:message key="jsp.info.a.donatepaypal"/></a></p>
     <p><a id="bibiscoInfoDonateFlattr" class="btn"><fmt:message key="jsp.info.a.donateflattr"/></a></p>
     </div>
 </div>		
