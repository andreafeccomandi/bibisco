<%@page import="com.bibisco.manager.ConfigManager"%>
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
    
    // donate with Flattr
    $('#bibiscoTipImgDonateFlattr').click(function() {
        bibiscoOpenDefaultBrowser('${baseURL}/donateFlattr');
    });      
   
});

</script>
<p><fmt:message key="jsp.tip.donationTip.1"/></p>
<p><fmt:message key="jsp.tip.donationTip.2"/></p>
<p style="margin-top: 15px;" class="bibiscoDonationsButton">
<img id="bibiscoTipImgDonatePayPal" class="bibiscoDonationButtonPaypal" src="img/<fmt:message key="jsp.info.img.donatepaypal"/>">
<img style="margin-left: 25px;" id="bibiscoTipImgDonateFlattr" class="bibiscoDonationButtonFlattr" src="img/flattr-badge.png">
</p>
     

     
