<%@tag import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ attribute name="text" required="true" type="java.lang.String" rtexprvalue="true" %>
<%@ attribute name="createButtonId" required="true" type="java.lang.String" rtexprvalue="true" %>
<%@ attribute name="createButtonText" required="true" type="java.lang.String" rtexprvalue="true" %>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<div class="hero-unit bibiscoEmptyThumnailListBox">
	<h3><fmt:message key="${text}" /></h3>
	<p>
		<a id="${createButtonId}" class="btn btn-primary" href="#"><fmt:message key="${createButtonText}" /></a>
	</p>
</div>
