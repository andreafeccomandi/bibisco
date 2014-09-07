<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
//<![CDATA[
                     
    function bibiscoAnalysisChaptersLengthInitGraph() {

    	$('#bibiscoAnalysisChaptersLengthChartDiv').css('width', innerWidth-320);
        $('#bibiscoAnalysisChaptersLengthChartDiv').css('height', innerHeight-180);
       
        var graphData = [];

        <c:if test="${not empty chapters}">
           <c:forEach items="${chapters}" var="chapter" varStatus="chapterNumber">
             var chapterItem = [];
             chapterItem.push(${chapter.position});
             chapterItem.push(${chapter.wordCount});
             graphData.push(chapterItem);
           </c:forEach>
        </c:if>
        
        var plot1 = $.jqplot('bibiscoAnalysisChaptersLengthChartDiv', [graphData], {

          seriesDefaults: {
              renderer:$.jqplot.BarRenderer,
              // Show point labels to the right ('e'ast) of each bar.
              // edgeTolerance of -15 allows labels flow outside the grid
              // up to 15 pixels.  If they flow out more than that, they 
              // will be hidden.
              pointLabels: { show: true, location: 'n' },
          },
          axesDefaults: {
              tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
              tickOptions: {
                fontSize: '10pt'
              }
          },
          pointLabels: { show: true },
          axes: {
              xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                label:'<fmt:message key="jsp.analysisChaptersLength.js.xaxis.label" />'
              },
              yaxis:{
                label:'<fmt:message key="jsp.analysisChaptersLength.js.yaxis.label" />', 
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer
              }
            }
        });
      }  
    
                  
    <!-- INIT DIALOG CALLBACK -->
    function bibiscoThumbnailInitCallback(ajaxDialog, idCaller, type, id) {
        
        // close button
        $('#bibiscoAnalysisChaptersLengthAClose').tooltip();
        
        // set div height
        $('#bibiscoAnalysisChaptersLengthDiv').css('height', window.innerHeight - 200);
                    
        // initialize graph
        bibiscoAnalysisChaptersLengthInitGraph();
    }     
    
    // close dialog callback
    function bibiscoThumbnailCloseCallback(ajaxDialog, idCaller, type) {
        // close button
        $('#bibiscoAnalysisChaptersLengthAClose').tooltip('hide');
    }
    
    // before close dialog callback
    function bibiscoThumbnailBeforeCloseCallback(ajaxDialog, idCaller, type) {
        
    }
    
//]]>           
</script>

<c:choose>
    <c:when test="${empty chapters}">
        <div class="notSelectableText bibiscoAnalysisNoInfoAvailable">
            <em><fmt:message key="jsp.analysisChaptersLength.em.noItemAvailable" /></em>
        </div>
    </c:when>
    <c:otherwise>
        <div id="bibiscoAnalysisChaptersLengthChartDiv"></div> 
    </c:otherwise>
</c:choose>



<div class="bibiscoDialogFooter control-group">
    <table style="width: 100%">
        <tr>
            <td style="text-align: right;"><a id="bibiscoAnalysisChaptersLengthAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" style="margin-left: 5px;" href="#"><i
                    class="icon-remove"></i></a></td>
        </tr>
    </table>
</div>