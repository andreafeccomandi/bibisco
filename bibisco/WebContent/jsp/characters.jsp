<script type="text/javascript">
$(function() {
	
	var config = {
		family: 'maincharacter',
		rowSlots: 4,
		init: function(position,config) { },
		select: function(position,config) { return bibiscoSelectMainCharacter(position,config)},
		del: {
			confirmMessage: '<fmt:message key="jsp.characters.delete.confirm" />',
			deleteKoMessage: '<fmt:message key="jsp.characters.delete.ko" />'
		},
		dnd: true,
		titleForm : {
			titleMandatory: true,
			titleMinlength: 2,
			titleMaxlength: 50,
			titleValue: function() {
				return $('#bibiscoCharacterSpanTitle').html();	
			}, 
			updateTitle: function(title,id,config, position) {
				$('#bibiscoCharacterSpanTitle').html(title);
			},
			titleLabel: "<fmt:message key="jsp.characterTitle.form.title" />",
			updateTitleLabel: "<fmt:message key="jsp.character.dialog.title.updateTitle" />",
			tipCode : 'charactersdndTip'
		}
	};
	<c:if test="${not empty project.mainCharacterList}">
		bibiscoShowNotEmptyThumbnailListElements(config.family); 
		bibiscoInitAllThumbnail(config);
	</c:if>
	<c:if test="${empty project.mainCharacterList}">
		bibiscoShowEmptyThumbnailListElements(config.family); 
	</c:if>
	
	$('#bibiscoCharactersACreateMainCharacter').click(function() {
		bibiscoCreateMainCharacter(config);
	});
	$('#bibiscoCharactersACreateFirstMainCharacter').click(function() {
		bibiscoCreateMainCharacter(config);
	});
	
	var configSecondary = {
			family: 'secondarycharacter',
			rowSlots: 4,
			init: function(position,config) { },
			select: function(position,config) { return bibiscoSelectSecondaryCharacter(position,config)},
			del: {
				confirmMessage: '<fmt:message key="jsp.characters.delete.confirm" />',
				deleteKoMessage: '<fmt:message key="jsp.characters.delete.ko" />'
			},
			dnd: true,
			titleForm : {
				titleMandatory: true,
				titleMinlength: 2,
				titleMaxlength: 50,
				titleValue: function() {
					return $.trim($('#bibiscoSecondaryCharacterDialogTitle').text());
				}, 
				updateTitle: function(title,id,config, position) {
					$('#bibiscoSecondaryCharacterDialogTitle').html(title);
					bibiscoSecondaryCharacterButtonUpdateTitleInit(config, id, position);
				},
				titleLabel: "<fmt:message key="jsp.characterTitle.form.title" />",
				updateTitleLabel: "<fmt:message key="jsp.character.dialog.title.updateTitle" />",
				tipCode : 'charactersdndTip'
			}
		};
	
	<c:if test="${not empty project.secondaryCharacterList}">
		bibiscoShowNotEmptyThumbnailListElements(configSecondary.family); 
		bibiscoInitAllThumbnail(configSecondary);
	</c:if>
	<c:if test="${empty project.secondaryCharacterList}">
		bibiscoShowEmptyThumbnailListElements(configSecondary.family); 
	</c:if>
	
	$('#bibiscoCharactersACreateSecondaryCharacter').click(function() {
		bibiscoCreateSecondaryCharacter(configSecondary);
	});
	$('#bibiscoCharactersACreateFirstSecondaryCharacter').click(function() {
		bibiscoCreateSecondaryCharacter(configSecondary);
	});
	
});

function bibiscoCreateMainCharacter(config) {
	var position = bibiscoThumbnailCount('maincharacter') + 1;
	var ajaxDialogContent = { 
			  idCaller: 'bibiscoCharactersACreateMainCharacter',
			  url: 'jsp/thumbnailTitleForm.jsp?action=createThumbnail&position='+position,
			  title: '<fmt:message key="jsp.characters.dialog.title.createMainCharacter" />', 
			  init: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormInit(idAjaxDialog, idCaller, config); },
			  close: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormClose(idAjaxDialog, idCaller); },
			  beforeClose: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormBeforeClose(idAjaxDialog, idCaller); },
			  resizable: false, modal: true, 
			  width: 500, height: 210, positionTop: 100
	  };
	  
	  bibiscoOpenAjaxDialog(ajaxDialogContent);
}

