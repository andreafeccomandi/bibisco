<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="tags" tagdir="/WEB-INF/tags"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>
	    		
   		<c:if test="${character.position>1 && character.position % 4 == 1}">
   			<section>
   			<div class="row-fluid">
   		</c:if>
   		
   		<div class="span3 thumbnailSlot" data-thumbnailFamily="${family}" data-slotPosition="${character.position}">
			<tags:bibiscoThumbnailCharacter title="${character.name}"  taskStatus="${character.taskStatus}" id="${character.idCharacter}" />
		</div>
   		
   		<c:if test="${character.position>1 && character.position % 4 == 1}">
   			</div>
   			</section>
   		</c:if>
