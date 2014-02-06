<%@ page language="java" contentType="text/html; charset=utf-8"%>
<meta charset="utf-8">

<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<c:set var="patternTimestamp" scope="session"><fmt:message key="pattern.timestamp" /></c:set>

<c:if test="${initParam.applicationMode == 'production'}">
	<c:set var="version" value="${initParam.applicationVersion}" scope="request"/>
</c:if>
<c:if test="${initParam.applicationMode != 'production'}">
	<c:set var="version" value="<%=new java.util.Date().getTime()%>" scope="request"/>
</c:if>

<link rel="stylesheet" href="js/jqueryui/jquery-ui-1.8.16.custom.css?version=${version}" type="text/css" media="print, projection, screen" />
<link rel="stylesheet" href="js/bootstrap/css/bootstrap.css?version=${version}" type="text/css" media="print, projection, screen" />
<link rel="stylesheet" href="js/bootstrap/css/bootstrap-responsive.css?version=${version}" type="text/css" media="print, projection, screen" />
<link rel="stylesheet" href="js/bootstrap/css/docs.css?version=${version}" type="text/css" media="print, projection, screen" />
<link rel="stylesheet" href="js/bootstrap/bootstrap-datetimepicker/css/datetimepicker.css?version=${version}" type="text/css" media="print, projection, screen" />
<link rel="stylesheet" href="js/bootstrap/select2-3.4.3/select2.css?version=${version}" type="text/css" media="print, projection, screen" />
<link rel="stylesheet" href="js/bootstrap/bootstrap-switch/bootstrapSwitch.css?version=${version}" type="text/css" media="print, projection, screen" />
<link rel="stylesheet" href="js/fontawesome/font-awesome.css?version=${version}" type="text/css" media="print, projection, screen" />
<link rel="stylesheet" href="js/jscrollpane/jquery.jscrollpane.css?version=${version}" type="text/css" media="print, projection, screen" />
<link rel="stylesheet" href="css/bibisco.css?version=${version}" type="text/css" media="print, projection, screen" />


<script type="text/javascript" src="js/jsMessages.jsp?version=${version}"></script>
<script type="text/javascript" src="js/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="js/jqueryui/jquery-ui-1.8.18.custom.min.js"></script> 
<script type="text/javascript" src="js/jquery.metadata.js"></script>
<script type="text/javascript" src="js/jquery.blockUI.js"></script>
<script type="text/javascript" src="js/jquery.validate/jquery.validate.js"></script>
<script type="text/javascript" src="js/bibisco.js?version=${version}"></script>
<script type="text/javascript" src="js/ckeditor/ckeditor.js"></script>
<script type="text/javascript" src="js/ckeditor/adapters/jquery.js"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-transition.js"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-alert.js"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-modal.js"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-dropdown.js"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-scrollspy.js"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-tab.js"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-tooltip.js"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-popover.js?version=${version}"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-button.js"></script>  
<script type="text/javascript" src="js/bootstrap/bootstrap-collapse.js"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-carousel.js"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-typeahead.js"></script>
<script type="text/javascript" src="js/bootstrap/select2-3.4.3/select2.min.js"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.js"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-switch/bootstrapSwitch.js"></script>
<script type="text/javascript" src="js/bootstrap/bootbox.js"></script>
<script type="text/javascript" src="js/jscrollpane/jquery.jscrollpane.min.js"></script>
<script type="text/javascript" src="js/jscrollpane/jquery.mousewheel.js"></script>
<script type="text/javascript" src="js/jquery-dateFormat/jquery.dateFormat-1.0.js"></script>


<c:if test="${language != 'en'}">
	<script type="text/javascript" src="js/jquery.validate/jquery.validate-i18n/messages_${language}.js"></script>
	<script type="text/javascript" src="js/bootstrap/bootstrap-datetimepicker/locales/bootstrap-datetimepicker.${language}.js"></script>
</c:if>
