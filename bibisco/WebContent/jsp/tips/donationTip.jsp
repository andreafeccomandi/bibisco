<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ page import="com.bibisco.manager.ConfigManager"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>
<c:set var="baseURL" value="<%=ConfigManager.getInstance().getMandatoryProperty("web/@uri")%>" scope="request"/>

<script type="text/javascript">
$(function() {
	// donate with PayPal
    $('#bibiscoTipImgDonatePayPal').click(function() {
        bibiscoOpenDefaultBrowser('${baseURL}/donatePayPal');
    }); 
        
});

</script>
<p><fmt:message key="jsp.tip.donationTip.1"/></p>
<p><fmt:message key="jsp.tip.donationTip.2"/></p>
<p class="bibiscoDonationsButton">
<img id="bibiscoTipImgDonatePayPal" class="bibiscoDonationButtonPaypal" src="img/<fmt:message key="jsp.info.img.donatepaypal"/>">
</p>
     

     
