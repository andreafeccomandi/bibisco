<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
	// init dialog callback
	function bibiscoThumbnailTitleFormInit(ajaxDialog, idCaller, config) {
		
		$('#bibiscoThumbnailTitleForm').validate({
			rules : {
				bibiscoLocationTitleFormInputNation : {
					maxlength : 30
				},
				bibiscoLocationTitleFormInputState : {
					maxlength : 30
				},
				bibiscoLocationTitleFormInputCity : {
					maxlength : 30
				},
				bibiscoThumbnailTitleFormInputTitle : {
					maxlength : 50,
					required : true
				},
			},
			highlight : function(label) {
				$(label).closest('.control-group').addClass('error');
			},

			onsubmit: true
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
	}
	
	
	
	function bibiscoThumbnailTitleFormSubmit(ajaxDialog, config) {
		if ($('#bibiscoThumbnailTitleForm').valid()) {

			var title = $('#bibiscoThumbnailTitleFormInputTitle').val();
			
			<c:if test="${not empty position}">
				var position = ${position};
			</c:if>
			
			<c:if test="${empty position}">
				var position = -1;
			</c:if>
			
			<c:if test="${action == 'createThumbnail'}">
			
			$.ajax({
				type : 'POST',
				url : 'BibiscoServlet?action=thumbnailAction&thumbnailAction=create&family='+config.family,
				data : {
					title : title,
					position : position,
					nation: $.trim($('#bibiscoLocationTitleFormInputNation').val()),
					state: $.trim($('#bibiscoLocationTitleFormInputState').val()),
					city: $.trim($('#bibiscoLocationTitleFormInputCity').val())
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
			
			<c:if test="${action == 'changeThumbnailTitle'}">
			
			var idLocation = $('#bibiscoLocationTitleFormInputIdLocation').val();
			
			$.ajax({
				type : 'POST',
				url : 'BibiscoServlet?action=thumbnailAction&thumbnailAction=changeTitle&family='+config.family,
				data : {
					idLocation : idLocation,
					title : title,
					position : position,
					nation: $.trim($('#bibiscoLocationTitleFormInputNation').val()),
					state: $.trim($('#bibiscoLocationTitleFormInputState').val()),
					city: $.trim($('#bibiscoLocationTitleFormInputCity').val())
				},
				beforeSend : function() {
					bibiscoOpenLoadingBanner();
				},
				success : function(data) {
					$('#bibiscoThumbnailTitleFormASave').tooltip('hide');
					var thumbnail = bibiscoGetThumbnailFromPosition(config.family, position);
					thumbnail.find('.bibiscoThumbnailTitle').html(title);
					if(config.titleForm.updateTitle) {
						config.titleForm.updateTitle(title, idLocation, config, position, data.fullyQualifiedArea);
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

<div class="bibiscoLocationTitleForm">
	<form id="bibiscoThumbnailTitleForm">
		<input type="hidden" id="bibiscoLocationTitleFormInputIdLocation" name="bibiscoLocationTitleFormInputIdLocation" value="${location.idLocation}" />
		<div class="control-group">
			<label id="bibiscoLocationTitleFormInputNationLabel" class="control-label" for="bibiscoLocationTitleFormInputNation"><fmt:message key="jsp.locationsTitleForm.label.nation" /></label>
			<div class="control">
				<input type="text" class="span5" name="bibiscoLocationTitleFormInputNation" tabindex="1"
				value="<c:out value="${location.nation}"></c:out>" maxlength="30"
				id="bibiscoLocationTitleFormInputNation" data-provide="typeahead" data-source="${nations}">
			</div>
			<label id="bibiscoLocationTitleFormInputStateLabel" class="control-label" for="bibiscoLocationTitleFormInputState"><fmt:message key="jsp.locationsTitleForm.label.state" /></label>
			<div class="control">
				<input type="text" class="span5" tabindex="2" name="bibiscoLocationTitleFormInputState" 
				value="<c:out value="${location.state}"></c:out>" maxlength="30"
				id="bibiscoLocationTitleFormInputState" data-provide="typeahead" data-source="${states}">
			</div>
			<label id="bibiscoLocationTitleFormInputCityLabel" class="control-label" for="bibiscoLocationTitleFormInputCity"><fmt:message key="jsp.locationsTitleForm.label.city" /></label>
			<div class="controls">
				<input type="text" class="span5" tabindex="3" name="bibiscoLocationTitleFormInputCity" 
				value="<c:out value="${location.city}"></c:out>" maxlength="30"
				id="bibiscoLocationTitleFormInputCity" data-provide="typeahead" data-source="${cities}">
			</div>
			<label id="bibiscoThumbnailTitleFormInputTitleLabel" class="control-label" for="bibiscoThumbnailTitleFormInputTitle"><fmt:message key="jsp.locationsTitleForm.label.location" /></label>
			<div class="control">
				<input type="text" class="span5" tabindex="4" name="bibiscoThumbnailTitleFormInputTitle" 
				value="<c:out value="${location.name}"></c:out>" maxlength="50"
				id="bibiscoThumbnailTitleFormInputTitle">
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