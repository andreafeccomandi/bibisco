<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="tags" tagdir="/WEB-INF/tags"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>
	    		   		
   		<c:if test="${scene.position>1 && scene.position % 4 == 1}">
   			<section>
   			<div class="row-fluid">
   		</c:if>
   		
   		<div class="span3 thumbnailSlot" data-thumbnailFamily="scene" data-slotPosition="${scene.position}">
			<tags:bibiscoThumbnailScene title="${scene.description}" position="${scene.position}" taskStatus="${scene.taskStatus}"
			characterCount="0" wordCount="0" id="${scene.idScene}" />
		</div>
   		
   		<c:if test="${scene.position>1 && scene.position % 4 == 1}">
   			</div>
   			</section>
   		</c:if>
   		