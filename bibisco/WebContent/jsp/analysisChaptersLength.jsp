<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
//<![CDATA[
        
    function bibiscoAnalysisChaptersLengthInitGraph() {
        plot2b = $.jqplot('bibiscoAnalysisChaptersLengthChartDiv', [[[9,1], [9,2], [6,3], [3,4]], [[5,1], [1,2], [3,3], [4,4]], [[4,1], [7,2], [1,3], [2,4]]], {
            seriesDefaults: {
                renderer:$.jqplot.BarRenderer,
                pointLabels: { show: true, location: 'e', edgeTolerance: -15 },
                shadowAngle: 135,
                rendererOptions: {
                    barDirection: 'horizontal'
                }
            },
            axes: {
                yaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer
                }
            }
        });
     
        $('#bibiscoAnalysisChaptersLengthChartDiv').bind('jqplotDataHighlight', 
            function (ev, seriesIndex, pointIndex, data) {
                $('#info2b').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data+ ', pageX: '+ev.pageX+', pageY: '+ev.pageY);
            }
        );    
        $('#bibiscoAnalysisChaptersLengthChartDiv').bind('jqplotDataClick', 
            function (ev, seriesIndex, pointIndex, data) {
                $('#info2c').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data+ ', pageX: '+ev.pageX+', pageY: '+ev.pageY);
            }
        );
             
        $('#bibiscoAnalysisChaptersLengthChartDiv').bind('jqplotDataUnhighlight', 
            function (ev) {
                $('#info2b').html('Nothing');
            }
        );
    }
	   
           
           
    <!-- INIT DIALOG CALLBACK -->
    function bibiscoThumbnailInitCallback(ajaxDialog, idCaller, type, id) {
    	
    	// close button
    	$('#bibiscoAnalysisChaptersLengthAClose').tooltip();
    	
    	// set div height
    	$('#bibiscoAnalysisChaptersLengthDiv').css('height', window.innerHeight - 200);
    	
    	// initialize scrollbar
		$('#bibiscoAnalysisChaptersLengthDiv').jScrollPane({
			autoReinitialise: true, animateScroll: true, verticalGutter: 30
		}).data('jsp');
    	
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
        <div id="bibiscoAnalysisChaptersLengthDiv2" style="width: 100%; overflow: scroll;" class="notSelectableText">
		   <div id="bibiscoAnalysisChaptersLengthChartDiv" style="height:400px;width:300px; "></div> 
		</div>
        
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