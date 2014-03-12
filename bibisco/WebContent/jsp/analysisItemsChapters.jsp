<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.manager.LocaleManager>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
//<![CDATA[
                  
    <!-- INIT DIALOG CALLBACK -->
    function bibiscoThumbnailInitCallback(ajaxDialog, idCaller, type, id) {
    	
    	// close button
    	$('#bibiscoAnalysisCharactersChaptersAClose').tooltip();
    	
    	// set div height
    	$('#bibiscoAnalysisCharactersChaptersDiv').css('height', window.innerHeight - 200);
    	
    	// initialize scrollbar
		$('#bibiscoAnalysisCharactersChaptersDiv').jScrollPane({
			autoReinitialise: true, animateScroll: true, verticalGutter: 30
		}).data('jsp');
	
    }     
    
 	// close dialog callback
	function bibiscoThumbnailCloseCallback(ajaxDialog, idCaller, type) {
		// close button
    	$('#bibiscoAnalysisCharactersChaptersAClose').tooltip('hide');
    }
	
	// before close dialog callback
	function bibiscoThumbnailBeforeCloseCallback(ajaxDialog, idCaller, type) {
		
    }
	
//]]>           
</script>

<c:choose>
    <c:when test="${empty chapters}">
        <div class="notSelectableText bibiscoAnalysisNoInfoAvailable">
            <em><fmt:message key="jsp.analysisItemsChapters.em.noChapters" /></em>
        </div>
    </c:when>
    <c:when test="${empty items}">
        <div class="notSelectableText bibiscoAnalysisNoInfoAvailable">
            <em><fmt:message key="jsp.analysisItemsChapters.em.noItemAvailable.${itemType}" /></em>
        </div>
    </c:when>
    <c:when test="${empty characterItemPresence}">
        <div class="notSelectableText bibiscoAnalysisNoInfoAvailable">
            <em><fmt:message key="jsp.analysisItemsChapters.em.noItemPresenceAvailable.${itemType}" /></em>
        </div>
    </c:when>
    <c:otherwise>
        <div id="bibiscoAnalysisCharactersChaptersDiv" style="margin-top: 10px; width: 100%; overflow: scroll;">
		    <table style="width: ${fn:length(chapters) * 27 + 120}px; table-layout: fixed;" class="table table-striped table-bordered table-condensed" >
		        <thead>
		            <tr>
		                <th style="width:120px;"></th>
		                <c:forEach items="${chapters}" var="chapter" varStatus="chapterNumber">
		                    <th style="text-align: center; width: 15px;">${chapter.position}</th>
		                </c:forEach>
		            </tr>
		        </thead>
		        <tbody>
		            <c:forEach items="${items}" var="item" varStatus="itemNumber">
		            <tr>
		                <td style="width:120px; text-align: right">${item.analysisChapterPresenceItemDescription}</td>
		                <c:forEach items="${characterItemPresence[item.analysisChapterPresenceItemId]}" var="chapterPresence" varStatus="characterNumber">
		                    <td style="text-align: center; vertical-align: middle; width: 15px;">
		                    <c:if test="${chapterPresence}"><i class="icon-ok"></i></c:if>
		                    </td>
		                </c:forEach>
		            </tr>
		            </c:forEach>
		        </tbody>
		    </table>
		</div>
    </c:otherwise>
</c:choose>


<div class="bibiscoDialogFooter control-group">
	<table style="width: 100%">
		<tr>
			<td style="text-align: right;"><a id="bibiscoAnalysisCharactersChaptersAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" style="margin-left: 5px;" href="#"><i
					class="icon-remove"></i></a></td>
		</tr>
	</table>
</div>