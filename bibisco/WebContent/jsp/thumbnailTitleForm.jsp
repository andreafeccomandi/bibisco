<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.manager.LocaleManager" %>
<%@ taglib prefix="fmt" uri="/jstl/fmt" %>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
	// init dialog callback
	function bibiscoThumbnailTitleFormInit(ajaxDialog, idCaller, config) {

		$('#bibiscoThumbnailTitleFormInputTitleLabel').html(config.titleForm.titleLabel);
		
		$('#bibiscoThumbnailTitleForm').validate({
			rules : {
				bibiscoThumbnailTitleFormInputTitle : {
					minlength : config.titleForm.titleMinlength,
					maxlength : config.titleForm.titleMaxlength,
					required : config.titleForm.titleMandatory
				}
			},
			highlight : function(label) {
				$(label).closest('.control-group').addClass('error');
			},
			
			onsubmit: false
		});
		
		$('#bibiscoThumbnailTitleForm').submit(function() {
			bibiscoThumbnailTitleFormSubmit(ajaxDialog, config);			
			return false;
		});

		$('#bibiscoThumbnailTitleFormASave').click(function() {
			bibiscoThumbnailTitleFormSubmit(ajaxDialog, config)
		});

		// tooltip
		$('#bibiscoThumbnailTitleFormASave').tooltip();
		$('#bibiscoThumbnailTitleFormAClose').tooltip();
		
		// init title value
		$('#bibiscoThumbnailTitleFormInputTitle').val(config.titleForm.titleValue());
		$('#bibiscoThumbnailTitleFormInputTitle').focus();
		
		// set maxlength
		$('#bibiscoThumbnailTitleFormInputTitle').attr('maxlength', config.titleForm.titleMaxlength);
	}
	
	
	
	function bibiscoThumbnailTitleFormSubmit(ajaxDialog, config) {
		if ($('#bibiscoThumbnailTitleForm').valid()) {

			var title = $('#bibiscoThumbnailTitleFormInputTitle').val();
			
			<c:if test="${not empty param.position}">
				var position = ${param.position};
			</c:if>
			
			<c:if test="${empty param.position}">
				var position = -1;
			</c:if>
			
			<c:if test="${not empty param.idParent}">
				var idParent = ${param.idParent};
			</c:if>
			
			<c:if test="${empty param.idParent}">
				var idParent = -1;
			</c:if>
			
			<c:if test="${param.action == 'createThumbnail'}">
			
			$.ajax({
				type : 'POST',
				url : 'BibiscoServlet?action=thumbnailAction&thumbnailAction=create&family='+config.family,
				data : {
					title : title,
					position : position,
					idParent : idParent
				},
				beforeSend : function() {
					bibiscoOpenLoadingBanner();
				},
				success : function(data) {
					$('#bibiscoThumbnailTitleFormASave').tooltip('hide');
					bibiscoAddThumbnail(data, position,config);
					bibiscoCloseLoadingBannerSuccess();
					ajaxDialog.close();
				},
				error : function() {
					bibiscoCloseLoadingBannerError();
				}
			});
			
			</c:if>
			
			<c:if test="${param.action == 'changeThumbnailTitle'}">
			
			var id = ${param.id};

			$.ajax({
				type : 'POST',
				url : 'BibiscoServlet?action=thumbnailAction&thumbnailAction=changeTitle&family='+config.family,
				data : {
					title : title,
					id : id
				},
				beforeSend : function() {
					bibiscoOpenLoadingBanner();
				},
				success : function(data) {
					$('#bibiscoThumbnailTitleFormASave').tooltip('hide');
					var thumbnail = bibiscoGetThumbnailFromPosition(config.family, position);
					thumbnail.find('.bibiscoThumbnailTitle').html(title);
					if(config.titleForm.updateTitle) {
						config.titleForm.updateTitle(title,id, config, position);
					}
					bibiscoCloseLoadingBannerSuccess();
					ajaxDialog.close();
				},
				error : function() {
					bibiscoCloseLoadingBannerError();
				}
			});
			
			</c:if>
			
		}

	}
	
	
	// close dialog callback
	function bibiscoThumbnailTitleFormClose(ajaxDialog, idCaller) {
		$('#bibiscoThumbnailTitleFormAClose').tooltip('hide');
	}

	// before close dialog callback
	function bibiscoThumbnailTitleFormBeforeClose(ajaxDialog, idCaller) {

	}
</script>

<div class="bibiscoThumbnailTitleForm">
	<form id="bibiscoThumbnailTitleForm">
		<div class="control-group">
			<label id="bibiscoThumbnailTitleFormInputTitleLabel" class="control-label" for="bibiscoThumbnailTitleFormInputTitle"></label>
			<div class="controls">
				<input type="text" class="span5" name="bibiscoThumbnailTitleFormInputTitle" id="bibiscoThumbnailTitleFormInputTitle" maxlength="">
			</div>
		</div>
	</form>
</div>
<div class="bibiscoDialogFooter control-group">
	<table>
		<tr>
			<td>
			     <a id="bibiscoThumbnailTitleFormASave" title="<fmt:message key="jsp.common.button.save" />" class="btn btn-primary" href="#"><i class="icon-ok icon-white"></i></a> 
			     <a id="bibiscoThumbnailTitleFormAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" href="#"><i class="icon-remove"></i></a>
			</td>
		</tr>
	</table>
</div>