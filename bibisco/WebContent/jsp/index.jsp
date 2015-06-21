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
});

</script>

<c:if test="${empty project}">
	<%@ include file="start.jsp" %>
</c:if>
<c:if test="${not empty project}">
	<%@ include file="main.jsp" %>
</c:if>
</body>
</html>
