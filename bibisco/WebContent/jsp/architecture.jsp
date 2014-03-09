<script type="text/javascript">
$(function() {
	
	var config = {
		family: 'strand',
		rowSlots: 4,
		init: function(position,config) { },
		select: function(position,config) { return bibiscoSelectStrand(position,config)},
		del: {
			confirmMessage: '<fmt:message key="jsp.architecture.strand.delete.confirm" />',
			deleteKoMessage: '<fmt:message key="jsp.architecture.strand.delete.ko" />'
		},
		dnd: true,
		titleForm : {
			titleMinlength: 2,
			titleMaxlength: 50,
			titleValue: function() {
                return $.trim($('#bibiscoStrandDialogTitle').text());
            },
			updateTitle: function(title,id,config, position) {
				$('#bibiscoStrandDialogTitle').html(title);
				bibiscoStrandButtonUpdateTitleInit(config, id, position);
			},
			titleLabel: "<fmt:message key="jsp.architecture.strandTitle.form.title" />",
			updateTitleLabel: "<fmt:message key="jsp.architecture.strand.dialog.title.updateTitle" />"
		}
	};

	<c:if test="${not empty project.architecture.strandList}">
		bibiscoShowNotEmptyThumbnailListElements(config.family); 
		bibiscoInitAllThumbnail(config);
	</c:if>
	<c:if test="${empty project.architecture.strandList}">
		bibiscoShowEmptyThumbnailListElements(config.family); 
	</c:if>
	
	$('#bibiscoStrandACreateStrand').click(function() {
		bibiscoCreateStrand(config);
	});
	
	$('#bibiscoStrandsACreateFirstStrand').click(function() {
		bibiscoCreateStrand(config);
	});
});

function bibiscoCreateStrand(config) {
	var position = bibiscoThumbnailCount('strand') + 1;

	var ajaxDialogContent = { 
		  idCaller: 'bibiscoStrandACreateStrand',
		  url: 'jsp/thumbnailTitleForm.jsp?action=createThumbnail&position='+position,
		  title: '<fmt:message key="jsp.architecture.strand.dialog.title.createStrand" />', 
		  init: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormInit(idAjaxDialog, idCaller, config); },
		  close: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormClose(idAjaxDialog, idCaller); },
		  beforeClose: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormBeforeClose(idAjaxDialog, idCaller); },
		  resizable: false, 
		  width: 500, height: 210, positionTop: 100
	  };
	  
	  bibiscoOpenAjaxDialog(ajaxDialogContent);
}

function bibiscoSelectStrand(position,config) {
	  
	  var idStrand = bibiscoGetThumbnailIdFromPosition(config.family, position);
	  var title = bibiscoGetThumbnailFromPosition(config.family, position).find('.bibiscoThumbnailTitle').html();

	  var ajaxDialogContent = { 
			  idCaller : 'bibiscoTagThumbnailStrandDiv'+idStrand,
			  url : 'BibiscoServlet?action=openStrand&idStrand='+idStrand,
			  id : idStrand,
			  type: 'strand',
			  title: title, 
			  init: function (idAjaxDialog, idCaller, type, id) { return bibiscoStrandInitCallback(idAjaxDialog, idCaller, type, id, config); },
			  close: function (idAjaxDialog, idCaller, type, id) { return bibiscoStrandCloseCallback(idAjaxDialog, idCaller, type, id); },
			  beforeClose: function (idAjaxDialog, idCaller, type, id) { return bibiscoStrandBeforeCloseCallback(idAjaxDialog, idCaller, type, id); },
			  resizable: false, 
			  width: 810, height: window.innerHeight - 75, positionTop: 25
	  };

	  bibiscoOpenAjaxDialog(ajaxDialogContent);
}
</script>

<div class="row-fluid">
	<div class="span12">
		<div class="row-fluid">
			<div class="span12 page-header">
    			<h1><fmt:message key="jsp.architecture.h1"/></h1>
    		</div>
    	</div>
    	<div class="row-fluid">
			<div class="span3">
				<tags:bibiscoThumbnail 
					description="jsp.architecture.thumbnail.premise.description" 
					title="jsp.architecture.thumbnail.premise.title" 
					type="architectureItem" taskStatus="${project.architecture.premiseTaskStatus}"
					id="PREMISE"
					width="810" height="window.innerHeight - 75" positionTop="25" />
			</div>
			<div class="span3">
				<tags:bibiscoThumbnail 
					description="jsp.architecture.thumbnail.fabula.description" 
					title="jsp.architecture.thumbnail.fabula.title" 
					type="architectureItem" taskStatus="${project.architecture.fabulaTaskStatus}"
					id="FABULA"
					width="810" height="window.innerHeight - 75" positionTop="25" />
			</div>
			<div class="span3">
				<tags:bibiscoThumbnail 
					description="jsp.architecture.thumbnail.setting.description" 
					title="jsp.architecture.thumbnail.setting.title" 
					type="architectureItem" taskStatus="${project.architecture.settingTaskStatus}"
					id="SETTING"
					width="810" height="window.innerHeight - 75" positionTop="25" />
			</div>
		</div>
	</div>
</div>

<div class="row-fluid page-header" style="margin-top: 50px;">
	<div class="span9">
		<h2><fmt:message key="jsp.architecture.strands.h2" /><small>&nbsp;&nbsp;&nbsp;<fmt:message key="jsp.architecture.strands.h2.small" /></small></h2>
  		</div>
  		<div class="span3" style="text-align: right;">
  			<a id="bibiscoStrandACreateStrand" class="btn btn-primary notEmptyThumbnailListElements" data-thumbnailFamily="strand" style="margin-top: 2px;" href="#"><i class="icon-plus icon-white"></i><fmt:message key="jsp.architecture.a.createStrand" /></a>
  		</div>
</div>
<div id="bibiscoStrandsDivEmptyStrands" data-thumbnailFamily="strand" class="emptyThumbnailListElements">
	<tags:bibiscoEmptyThumbnailListBox text="jsp.architecture.bibiscoEmptyThumbnailListBoxStrands.text" createButtonText="jsp.strands.a.createFirstStrand" createButtonId="bibiscoStrandsACreateFirstStrand"  />
</div>
<div id="bibiscoStrandsDivNotEmptyStrands" class="bibiscoThumbnailPages notEmptyThumbnailListElements" data-thumbnailFamily="strand" style="width: 100%; height: 350px; overflow: scroll;">
	    	<c:forEach items="${project.architecture.strandList}" var="strand" varStatus="strandNumber">
	    		
	    		<c:if test="${strandNumber.count % 4 == 1}">
	    			<section>
	    			<div class="row-fluid">
	    		</c:if>
	    		
	    		<div class="span3 thumbnailSlot" data-thumbnailFamily="strand" data-slotPosition="${strand.position}">
					<tags:bibiscoThumbnailStrand title="${strand.name}" taskStatus="${strand.taskStatus}" id="${strand.idStrand}" />
				</div>
	    		
	    		<c:if test="${strandNumber.count % 4 == 0 || strandNumber.count == fn:length(project.architecture.strandList)}">
	    			</div>
	    			</section>
	    		</c:if>

	    	</c:forEach>
	    	<c:if test="${fn:length(project.architecture.strandList) == 0}">
	    		<section>
	    			<div class="row-fluid"></div>
	    		</section>
	    	</c:if>
    	</div> 

			
		