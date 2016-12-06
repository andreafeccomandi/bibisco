<%@tag import="com.bibisco.manager.LocaleManager"%>
<%@ attribute name="bibiscoTaskStatus" required="true" type="com.bibisco.enums.TaskStatus" rtexprvalue="true" %>
<%@ attribute name="bibiscoWordCount" required="false" type="java.lang.Integer" rtexprvalue="true" %>
<%@ attribute name="bibiscoCharacterCount" required="false" type="java.lang.Integer" rtexprvalue="true" %>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<!-- The tooltips of this tag are initialized in main.jsp -->

<div class="bibiscoTagTaskStatusDiv">
<c:if test="${not empty bibiscoWordCount && not empty bibiscoCharacterCount}">
<span class="label label-info" title="<fmt:message key="jsp.common.span.words"/> (<fmt:message key="jsp.common.span.characters"/>)">${bibiscoWordCount} (${bibiscoCharacterCount})</span>
</c:if>
<c:if test="${bibiscoTaskStatus == 'TODO'}">
<span class="badge badge-important bibiscoTaskStatusTodo" title="<fmt:message key="tag.bibiscothumbnail.taskstatus.todo.description" />"><fmt:message key="tag.bibiscothumbnail.taskstatus.todo" /></span>	
</c:if>

<c:if test="${bibiscoTaskStatus == 'TOCOMPLETE'}">
<span class="badge badge-warning bibiscoTaskStatusToComplete" title="<fmt:message key="tag.bibiscothumbnail.taskstatus.tocomplete.description" />"><fmt:message key="tag.bibiscothumbnail.taskstatus.tocomplete" /></span>	
</c:if>

<c:if test="${bibiscoTaskStatus == 'COMPLETED'}">
<span class="badge badge-success bibiscoTaskStatusCompleted" title="<fmt:message key="tag.bibiscothumbnail.taskstatus.completed.description"/>"><fmt:message key="tag.bibiscothumbnail.taskstatus.completed" /></span>	
</c:if>

<c:if test="${bibiscoTaskStatus == 'STATS'}">
<span class="label label-info">info</i> </span>  
</c:if>
</div>