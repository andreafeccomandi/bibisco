<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.LocaleManager"%>
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
        <div class="notSelectableText bibiscoAnalysisNoInfoAvailable">
            <em><fmt:message key="jsp.analysisCharacterScene.em.noItemAvailable" /></em>
        </div>
    </c:when>
    <c:when test="${empty characterSceneAnalysis}">
        <div class="notSelectableText bibiscoAnalysisNoInfoAvailable">
            <em><fmt:message key="jsp.analysisItemsChaanalysisCharacterScenepters.em.noItemPresenceAvailable" /></em>
        </div>
    </c:when>
    <c:otherwise>
        <div id="bibiscoAnalysisCharacterSceneDiv" style="width: 100%; overflow: scroll;" class="notSelectableText">
		    <c:forEach items="${characters}" var="character" varStatus="characterNumber">
		        <h4 style="margin-top: 10px;">${character.name}</h4>
		        <c:if test="${empty characterSceneAnalysis[character.idCharacter]}">
		        <em><fmt:message key="jsp.analysisCharacterScene.noInfoAvailable"/></em>
		        </c:if>
		        <c:if test="${not empty characterSceneAnalysis[character.idCharacter]}">
		            <table style="width: 850px; table-layout: fixed;" class="table table-striped table-bordered table-condensed" >
		                <thead>
		                    <th style="width: 120px;"><fmt:message key="jsp.analysisCharacterScene.th.dateTime"/></th>
		                    <th style="width: 330px;"><fmt:message key="jsp.analysisCharacterScene.th.location"/></th>
		                    <th style="width: 200px;"><fmt:message key="jsp.analysisCharacterScene.th.scene"/></th>
		                    <th style="width: 200px;"><fmt:message key="jsp.analysisCharacterScene.th.chapter"/></th>       
		                </thead>
		                <tbody>
		                    <c:forEach items="${characterSceneAnalysis[character.idCharacter]}" var="characterScene" varStatus="characterSceneNumber">
		                    <tr>
		                        <td style="width: 120px;"><fmt:formatDate value="${characterScene.sceneDate}" pattern="${patternTimestamp}"/></td>
		                        <td style="width: 330px;"><c:out value="${characterScene.location}" /></td>
		                        <td style="width: 200px;"><c:out value="${characterScene.sceneDescription}" /></td>
		                        <td style="width: 200px;"><c:out value="${characterScene.chapterTitle}" /></td>
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
	<table style="width: 100%">
		<tr>
			<td style="text-align: right;"><a id="bibiscoAnalysisCharacterSceneAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" style="margin-left: 5px;" href="#"><i
					class="icon-remove"></i></a></td>
		</tr>
	</table>
</div>