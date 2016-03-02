<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@page import="com.bibisco.manager.ConfigManager"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>
<c:set var="baseURL" value="<%=ConfigManager.getInstance().getMandatoryProperty("web/@uri")%>" scope="request"/>
<script type="text/javascript">
$(function() {
        
    // link to official website
    $('#bibiscoSuggestedReadings').click(function() {
        bibiscoOpenDefaultBrowser('http://www.bibisco.com/readings');
    }); 
            
});

</script>

<div class="row-fluid bibiscoNotSelectableText">
	<div class="span12">
		<div class="row-fluid  page-header">
			<div class="span8">
    			<h1><fmt:message key="jsp.suggestedReadings.h1.title"/></h1>
    		</div>
    	</div>
	</div>
	<div class="row-fluid">
	<div class="span12">
    	<div class="hero-unit bibiscoNotSelectableText bibiscoSuggestedReadingsMotivational">
				<h1><fmt:message key="jsp.suggestedReadings.h1.herounit" /></h1>
				<div>
				<p><fmt:message key="jsp.suggestedReadings.p.1" /></p>
				<p><fmt:message key="jsp.suggestedReadings.p.2" /></p>
				<p><a href="#" class="btn btn-large btn-primary" id="bibiscoSuggestedReadings"><fmt:message key="jsp.suggestedReadings.button" /></a></p>
				</div>
		</div>  	  	
    </div>
    </div>
</div>
	
