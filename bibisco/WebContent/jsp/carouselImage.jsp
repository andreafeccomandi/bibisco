<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
//<![CDATA[
        
    <!-- INIT DIALOG CALLBACK -->
    function bibiscoCarouselImageInitCallback(ajaxDialog, idCaller) {
    	
    	<c:if test="${empty images}">
			 bibiscoShowEmptyThumbnailListElements('images');
    	</c:if>
		<c:if test="${not empty images}">
			bibiscoShowNotEmptyThumbnailListElements('images')
    	</c:if>

    	 
    	// close button
    	$('#bibiscoCarouselImageAClose').tooltip();
    	
       	// add image button
    	$('#bibiscoCarouselImageAAddImage').click(function() {
    		bibiscoAddImage();
       	});
    	$('#bibiscoCarouselImageAAddFirstImage').click(function() {
    		bibiscoAddImage();
       	});
       	
    	// delete image button
    	$('#bibiscoCarouselImageADeleteCurrentImage').click(function() {
    		bibiscoConfirm('<fmt:message key="jsp.carouselImage.dialog.deleteCurrentImage.confirm" />', function(result) {
			    if (result) {
			    	// get id image to delete
			    	var idImage = $('div.carousel-inner div.active img').attr('data-idimage');
	
			    	// get actual image number
					var actualImagesNumber = $('div.carousel-inner div.item').size();
			    	
			    	$.ajax({
			    		  type: 'POST',
			    		  url: 'BibiscoServlet?action=deleteCurrentImage',
			    		  dataType: 'json',
			    		  data: { 	idImage: idImage
			    			  	},
			    		  beforeSend:function(){
			    			  bibiscoOpenLoadingBanner();
			    		  },
			    		  success:function(scene){
		    				  $('div.carousel-inner div.active').remove();
			    			  if (actualImagesNumber > 1) {
			    				  $('div.carousel-inner div.item:first').addClass('active');
			    			  } else {
			    				  bibiscoShowEmptyThumbnailListElements('images');
			    			  }
			    			  
			    			  bibiscoCloseLoadingBannerSuccess();
			    		  },
			    		  error:function(){
			    			  bibiscoCloseLoadingBannerError();
			    		  }
			    	});
			    } 
			});
       	});
    	
     	// disable automatic cycle
    	$('.carousel').carousel('pause');
     	
     	// remove loading icon after loading image
     	$('img').load(function() {
     		$(this).closest('div').removeClass('bibiscoLoadingImage');
     		$(this).closest('div').addClass('bibiscoCarouselImageBackground');
     	});
 	
    }     
    
    // add image
    function bibiscoAddImage() {
    	var ajaxDialogContent = { 
				  idCaller: 'bibiscoCarouselImageDivImages',
				  url: 'jsp/addImageForm.jsp?idElement=${idElement}&elementType=${elementType}',	    
				  title: '<fmt:message key="jsp.addImageForm.dialog.title" />', 
				  init: function (idAjaxDialog, idCaller) { return bibiscoAddImageInit(idAjaxDialog, idCaller); },
				  close: function (idAjaxDialog, idCaller) { return bibiscoAddImageClose(idAjaxDialog, idCaller); },
				  beforeClose: function (idAjaxDialog, idCaller) { return bibiscoAddImageBeforeClose(idAjaxDialog, idCaller); },
				  resizable: false, modal: true, 
				  width: 500, height: 300, positionTop: 100
  		};

  		bibiscoOpenAjaxDialog(ajaxDialogContent);
    }
    
  	// close dialog callback
	function bibiscoCarouselImageCloseCallback(ajaxDialog, idCaller) {
		$('#bibiscoCarouselImageAClose').tooltip('hide');
    }
	
	// before close dialog callback
	function bibiscoCarouselImageBeforeCloseCallback(ajaxDialog, idCaller) {
		
    }
	
	
	
//]]>           
</script>


<%@ taglib prefix="tags" tagdir="/WEB-INF/tags"%>

<div class="bibiscoDialogContent">
	
	<div data-thumbnailFamily="images" class="bibiscoEmptyThumbnailListElements">
	  <tags:bibiscoEmptyThumbnailListBox text="jsp.carouselImage.bibiscoEmptyThumbnailListBox.text" createButtonText="jsp.carouselImage.a.addFirstImage" createButtonId="bibiscoCarouselImageAAddFirstImage"  />
	</div>
	
	<div id="bibiscoCarouselImageDivImages" class="bibiscoNotEmptyThumbnailListElements" data-thumbnailFamily="images">
		
		<div id="bibiscoCarouselImageDivCarousel" class="carousel slide">
		  <!-- Carousel items -->
			<div class="carousel-inner">
				<c:forEach items="${images}" var="image" varStatus="imageNumber">
					<c:if test="${imageNumber.count == 1}">
						<div class="active item" >
					</c:if>
					<c:if test="${imageNumber.count > 1}">
						<div class="item">
					</c:if>
							<div class="bibiscoLoadingImage" style="width: 810px; height: 500px; text-align:center; 
							line-height:500px;  vertical-align: middle;">
								<img data-idimage="${image.idImage}" src="BibiscoServlet?action=getImage&idImage=${image.idImage}" style="display: inline;max-height: 500px; height: auto; max-width: 810px; width: auto;"/>
							</div>
							<div class="carousel-caption">
								<h4>${image.description}</h4>
							</div>
						</div>
				</c:forEach>
			</div>
			<!-- Carousel nav -->
		  <a class="carousel-control left" href="#bibiscoCarouselImageDivCarousel" data-slide="prev">&lsaquo;</a>
		  <a class="carousel-control right" href="#bibiscoCarouselImageDivCarousel" data-slide="next">&rsaquo;</a>
		</div>

		<div class="row-fluid">
			<div class="span12" style="text-align: right;">
	    		<a id="bibiscoCarouselImageAAddImage" class="btn btn-primary" href="#"><i class="icon-plus icon-white"></i>&nbsp;<fmt:message key="jsp.carouselImage.a.addImage" /></a>
	    		<a id="bibiscoCarouselImageADeleteCurrentImage" class="btn" style="margin-left: 5px;" href="#"><i class="icon-trash icon-white"></i>&nbsp;<fmt:message key="jsp.carouselImage.a.deleteCurrentImage" /></a>
	    	</div>
	    </div>
</div>
<div class="bibiscoDialogFooter control-group">
	<table style="width: 100%">
		<tr>
			<td style="text-align: right:;">
				<a id="bibiscoCarouselImageAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" style="margin-left: 5px;" href="#"><i class="icon-remove"> </i> </a>
			</td>
		</tr>
	</table>
</div>