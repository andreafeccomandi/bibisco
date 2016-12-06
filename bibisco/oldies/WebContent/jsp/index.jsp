<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
<title>bibisco</title>
<%@ include file="head.jsp" %>
</head>

<body class="bibiscoIndexBody">
<%@ taglib prefix="c" uri="/jstl/core"%>

<script type="text/javascript">
$(function() {
	// set body height: this is necessary to avoid strange behaviours of dialog dragged outside body height
	$('body').css('height', window.innerHeight-50);
	
	// disable drag on all button, img, anchor elements
	$(document).on('dragstart', '.btn, img, a', function(event) { event.preventDefault(); });
	
	// disable open modal dialog by xulrunner to avoid message 'This document cannot be displayed while offline. To go online, uncheck Work Offline from the File menu.'
	//$(window).addEventListener('DOMWillOpenModalDialog',function(e){ e.preventDefault(); }, true);

	// disable text selection on CTRL+A  
    $(document).keydown(function(objEvent) {
    	if (objEvent.ctrlKey) {
        	if ($(objEvent.target).not('input')){
            	if (objEvent.keyCode == 65 || objEvent.keyCode == 97) {                         
                	objEvent.preventDefault();
            	}
            }
        }
    });
	
});

</script>
<c:choose>
<c:when test="${firstAccess}">
	<%@ include file="welcome.jsp" %>
</c:when>
<c:when test="${empty project}">
	<%@ include file="start.jsp" %>
</c:when>
<c:otherwise>
	<%@ include file="main.jsp" %>
</c:otherwise>

</c:choose>


</body>
</html>
