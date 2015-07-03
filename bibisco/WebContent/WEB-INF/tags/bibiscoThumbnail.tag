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
			  $("#bibiscoTagThumbnailDiv${type}${id}").addClass("bibiscoThumbnailTagHover");
		  },
		  function () {
			  $("#bibiscoTagThumbnailDiv${type}${id}").removeClass("bibiscoThumbnailTagHover");
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
					  resizable: false, modal: true, 
					  width: ${width}, height: ${height}, positionTop: ${positionTop}
			  };
			  
			  bibiscoOpenAjaxDialog(ajaxDialogContent);
	       }
		);
	});
	//
</script>

<div id="bibiscoTagThumbnailDiv${type}${id}" class="thumbnail bibiscoThumbnail">
	<div class="caption">
		<table>
		<tr class="bibiscoThumbnailHeader"><td><strong class="bibiscoThumbnailTitle"><fmt:message key="${title}" /></strong></td>
		<td>
		<tags:bibiscoTaskStatus bibiscoTaskStatus="${taskStatus}" />
		</td></tr>
		<tr class="bibiscoThumbnailSpacingSmall"><td colspan="2"></td></tr>
		<tr class="bibiscoThumbnailDescription"><td colspan="2"><fmt:message key="${description}" /></td></tr>
		</table>
	</div>		
</div>

