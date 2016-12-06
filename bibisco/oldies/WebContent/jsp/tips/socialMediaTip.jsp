<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
$(function() {
            
    // link to facebook page
    $('#bibiscoTipImgFacebook').click(function() {
        bibiscoOpenDefaultBrowser('https://www.facebook.com/bibisco.official.page');
    }); 
    
    // link to twitter page
    $('#bibiscoTipImgTwitter').click(function() {
        bibiscoOpenDefaultBrowser('https://twitter.com/bibiscotweet');
    });
   
});

</script>

<p><fmt:message key="jsp.tip.socialMediaTip.1"/></p>
<p><fmt:message key="jsp.tip.socialMediaTip.2"/></p>
<p class="bibiscoSocialMediaButton">
   <img id="bibiscoTipImgFacebook" class="bibiscoSocialMediaButtonFacebook" src="img/facebook.png">
   <img id="bibiscoTipImgTwitter" class="bibiscoSocialMediaButtonTwitter" src="img/twitter.png">
</p>