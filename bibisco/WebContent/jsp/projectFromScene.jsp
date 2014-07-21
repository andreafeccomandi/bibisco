<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
//<![CDATA[
            
    <!-- INIT DIALOG CALLBACK -->
    function bibiscoProjectFromSceneInitCallback(ajaxDialog, idCaller, dialogWidth, projectFromSceneDialogHeight) {
    	
    	// create dialog config object
    	var dialogConfig = {
            width: dialogWidth,
            height: projectFromSceneDialogHeight,
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
    }
    
    function initArchitectureTab(dialogConfig) {
    	
    	$("#bibiscoProjectFromSceneSelectArchitecture").css("width", dialogConfig.selectWidth);
        $("#bibiscoProjectFromSceneSelectArchitecture").select2({
            escapeMarkup: function(m) { return m; }
        });
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
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Personaldata" id="bibiscoProjectFromSceneSelectCharacterSectionOptionPersonalData">Dati personali</option>');   	   
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Physionomy"  id="bibiscoProjectFromSceneSelectCharacterSectionOptionPhysionomy">Aspetto fisico</option>'); 
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Behaviors"  id="bibiscoProjectFromSceneSelectCharacterSectionOptionBehaviors">Modi di fare</option>');
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Psychology"  id="bibiscoProjectFromSceneSelectCharacterSectionOptionPsychology">Psicologia</option>');  
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Ideas"  id="bibiscoProjectFromSceneSelectCharacterSectionOptionIdeas">Idee e passioni</option>');
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Sociology"  id="bibiscoProjectFromSceneSelectCharacterSectionOptionSociology">Sociologia</option>');
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Lifebeforestorybeginning"  id="bibiscoProjectFromSceneSelectCharacterSectionOptionLifebeforestorybeginning">Vita precedente alla storia</option>');
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Conflict"  id="bibiscoProjectFromSceneSelectCharacterSectionOptionConflict">Conflitto</option>');
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Evolutionduringthestory"  id="bibiscoProjectFromSceneSelectCharacterSectionOptionEvolutionduringthestory">Evoluzione</option>');
    	$("#bibiscoProjectFromSceneSelectCharacterSection").append('<option data-idcharactersection="Images" id="bibiscoProjectFromSceneSelectCharacterSectionOptionImages">Immagini</option>');
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
    
    function populateMainCharacterInfoWithoutQuestion(infoWithoutQuestion, targetDiv) {
        targetDiv.html('');
        targetDiv.append(infoWithoutQuestion.info);
    }
    
    function populateImages(character, dialogConfig) {
    	var imagesDiv = $('#bibiscoProjectFromSceneDivCharacterImages');
        imagesDiv.html('');
        for (i=0;i<character.images.length;i++) {
            imagesDiv.append('<h4>'+character.images[i].description+'</h4>');
            imagesDiv.append('<img src="BibiscoServlet?action=getImage&idImage='+character.images[i].idImage+'" style="width: 100%;  height: auto; display: inline; max-width: '+dialogConfig.imageWidth+'px"/>');
            imagesDiv.append('<p></p>');   
        }
    }
    
    function populateMainCharacter(projectFromSceneMainCharacter, dialogConfig) {
    	populateMainCharacterInfoQuestion(projectFromSceneMainCharacter.PERSONAL_DATA, $('#bibiscoProjectFromSceneDivCharacterPersonaldata'));
    	populateMainCharacterInfoQuestion(projectFromSceneMainCharacter.PHYSIONOMY, $('#bibiscoProjectFromSceneDivCharacterPhysionomy'));
    	populateMainCharacterInfoQuestion(projectFromSceneMainCharacter.BEHAVIORS, $('#bibiscoProjectFromSceneDivCharacterBehaviors'));
    	populateMainCharacterInfoQuestion(projectFromSceneMainCharacter.PSYCHOLOGY, $('#bibiscoProjectFromSceneDivCharacterPsychology'));
    	populateMainCharacterInfoQuestion(projectFromSceneMainCharacter.IDEAS, $('#bibiscoProjectFromSceneDivCharacterIdeas'));
    	populateMainCharacterInfoQuestion(projectFromSceneMainCharacter.SOCIOLOGY, $('#bibiscoProjectFromSceneDivCharacterSociology'));
    	populateMainCharacterInfoWithoutQuestion(projectFromSceneMainCharacter.LIFE_BEFORE_STORY_BEGINNING, $('#bibiscoProjectFromSceneDivCharacterLifebeforestorybeginning'));
    	populateMainCharacterInfoWithoutQuestion(projectFromSceneMainCharacter.CONFLICT, $('#bibiscoProjectFromSceneDivCharacterConflict'));
    	populateMainCharacterInfoWithoutQuestion(projectFromSceneMainCharacter.EVOLUTION_DURING_THE_STORY, $('#bibiscoProjectFromSceneDivCharacterEvolutionduringthestory'));
    	populateImages(projectFromSceneMainCharacter, dialogConfig)
    }
    
    function populateSecondaryCharacter(projectFromSceneSecondaryCharacter, dialogConfig) {
    	$('#bibiscoProjectFromSceneDivCharacterDescription').html('');
        $('#bibiscoProjectFromSceneDivCharacterDescription').append(projectFromSceneSecondaryCharacter.description);
        populateImages(projectFromSceneSecondaryCharacter, dialogConfig);
    }
    
    function populateChapter(projectFromSceneChapter) {
    	
    	// chapter text
    	var chapterText = $('#bibiscoProjectFromSceneDivChapterText');
    	chapterText.html('');
    	for (i=0;i<projectFromSceneChapter.scenes.length;i++) {
	   		chapterText.append('<h4>'+projectFromSceneChapter.scenes[i].sceneTitle+'</h4>');
	   	   if (projectFromSceneChapter.scenes[i].idScene == ${idActualScene}) {
	   		  chapterText.append('<em>Scena attualmente in composizione</em>');
	   	   } else {
	   			 if (projectFromSceneChapter.scenes[i].sceneText) {
	   				chapterText.append(projectFromSceneChapter.scenes[i].sceneText);
	   			 } else {
	   				chapterText.append('<em>Scena ancora da comporre</em>');
	   			 }
	   		}
	   	   chapterText.append('<p></p>');
	    }
    
    	// chapter reason
    	var chapterReason = $('#bibiscoProjectFromSceneDivChapterReason');
    	chapterReason.html('');    	
    	if (projectFromSceneChapter.chapterReason) {
    		chapterReason.append(projectFromSceneChapter.chapterReason);
        } else {
        	chapterReason.append('<em>'+'La motivazione del capitolo non è stata specificata'+'</em>');
        }
    	
    	// chapter notes
    	var chapterNotes = $('#bibiscoProjectFromSceneDivChapterNotes');
    	chapterNotes.html('');
    	if (projectFromSceneChapter.chapterNotes) {
    		chapterNotes.append(projectFromSceneChapter.chapterNotes);
        } else {
        	chapterNotes.append('<em>'+'Non sono stati specificati appunti per il capitolo'+'</em>');
        }
    	
    	var chapterDiv = $('#bibiscoProjectFromSceneDivChapterContent');
    	chapterDiv.jScrollPane({
            autoReinitialise: true, animateScroll: true, verticalGutter: 30
        }).data('jsp');
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
	  <li class="active"><a href="#bibiscoProjectFromSceneTabLiArchitecture" data-toggle="tab">Architettura</a></li>
	  <li><a href="#bibiscoProjectFromSceneTabLiChapters" data-toggle="tab">Capitoli</a></li>
	  <li><a href="#bibiscoProjectFromSceneTabLiCharacters" data-toggle="tab">Personaggi</a></li>
	  <li><a href="#bibiscoProjectFromSceneTabLiLocations" data-toggle="tab">Luoghi</a></li>
	</ul>
	<div class="tab-content">
	   <!-- ARCHITECTURE -->
	   <div style="margin-top: 10px;" class="tab-pane active" id="bibiscoProjectFromSceneTabLiArchitecture">
		   <select style="margin-left: 50px;" class="selectpicker" id="bibiscoProjectFromSceneSelectArchitecture">
		       <option>Premessa</option>
		       <option>Fabula</option>
		       <option>Ambientazione</option>  
		   </select>    
		   <hr/>
		   <div id="bibiscoProjectFromSceneDivArchitecture">
		   
		   </div>
	   </div>
	   
	   <!-- CHAPTER -->
	   <div style="margin-top: 10px;" class="tab-pane" id="bibiscoProjectFromSceneTabLiChapters">
	       <select style="margin-left: 50px;" class="selectpicker" id="bibiscoProjectFromSceneSelectChapter">
		   <c:forEach items="${chapters}" var="chapter" varStatus="chapterNumber">
		      <c:choose>
			      <c:when test="${chapter.idChapter == idActualChapter}">
			         <option selected="selected" data-idchapter="${chapter.idChapter}">${chapter.title}</option>
			      </c:when>
			      <c:otherwise>
				     <option data-idchapter="${chapter.idChapter}">${chapter.title}</option>
				  </c:otherwise>
			  </c:choose>
		   </c:forEach>	   
		   </select>
		   <select style="margin-left: 50px; margin-top: 5px;" class="selectpicker" id="bibiscoProjectFromSceneSelectChapterSection">
              <option selected="selected" data-idchaptersection="Text">Testo</option>
              <option data-idchaptersection="Reason">Motivazione</option>  
              <option data-idchaptersection="Notes">Appunti</option>  
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
          </c:when>
          <c:otherwise>
             <em>Non sono ancora stati creati personaggi</em>
          </c:otherwise>
	   </c:choose>
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
	   </div>
	   
	   
	   <!-- LOCATIONS -->
	   <div style="margin-top: 10px;" class="tab-pane" id="bibiscoProjectFromSceneTabLiLocations">
	   <c:choose>
          <c:when test="${fn:length(locations) > 0}">
             <select style="margin-left: 50px;" class="selectpicker" id="bibiscoProjectFromSceneSelectLocation">
                <option selected="selected" data-idchapter="${chapter.idChapter}">${chapter.title}</option>
             </select>
          </c:when>
          <c:otherwise>
             <em>Non sono ancora stati creati personaggi</em>
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
