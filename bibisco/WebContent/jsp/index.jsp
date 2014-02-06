<!DOCTYPE html>
<html lang="en">
<head>
<title>bibisco</title>
<%@ include file="head.jsp" %>
</head>

<body style="height: 100%; overflow: hidden;">
<%@ taglib prefix="c" uri="/jstl/core"%>

<script type="text/javascript">
$(function() {
	
	// set body height: this is necessary to avoid strange behaviours of dialog dragged outside body height
	$('body').css('height', window.innerHeight-50);
	
	// disable drag on all button, img, anchor elements
	$(document).on('dragstart', '.btn, img, a', function(event) { event.preventDefault(); });

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
