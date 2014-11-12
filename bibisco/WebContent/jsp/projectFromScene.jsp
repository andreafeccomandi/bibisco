<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
<%@ taglib prefix="tags" tagdir="/WEB-INF/tags"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
//<![CDATA[
            
    <!-- INIT DIALOG CALLBACK -->
    function bibiscoProjectFromSceneInitCallback(ajaxDialog, idCaller, dialogWidth, projectFromSceneDialogHeight) {
    	
    	// create dialog config object
    	var dialogConfig = {
            width: dialogWidth,
            height: projectFromSceneDialogHeight - 20,
            selectWidth : dialogWidth - 150,
            imageWidth : dialogWidth - 50
        }
    	
    	// init tabbing
    	$('#bibiscoProjectFromSceneULMainMenu a').click(function (e) {
   		  e.preventDefault();
   		  $(this).tab('show');
   		});
    		
    	// architecture
    	initArchitectureTab(dialogConfig);
    	
    	// chapters
    	initChaptersTab(dialogConfig);
    	
        // characters
        initCharactersTab(dialogConfig);
        
        // locations
        initLocationsTab(dialogConfig);
    }
    
    function initArchitectureTab(dialogConfig) {
    	
    	$("#bibiscoProjectFromSceneSelectArchitectureSection").css("width", dialogConfig.selectWidth);
        $("#bibiscoProjectFromSceneSelectArchitectureSection").select2({
            escapeMarkup: function(m) { return m; }
        });
        $('#bibiscoProjectFromSceneSelectArchitectureSection').on("change", function(e) { 
            var selectedArchitectureSection = $('#bibiscoProjectFromSceneSelectArchitectureSection option:selected').data('idarchitecturesection');
            $('.architectureContentSection').hide();
            $('#bibiscoProjectFromSceneDivArchitecture'+selectedArchitectureSection).show();
        });
        
        populateArchitecture(${projectFromSceneArchitecture});
        
        $('.architectureContentSection').hide();
        $('#bibiscoProjectFromSceneDivArchitecturePremise').show();
        
        // init jScrollPane
        $('#bibiscoProjectFromSceneDivArchitectureContent').css("height", dialogConfig.height-250);
        $('#bibiscoProjectFromSceneDivArchitectureContent').jScrollPane({
            autoReinitialise: true, animateScroll: true, verticalGutter: 30
        }).data('jsp');
    }
    
    function initChaptersTab(dialogConfig) {
    	
        $("#bibiscoProjectFromSceneSelectChapter").css("width", dialogConfig.selectWidth);
        $("#bibiscoProjectFromSceneSelectChapterSection").css("width", dialogConfig.selectWidth);
        
        // hide chapter's sections not visible at startup   
        $('#bibiscoProjectFromSceneDivChapterReason').hide();
        $('#bibiscoProjectFromSceneDivChapterNotes').hide();
        $('#bibiscoProjectFromSceneDivChapterContent').css("height", dialogConfig.height-250);
        
        // select chapter
        $('#bibiscoProjectFromSceneSelectChapter').select2({
            escapeMarkup: function(m) { return m; }
        });
        $('#bibiscoProjectFromSceneSelectChapter').on("change", function(e) { 
            var selectedChapter = $('#bibiscoProjectFromSceneSelectChapter option:selected').data('idchapter');
            $.ajax({
                  type: 'POST',
                  url: 'BibiscoServlet?action=changeChapterInProjectFromScene',
                  dataType: 'json',
                  data: {   
                      idChapter: selectedChapter
                  },
                  beforeSend:function(){
                      bibiscoOpenLoadingBanner();
                  },
                  success:function(projectFromSceneChapter){
                      populateChapter(projectFromSceneChapter, dialogConfig.height);
                      bibiscoCloseLoadingBannerSuccess();
                  },
                  error:function(){
                      bibiscoCloseLoadingBannerError();
                  }
                });
        });
        
        // select chapter sections
        $('#bibiscoProjectFromSceneSelectChapterSection').select2({
            escapeMarkup: function(m) { return m; }
        });
        $('#bibiscoProjectFromSceneSelectChapterSection').on("change", function(e) { 
            var selectedChapterSection = $('#bibiscoProjectFromSceneSelectChapterSection option:selected').data('idchaptersection');
            $('.chapterContentSection').hide();
            $('#bibiscoProjectFromSceneDivChapter'+selectedChapterSection).show();
        });
        
        // populate chapter section
        populateChapter(${projectFromSceneChapter});
        
        // init jScrollPane
        var chapterDiv = $('#bibiscoProjectFromSceneDivChapterContent');
        chapterDiv.jScrollPane({
            autoReinitialise: true, animateScroll: true, verticalGutter: 30
        }).data('jsp');
            	
    }
    
    function initCharactersTab(dialogConfig) {
        
        <c:if test="${fn:length(characters) > 0}">
           initSelectCharacter(dialogConfig);
           <c:choose>
	           <c:when test="${not empty projectFromSceneMainCharacter}">
	               initSelectCharacterSection(dialogConfig, true);
	               initCharacterElements(dialogConfig, true);
	               populateMainCharacter(${projectFromSceneMainCharacter}, dialogConfig); 
	           </c:when>
	           <c:otherwise>
		           initSelectCharacterSection(dialogConfig, false);
	               initCharacterElements(dialogConfig, false);
	               populateSecondaryCharacter(${projectFromSceneSecondaryCharacter}, dialogConfig);
	           </c:otherwise>
           </c:choose>   
        </c:if>
        <c:if test="${fn:length(characters) == 0}">
            $('#bibiscoProjectFromSceneDivCharacterContent').hide();
        </c:if>
    }
    
    function initSelectCharacter(dialogConfig) {
    	$("#bibiscoProjectFromSceneSelectCharacter").css("width", dialogConfig.selectWidth); 
    	$("#bibiscoProjectFromSceneSelectCharacter").select2({
            escapeMarkup: function(m) { return m; }
        });
        $("#bibiscoProjectFromSceneSelectCharacter").on("change", function(e) { 
            var selectedCharacter = $('#bibiscoProjectFromSceneSelectCharacter option:selected').data('idcharacter');
            var mainCharacter = $('#bibiscoProjectFromSceneSelectCharacter option:selected').data('maincharacter');
            var showingMainCharacter = $('#bibiscoProjectFromSceneSelectCharacterSection').data('showingmaincharacter');
            var toggleMainSecondary = (!mainCharacter && showingMainCharacter) || (mainCharacter && !showingMainCharacter);
            var action = mainCharacter ? 'changeMainCharacterInProjectFromScene' : 'changeSecondaryCharacterInProjectFromScene';
           
            $.ajax({
                  type: 'POST',
                  url: 'BibiscoServlet?action='+action,
                  dataType: 'json',
                  data: {   
                      idCharacter: selectedCharacter
                  },
                  beforeSend:function(){
                      bibiscoOpenLoadingBanner();
                  },
                  success:function(projectFromSceneCharacter){
                      if (mainCharacter) {
                    	  if (toggleMainSecondary) {
                    		 updateCharacter(true);
                    	  }
                          populateMainCharacter(projectFromSceneCharacter, dialogConfig); 
                      } else {
                    	  if (toggleMainSecondary) {
                    		 updateCharacter(false);
                    	  }
                          populateSecondaryCharacter(projectFromSceneCharacter, dialogConfig);
                      }
                      bibiscoCloseLoadingBannerSuccess();
                  },
                  error:function(){
                      bibiscoCloseLoadingBannerError();
                  }
                });
        });
    }
    
    function initSelectCharacterSection(dialogConfig, main) {
    	
        $('#bibiscoProjectFromSceneSelectCharacterSection').css("width", dialogConfig.selectWidth);   
        if (main) {
        	addMainCharacterOptionToSelectCharacterSection();
        } else {
        	addSecondaryCharacterOptionToSelectCharacterSection();
        }
        
        $("#bibiscoProjectFromSceneSelectCharacterSection").show();
        $("#bibiscoProjectFromSceneSelectCharacterSection").select2({
            escapeMarkup: function(m) { return m; }
        });
        $('#bibiscoProjectFromSceneSelectCharacterSection').on("change", function(e) { 
            var selectedCharacterSection = $('#bibiscoProjectFromSceneSelectCharacterSection option:selected').data('idcharactersection');
            $('.characterContentSection').hide();
            $('#bibiscoProjectFromSceneDivCharacter'+selectedCharacterSection).show();                  
        });
    }
    
    function addMainCharacterOptionToSelectCharacterSection() {
    	$("#bibiscoProjectFromSceneSelectCharacterSection").html('');
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Personaldata" id="bibiscoProjectFromSceneSelectCharacterSectionOptionPersonalData"><fmt:message key="jsp.projectFromScene.select.characters.personaldata" /></option>');   	   
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Physionomy"  id="bibiscoProjectFromSceneSelectCharacterSectionOptionPhysionomy"><fmt:message key="jsp.projectFromScene.select.characters.physionomy" /></option>'); 
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Behaviors"  id="bibiscoProjectFromSceneSelectCharacterSectionOptionBehaviors"><fmt:message key="jsp.projectFromScene.select.characters.behaviors" /></option>');
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Psychology"  id="bibiscoProjectFromSceneSelectCharacterSectionOptionPsychology"><fmt:message key="jsp.projectFromScene.select.characters.psychology" /></option>');  
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Ideas"  id="bibiscoProjectFromSceneSelectCharacterSectionOptionIdeas"><fmt:message key="jsp.projectFromScene.select.characters.ideas" /></option>');
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Sociology"  id="bibiscoProjectFromSceneSelectCharacterSectionOptionSociology"><fmt:message key="jsp.projectFromScene.select.characters.sociology" /></option>');
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Lifebeforestorybeginning"  id="bibiscoProjectFromSceneSelectCharacterSectionOptionLifebeforestorybeginning"><fmt:message key="jsp.projectFromScene.select.characters.lifebeforestorybeginning" /></option>');
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Conflict"  id="bibiscoProjectFromSceneSelectCharacterSectionOptionConflict"><fmt:message key="jsp.projectFromScene.select.characters.conflict" /></option>');
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Evolutionduringthestory"  id="bibiscoProjectFromSceneSelectCharacterSectionOptionEvolutionduringthestory"><fmt:message key="jsp.projectFromScene.select.characters.evolutionduringthestory" /></option>');
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Images" id="bibiscoProjectFromSceneSelectCharacterSectionOptionImages"><fmt:message key="jsp.projectFromScene.select.characters.images" /></option>');
    	$('#bibiscoProjectFromSceneSelectCharacterSectionOptionPersonalData').attr('selected','selected'); 
    	$('#bibiscoProjectFromSceneSelectCharacterSection').data('showingmaincharacter', true);
    }
    
    function addSecondaryCharacterOptionToSelectCharacterSection() {
    	$("#bibiscoProjectFromSceneSelectCharacterSection").html('');
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Description" id="bibiscoProjectFromSceneSelectCharacterSectionOptionDescription">Descrizione</option>');
        $("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Images" id="bibiscoProjectFromSceneSelectCharacterSectionOptionImages">Immagini</option>');
        $('#bibiscoProjectFromSceneSelectCharacterSectionOptionDescription').attr('selected','selected');
        $('#bibiscoProjectFromSceneSelectCharacterSection').data('showingmaincharacter', false);
    }
    
    function initCharacterElements(dialogConfig, main) {
    	
        $('.characterContentSection').hide();
        if (main) {
            $('#bibiscoProjectFromSceneDivCharacterPersonaldata').show();
        } else {
        	$('#bibiscoProjectFromSceneDivCharacterDescription').show();
        }
	    $('#bibiscoProjectFromSceneDivCharacterContent').css("height", dialogConfig.height-250);
	    $('#bibiscoProjectFromSceneDivCharacterContent').jScrollPane({
	        autoReinitialise: true, animateScroll: true, verticalGutter: 30
	    }).data('jsp');
    }
   
    
    function updateCharacter(secondaryToMain) {
    	
    	 $("#bibiscoProjectFromSceneSelectCharacterSection").select2('destroy');
    	 $("#bibiscoProjectFromSceneSelectCharacterSection option:selected").removeAttr('selected');
    	 if (secondaryToMain) {
    		 addMainCharacterOptionToSelectCharacterSection();
         } else {
        	 addSecondaryCharacterOptionToSelectCharacterSection();
         }
         
         $('#bibiscoProjectFromSceneSelectCharacterSection').select2({
             escapeMarkup: function(m) { return m; }
         });
         $('#bibiscoProjectFromSceneSelectCharacterSection').on("change", function(e) { 
             var selectedCharacterSection = $('#bibiscoProjectFromSceneSelectCharacterSection option:selected').data('idcharactersection');
             $('.characterContentSection').hide();
             $('#bibiscoProjectFromSceneDivCharacter'+selectedCharacterSection).show();                  
         });
         
         $('.characterContentSection').hide();
         if (secondaryToMain) {
             $('#bibiscoProjectFromSceneDivCharacterPersonaldata').show();
         } else {
             $('#bibiscoProjectFromSceneDivCharacterDescription').show();
         }
    }
    
    function populateMainCharacterInfoQuestion(infoQuestion, targetDiv) {
    	
    	targetDiv.html('');
        if (infoQuestion.interviewMode) {
            for (i=0;i<infoQuestion.questionsAnswers.length;i++) {
               targetDiv.append('<em><b>'+infoQuestion.questionsAnswers[i].question+'</b></em>');
               targetDiv.append('<p>'+infoQuestion.questionsAnswers[i].answer+'</p>');
            }
            targetDiv.append('<p></p>');
        } else {
            targetDiv.append('<p>'+infoQuestion.freeText+'</p>');
        }
    }
    
    function populateDivWithTextManagingEmpty(text, targetDiv, preventCleanDiv) {
        
    	if (!preventCleanDiv) {
    		targetDiv.html('');
    	}
        if (text) {
        	targetDiv.append(text);
        } else {
        	targetDiv.append("<em><fmt:message key="jsp.projectFromScene.section.empty" /></em>");
        }
    }
        
    function populateImages(imagesDiv, element, dialogConfig) {
        imagesDiv.html('');
        if (element.images && element.images.length>0) {
	        for (i=0;i<element.images.length;i++) {
	            imagesDiv.append('<h4>'+element.images[i].description+'</h4>');
	            imagesDiv.append('<img src="BibiscoServlet?action=getImage&idImage='+element.images[i].idImage+'" style="width: 100%;  height: auto; display: inline; max-width: '+dialogConfig.imageWidth+'px"/>');
	            imagesDiv.append('<p></p>');   
	        }        	
        } else {
        	imagesDiv.append("<em><fmt:message key="jsp.projectFromScene.div.images.empty" /></em>");
        }
    }
    
    function populateMainCharacter(projectFromSceneMainCharacter, dialogConfig) {
    	populateMainCharacterInfoQuestion(projectFromSceneMainCharacter.PERSONAL_DATA, $('#bibiscoProjectFromSceneDivCharacterPersonaldata'));
    	populateMainCharacterInfoQuestion(projectFromSceneMainCharacter.PHYSIONOMY, $('#bibiscoProjectFromSceneDivCharacterPhysionomy'));
    	populateMainCharacterInfoQuestion(projectFromSceneMainCharacter.BEHAVIORS, $('#bibiscoProjectFromSceneDivCharacterBehaviors'));
    	populateMainCharacterInfoQuestion(projectFromSceneMainCharacter.PSYCHOLOGY, $('#bibiscoProjectFromSceneDivCharacterPsychology'));
    	populateMainCharacterInfoQuestion(projectFromSceneMainCharacter.IDEAS, $('#bibiscoProjectFromSceneDivCharacterIdeas'));
    	populateMainCharacterInfoQuestion(projectFromSceneMainCharacter.SOCIOLOGY, $('#bibiscoProjectFromSceneDivCharacterSociology'));
    	populateDivWithTextManagingEmpty(projectFromSceneMainCharacter.LIFE_BEFORE_STORY_BEGINNING.info, $('#bibiscoProjectFromSceneDivCharacterLifebeforestorybeginning'));
    	populateDivWithTextManagingEmpty(projectFromSceneMainCharacter.CONFLICT.info, $('#bibiscoProjectFromSceneDivCharacterConflict'));
    	populateDivWithTextManagingEmpty(projectFromSceneMainCharacter.EVOLUTION_DURING_THE_STORY.info, $('#bibiscoProjectFromSceneDivCharacterEvolutionduringthestory'));
    	populateImages($('#bibiscoProjectFromSceneDivCharacterImages'), projectFromSceneMainCharacter, dialogConfig);
    }
    
    function populateSecondaryCharacter(projectFromSceneSecondaryCharacter, dialogConfig) {
    	populateDivWithTextManagingEmpty(projectFromSceneSecondaryCharacter.description, $('#bibiscoProjectFromSceneDivCharacterDescription'));
        populateImages($('#bibiscoProjectFromSceneDivCharacterImages'),projectFromSceneSecondaryCharacter, dialogConfig);
    }
    
    function populateArchitecture(projectFromSceneArchitecture) {
    	
    	// premise
    	populateDivWithTextManagingEmpty(projectFromSceneArchitecture.premise, $('#bibiscoProjectFromSceneDivArchitecturePremise'));
    	
    	// fabula
    	populateDivWithTextManagingEmpty(projectFromSceneArchitecture.fabula, $('#bibiscoProjectFromSceneDivArchitectureFabula'));
    	
    	// setting
    	populateDivWithTextManagingEmpty(projectFromSceneArchitecture.setting, $('#bibiscoProjectFromSceneDivArchitectureSetting'));
    	
    	//strands
    	var strandsDiv = $('#bibiscoProjectFromSceneDivArchitectureStrands');
    	strandsDiv.html('');
    	if (projectFromSceneArchitecture.strands) {
    		for (i=0;i<projectFromSceneArchitecture.strands.length;i++) {
    			strandsDiv.append('<h4>'+projectFromSceneArchitecture.strands[i].name+'</h4>');
    			strandsDiv.append('<p>');
    			populateDivWithTextManagingEmpty(projectFromSceneArchitecture.strands[i].description,strandsDiv,true);
    			strandsDiv.append('</p>');
    			strandsDiv.append('<p></p>');   
            }	
    	} else {
    		strandsDiv.append("<em><fmt:message key="jsp.projectFromScene.div.strands.empty" /></em>");	
    	}
    }
    
    function populateChapter(projectFromSceneChapter) {
    	
    	// chapter text
    	var chapterText = $('#bibiscoProjectFromSceneDivChapterText');
    	chapterText.html('');
    	if(projectFromSceneChapter.scenes.length==0) {
    		chapterText.append("<em><fmt:message key="jsp.projectFromScene.div.scenes.empty" /></em>");
    	}
    	for (i=0;i<projectFromSceneChapter.scenes.length;i++) {
	   		chapterText.append('<h4>'+projectFromSceneChapter.scenes[i].sceneTitle+'</h4>');
	   	   if (projectFromSceneChapter.scenes[i].idScene == ${idActualScene}) {
	   		  chapterText.append("<em><fmt:message key="jsp.projectFromScene.chapter.scene.actual" /></em>");
	   	   } else {
	   		  populateDivWithTextManagingEmpty(projectFromSceneChapter.scenes[i].sceneText, chapterText, true);
	   		}
	   	   chapterText.append('<p></p>');
	    }
    
    	// chapter reason
    	populateDivWithTextManagingEmpty(projectFromSceneChapter.chapterReason, $('#bibiscoProjectFromSceneDivChapterReason'));
    	
    	// chapter notes
    	populateDivWithTextManagingEmpty(projectFromSceneChapter.chapterNotes, $('#bibiscoProjectFromSceneDivChapterNotes'));
    }
    
    function initLocationsTab(dialogConfig) {
        
        <c:if test="${fn:length(locations) > 0}">
        
        // select location
        $('#bibiscoProjectFromSceneSelectLocation').css("width", dialogConfig.selectWidth);
        $('#bibiscoProjectFromSceneSelectLocation').select2({
            escapeMarkup: function(m) { return m; }
        });
        $('#bibiscoProjectFromSceneSelectLocation').on("change", function(e) { 
            var selectedLocation = $('#bibiscoProjectFromSceneSelectLocation option:selected').data('idlocation');
            $.ajax({
                  type: 'POST',
                  url: 'BibiscoServlet?action=changeLocationInProjectFromScene',
                  dataType: 'json',
                  data: {   
                	  idLocation: selectedLocation
                  },
                  beforeSend:function(){
                      bibiscoOpenLoadingBanner();
                  },
                  success:function(projectFromSceneLocation){
                      populateLocation(projectFromSceneLocation, dialogConfig.height);
                      bibiscoCloseLoadingBannerSuccess();
                  },
                  error:function(){
                      bibiscoCloseLoadingBannerError();
                  }
                });
        });
        
        // select location section
        $('#bibiscoProjectFromSceneSelectLocationSection').css("width", dialogConfig.selectWidth);
        $('#bibiscoProjectFromSceneSelectLocationSection').select2({
            escapeMarkup: function(m) { return m; }
        });
        $('#bibiscoProjectFromSceneSelectLocationSection').on("change", function(e) { 
            var selectedLocationSection = $('#bibiscoProjectFromSceneSelectLocationSection option:selected').data('idlocationsection');
            $('.locationContentSection').hide();
            $('#bibiscoProjectFromSceneDivLocation'+selectedLocationSection).show();                  
        });
        
        // location content
        $('#bibiscoProjectFromSceneDivLocationImages').hide();
        
        // populate
        populateLocation(${projectFromSceneLocation}, dialogConfig);
        
        // init jScrollPane
        $('#bibiscoProjectFromSceneDivLocationContent').css("height", dialogConfig.height-250);
        $('#bibiscoProjectFromSceneDivLocationContent').jScrollPane({
            autoReinitialise: true, animateScroll: true, verticalGutter: 30
        }).data('jsp');
        
        </c:if>

    }
    
    function populateLocation(projectFromSceneLocation, dialogConfig) {
        $('#bibiscoProjectFromSceneDivLocationDescription').html('');
        populateDivWithTextManagingEmpty(projectFromSceneLocation.description, $('#bibiscoProjectFromSceneDivLocationDescription'));
        populateImages($('#bibiscoProjectFromSceneDivLocationImages'),projectFromSceneLocation, dialogConfig);
    }
    
    <!-- CLOSE DIALOG CALLBACK -->
    function bibiscoProjectFromSceneCloseCallback(ajaxDialog, idCaller) {
    
    }
    
    <!-- BEFORE DIALOG CALLBACK -->
    function bibiscoProjectFromSceneBeforeCloseCallback(ajaxDialog, idCaller) {
    	
    }
    
    
    
//]]>           
</script>
<div style="margin-top: 10px;">
	<ul id="bibiscoProjectFromSceneULMainMenu" class="nav nav-tabs">
	  <li class="active"><a href="#bibiscoProjectFromSceneTabLiArchitecture" data-toggle="tab"><fmt:message key="jsp.projectFromScene.nav.li.architecture" /></a></li>
	  <li><a href="#bibiscoProjectFromSceneTabLiCharacters" data-toggle="tab"><fmt:message key="jsp.projectFromScene.nav.li.characters" /></a></li>
	  <li><a href="#bibiscoProjectFromSceneTabLiLocations" data-toggle="tab"><fmt:message key="jsp.projectFromScene.nav.li.locations" /></a></li>
	  <li><a href="#bibiscoProjectFromSceneTabLiChapters" data-toggle="tab"><fmt:message key="jsp.projectFromScene.nav.li.chapters" /></a></li>
	</ul>
	<div class="tab-content">
	
	   <!-- ARCHITECTURE -->
	   <div style="margin-top: 10px;" class="tab-pane active" id="bibiscoProjectFromSceneTabLiArchitecture">
		   <select style="margin-left: 50px;" class="selectpicker" id="bibiscoProjectFromSceneSelectArchitectureSection"> 
		       <option selected="selected" data-idarchitecturesection="Premise"><fmt:message key="jsp.projectFromScene.select.architecture.premise" /></option>
               <option data-idarchitecturesection="Fabula"><fmt:message key="jsp.projectFromScene.select.architecture.fabula" /></option>  
               <option data-idarchitecturesection="Setting"><fmt:message key="jsp.projectFromScene.select.architecture.setting" /></option>  
               <option data-idarchitecturesection="Strands"><fmt:message key="jsp.projectFromScene.select.architecture.strands" /></option>  
		   </select>    
		   <hr/>
		   <div id="bibiscoProjectFromSceneDivArchitectureContent">
		      <div id="bibiscoProjectFromSceneDivArchitecturePremise" class="architectureContentSection"></div>
              <div id="bibiscoProjectFromSceneDivArchitectureFabula" class="architectureContentSection"></div> 
              <div id="bibiscoProjectFromSceneDivArchitectureSetting" class="architectureContentSection"></div>
              <div id="bibiscoProjectFromSceneDivArchitectureStrands" class="architectureContentSection"></div>
		   </div>
	   </div>
	   
	   <!-- CHAPTER -->
	   <div style="margin-top: 10px;" class="tab-pane" id="bibiscoProjectFromSceneTabLiChapters">
	       <select style="margin-left: 50px;" class="selectpicker" id="bibiscoProjectFromSceneSelectChapter">
		   <c:forEach items="${chapters}" var="chapter" varStatus="chapterNumber">
		      <c:choose>
			      <c:when test="${chapter.idChapter == idActualChapter}">
			         <option selected="selected" data-idchapter="${chapter.idChapter}">#${chapter.position} ${chapter.title}</option>
			      </c:when>
			      <c:otherwise>
				     <option data-idchapter="${chapter.idChapter}">#${chapter.position} ${chapter.title}</option>
				  </c:otherwise>
			  </c:choose>
		   </c:forEach>	   
		   </select>
		   <select style="margin-left: 50px; margin-top: 5px;" class="selectpicker" id="bibiscoProjectFromSceneSelectChapterSection">
              <option selected="selected" data-idchaptersection="Text"><fmt:message key="jsp.projectFromScene.select.chapter.text" /></option>
              <option data-idchaptersection="Reason"><fmt:message key="jsp.projectFromScene.select.chapter.reason" /></option>  
              <option data-idchaptersection="Notes"><fmt:message key="jsp.projectFromScene.select.chapter.notes" /></option>  
           </select>
		   <hr style="margin-top: 10px;" />
		   <div id="bibiscoProjectFromSceneDivChapterContent" style="text-align: justify; width: 100%; overflow: scroll;">
		      <div id="bibiscoProjectFromSceneDivChapterText" class="chapterContentSection"></div>
		      <div id="bibiscoProjectFromSceneDivChapterReason" class="chapterContentSection"></div>
		      <div id="bibiscoProjectFromSceneDivChapterNotes" class="chapterContentSection"></div>
	       </div>
	   </div>
	   
	   <!-- CHARACTERS -->
	   <div style="margin-top: 10px;" class="tab-pane" id="bibiscoProjectFromSceneTabLiCharacters">
	   <c:choose>
          <c:when test="${fn:length(characters) > 0}">
             <select style="margin-left: 50px;" class="selectpicker" id="bibiscoProjectFromSceneSelectCharacter">
                <c:forEach items="${characters}" var="character" varStatus="characterNumber">
                    <c:choose>
                        <c:when test="${characterNumber.count == 1}">
                            <option selected="selected" data-idcharacter="${character.idCharacter}" data-maincharacter="${character.mainCharacter}">${character.name}</option>
                        </c:when>
                        <c:otherwise>
                            <option data-idcharacter="${character.idCharacter}" data-mainCharacter="${character.mainCharacter}">${character.name}</option>
                        </c:otherwise>
                    </c:choose>
                </c:forEach>
             </select>
             <select style="margin-left: 50px; margin-top: 5px;" class="selectpicker" id="bibiscoProjectFromSceneSelectCharacterSection">
            </select>
	        <hr style="margin-top: 10px;" />
            <div id="bibiscoProjectFromSceneDivCharacterContent" style="text-align: justify; width: 100%; overflow: scroll;">
              <div id="bibiscoProjectFromSceneDivCharacterPersonaldata" class="characterContentSection"></div>
              <div id="bibiscoProjectFromSceneDivCharacterPhysionomy" class="characterContentSection"></div>
              <div id="bibiscoProjectFromSceneDivCharacterBehaviors" class="characterContentSection"></div>
              <div id="bibiscoProjectFromSceneDivCharacterPsychology" class="characterContentSection"></div>
              <div id="bibiscoProjectFromSceneDivCharacterIdeas" class="characterContentSection"></div>
              <div id="bibiscoProjectFromSceneDivCharacterSociology" class="characterContentSection"></div>
              <div id="bibiscoProjectFromSceneDivCharacterLifebeforestorybeginning" class="characterContentSection"></div>
              <div id="bibiscoProjectFromSceneDivCharacterConflict" class="characterContentSection"></div>
              <div id="bibiscoProjectFromSceneDivCharacterEvolutionduringthestory" class="characterContentSection"></div>
              <div id="bibiscoProjectFromSceneDivCharacterDescription" class="characterContentSection"></div>
              <div id="bibiscoProjectFromSceneDivCharacterImages" class="characterContentSection"></div>
            </div>
          </c:when>
          <c:otherwise>
             <em><fmt:message key="jsp.projectFromScene.div.characters.empty" /></em>
          </c:otherwise>
	   </c:choose>
	   </div>
	   
	   
	   <!-- LOCATIONS -->
	   <div style="margin-top: 10px;" class="tab-pane" id="bibiscoProjectFromSceneTabLiLocations">
	   <c:choose>
          <c:when test="${fn:length(locations) > 0}">
             <select style="margin-left: 50px;" class="selectpicker" id="bibiscoProjectFromSceneSelectLocation">
                <c:forEach items="${locations}" var="location" varStatus="locationNumber">
                    <c:choose>
                        <c:when test="${locationNumber.count == 1}">
                            <option selected="selected" data-idlocation="${location.idLocation}">${location.name} (${location.fullyQualifiedArea})</option>
                        </c:when>
                        <c:otherwise>
                            <option data-idlocation="${location.idLocation}">${location.name} (${location.fullyQualifiedArea})</option>
                        </c:otherwise>
                    </c:choose>
                </c:forEach>
             </select>
             <select style="margin-left: 50px; margin-top: 5px;" class="selectpicker" id="bibiscoProjectFromSceneSelectLocationSection">
	              <option selected="selected" data-idlocationsection="Description"><fmt:message key="jsp.projectFromScene.select.location.description" /></option>
	              <option data-idlocationsection="Images"><fmt:message key="jsp.projectFromScene.select.location.images" /></option>  
	         </select>
             <hr style="margin-top: 10px;" />
	           <div id="bibiscoProjectFromSceneDivLocationContent" style="text-align: justify; width: 100%; overflow: scroll;">
	              <div id="bibiscoProjectFromSceneDivLocationDescription" class="locationContentSection"></div>
	              <div id="bibiscoProjectFromSceneDivLocationImages" class="locationContentSection"></div>
	           </div>	          
          </c:when>
          <c:otherwise>
             <em><fmt:message key="jsp.projectFromScene.div.locations.empty" /></em>
          </c:otherwise>
       </c:choose>
       
       
	   </div>
    </div>
</div>


<div class="bibiscoDialogFooter control-group">
    <table style="width: 100%">
        <tr>
            <td style="text-align: right;">
                <a id="bibiscoProjectFromSceneAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" style="margin-left: 5px;" href="#">
                <i class="icon-remove"></i></a>
            </td>
        </tr>
    </table>
</div>
