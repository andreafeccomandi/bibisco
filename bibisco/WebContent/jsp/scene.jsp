<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
//<![CDATA[
          
    var bibiscoRichTextEditor;    
    var bibiscoRichTextEditorHeight;
	var bibiscoRichTextEditorVerticalPadding = 200;
    
    function populate(scene, changeRevision) {
    	
    	// id scene
    	$('#bibiscoSceneIdScene').val(scene.idScene);
    	$('#bibiscoSceneRevision').val(scene.revision);
    	
    	// point of view
    	$('button.scenePointOfView').removeClass('active');
    	$('button[data-id="'+scene.pointOfView+'"].scenePointOfView').addClass('active');
    	if (scene.idCharacterPointOfView) {
    		$('button[data-id="'+scene.idCharacterPointOfView+'"].scenePointOfViewCharacter').addClass('active');
    	} else {
    		$('#bibiscoSceneDivScenePointOfViewCharacter').hide();
    	}
    	
    	//location
    	$('button.location').removeClass('active');
    	$('button[data-id="'+scene.idLocation+'"].location').addClass('active');    
    	
    	//time
    	if(scene.sceneDate) {
    		$('#bibiscoSceneInputTime').val($.format.date(scene.sceneDate, "${patternTimestamp}"));		
    	} else {
    		$('#bibiscoSceneInputTime').val(null);		
    	}
    	$('#bibiscoSceneDivTime').datetimepicker({startView: 'decade', minuteStep:5, autoclose: true, language: '${language}'})
		.on('changeDate', function(ev){
			bibiscoRichTextEditor.unSaved = true;
		});

		//characters
		$('button.sceneCharacter').removeClass('active');
		if (scene.characters) {
			for (i=0;i<scene.characters.length;i++) {
				$('button[data-id="'+scene.characters[i].idCharacter+'"].sceneCharacter').addClass('active');
			}	
		}
		
		//strands 
		$('button.strand').removeClass('active');
		if (scene.strands) {
			for (i=0;i<scene.strands.length;i++) {
				$('button[data-id="'+scene.strands[i].idStrand+'"].strand').addClass('active');
			}
		} 
		
		//text
		if (changeRevision) {
			// change revision
			bibiscoRichTextEditor.setText(scene.text);
		} else {
			// first open of scene dialog
			bibiscoRichTextEditor = bibiscoRichTextEditorInit({text: scene.text, height: bibiscoRichTextEditorHeight+'px', width: jsBibiscoRichTextEditorWidth+'px'});	
		}
		
		bibiscoRichTextEditor.unSaved = false;
		
		//revision
		$('#bibiscoSceneSelectRevision option').remove();
		if(scene.revisions) {
			for (i=0;i<scene.revisions.length;i++) {
				var option = '<option value="'+scene.revisions[i].idRevision+'"><fmt:message key="jsp.scene.select.option.revision" /> ' + (scene.revisions.length - i) + '</option>';
				$('#bibiscoSceneSelectRevision').append(option);
			}	
		}

		$('#bibiscoSceneSelectRevision option[value="'+scene.idRevision+'"]').attr('selected','selected');
		$('#bibiscoSceneSelectRevision').attr('data-actualRevision',scene.idRevision);
	
		var optionNewRevision = '<option data-revisionOptionType="action" value="createRevision"><fmt:message key="jsp.scene.select.option.newRevision" /></option>';
		$('#bibiscoSceneSelectRevision').append(optionNewRevision);
		
		if (scene.revisions && scene.revisions.length > 1) {
			var optionDeleteCurrentRevision = '<option data-revisionOptionType="action" value="deleteCurrentRevision"><fmt:message key="jsp.scene.select.option.deleteCurrentRevision" /></option>';
			$('#bibiscoSceneSelectRevision').append(optionDeleteCurrentRevision);
		}
		
		$("#bibiscoSceneSelectRevision").select2({
    	    formatResult: formatRevisionActionSelectOption,
    	    formatSelection: formatRevisionActionSelectOption,
    	    escapeMarkup: function(m) { return m; }
    	});
    	
    }
    
           
    <!-- INIT DIALOG CALLBACK -->
    function bibiscoSceneInitCallback(ajaxDialog, idCaller, type, id, config) {
    	
    	$('#bibiscoSceneDivTags').hide();    	
    	
    	// point of view
    	$('button.scenePointOfView').click(function() {
    		$('button.scenePointOfView.active').removeClass('active');
    		if($(this).hasClass('scenePointOfViewOnCharacter')) {
    			$('#bibiscoSceneDivScenePointOfViewCharacter').show();
    		} else {
    			$('#bibiscoSceneDivScenePointOfViewCharacter').hide();
    			$('button.scenePointOfViewCharacter').removeClass('active');
    		}
    	});
    	
    	$('button.scenePointOfViewCharacter').click(function() {
    		$('button.scenePointOfViewCharacter.active').removeClass('active');
    	});
    	
    	$('#bibiscoSceneBtnPointOfView1stOnMajor').popover({placement	: 'bottom', content: "<fmt:message key="jsp.scene.button.pointOfView.1stOnMajor.popover" />"});
    	$('#bibiscoSceneBtnPointOfView1stOnMinor').popover({placement	: 'bottom', content: "<fmt:message key="jsp.scene.button.pointOfView.1stOnMinor.popover" />"});
    	$('#bibiscoSceneBtnPointOfView3rdLimited').popover({placement	: 'bottom', content: "<fmt:message key="jsp.scene.button.pointOfView.3rdLimited.popover" />"});
    	$('#bibiscoSceneBtnPointOfView3rdOmniscient').popover({placement	: 'bottom', content: "<fmt:message key="jsp.scene.button.pointOfView.3rdOmniscient.popover" />"});
    	$('#bibiscoSceneBtnPointOfView3rdObjective').popover({placement	: 'bottom', content: "<fmt:message key="jsp.scene.button.pointOfView.3rdObjective.popover" />"});
    	$('#bibiscoSceneBtnPointOfView2nd').popover({placement	: 'bottom', content: "<fmt:message key="jsp.scene.button.pointOfView.2nd.popover" />"});
    	
    	//location
		$('button.location').click(function() {
    		$('button.location.active').removeClass('active');
    	});
		
		//unsaved flag on tags button
		$('.btnSceneTags').click(function() {
			bibiscoRichTextEditor.unSaved = true;
		});
		
		//rich text editor height
		bibiscoRichTextEditorHeight = ajaxDialog.getHeight() - bibiscoRichTextEditorVerticalPadding;
    	
    	// save button
    	$('#bibiscoSceneASave').click(function() {
    		
    		bibiscoOpenLoadingBanner();
    		
    		bibiscoRichTextEditorSpellCheck(bibiscoRichTextEditor, true);
    		
    		var characters = new Array();
    		$('button.sceneCharacter.active').each(function(index) {
    			characters[index] = $(this).attr('data-id');
    		});
    		
    		var strands = new Array();
    		$('button.strand.active').each(function(index) {
    			strands[index] = $(this).attr('data-id');
    		});
    		
    		
        	$.ajax({
      		  type: 'POST',
      		  url: 'BibiscoServlet?action=saveScene',
      		  data: { 	idScene: $('#bibiscoSceneIdScene').val(),
      		            revision: $('#bibiscoSceneRevision').val(),
      			  		idRevision: $("#bibiscoSceneSelectRevision").attr('data-actualRevision'),
      			  		taskStatus: bibiscoTaskStatusSelector.getSelected(), 
      			  		text: bibiscoRichTextEditor.getText(),
      			  		pointOfView: $('button.scenePointOfView.active').attr('data-id'),
      			  		pointOfViewCharacter: $('button.scenePointOfViewCharacter.active').attr('data-id'),
      			  		characters: characters,
      			  		location: $('button.location.active').attr('data-id'),
      			  		time: $('#bibiscoSceneInputTime').val(),
      			  		strands: strands
      			  	},
      		  beforeSend:function(){
      			  
      		  },
      		  success:function(data){
      			  $('#'+idCaller+' div.bibiscoTagTaskStatusDiv').html(bibiscoGetBibiscoTaskStatus(bibiscoTaskStatusSelector.getSelected()));
      			  $('#'+idCaller+' div.bibiscoTagTaskStatusDiv span').tooltip();
      			  bibiscoCloseLoadingBannerSuccess();
      			  bibiscoRichTextEditor.unSaved = false;
      		  },
      		  error:function(){
      			  bibiscoCloseLoadingBannerError();
      		  }
      		});
    	});	  
    	$('#bibiscoSceneASave').tooltip();
    	
    	// close button
    	$('#bibiscoSceneAClose').tooltip();
    	
    	// tags button
    	$('#bibiscoSceneATags').tooltip();
    	$('#bibiscoSceneATags').click(function() {
    		$('#bibiscoSceneDivTags').show();
    		$('#bibiscoSceneDivRichTextEditor').hide();
    		$('#bibiscoSceneATags').hide();
    		$('#bibiscoSceneATextEditor').show();
    	});
    	
    	// text editor button
    	$('#bibiscoSceneATextEditor').hide();
    	$('#bibiscoSceneATextEditor').tooltip();
    	$('#bibiscoSceneATextEditor').click(function() {
    		$('#bibiscoSceneDivTags').hide();
    		$('#bibiscoSceneDivRichTextEditor').show();
    		$('#bibiscoSceneATags').show();
    		$('#bibiscoSceneATextEditor').hide();
    	});
    	
    	// revisions
    	$("#bibiscoSceneSelectRevision").on("change", function(e) { 
    		if (bibiscoRichTextEditor.unSaved) {
				bibiscoConfirm('<fmt:message key="jsp.scene.revision.change.message" />', function(result) {
    			    if (result) {
    			    	bibiscoRichTextEditor.unSaved=false;
    			    	bibiscoSceneSelectRevisionChange(e);
    			    } else {
    			    	setSceneRevisionSelectToActualRevision();
    			    }
    			});
			} else {
				bibiscoSceneSelectRevisionChange(e);
			}
    	});
    	
		// populate scene page
		var scene = ${scene};
		populate(scene, false);
		
		// update title scene button
    	$('.ui-dialog-title').attr('id', 'bibiscoSceneDialogTitle');
    	bibiscoSceneButtonUpdateTitleInit(config, scene.idScene, scene.position);
		
		//task status
    	var bibiscoTaskStatusSelector = bibiscoTaskStatusSelectorInit({value: scene.taskStatus, changeCallback: function() { bibiscoRichTextEditor.unSaved = true; } });
    	
    }     
    
    function bibiscoSceneButtonUpdateTitleInit(config, idScene, position) {
    	
    	$('#bibiscoSceneDialogTitle').append('&nbsp;<button id="bibiscoSceneButtonUpdateTitle" title="<fmt:message key="jsp.scene.button.updateTitle" />" class="btn btn-mini"><i class="icon-pencil"></i></button>');
    	$('#bibiscoSceneButtonUpdateTitle').tooltip();
    	$('#bibiscoSceneButtonUpdateTitle').click(function() {
    		openThumbnailUpdateTitle('bibiscoSceneButtonUpdateTitle', config, idScene, position);
    	});
    }
    
 	// close dialog callback
	function bibiscoSceneCloseCallback(ajaxDialog, idCaller, type) {
		bibiscoRichTextEditor.destroy();
    }
	
	// before close dialog callback
	function bibiscoSceneBeforeCloseCallback(ajaxDialog, idCaller, type) {
		
		$('#bibiscoSceneAClose').tooltip('hide');
		if (bibiscoRichTextEditor.unSaved) {
			bibiscoRichTextEditorSpellCheck(bibiscoRichTextEditor, true);
			bibiscoConfirm(jsCommonMessageConfirmExitWithoutSave, function(result) {
			    if (result) {
			    	bibiscoRichTextEditor.unSaved = false;
			    	ajaxDialog.close();
			    } 
			});
			return false;
		} else {
			return true;	
		}

    }
	
	// format select option of action on revision
	function formatRevisionActionSelectOption(state) {
	    var originalOption = state.element;
	    if ($(originalOption).attr('data-revisionOptionType') == 'action') {
	    	return '<span style="font-style: italic;">'+state.text+'</span>';
	    } else {
	    	return state.text;
	    }
	}
	
	// change revision
	function bibiscoSceneSelectRevisionChange(e) {
		
		var selectedValue = $('#bibiscoSceneSelectRevision option:selected').val();
		
		if (selectedValue=='createRevision') {
			bibiscoConfirm('<fmt:message key="jsp.scene.createRevisionFromActual.message" />', 
				function(result) {
			    	if (result) {
			    		bibiscoExecuteChangeRevision('createRevisionFromActual');
			    	} else {
			    		bibiscoExecuteChangeRevision('createRevisionFromScratch');
			    	}
			    });
		} else if (selectedValue=='deleteCurrentRevision') {
			setSceneRevisionSelectToActualRevision();
			bibiscoConfirm('<fmt:message key="jsp.scene.deleteCurrentRevision.message" />',
				function(result) {
			    	if (result) {
			    		bibiscoExecuteChangeRevision(selectedValue)
			    	} 
			    });
		} else {
			bibiscoExecuteChangeRevision('changeRevision', selectedValue);
		}
	}
	
	function bibiscoExecuteChangeRevision(operation, idRevision) {
		$.ajax({
  		  type: 'POST',
  		  url: 'BibiscoServlet?action=sceneRevisionChange',
  		  dataType: 'json',
  		  data: { 	idScene: $('#bibiscoSceneIdScene').val(),
  			  		operation: operation, 
  			  		idRevision: idRevision
  			  	},
  		  beforeSend:function(){
  			  bibiscoOpenLoadingBanner();
  		  },
  		  success:function(scene){
  			  populate(scene, true);
  			  bibiscoCloseLoadingBannerSuccess();
  		  },
  		  error:function(){
  			  bibiscoCloseLoadingBannerError();
  		  }
  	});
	}
	
	function setSceneRevisionSelectToActualRevision() {
		var actualRevisionValue = parseInt($("#bibiscoSceneSelectRevision").attr('data-actualRevision')); 
    	$("#bibiscoSceneSelectRevision").select2("val", actualRevisionValue);
	}

