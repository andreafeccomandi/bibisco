<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="tags" tagdir="/WEB-INF/tags"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>
	    		
   		<c:if test="${location.position>1 && location.position % 4 == 1}">
   			<section>
   			<div class="row-fluid">
   		</c:if>
   		
   		<div class="span3 thumbnailSlot" data-thumbnailFamily="location" data-slotPosition="${location.position}">
			<tags:bibiscoThumbnailLocation title="${location.name}" area="${location.fullyQualifiedArea}" position="${location.position}" taskStatus="${location.taskStatus}" id="${location.idLocation}" />
		</div>
   		
   		<c:if test="${location.position>1 && location.position % 4 == 1}">
   			</div>
   			</section>
   		</c:if>
