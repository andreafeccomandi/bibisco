<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="tags" tagdir="/WEB-INF/tags"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
	    		
   		<c:if test="${strand.position>1 && strand.position % 4 == 1}">
   			<section>
   			<div class="row-fluid">
   		</c:if>
   		
		<div class="span3 thumbnailSlot" data-thumbnailFamily="strand" data-slotPosition="${strand.position}">
			<tags:bibiscoThumbnailStrand title="${strand.name}" taskStatus="${strand.taskStatus}" id="${strand.idStrand}" />
		</div>
   		
   		<c:if test="${strand.position>1 && strand.position % 4 == 1}">
   			</div>
   			</section>
   		</c:if>
