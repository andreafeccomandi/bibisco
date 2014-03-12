<%@tag import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ attribute name="text" required="true" type="java.lang.String" rtexprvalue="true" %>
<%@ attribute name="createButtonId" required="true" type="java.lang.String" rtexprvalue="true" %>
<%@ attribute name="createButtonText" required="true" type="java.lang.String" rtexprvalue="true" %>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<div class="hero-unit" style="margin-top: 30px; margin-left: 30px; margin-right: 150px; padding-top: 20px; padding-bottom: 35px; padding-left: 40px;">
	<h3><fmt:message key="${text}" /></h3>
	<p style="margin-top: 16px;">
		<a id="${createButtonId}" class="btn btn-primary" href="#"><fmt:message key="${createButtonText}" /></a>
	</p>
</div>
