<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
	// init dialog callback
	function bibiscoAddImageInit(ajaxDialog, idCaller) {

		//add filesize validator
		$.validator.addMethod('filesize', function(value, element, param) {
		    // param = size (en bytes) 
		    // element = element to validate (<input>)
		    // value = value of the element (file name)
		    return this.optional(element) || (element.files[0].size <= param) 
		});
		
		$('#bibiscoAddImageForm').validate({
			rules : {
				bibiscoAddImageDescription : {
					maxlength : 50,
					required : true
				},
				document_file : {
					required : true,
					accept: "png|jpe?g|gif|bmp",
					filesize: 3145728
				}
			},
			messages: { document_file: '<fmt:message key="jsp.addImageForm.form.input.file.validationMessage" />' },
			highlight : function(label) {
				$(label).closest('.control-group').addClass('error');
			},
			
			onsubmit: true
		});
		
		$('#bibiscoAddImage').submit(function() {
			bibiscoAddImageSubmit();			
			return false;
		});

		$('#bibiscoAddImageASave').click(function() {
			bibiscoAddImageSubmit()
		});

		// tooltip
		$('#bibiscoAddImageASave').tooltip();
		$('#bibiscoAddImageAClose').tooltip();
		
		// init title value
		$('#bibiscoAddImageInputTitle').focus();
	}
	
	
	
	function bibiscoAddImageSubmit() {
		$('#bibiscoAddImageForm').submit();
	}
	
	
	// close dialog callback
	function bibiscoAddImageClose(ajaxDialog, idCaller) {
		$('#bibiscoAddImageAClose').tooltip('hide');
	}

	// before close dialog callback
	function bibiscoAddImageBeforeClose(ajaxDialog, idCaller) {

	}
	
	// add image callback
	function bibiscoAddImageCallback(idImage, imageDescription) {

		// get actual image number
		var actualImagesNumber = $('div.carousel-inner div.item').size();
		
		// html to append
		var imageToAppend = '<div class="active item"><div class="loadingImage" style="width: 810px; height: 500px; text-align:center; line-height:500px;  vertical-align: middle;"><img src="BibiscoServlet?action=getImage&idImage='+idImage+'" data-idimage="'+idImage+'"  /></div><div class="carousel-caption"><h4>'+imageDescription+'</h4></div></div>';
		
		// add image to carousel
		if (actualImagesNumber > 0) {
			$('div.carousel-inner div.active').removeClass('active');
		} else {
			bibiscoShowNotEmptyThumbnailListElements('images');
		}
		$('div.carousel-inner').append(imageToAppend);
		
		// close save button tooltip
		$('#bibiscoAddImageASave').tooltip('hide');
		
		// close dialog
		$('#bibiscoAddImageAClose').click();
	}
</script>

<div style="margin-top: 10px;">
	<form id="bibiscoAddImageForm" method="post" enctype="multipart/form-data" target="upload_target" action="BibiscoServlet">
		<input type="hidden" name="action" value="addImage">
		<input type="hidden" name="idElement" value="${param.idElement}">
		<input type="hidden" name="elementType" value="${param.elementType}">
		<div class="control-group">
			<label id="bibiscoAddImageInputTitleLabel" class="control-label" for="bibiscoAddImageInputTitle"><fmt:message key="jsp.addImageForm.label.imageName" /></label>
			<div class="controls">
				<input maxlength="50" type="text" class="span5" name="bibiscoAddImageDescription" id="bibiscoAddImageDescription">
			</div>
			<label id="bibiscoAddImageInputFileLabel" class="control-label" for="bibiscoAddImageInputFile"><fmt:message key="jsp.addImageForm.label.file" /></label>
			<div class="controls">
				<input width="50" class="span5" id="document_file" type="file" name="document_file" >
			</div>
		</div>
	</form>
</div>
<div class="bibiscoDialogFooter control-group">
	<table style="width: 100%">
		<tr>
			<td style="text-align: right;">
				<a id="bibiscoAddImageASave" title="<fmt:message key="jsp.common.button.save" />" class="btn btn-primary" style="margin-left: 5px;" href="#"><i	class="icon-ok icon-white"></i></a> 
				<a id="bibiscoAddImageAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" style="margin-left: 5px;" href="#"><i class="icon-remove"></i></a>
			</td>
		</tr>
	</table>
</div>
<iframe id="upload_target" name="upload_target" src="#" style="width:0;height:0;border:0px solid #fff;"></iframe> 