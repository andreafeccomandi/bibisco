<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<p><button class="btn bibiscoSceneTipButton"><i class="icon-external-link"></i></button><fmt:message key="jsp.tip.sceneTip.1"/></p>
<p><button class="btn bibiscoSceneTipButton"><i class="icon-tags"></i></button><fmt:message key="jsp.tip.sceneTip.2"/></p>