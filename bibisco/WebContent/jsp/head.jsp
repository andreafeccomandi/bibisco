<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<meta charset="utf-8">

<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>
<c:set var="patternTimestamp" scope="session"><fmt:message key="pattern.timestamp" /></c:set>
<c:set var="version" value="<%=new java.util.Date().getTime()%>" scope="request"/>

<link rel="stylesheet" href="js/jqueryui/jquery-ui-1.8.16.custom.css?version=${version}" type="text/css" media="print, projection, screen" />
<link rel="stylesheet" href="js/bootstrap/css/bootstrap.css?version=${version}" type="text/css" media="print, projection, screen" />
<link rel="stylesheet" href="js/bootstrap/css/bootstrap-responsive.css?version=${version}" type="text/css" media="print, projection, screen" />
<link rel="stylesheet" href="js/bootstrap/css/docs.css?version=${version}" type="text/css" media="print, projection, screen" />
<link rel="stylesheet" href="js/bootstrap/bootstrap-datetimepicker/css/datetimepicker.css?version=${version}" type="text/css" media="print, projection, screen" />
<link rel="stylesheet" href="js/bootstrap/select2-3.4.3/select2.css?version=${version}" type="text/css" media="print, projection, screen" />
<link rel="stylesheet" href="js/bootstrap/bootstrap-switch/bootstrapSwitch.css?version=${version}" type="text/css" media="print, projection, screen" />
<link rel="stylesheet" href="js/fontawesome/font-awesome.css?version=${version}" type="text/css" media="print, projection, screen" />
<link rel="stylesheet" href="js/jqplot/jquery.jqplot.css?version=${version}" type="text/css" media="print, projection, screen" />
<link rel="stylesheet" href="css/bibisco.css?version=${version}" type="text/css" media="print, projection, screen" />
<link rel="stylesheet" href="js/perfect-scrollbar/perfect-scrollbar.css?version=${version}" type="text/css" media="print, projection, screen" />

<script type="text/javascript" src="js/jsMessages.jsp?version=${version}"></script>
<script type="text/javascript" src="js/jquery-1.7.2.min.js?version=${version}"></script>
<script type="text/javascript" src="js/jqueryui/jquery-ui-1.8.18.custom.min.js?version=${version}"></script> 
<script type="text/javascript" src="js/jquery.metadata.js?version=${version}"></script>
<script type="text/javascript" src="js/jquery.blockUI.js?version=${version}"></script>
<script type="text/javascript" src="js/jquery.validate/jquery.validate.js?version=${version}"></script>
<script type="text/javascript" src="js/bibisco.js?version=${version}"></script>
<script type="text/javascript" src="js/ckeditor/ckeditor.js?version=${version}"></script>
<script type="text/javascript" src="js/ckeditor/adapters/jquery.js?version=${version}"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-transition.js?version=${version}"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-alert.js?version=${version}"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-modal.js?version=${version}"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-dropdown.js?version=${version}"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-scrollspy.js?version=${version}"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-tab.js?version=${version}"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-tooltip.js?version=${version}"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-popover.js?version=${version}"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-button.js?version=${version}"></script>  
<script type="text/javascript" src="js/bootstrap/bootstrap-collapse.js?version=${version}"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-carousel.js?version=${version}"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-typeahead.js?version=${version}"></script>
<script type="text/javascript" src="js/bootstrap/select2-3.4.3/select2.min.js?version=${version}"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.js?version=${version}"></script>
<script type="text/javascript" src="js/bootstrap/bootstrap-switch/bootstrapSwitch.js?version=${version}"></script>
<script type="text/javascript" src="js/bootstrap/bootbox.js?version=${version}"></script>
<script type="text/javascript" src="js/jquery-dateFormat/jquery.dateFormat-1.0.js?version=${version}"></script>
<script type="text/javascript" src="js/jqplot/jquery.jqplot.js"></script>
<script type="text/javascript" src="js/jqplot/plugins/jqplot.barRenderer.js"></script>
<script type="text/javascript" src="js/jqplot/plugins/jqplot.canvasAxisLabelRenderer.js"></script>
<script type="text/javascript" src="js/jqplot/plugins/jqplot.canvasAxisTickRenderer.js"></script>
<script type="text/javascript" src="js/jqplot/plugins/jqplot.canvasTextRenderer.js"></script>
<script type="text/javascript" src="js/jqplot/plugins/jqplot.categoryAxisRenderer.js"></script>
<script type="text/javascript" src="js/jqplot/plugins/jqplot.dateAxisRenderer.js"></script>
<script type="text/javascript" src="js/jqplot/plugins/jqplot.pointLabels.js"></script>
<script type="text/javascript" src="js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>


<c:if test="${language != 'en'}">
	<script type="text/javascript" src="js/jquery.validate/jquery.validate-i18n/messages_${language}.js?version=${version}"></script>
	<script type="text/javascript" src="js/bootstrap/bootstrap-datetimepicker/locales/bootstrap-datetimepicker.${language}.js?version=${version}"></script>
</c:if>
