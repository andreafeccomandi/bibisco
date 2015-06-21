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

<div id="bibiscoTipDiv">
	<div class="">
	<jsp:include page="tips/${param.tipCode}.jsp" />
	</div>
</div>

<div class="bibiscoDialogFooter control-group">
	<table>
		<tr>
			<td>
				<a id="bibiscoTipADontTellMeMore" class="btn btn-primary"href="#"><fmt:message key="jsp.tip.button.donttellmemore" /></a>
				<a id="bibiscoTipAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" href="#"><i class="icon-remove"></i></a>
			</td>
		</tr>
	</table>
</div>