function bibiscoCreateSecondaryCharacter(configSecondary) {
	var position = bibiscoThumbnailCount('secondarycharacter') + 1;
	var ajaxDialogContent = { 
			  idCaller: 'bibiscoCharactersACreateSecondaryCharacter',
			  url: 'jsp/thumbnailTitleForm.jsp?action=createThumbnail&position='+position,
			  title: '<fmt:message key="jsp.characters.dialog.title.createSecondaryCharacter" />', 
			  init: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormInit(idAjaxDialog, idCaller, configSecondary); },
			  close: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormClose(idAjaxDialog, idCaller); },
			  beforeClose: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormBeforeClose(idAjaxDialog, idCaller); },
			  resizable: false, modal: true, 
			  width: 500, height: 210, positionTop: 100
	  };
	  
	  bibiscoOpenAjaxDialog(ajaxDialogContent);
}

function bibiscoSelectMainCharacter(position,config) {
	  
	  var idCharacter = bibiscoGetThumbnailIdFromPosition(config.family, position);

	  $.ajax({
  		  type: 'GET',
  		  url : 'BibiscoServlet?action=openMainCharacter&idCharacter='+idCharacter,
  		  beforeSend:function(){
  			  bibiscoOpenLoadingBanner();
  		  },
  		  success:function(data){
  			  $('#bibiscoCharactersDivCharacterList').hide();
  			  $('#bibiscoCharactersDivCharacterDetail').html(data);
  			  bibiscoCharacterInitCallback(config)
  			  $('#bibiscoCharactersDivCharacterDetail').show();
  			  bibiscoCloseLoadingBannerSuccess();
  		  },
  		  error:function(){
  			  bibiscoCloseLoadingBannerError();
  		  }
  	});
}

function bibiscoSelectSecondaryCharacter(position,config) {
	  
	  var idCharacter = bibiscoGetThumbnailIdFromPosition(config.family, position);
	  var title = bibiscoGetThumbnailFromPosition(config.family, position).find('.bibiscoThumbnailTitle').html();


	  var ajaxDialogContent = { 
			  idCaller : 'bibiscoTagThumbnailCharacterDiv'+idCharacter,
			  url : 'BibiscoServlet?action=openSecondaryCharacter&idCharacter='+idCharacter,
			  id : idCharacter,
			  type: 'secondarycharacter',
			  title: title, 
			  init: function (idAjaxDialog, idCaller, type, id) { return bibiscoSecondaryCharacterInitCallback(idAjaxDialog, idCaller, type, id, config); },
			  close: function (idAjaxDialog, idCaller, type, id) { return bibiscoSecondaryCharacterCloseCallback(idAjaxDialog, idCaller, type, id); },
			  beforeClose: function (idAjaxDialog, idCaller, type, id) { return bibiscoSecondaryCharacterBeforeCloseCallback(idAjaxDialog, idCaller, type, id); },
			  resizable: false, modal: true, 
			  width: 810, height: window.innerHeight - 75, positionTop: 25
	  };

	  bibiscoOpenAjaxDialog(ajaxDialogContent);
}



</script>

