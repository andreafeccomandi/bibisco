<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
//<![CDATA[
           
    var bibiscoRichTextEditor;    
           
    <!-- INIT DIALOG CALLBACK -->
    function bibiscostrandsInit(ajaxDialog, idCaller) {
    	
    	$('#bibiscoStrandsAddItem').hide();
    	var bibiscoTaskStatusSelector = bibiscoTaskStatusSelectorInit({value: '${Strands.taskStatus}', changeCallback: function() {  } });
    	
    	// save button
    	$('#bibiscoStrandsASave').click(function() {
    		saveStrands(ajaxDialog, idCaller, bibiscoTaskStatusSelector);
    	});	  
    	$('#bibiscoStrandsASave').tooltip();
    	$('#bibiscoStrandsAClose').tooltip();
	
    }     
    
 	// close dialog callback
	function bibiscostrandsClose(ajaxDialog, idCaller) {
		
    }
	
	// before close dialog callback
	function bibiscostrandsBeforeClose(ajaxDialog, idCaller) {
		
		$('#bibiscoStrandsAClose').tooltip('hide');

    }
	
   // save function
    function saveStrands(ajaxDialog, idCaller, bibiscoTaskStatusSelector) {
    	
    }
  
    
   function bibiscoTagThumbnailStrandInitAddItem() {

		$("#bibiscoTagThumbnailStrandDivAddItem").hover(
		  function () {
			  $('#bibiscoTagThumbnailStrandDivAddItem').addClass('thumbnailTagHover');
		  },
		  function () {
			  $("#bibiscoTagThumbnailStrandDivAddItem").removeClass('thumbnailTagHover');
		  }
		);
		
		$("#bibiscoTagThumbnailStrandDivAddItem").click(
		  function () {
	  
			  var ajaxDialogContent = { 
					  idCaller: 'bibiscoTagThumbnailStrandDiv${id}',
					  url : 'BibiscoServlet?action=openThumbnail&type=${type}&id=${id}',
					  title: '<fmt:message key="${title}" />', 
					  init: function (idAjaxDialog, idCaller) { return bibisco${type}Init(idAjaxDialog, idCaller); },
					  close: function (idAjaxDialog, idCaller) { return bibisco${type}Close(idAjaxDialog, idCaller); },
					  beforeClose: function (idAjaxDialog, idCaller) { return bibisco${type}BeforeClose(idAjaxDialog, idCaller); },
					  resizable: false, 
					  width: 500, height: 500, positionTop: 100
			  };
			  
			  bibiscoOpenAjaxDialog(ajaxDialogContent);
	       }
		);
	}
   
//]]>           
</script>


<%@ taglib prefix="tags" tagdir="/WEB-INF/tags"%>
<div class="bibiscoDialogContent" id="bibiscoStrands" data-firstSlotFree="7">
	<section style="margin-top: 10px;">
	<div class="row-fluid">
		<div class="span4 strandSlot" id="bibiscoStrandsDivItem1" data-slotPosition="1">
			<tags:bibiscoThumbnailStrand description="Trama principale" title="Principale" color="red" id="11" />
		</div>
		<div class="span4 strandSlot" id="bibiscoStrandsDivItem2" data-slotPosition="2">
			<tags:bibiscoThumbnailStrand description="Trama principale" title="Trama2" color="red" id="22" />
		</div>
		<div class="span4 strandSlot" id="bibiscoStrandsDivItem3" data-slotPosition="3">
			<tags:bibiscoThumbnailStrand description="Trama principale" title="Trama3" color="red" id="33" />
		</div>
	</div>
	</section>
	<section style="margin-top: 10px;">
	<div class="row-fluid">
		<div class="span4 strandSlot"  id="bibiscoStrandsDivItem4" data-slotPosition="4">
			<tags:bibiscoThumbnailStrand description="Trama principale" title="Trama4" color="red" id="44" />
		</div>
		<div class="span4 strandSlot"  id="bibiscoStrandsDivItem5" data-slotPosition="5">
			<tags:bibiscoThumbnailStrand description="Trama principale" title="Trama5" color="red" id="55" />
		</div>
		<div class="span4 strandSlot"  id="bibiscoStrandsDivItem6" data-slotPosition="6">
			<tags:bibiscoThumbnailStrand description="Trama principale" title="Trama6" color="red" id="66" />
		</div>
	</div>
	</section>	
</div>


<div class="bibiscoDialogFooter control-group">
	<table style="width: 100%">
		<tr>
			<td style="text-align: left;"><tags:bibiscoTaskStatusSelector /></td>
			<td style="text-align: right;"><a id="bibiscoStrandsASave" title="<fmt:message key="jsp.common.button.save" />" class="btn btn-primary" style="margin-left: 5px;" href="#"><i
					class="icon-ok icon-white"></i></a> <a id="bibiscoStrandsAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" style="margin-left: 5px;" href="#">
					<i class="icon-remove"></i></a></td>
		</tr>
	</table>
</div>

<div id="bibiscoStrandsAddItem">
	<div id="bibiscoTagThumbnailStrandDivAddItem" class="thumbnail" style="height: 100px;" data-bibiscoTagThumbnailStrandId="AddItem">
		<div class="caption">
			<div id="bibiscoTagThumbnailStrandDivAddItemPlus" style="height: 100%; text-align: center; font-size: 100px; font-weight: bolder; color: #F0F0F0; margin-top: -8px;"><i class="icon-sign-plus"></div>
		</div>
	</div>
</div>