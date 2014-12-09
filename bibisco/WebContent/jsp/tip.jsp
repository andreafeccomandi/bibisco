<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>
<script type="text/javascript">

function bibiscoTipInit(idAjaxDialog, idCaller) {
			
	// tooltip
	$('#bibiscoTipAClose').tooltip();

	//don't tell me more button
	$('#bibiscoTipADontTellMeMore').click(function() {
		
		$.ajax({
            type : 'POST',
            url : 'BibiscoServlet?action=disableTip',
            data : {
            	tipCode : '${param.tipCode}'
            },
            beforeSend : function() {
                bibiscoOpenLoadingBanner();
            },
            success : function(data) {
                $('#bibiscoTipAClose').tooltip('hide');
                bibiscoCloseLoadingBannerSuccess();
                idAjaxDialog.close();
            },
            error : function() {
                bibiscoCloseLoadingBannerError();
            }
        });
	});
}

function bibiscoTipBeforeClose(idAjaxDialog, idCaller) {
	$('#bibiscoTipAClose').tooltip('hide');
}

function bibiscoTipClose(idAjaxDialog, idCaller) {
    
}

	
</script>

<div id="bibiscoTipDiv" style="width: 100%;" >
	<div class="bibiscoTip">
	<jsp:include page="tips/${param.tipCode}.jsp" />
	</div>
</div>

<div class="bibiscoDialogFooter control-group">
	<table style="width: 100%">
		<tr>
			<td style="text-align: right;">
				<a id="bibiscoTipADontTellMeMore" class="btn btn-primary" style="margin-left: 5px;" href="#"><fmt:message key="jsp.tip.button.donttellmemore" /></a>
				<a id="bibiscoTipAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" style="margin-left: 5px;" href="#"><i class="icon-remove"></i></a></td>
		</tr>
	</table>
</div>