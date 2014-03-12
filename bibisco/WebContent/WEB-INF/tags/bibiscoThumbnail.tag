<%@tag import="com.bibisco.manager.LocaleManager"%>
<%@ attribute name="id" required="true" type="java.lang.String" rtexprvalue="true" %>
<%@ attribute name="type" required="true" type="java.lang.String" rtexprvalue="true" %>
<%@ attribute name="title" required="true" type="java.lang.String" rtexprvalue="true" %>
<%@ attribute name="description" required="true" type="java.lang.String" rtexprvalue="true" %>
<%@ attribute name="positionTop" required="true" type="java.lang.String" rtexprvalue="true" %>
<%@ attribute name="width" required="true" type="java.lang.String" rtexprvalue="true" %>
<%@ attribute name="height" required="true" type="java.lang.String" rtexprvalue="true" %>
<%@ attribute name="taskStatus" required="true" type="com.bibisco.enums.TaskStatus" rtexprvalue="true" %>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="tags" tagdir="/WEB-INF/tags"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>
    
<script type="text/javascript">
	//         
	$(function() {
		
		$("#bibiscoTagThumbnailDiv${type}${id}").hover(
		  function () {
			  $("#bibiscoTagThumbnailDiv${type}${id}").addClass("thumbnailTagHover");
		  },
		  function () {
			  $("#bibiscoTagThumbnailDiv${type}${id}").removeClass("thumbnailTagHover");
		  }
		);
		
		$("#bibiscoTagThumbnailDiv${type}${id}").click(
		  function () {
	  
			  var ajaxDialogContent = { 
					  idCaller: 'bibiscoTagThumbnailDiv${type}${id}',
					  url : 'BibiscoServlet?action=thumbnailAction&thumbnailAction=open&family=${type}&id=${id}&description=${description}&title=${title}',
					  title: "<fmt:message key="${title}" />", 
					  type: '${type}',
					  id: '${id}',
					  init: function (idAjaxDialog, idCaller, type, id) { return bibiscoThumbnailInitCallback(idAjaxDialog, idCaller, type, id); },
					  close: function (idAjaxDialog, idCaller, type, id) { return bibiscoThumbnailCloseCallback(idAjaxDialog, idCaller, type, id); },
					  beforeClose: function (idAjaxDialog, idCaller, type, id) { return bibiscoThumbnailBeforeCloseCallback(idAjaxDialog, idCaller, type, id); },
					  resizable: false, 
					  width: ${width}, height: ${height}, positionTop: ${positionTop}
			  };
			  
			  bibiscoOpenAjaxDialog(ajaxDialogContent);
	       }
		);
	});
	//
</script>

<div id="bibiscoTagThumbnailDiv${type}${id}" class="thumbnail" style="height: 100px;">
	<div class="caption">
		<table style="width: 100%">
		<tr><td style="text-align: left;"><strong><fmt:message key="${title}" /></strong></td>
		<td style="text-align: right;">
		<tags:bibiscoTaskStatus bibiscoTaskStatus="${taskStatus}" />
		</td></tr>
		<tr><td colspan="2" style="height: 10px;"></td></tr>
		<tr><td colspan="2" style="height: 52px; vertical-align: top;"><fmt:message key="${description}" /></td></tr>
		</table>
	</div>		
</div>

