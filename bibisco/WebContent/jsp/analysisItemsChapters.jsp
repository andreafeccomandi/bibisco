<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ page import="com.bibisco.manager.LocaleManager"%>
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
    	
    	// set table width
    	$('#bibiscoAnalysisCharactersChaptersDiv table').css('width', ${fn:length(chapters) * 27 + 120});
    	
    	// initialize scrollbar
    	$('#bibiscoAnalysisCharactersChaptersDiv').perfectScrollbar();
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
        <div class="bibiscoNotSelectableText bibiscoAnalysisNoInfoAvailable">
            <em><fmt:message key="jsp.analysisItemsChapters.em.noChapters" /></em>
        </div>
    </c:when>
    <c:when test="${empty items}">
        <div class="bibiscoNotSelectableText bibiscoAnalysisNoInfoAvailable">
            <em><fmt:message key="jsp.analysisItemsChapters.em.noItemAvailable.${itemType}" /></em>
        </div>
    </c:when>
    <c:when test="${empty characterItemPresence}">
        <div class="bibiscoNotSelectableText bibiscoAnalysisNoInfoAvailable">
            <em><fmt:message key="jsp.analysisItemsChapters.em.noItemPresenceAvailable.${itemType}" /></em>
        </div>
    </c:when>
    <c:otherwise>
        <div id="bibiscoAnalysisCharactersChaptersDiv" class="bibiscoAnalysisCharactersChapters bibiscoScrollable">
		    <table class="table table-striped table-bordered table-condensed" >
		        <thead>
		            <tr>
		                <th></th>
		                <c:forEach items="${chapters}" var="chapter" varStatus="chapterNumber">
		                    <th>${chapter.position}</th>
		                </c:forEach>
		            </tr>
		        </thead>
		        <tbody>
		            <c:forEach items="${items}" var="item" varStatus="itemNumber">
		            <tr>
		                <td>${item.analysisChapterPresenceItemDescription}</td>
		                <c:forEach items="${characterItemPresence[item.analysisChapterPresenceItemId]}" var="chapterPresence" varStatus="characterNumber">
		                    <c:choose>
			                    <c:when test="${chapterPresence}">
				                    <td class="bibiscoAnalysisItemsRow${itemNumber.count % 12}"></td>
			                    </c:when>
			                    <c:otherwise>
				                    <td></td>
			                    </c:otherwise>
		                    </c:choose>              
		                </c:forEach>
		            </tr>
		            </c:forEach>
		        </tbody>
		    </table>
		</div>
    </c:otherwise>
</c:choose>


<div class="bibiscoDialogFooter control-group">
	<table>
		<tr>
			<td><a id="bibiscoAnalysisCharactersChaptersAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" href="#"><i
					class="icon-remove"></i></a></td>
		</tr>
	</table>
</div>