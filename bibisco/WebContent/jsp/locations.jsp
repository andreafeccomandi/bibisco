<script type="text/javascript">
$(function() {
	
	var config = {
		family: 'location',
		rowSlots: 4,
		init: function(position,config) { return bibiscoInitLocation(position,config)},
		select: function(position,config) { return bibiscoSelectLocation(position,config)},
		del: {
			confirmMessage: '<fmt:message key="jsp.locations.delete.confirm" />',
			deleteKoMessage: '<fmt:message key="jsp.locations.delete.ko" />'
		},
		dnd: true,
		titleForm : {
			titleMandatory: true,
			titleMinlength: 2,
			titleMaxlength: 50,
			titleValue: function() {
				return $('#bibiscoLocationSpanTitle').html();
			},
			updateTitle: function(title,id,config, position, area) {
				var titleComplete = title + '&nbsp;(' + area  + ')&nbsp;'; 
				$('#bibiscoLocationDialogTitle').html(titleComplete);
				bibiscoLocationButtonUpdateTitleInit(config, id, position);
				bibiscoGetThumbnailFromPosition(config.family, position).find('.bibiscoThumbnailLocationArea').html(area);
					
			},
			titleLabel: "<fmt:message key="jsp.locationTitle.form.title" />",
			updateTitleLabel: "<fmt:message key="jsp.location.dialog.title.updateTitle" />",
			tipCode : 'locationsdndTip'
		}
	};
	
	<c:if test="${not empty project.locationList}">
		bibiscoShowNotEmptyThumbnailListElements(config.family); 
		bibiscoInitAllThumbnail(config);
	</c:if>
	<c:if test="${empty project.locationList}">
		bibiscoShowEmptyThumbnailListElements(config.family); 
	</c:if>

	
	$('#bibiscoLocationsACreateLocation').click(function() {
		bibiscoCreateLocation(config);
	});
	$('#bibiscoLocationsACreateFirstLocation').click(function() {
		bibiscoCreateLocation(config);
	});
});

function bibiscoCreateLocation(config) {
	var position = bibiscoThumbnailCount('location') + 1;

	var ajaxDialogContent = { 
			  idCaller: 'bibiscoLocationsACreateLocation',
			  url: 'BibiscoServlet?action=startCreateLocation&position='+position,
			  title: '<fmt:message key="jsp.locations.dialog.title.createLocation" />', 
			  init: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormInit(idAjaxDialog, idCaller, config); },
			  close: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormClose(idAjaxDialog, idCaller); },
			  beforeClose: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormBeforeClose(idAjaxDialog, idCaller); },
			  resizable: false, modal: true, 
			  width: 500, height: 430, positionTop: 100
	  };
	  
	  bibiscoOpenAjaxDialog(ajaxDialogContent);
}

function bibiscoInitLocation(position,config) {
	
}

function bibiscoSelectLocation(position,config) {
	  
	  var idLocation = bibiscoGetThumbnailIdFromPosition(config.family, position);
	  var title = bibiscoGetThumbnailFromPosition(config.family, position).find('.bibiscoThumbnailTitle').html()
	  + '&nbsp;(' 
	  + bibiscoGetThumbnailFromPosition(config.family, position).find('.bibiscoThumbnailLocationArea').html()
	  + ')&nbsp;'; 

	  var ajaxDialogContent = { 
			  idCaller : 'bibiscoTagThumbnailLocationDiv'+idLocation,
			  url : 'BibiscoServlet?action=openLocation&idLocation='+idLocation,
			  id : idLocation,
			  type: 'location',
			  title: title, 
			  init: function (idAjaxDialog, idCaller, type, id) { return bibiscoLocationInitCallback(idAjaxDialog, idCaller, type, id, config); },
			  close: function (idAjaxDialog, idCaller, type, id) { return bibiscoLocationCloseCallback(idAjaxDialog, idCaller, type, id); },
			  beforeClose: function (idAjaxDialog, idCaller, type, id) { return bibiscoLocationBeforeCloseCallback(idAjaxDialog, idCaller, type, id); },
			  resizable: false, modal: true, 
			  width: 810, height: window.innerHeight - 75, positionTop: 25
	  };

	  bibiscoOpenAjaxDialog(ajaxDialogContent);
}

</script>

<div id="bibiscoLocationsDivLocationList">
<div class="row-fluid">
	<div class="span12">
		<div class="row-fluid page-header">
			<div class="span2">
				<h1><fmt:message key="jsp.locations.h1" /></h1>
    		</div>
    		<div class="span6">
    		</div>
    		<div class="span4 pagination-right">
    			<a id="bibiscoLocationsACreateLocation" class="btn btn-primary bibiscoHeaderButton" data-thumbnailFamily="location" href="#"><i class="icon-plus icon-white"></i><fmt:message key="jsp.locations.a.createLocation" /></a>
    		</div>
    	</div>
    	<div id="bibiscoLocationsDivEmptyLocations" data-thumbnailFamily="location" class="bibiscoEmptyThumbnailListElements">
			<tags:bibiscoEmptyThumbnailListBox text="jsp.locations.bibiscoEmptyThumbnailListBox.text" createButtonText="jsp.locations.a.createFirstLocation" createButtonId="bibiscoLocationsACreateFirstLocation"  />
		</div>	    	
    	<div class="bibiscoThumbnailPages bibiscoNotEmptyThumbnailListElements bibiscoLocationsNotEmptyThumbnailListElements bibiscoScrollable" data-thumbnailFamily="location" >
	    	<c:forEach items="${project.locationList}" var="location" varStatus="locationNumber">
	    		
	    		<c:if test="${locationNumber.count % 4 == 1}">
	    			<section>
	    			<div class="row-fluid">
	    		</c:if>
	    		
	    		<div class="span3 thumbnailSlot" data-thumbnailFamily="location" data-slotPosition="${location.position}">
					<tags:bibiscoThumbnailLocation title="${location.name}" area="${location.fullyQualifiedArea}" position="${location.position}" taskStatus="${location.taskStatus}" id="${location.idLocation}" />
				</div>
	    		
	    		<c:if test="${locationNumber.count % 4 == 0 || locationNumber.count == fn:length(project.locationList)}">
	    			</div>
	    			</section>
	    		</c:if>

	    	</c:forEach>
	    	<c:if test="${fn:length(project.locationList) == 0}">
	    		<section>
	    			<div class="row-fluid"></div>
	    		</section>
	    	</c:if>
    	</div>    	
    </div>
</div>
</div>
