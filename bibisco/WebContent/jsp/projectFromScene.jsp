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
            selectWidth : dialogWidth - 150
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
        
        // hide chapter's section not visible at startup   
        $('bibiscoProjectFromSceneDivChapterReason').hide();
        $('bibiscoProjectFromSceneDivChapterNotes').hide();
        $('#bibiscoProjectFromSceneDivChapterContent').css("height", dialogConfig.height-250);
        
        // select chapter
        $("#bibiscoProjectFromSceneSelectChapter").select2({
            escapeMarkup: function(m) { return m; }
        });
        $("#bibiscoProjectFromSceneSelectChapter").on("change", function(e) { 
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
	               initMainCharacterElements(dialogConfig)
	               populateMainCharacter(${projectFromSceneMainCharacter}); 
	               hideSecondaryCharacterElements();
	           </c:when>
	           <c:when test="${not empty projectFromSceneSecondaryCharacter}">
	               initSecondaryCharacterElements(dialogConfig) 
	               populateSecondaryCharacter(${projectFromSceneSecondaryCharacter});
	               hideMainCharacterElements();
	           </c:when>
	           <c:otherwise>
	           hideMainCharacterElements();
	           hideSecondaryCharacterElements();
	           </c:otherwise>
           </c:choose>   
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

            var action;
            if (mainCharacter) {
                action = 'changeMainCharacterInProjectFromScene';
            } else {
                action = 'changeSecondaryCharacterInProjectFromScene';
            }
            
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
                          populateMainCharacter(projectFromSceneCharacter);               
                      } else {
                          populateSecondaryCharacter(projectFromSceneCharacter);
                      }
                      bibiscoCloseLoadingBannerSuccess();
                  },
                  error:function(){
                      bibiscoCloseLoadingBannerError();
                  }
                });
        });
    }
    
    function initMainCharacterElements(dialogConfig) {
    	$("#bibiscoProjectFromSceneSelectMainCharacterSection").css("width", dialogConfig.selectWidth);       
    	$("#bibiscoProjectFromSceneSelectMainCharacterSection").select2({
            escapeMarkup: function(m) { return m; }
        });
        
        $('#bibiscoProjectFromSceneSelectMainCharacterSection').on("change", function(e) { 
            var selectedMainCharacterSection = $('#bibiscoProjectFromSceneSelectMainCharacterSection option:selected').data('idmaincharactersection');
            $('.mainCharacterContentSection').hide();
            $('#bibiscoProjectFromSceneDivMainCharacter'+selectedMainCharacterSection).show();                  
        });
        $('.mainCharacterContentSection').hide();
        $('#bibiscoProjectFromSceneDivMainCharacterPersonaldata').show();
        $('#bibiscoProjectFromSceneDivMainCharacterContent').css("height", dialogConfig.height-250);
        $('#bibiscoProjectFromSceneDivMainCharacterContent').jScrollPane({
            autoReinitialise: true, animateScroll: true, verticalGutter: 30
        }).data('jsp');
    }
    
    function hideMainCharacterElements() {
    	 $("#bibiscoProjectFromSceneSelectMainCharacterSection").hide();
    	 $('#bibiscoProjectFromSceneDivMainCharacterContent').hide();
    }
    
    function initSecondaryCharacterElements(dialogConfig) {
        $("#bibiscoProjectFromSceneSelectSecondaryCharacterSection").css("width", dialogConfig.selectWidth);
        $("#bibiscoProjectFromSceneSelectSecondaryCharacterSection").select2({
            escapeMarkup: function(m) { return m; }
        });
        
        $('#bibiscoProjectFromSceneSelectSecondaryCharacterSection').on("change", function(e) { 
            var selectedSecondaryCharacterSection = $('#bibiscoProjectFromSceneSelectSecondaryCharacterSection option:selected').data('idsecondarycharactersection');
            $('.secondaryCharacterContentSection').hide();
            $('#bibiscoProjectFromSceneDivSecondaryCharacter'+selectedSecondaryCharacterSection).show();                  
        });
        $('.secondaryCharacterContentSection').hide();
        $('#bibiscoProjectFromSceneDivSecondaryCharacterDescription').show();
        $('#bibiscoProjectFromSceneDivSecondaryCharacterContent').css("height", dialogConfig.height-250);
        $('#bibiscoProjectFromSceneDivSecondaryCharacterContent').jScrollPane({
            autoReinitialise: true, animateScroll: true, verticalGutter: 30
        }).data('jsp');
    }
    
    
    function hideSecondaryCharacterElements() {
    	$("#bibiscoProjectFromSceneSelectSecondaryCharacterSection").hide();
        $('#bibiscoProjectFromSceneDivSecondaryCharacterContent').hide();
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
    
    function populateMainCharacter(projectFromSceneMainCharacter) {
    	
    	populateMainCharacterInfoQuestion(projectFromSceneMainCharacter.PERSONAL_DATA, $('#bibiscoProjectFromSceneDivMainCharacterPersonaldata'));
    	populateMainCharacterInfoQuestion(projectFromSceneMainCharacter.PHYSIONOMY, $('#bibiscoProjectFromSceneDivMainCharacterPhysionomy'));
    	populateMainCharacterInfoQuestion(projectFromSceneMainCharacter.BEHAVIORS, $('#bibiscoProjectFromSceneDivMainCharacterBehaviors'));
    	populateMainCharacterInfoQuestion(projectFromSceneMainCharacter.PSYCHOLOGY, $('#bibiscoProjectFromSceneDivMainCharacterPsychology'));
    	populateMainCharacterInfoQuestion(projectFromSceneMainCharacter.IDEAS, $('#bibiscoProjectFromSceneDivMainCharacterIdeas'));
    	populateMainCharacterInfoQuestion(projectFromSceneMainCharacter.SOCIOLOGY, $('#bibiscoProjectFromSceneDivMainCharacterSociology'));
    	populateMainCharacterInfoWithoutQuestion(projectFromSceneMainCharacter.LIFE_BEFORE_STORY_BEGINNING, $('#bibiscoProjectFromSceneDivMainCharacterLifebeforestorybeginning'));
    	populateMainCharacterInfoWithoutQuestion(projectFromSceneMainCharacter.CONFLICT, $('#bibiscoProjectFromSceneDivMainCharacterConflict'));
    	populateMainCharacterInfoWithoutQuestion(projectFromSceneMainCharacter.EVOLUTION_DURING_THE_STORY, $('#bibiscoProjectFromSceneDivMainCharacterEvolutionduringthestory'));
    }
    
    function populateSecondaryCharacter(projectFromSceneSecondaryCharacter) {
    	
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
             <select style="margin-left: 50px; margin-top: 5px;" class="selectpicker" id="bibiscoProjectFromSceneSelectMainCharacterSection">
                <option selected="selected" data-idmaincharactersection="Personaldata">Dati personali</option>
                <option data-idmaincharactersection="Physionomy">Aspetto fisico</option>  
                <option data-idmaincharactersection="Behaviors">Modi di fare</option>
                <option data-idmaincharactersection="Psychology">Psicologia</option>  
                <option data-idmaincharactersection="Ideas">Idee e passioni</option>
                <option data-idmaincharactersection="Sociology">Sociologia</option>
                <option data-idmaincharactersection="Lifebeforestorybeginning">Vita precedente alla storia</option>
                <option data-idmaincharactersection="Conflict">Conflitto</option>
                <option data-idmaincharactersection="Evolutionduringthestory">Evoluzione</option>
                <option data-idmaincharactersection="Images">Immagini</option>
            </select>
            <select style="margin-left: 50px; margin-top: 5px;" class="selectpicker" id="bibiscoProjectFromSceneSelectSecondaryCharacterSection">
                <option selected="selected" data-idsecondarycharactersection="description">Descrizione</option>
                <option data-idsecondarycharactersection="images">Immagini</option>
            </select>
          </c:when>
          <c:otherwise>
             <em>Non sono ancora stati creati personaggi</em>
          </c:otherwise>
	   </c:choose>
	   <hr style="margin-top: 10px;" />
           <div id="bibiscoProjectFromSceneDivMainCharacterContent" style="text-align: justify; width: 100%; overflow: scroll;">
              <div id="bibiscoProjectFromSceneDivMainCharacterPersonaldata" class="mainCharacterContentSection">dati personali</div>
              <div id="bibiscoProjectFromSceneDivMainCharacterPhysionomy" class="mainCharacterContentSection">fisionomia</div>
              <div id="bibiscoProjectFromSceneDivMainCharacterBehaviors" class="mainCharacterContentSection">comportamenti</div>
              <div id="bibiscoProjectFromSceneDivMainCharacterPsychology" class="mainCharacterContentSection">psicologia</div>
              <div id="bibiscoProjectFromSceneDivMainCharacterIdeas" class="mainCharacterContentSection">idee</div>
              <div id="bibiscoProjectFromSceneDivMainCharacterSociology" class="mainCharacterContentSection">sociologia</div>
              <div id="bibiscoProjectFromSceneDivMainCharacterLifebeforestorybeginning" class="mainCharacterContentSection"></div>
              <div id="bibiscoProjectFromSceneDivMainCharacterConflict" class="mainCharacterContentSection"></div>
              <div id="bibiscoProjectFromSceneDivMainCharacterEvolutionduringthestory" class="mainCharacterContentSection"></div>
              <div id="bibiscoProjectFromSceneDivMainCharacterImages" class="mainCharacterContentSection"></div>
           </div>
           <div id="bibiscoProjectFromSceneDivSecondaryCharacterContent" style="text-align: justify; width: 100%; overflow: scroll;">
              <div id="bibiscoProjectFromSceneDivSecondaryCharacterDescription" class="secondaryCharacterContentSection"></div>
              <div id="bibiscoProjectFromSceneDivSecondaryCharacterImages" class="secondaryCharacterContentSection"></div>
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