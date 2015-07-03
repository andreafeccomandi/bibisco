<%@tag import="com.bibisco.manager.LocaleManager"%>
<%@ attribute name="id" required="true" type="java.lang.String" rtexprvalue="true" %>
<%@ attribute name="position" required="true" type="java.lang.String" rtexprvalue="true" %>
<%@ attribute name="title" required="true" type="java.lang.String" rtexprvalue="true" %>
<%@ attribute name="area" required="true" type="java.lang.String" rtexprvalue="true" %>
<%@ attribute name="taskStatus" required="true" type="com.bibisco.enums.TaskStatus" rtexprvalue="true" %>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="tags" tagdir="/WEB-INF/tags"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>
    
<div data-bibiscoTagThumbnailId="${id}" class="thumbnail bibiscoThumbnail" id="bibiscoTagThumbnailLocationDiv${id}">
	<div class="caption">
		<table>
		<tr class="bibiscoThumbnailHeader"><td rowspan="2"><strong class="bibiscoThumbnailTitle">${title}</strong></td>
		<td>
		<tags:bibiscoTaskStatus bibiscoTaskStatus="${taskStatus}" />
		</td></tr>
		<tr class="bibiscoThumbnailSpacingSmall"><td colspan="2"></td></tr>
		<tr class="bibiscoThumbnailDescription"><td colspan="2" class="bibiscoThumbnailLocationArea">${area}</td></tr>
		<tr><td colspan="2" class="bibiscoThumbnailToolbar">
			<button title="<fmt:message key="jsp.common.button.delete" />" class="btn btn-mini bibiscoThumbnailButtonDelete"><i class="icon-trash"></i></button>
		</td></tr>
		</table>
	</div>	
</div>
