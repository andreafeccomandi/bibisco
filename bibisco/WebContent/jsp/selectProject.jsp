<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
	// init dialog callback
	function bibiscoSelectProjectInit(ajaxDialog, idCaller) {
	
		// tooltip
		$('#bibiscoSelectProjectFormAClose').tooltip();
		
		// open button
		$('.openButton').click(function() {
			
			var idProject = $(this).attr('data-idproject');
			
			$.ajax({
				type : 'POST',
				url : 'BibiscoServlet?action=openProject',
				data : {
					idProject : idProject
				},
				beforeSend : function() {
					bibiscoBlockUI();
					bibiscoOpenLoadingBanner();
				},
				success : function(data) {
					$('body').html(data);
					bibiscoCloseLoadingBannerSuccess();
					ajaxDialog.close();
				},
				error : function() {
					bibiscoCloseLoadingBannerError();
				}
			});
		});
		$('.openButton').tooltip();
		
		// delete button
		$('.deleteButton').click(function() {
			var idProject = $(this).attr('data-idproject');
			var tr = $(this).closest('tr');
			bibiscoConfirm('<fmt:message key="jsp.selectProject.delete.confirm" />', function(result) {
			    if (result) {
			    	$.ajax({
						type : 'POST',
						url : 'BibiscoServlet?action=deleteProject',
						data : {
							idProject : idProject
						},
						beforeSend : function() {
							bibiscoOpenLoadingBanner();
						},
						success : function(data) {
							tr.remove();
							bibiscoCloseLoadingBannerSuccess();						
						},
						error : function() {
							bibiscoCloseLoadingBannerError();
						}
					});
			    } 
			});
		});
		$('.deleteButton').tooltip();
		
		
		// initialize scrollbar
		$('#bibiscoSelectProjectDiv').jScrollPane({
			autoReinitialise: true, animateScroll: true, verticalGutter: 30
		}).data('jsp');
	}
	
	// close dialog callback
	function bibiscoSelectProjectClose(ajaxDialog, idCaller) {
		$('#bibiscoSelectProjectFormAClose').tooltip('hide');
	}

	// before close dialog callback
	function bibiscoSelectProjectBeforeClose(ajaxDialog, idCaller) {

	}
</script>

<div id="bibiscoSelectProjectDiv" style="margin-top: 10px; overflow: scroll; width: 100%; height: 250px;">
	<table style="width: 465px; margin-left: 15px;" class="table table-striped table-bordered">
  		<tbody>
  			<c:forEach items="${projectList}" var="project" varStatus="projectNumber">
    		<tr>
      			<td>
				<span style="display: inline-block; width: 360px;"><c:out value="${project.name}" /></span>
      			<a data-idproject="${project.idProject}" title="<fmt:message key="jsp.selectProject.button.open" />" class="btn btn-primary openButton" style="margin-left: 5px;" href="#">
      			<i class="icon-folder-open"></i></a>
      			<a data-idproject="${project.idProject}" title="<fmt:message key="jsp.common.button.delete" />" class="btn deleteButton" style="margin-left: 5px;" href="#">
      			<i class="icon-trash"></i></a>
      			</td>
    		</tr>
    		</c:forEach>
  		</tbody>
	</table>
</div>


<div class="bibiscoDialogFooter control-group">
	<table style="width: 100%">
		<tr>
			<td style="text-align: right;"><a id="bibiscoSelectProjectFormAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" style="margin-left: 5px;" href="#"><i
					class="icon-remove"></i></a></td>
		</tr>
	</table>
</div>