<div id="bibiscoCharactersDivCharacterList">
<div class="row-fluid">
	<div class="span12">
		<div class="row-fluid page-header">
			<div class="span8">
				<h1><fmt:message key="jsp.characters.h1.main" /><small>&nbsp;&nbsp;&nbsp;<fmt:message key="jsp.characters.h1.small.main" /></small></h1>
    		</div>
    		<div class="span4 pagination-right">
    			<a id="bibiscoCharactersACreateMainCharacter" class="btn btn-primary bibiscoHeaderButton" data-thumbnailFamily="maincharacter" href="#"><i class="icon-plus icon-white"></i>&nbsp;<fmt:message key="jsp.characters.a.createMainCharacter" /></a>
    		</div>
    	</div>
    	<div id="bibiscoCharactersDivEmptyMainCharacters" data-thumbnailFamily="maincharacter" class="emptyThumbnailListElements bibiscoMainCharactersEmpty">
			<tags:bibiscoEmptyThumbnailListBox text="jsp.characters.bibiscoEmptyThumbnailListBox.text.main" createButtonText="jsp.characters.a.createFirstMainCharacter" createButtonId="bibiscoCharactersACreateFirstMainCharacter"  />
		</div>	    	
    	<div id="bibiscoCharactersDivNotEmptyMainCharacters" class="bibiscoThumbnailPages notEmptyThumbnailListElements bibiscoMainCharactersNotEmpty" data-thumbnailFamily="maincharacter">
	    	<c:forEach items="${project.mainCharacterList}" var="maincharacter" varStatus="mainCharacterNumber">
	    		
	    		<c:if test="${mainCharacterNumber.count % 4 == 1}">
	    			<section>
	    			<div class="row-fluid">
	    		</c:if>
	    		
	    		<div class="span3 thumbnailSlot" data-thumbnailFamily="maincharacter" data-slotPosition="${mainCharacterNumber.count}">
					<tags:bibiscoThumbnailCharacter title="${maincharacter.name}"  taskStatus="${maincharacter.taskStatus}" id="${maincharacter.idCharacter}" />
				</div>
	    		
	    		<c:if test="${mainCharacterNumber.count % 4 == 0 || mainCharacterNumber.count == fn:length(project.mainCharacterList)}">
	    			</div>
	    			</section>
	    		</c:if>
	    	</c:forEach>
	    	<c:if test="${fn:length(project.mainCharacterList) == 0}">
	    		<section>
	    			<div class="row-fluid"></div>
	    		</section>
	    	</c:if>
    	</div>    	
    </div>
    <div class="row-fluid page-header bibiscoSecondaryCharactersSectionTitle">
		<div class="span10">
			<h1><fmt:message key="jsp.characters.h1.secondary" /><small>&nbsp;&nbsp;&nbsp;<fmt:message key="jsp.characters.h1.small.secondary" /></small></h1>
   		</div>
   		<div class="span2 pagination-right">
   			<a id="bibiscoCharactersACreateSecondaryCharacter" class="btn btn-primary bibiscoHeaderButton" data-thumbnailFamily="secondarycharacter" href="#"><i class="icon-plus icon-white"></i>&nbsp;<fmt:message key="jsp.characters.a.createSecondaryCharacter" /></a>
   		</div>
   	</div>
	<div id="bibiscoCharactersDivEmptySecondaryCharacters" data-thumbnailFamily="secondarycharacter" class="emptyThumbnailListElements" >
		<tags:bibiscoEmptyThumbnailListBox text="jsp.characters.bibiscoEmptyThumbnailListBox.text.secondary" createButtonText="jsp.characters.a.createFirstSecondaryCharacter" createButtonId="bibiscoCharactersACreateFirstSecondaryCharacter"  />
	</div>	  
   	<div id="bibiscoCharactersDivNotEmptySecondaryCharacters" class="bibiscoThumbnailPages notEmptyThumbnailListElements bibiscoSecondaryCharactersNotEmpty" data-thumbnailFamily="secondarycharacter">
	    	<c:forEach items="${project.secondaryCharacterList}" var="secondarycharacter" varStatus="secondaryCharacterNumber">
	    		<c:if test="${secondaryCharacterNumber.count % 4 == 1}">
	    			<section>
	    			<div class="row-fluid">
	    		</c:if>
	    		
	    		<div class="span3 thumbnailSlot" data-thumbnailFamily="secondarycharacter" data-slotPosition="${secondaryCharacterNumber.count}">
					<tags:bibiscoThumbnailCharacter title="${secondarycharacter.name}"  taskStatus="${secondarycharacter.taskStatus}" id="${secondarycharacter.idCharacter}" />
				</div>
	    		
	    		<c:if test="${secondaryCharacterNumber.count % 4 == 0 || secondaryCharacterNumber.count == fn:length(project.secondaryCharacterList)}">
	    			</div>
	    			</section>
	    		</c:if>
	    	</c:forEach>
	    	<c:if test="${fn:length(project.secondaryCharacterList) == 0}">
	    		<section>
	    			<div class="row-fluid"></div>
	    		</section>
	    	</c:if>
    	</div>    	
   	
   	<!--  -->
</div>
</div>



<div id="bibiscoCharactersDivCharacterDetail"></div>