<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<html>
<body>
<script>
window.top.window.bibiscoImportProjectCallback('${importProjectArchive.idProject}',${importProjectArchive.archiveFileValid},${importProjectArchive.alreadyPresent}, 
		'<fmt:message key="jsp.closeImportProject.importAlreadyPresent.confirm"><fmt:param value="${importProjectArchive.projectName}"/></fmt:message>');
</script>
</body>
</html>