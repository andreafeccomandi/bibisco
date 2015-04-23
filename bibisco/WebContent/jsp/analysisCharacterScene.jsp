<%@ page language="java" pageEncoding="UTF-8"%>
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
    	$('#bibiscoAnalysisCharacterSceneAClose').tooltip();
    	
    	// set div height
    	$('#bibiscoAnalysisCharacterSceneDiv').css('height', window.innerHeight - 200);
    	
    	// initialize scrollbar
		$('#bibiscoAnalysisCharacterSceneDiv').jScrollPane({
			autoReinitialise: true, animateScroll: true, verticalGutter: 30
		}).data('jsp');
	
    }     
    
 	// close dialog callback
	function bibiscoThumbnailCloseCallback(ajaxDialog, idCaller, type) {
		// close button
    	$('#bibiscoAnalysisCharacterSceneAClose').tooltip('hide');
    }
	
	// before close dialog callback
	function bibiscoThumbnailBeforeCloseCallback(ajaxDialog, idCaller, type) {
		
    }
	
//]]>           
</script>

<c:choose>
    <c:when test="${empty characters}">
        <div class="bibiscoNotSelectableText bibiscoAnalysisNoInfoAvailable">
            <em><fmt:message key="jsp.analysisCharacterScene.em.noItemAvailable" /></em>
        </div>
    </c:when>
    <c:when test="${empty characterSceneAnalysis}">
        <div class="bibiscoNotSelectableText bibiscoAnalysisNoInfoAvailable">
            <em><fmt:message key="jsp.analysisItemsChaanalysisCharacterScenepters.em.noItemPresenceAvailable" /></em>
        </div>
    </c:when>
    <c:otherwise>
        <div id="bibiscoAnalysisCharacterSceneDiv" class="bibiscoAnalysisCharacterScene bibiscoNotSelectableText">
		    <c:forEach items="${characters}" var="character" varStatus="characterNumber">
		        <h4>${character.name}</h4>
		        <c:if test="${empty characterSceneAnalysis[character.idCharacter]}">
		        <em><fmt:message key="jsp.analysisCharacterScene.noInfoAvailable"/></em>
		        </c:if>
		        <c:if test="${not empty characterSceneAnalysis[character.idCharacter]}">
		            <table class="table table-striped table-bordered table-condensed" >
		                <thead>
		                    <th class="bibiscoAnalysisCharacterSceneColSceneDate"><fmt:message key="jsp.analysisCharacterScene.th.dateTime"/></th>
		                    <th class="bibiscoAnalysisCharacterSceneColLocation"><fmt:message key="jsp.analysisCharacterScene.th.location"/></th>
		                    <th class="bibiscoAnalysisCharacterSceneSceneDescription"><fmt:message key="jsp.analysisCharacterScene.th.scene"/></th>
		                    <th class="bibiscoAnalysisCharacterSceneChapterPosition"><fmt:message key="jsp.analysisCharacterScene.th.chapter"/></th>       
		                </thead>
		                <tbody>
		                    <c:forEach items="${characterSceneAnalysis[character.idCharacter]}" var="characterScene" varStatus="characterSceneNumber">
		                    <tr>
		                        <td class="bibiscoAnalysisCharacterSceneColSceneDate"><fmt:formatDate value="${characterScene.sceneDate}" pattern="${patternTimestamp}"/></td>
		                        <td class="bibiscoAnalysisCharacterSceneColLocation"><c:out value="${characterScene.location}" /></td>
		                        <td class="bibiscoAnalysisCharacterSceneSceneDescription"><c:out value="${characterScene.sceneDescription}" /></td>
		                        <td class="bibiscoAnalysisCharacterSceneChapterPosition">#${characterScene.chapterPosition}&nbsp;<c:out value="${characterScene.chapterTitle}" /></td>
		                    </tr>
		                    </c:forEach>
		                </tbody>
		            </table>
		        </c:if>
		    </c:forEach>
		</div>
    </c:otherwise>
</c:choose>



<div class="bibiscoDialogFooter control-group">
	<table>
		<tr>
			<td><a id="bibiscoAnalysisCharacterSceneAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" href="#"><i
					class="icon-remove"></i></a></td>
		</tr>
	</table>
</div>