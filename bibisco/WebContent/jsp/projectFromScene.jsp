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
    	$('#bibiscoProjectFromSceneULMainMenu a').click(function (e) {
   		  e.preventDefault();
   		  $(this).tab('show');
   		});
    	
    	// set select option width
    	var selectWidth = dialogWidth - 150;
    	$("#bibiscoProjectFromSceneSelectArchitecture").css("width", selectWidth);
    	$("#bibiscoProjectFromSceneSelectChapter").css("width", selectWidth);
    	$("#bibiscoProjectFromSceneSelectChapterSection").css("width", selectWidth);
    	$("#bibiscoProjectFromSceneSelectCharacter").css("width", selectWidth);
    	$("#bibiscoProjectFromSceneSelectMainCharacterSection").css("width", selectWidth);
    	$("#bibiscoProjectFromSceneSelectSecondaryCharacterSection").css("width", selectWidth);
    	
    	// hide chapter's section not visible at startup   
    	$('bibiscoProjectFromSceneDivChapterReason').hide();
    	$('bibiscoProjectFromSceneDivChapterNotes').hide();
    	
    	$("#bibiscoProjectFromSceneSelectArchitecture").select2({
            escapeMarkup: function(m) { return m; }
        });
    	
    	$('#bibiscoProjectFromSceneDivChapterContent').css("height", projectFromSceneDialogHeight-250);
    	
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
    	        	  populateProjectFromSceneChapter(projectFromSceneChapter, projectFromSceneDialogHeight);
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
            
            if (selectedChapterSection=='text') {
            	$('#bibiscoProjectFromSceneDivChapterText').show();
            	$('#bibiscoProjectFromSceneDivChapterReason').hide();
                $('#bibiscoProjectFromSceneDivChapterNotes').hide();
            } else if (selectedChapterSection=='reason') {
            	$('#bibiscoProjectFromSceneDivChapterText').hide();
            	$('#bibiscoProjectFromSceneDivChapterReason').show();
                $('#bibiscoProjectFromSceneDivChapterNotes').hide();
            } else if (selectedChapterSection=='notes') {
            	$('#bibiscoProjectFromSceneDivChapterText').hide();
            	$('#bibiscoProjectFromSceneDivChapterReason').hide();
                $('#bibiscoProjectFromSceneDivChapterNotes').show();
            }
        });
    	
        // populate chapter section
        populateProjectFromSceneChapter(${projectFromSceneChapter});
        
        // select character
        $("#bibiscoProjectFromSceneSelectCharacter").select2({
            escapeMarkup: function(m) { return m; }
        });
        
        // select main character sections
        /*$("#bibiscoProjectFromSceneSelectMainCharacterSection").select2({
            escapeMarkup: function(m) { return m; }
        });*/
        $("#bibiscoProjectFromSceneSelectMainCharacterSection").hide();
        
        // select secondary character sections
        /*$("#bibiscoProjectFromSceneSelectSecondaryCharacterSection").select2({
            escapeMarkup: function(m) { return m; }
        });*/
        $("#bibiscoProjectFromSceneSelectSecondaryCharacterSection").hide();
        
        $('#bibiscoProjectFromSceneDivMainCharacterContent').hide();
        $('#bibiscoProjectFromSceneDivSecondaryCharacterContent').hide();
    }
    
    function populateProjectFromSceneChapter(projectFromSceneChapter) {
    	
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
              <option selected="selected" data-idchaptersection="text">Testo</option>
              <option data-idchaptersection="reason">Motivazione</option>  
              <option data-idchaptersection="notes">Appunti</option>  
           </select>
		   <hr style="margin-top: 10px;" />
		   <div id="bibiscoProjectFromSceneDivChapterContent" style="text-align: justify; width: 100%; overflow: scroll;">
		      <div id="bibiscoProjectFromSceneDivChapterText"></div>
		      <div id="bibiscoProjectFromSceneDivChapterReason"></div>
		      <div id="bibiscoProjectFromSceneDivChapterNotes"></div>
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
                            <option selected="selected" data-idcharacter="${character.idCharacter}" data-mainCharacter="${character.mainCharacter}">${character.name}</option>
                        </c:when>
                        <c:otherwise>
                            <option data-idcharacter="${character.idCharacter}" data-mainCharacter="${character.mainCharacter}">${character.name}</option>
                        </c:otherwise>
                    </c:choose>
                </c:forEach>
             </select>
             <select style="margin-left: 50px; margin-top: 5px;" class="selectpicker" id="bibiscoProjectFromSceneSelectMainCharacterSection">
                <option selected="selected" data-idmaincharactersection="personaldata">Dati personali</option>
                <option data-idmaincharactersection="physionomy">Aspetto fisico</option>  
                <option data-idmaincharactersection="behaviors">Modi di fare</option>
                <option data-idmaincharactersection="psychology">Psicologia</option>  
                <option data-idmaincharactersection="ideas">Idee e passioni</option>
                <option data-idmaincharactersection="sociology">Sociologia</option>
                <option data-idmaincharactersection="lifebeforestorybeginning">Vita precedente alla storia</option>
                <option data-idmaincharactersection="conflict">Conflitto</option>
                <option data-idmaincharactersection="evolutionduringthestory">Evoluzione</option>
                <option data-idmaincharactersection="images">Immagini</option>
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
              <div id="bibiscoProjectFromSceneDivMainCharacterPersonaldata"></div>
              <div id="bibiscoProjectFromSceneDivMainCharacterPhysionomy"></div>
              <div id="bibiscoProjectFromSceneDivMainCharacterBehaviors"></div>
              <div id="bibiscoProjectFromSceneDivMainCharacterPsychology"></div>
              <div id="bibiscoProjectFromSceneDivMainCharacterIdeas"></div>
              <div id="bibiscoProjectFromSceneDivMainCharacterSociology"></div>
              <div id="bibiscoProjectFromSceneDivMainCharacterLifebeforestorybeginning"></div>
              <div id="bibiscoProjectFromSceneDivMainCharacterConflict"></div>
              <div id="bibiscoProjectFromSceneDivMainCharacterEvolutionduringthestory"></div>
              <div id="bibiscoProjectFromSceneDivMainCharacterImages"></div>
           </div>
           <div id="bibiscoProjectFromSceneDivSecondaryCharacterContent" style="text-align: justify; width: 100%; overflow: scroll;">
              <div id="bibiscoProjectFromSceneDivSecondaryCharacterDescription"></div>
              <div id="bibiscoProjectFromSceneDivSecondaryCharacterImages"></div>
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