//]]>           
</script>


<%@ taglib prefix="tags" tagdir="/WEB-INF/tags"%>

<input type="hidden" id="bibiscoSceneIdScene" />
<input type="hidden" id="bibiscoSceneRevision" />
<div class="bibiscoDialogContent">
	<div id="bibiscoSceneDivRichTextEditor">
		<tags:bibiscoRichTextEditor />
	</div>
</div>
<div id="bibiscoSceneDivTags">
	<div class="accordion" id="sceneAccordion">
		<div class="accordion-group">
			<div class="accordion-heading">
				<span style="font-size: 14px;" class="label label-info accordion-toggle" data-toggle="collapse" data-parent="#sceneAccordion" href="#sceneAccordionGroupPointOfView"> <fmt:message key="jsp.scene.pointOfView.title" />
				</span>
			</div>
			<div id="sceneAccordionGroupPointOfView" class="accordion-body collapse in">
				<div class="accordion-inner">
					<div class="row-fluid sceneTagsExplains"><fmt:message key="jsp.scene.pointOfView.subtitle" /></div>
					<div class="row-fluid" style="margin-bottom: 5px;">
						<button id="bibiscoSceneBtnPointOfView1stOnMajor" class="btn btnSceneTags scenePointOfView scenePointOfViewOnCharacter" style="margin-bottom: 5px;" data-toggle="button" data-id="FIRST_ON_MAJOR">
							<fmt:message key="jsp.scene.button.pointOfView.1stOnMajor" />
						</button>
						<button id="bibiscoSceneBtnPointOfView1stOnMinor" class="btn btnSceneTags scenePointOfView scenePointOfViewOnCharacter" style="margin-bottom: 5px;" data-toggle="button" data-id="FIRST_ON_MINOR">
							<fmt:message key="jsp.scene.button.pointOfView.1stOnMinor" />
						</button>
						<button id="bibiscoSceneBtnPointOfView3rdLimited" class="btn btnSceneTags scenePointOfView scenePointOfViewOnCharacter"style="margin-bottom: 5px;" data-toggle="button" data-id="THIRD_LIMITED">
							<fmt:message key="jsp.scene.button.pointOfView.3rdLimited" />
						</button>
						<button id="bibiscoSceneBtnPointOfView3rdOmniscient" class="btn btnSceneTags scenePointOfView" style="margin-bottom: 5px;" data-toggle="button" data-id="THIRD_OMNISCIENT">
							<fmt:message key="jsp.scene.button.pointOfView.3rdOmniscient" />
						</button>
						<button id="bibiscoSceneBtnPointOfView3rdObjective" class="btn btnSceneTags scenePointOfView" style="margin-bottom: 5px;" data-toggle="button" data-id="THIRD_OBJECTIVE">
							<fmt:message key="jsp.scene.button.pointOfView.3rdObjective" />
						</button>
						<button id="bibiscoSceneBtnPointOfView2nd" class="btn btnSceneTags scenePointOfView" style="margin-bottom: 5px;" data-toggle="button" data-id="SECOND">
							<fmt:message key="jsp.scene.button.pointOfView.2nd" />
						</button>
					</div>
					<div class="row-fluid" id="bibiscoSceneDivScenePointOfViewCharacter">
						<div class="row-fluid sceneTagsExplains" style="margin-top: 5px;"><fmt:message key="jsp.scene.label.pointOfView.character" /></div>
						<c:forEach items="${characters}" var="sceneCharacter" varStatus="sceneCharacterNumber">
							<button class="btn btnSceneTags scenePointOfViewCharacter"  data-toggle="button" data-id="${sceneCharacter.idCharacter}">${sceneCharacter.name}</button>
						</c:forEach>
					</div>
				</div>
			</div>
		</div>
		<div class="accordion-group">
			<div class="accordion-heading">
				<span style="font-size: 14px;" class="label label-info accordion-toggle" data-toggle="collapse" data-parent="#sceneAccordion" href="#sceneAccordionGroupCharacters"> <fmt:message key="jsp.scene.characters.title" /> </span>
			</div>
			<div id="sceneAccordionGroupCharacters" class="accordion-body collapse">
				<div class="accordion-inner">
					<div class="row-fluid sceneTagsExplains"><fmt:message key="jsp.scene.characters.subtitle" /></div>
					<c:forEach items="${characters}" var="character" varStatus="characterNumber">
						<button style="margin-top: 5px;" class="btn btnSceneTags sceneCharacter" data-toggle="button" data-id="${character.idCharacter}">${character.name}</button>
					</c:forEach>
				</div>
			</div>
		</div>
		<div class="accordion-group">
			<div class="accordion-heading">
				<span style="font-size: 14px;" class="label label-info accordion-toggle" data-toggle="collapse" data-parent="#sceneAccordion" href="#sceneAccordionGroupLocation"> <fmt:message key="jsp.scene.location.title" /> </span>
			</div>
			<div id="sceneAccordionGroupLocation" class="accordion-body collapse">
				<div class="accordion-inner">
					<div class="row-fluid sceneTagsExplains"><fmt:message key="jsp.scene.location.subtitle" /></div>
					<c:forEach items="${locations}" var="location" varStatus="locationNumber">
						<button style="margin-top: 5px;" class="btn btnSceneTags location" data-toggle="button" data-id="${location.idLocation}">${location.name}</button>
					</c:forEach>
				</div>
			</div>
		</div>
		<div class="accordion-group">
			<div class="accordion-heading">
				<span style="font-size: 14px;" class="label label-info accordion-toggle" data-toggle="collapse" data-parent="#sceneAccordion" href="#sceneAccordionGroupTime"> <fmt:message key="jsp.scene.time.title" /> </span>
			</div>
			<div id="sceneAccordionGroupTime" class="accordion-body collapse">
				<div class="accordion-inner">
					<div class="row-fluid sceneTagsExplains"><fmt:message key="jsp.scene.time.subtitle" /></div>
					<div class="input-append date" id="bibiscoSceneDivTime" data-date-format="<fmt:message key="pattern.datetimepicker.datetime" />">
					    <input id="bibiscoSceneInputTime" class="span2" size="16" type="text" value="">
					    <span class="add-on"><i class="icon-remove"></i></span>
					    <span class="add-on"><i class="icon-th"></i></span>
					</div> 
				</div>
			</div>
		</div>
		<div class="accordion-group">
			<div class="accordion-heading">
				<span style="font-size: 14px;" class="label label-info accordion-toggle" data-toggle="collapse" data-parent="#sceneAccordion" href="#sceneAccordionGroupStrands"> <fmt:message key="jsp.scene.strands.title" /> </span>
			</div>
			<div id="sceneAccordionGroupStrands" class="accordion-body collapse">
				<div class="accordion-inner">
					<div class="row-fluid sceneTagsExplains"><fmt:message key="jsp.scene.strands.subtitle" /></div>
					<c:forEach items="${strands}" var="strand" varStatus="strandNumber">
						<button style="margin-top: 5px;" class="btn btnSceneTags strand" data-toggle="button" data-id="${strand.idStrand}">${strand.name}</butmeton>
					</c:forEach>
				</div>
			</div>
		</div>
	</div>

</div>
<div class="bibiscoDialogFooter control-group">
	<table style="width: 100%">
		<tr>
			<td style="text-align: left;"><tags:bibiscoTaskStatusSelector/></td>
			<td style="text-align: right:;">
				<select data-totalRevisions="" data-actualRevision="" class="selectpicker" style="width:200px;" id="bibiscoSceneSelectRevision"></select>
				<a id="bibiscoSceneATextEditor" title="<fmt:message key="jsp.scene.button.showTextScene" />" class="btn" style="margin-left: 5px;" href="#"><i class="icon-edit"></i></a> 
				<a id="bibiscoSceneATags" title="<fmt:message key="jsp.scene.button.tags" />" class="btn" style="margin-left: 5px;" href="#"><i class="icon-tags"></i></a> 
				<a id="bibiscoSceneASave" title="<fmt:message key="jsp.common.button.save" />" class="btn btn-primary" style="margin-left: 5px;" href="#"><i class="icon-ok icon-white"></i></a> 
				<a id="bibiscoSceneAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" style="margin-left: 5px;" href="#"><i class="icon-remove"></i></a>
			</td>
		</tr>
	</table>
</div>