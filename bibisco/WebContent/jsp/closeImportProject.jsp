<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<html>
<body>
<script>
<fmt:message key="jsp.closeImportProject.importAlreadyPresent.confirm" var="confirmMessage"><fmt:param value="${importProjectArchive.projectName}"/></fmt:message>
var confirmMessage = "<c:out value="${confirmMessage}"/>";
window.top.window.bibiscoImportProjectCallback('${importProjectArchive.idProject}',${importProjectArchive.archiveFileValid},${importProjectArchive.alreadyPresent}, 
		confirmMessage);
</script>
</body>
</html>