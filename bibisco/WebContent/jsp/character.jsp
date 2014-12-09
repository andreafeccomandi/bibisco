<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="tags" tagdir="/WEB-INF/tags"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">

function bibiscoCharacterInitCallback(config) {
	
	// back to chapter list button
	$('#bibiscoCharacterABackToCharacterList').click(function() {	
		
		var bibiscoTaskStatusTodo = $('div .bibiscoCharacter .bibiscoTaskStatusTodo').size();
		var bibiscoTaskStatusToComplete = $('div .bibiscoCharacter .bibiscoTaskStatusToComplete').size();
		var bibiscoTaskStatusCompleted = $('div .bibiscoCharacter .bibiscoTaskStatusCompleted').size(); 
		var bibiscoTaskStatusValue;
		
		if (bibiscoTaskStatusTodo>0 && bibiscoTaskStatusToComplete==0 && bibiscoTaskStatusCompleted==0) {
			bibiscoTaskStatusValue= 'TODO';
		} else if(bibiscoTaskStatusCompleted>0 && bibiscoTaskStatusToComplete==0 && bibiscoTaskStatusTodo==0 ) {
			bibiscoTaskStatusValue= 'COMPLETED';
		} else {
			bibiscoTaskStatusValue='TOCOMPLETE';
		}
	
		var mainCharacterThumbnail = bibiscoGetThumbnailFromPosition('maincharacter', ${character.position});	
		mainCharacterThumbnail.find('div.bibiscoTagTaskStatusDiv').html(bibiscoGetBibiscoTaskStatus(bibiscoTaskStatusValue));
		mainCharacterThumbnail.find('div.bibiscoTagTaskStatusDiv span').tooltip();
		
		$('#bibiscoCharactersDivCharacterList').show();
		$('#bibiscoCharactersDivCharacterDetail').html('');
		$('#bibiscoCharactersDivCharacterDetail').hide();
	});
	
	// update character name button
	$('#bibiscoCharacterButtonUpdateTitle').click(function() {
		openThumbnailUpdateTitle('bibiscoCharacterButtonUpdateTitle', config, ${character.idCharacter}, ${character.position});
	});
	$('#bibiscoCharacterButtonUpdateTitle').tooltip();
	
	$('.bibiscoTagTaskStatusDiv span').tooltip();
	
	// show social media tip
	bibiscoShowSocialMediaTip();
}


function bibiscoShowSocialMediaTip() {
    <c:if test="${tipSettings.socialMediaTip}">
       bibiscoShowTip('socialMediaTip', 235);
    </c:if>
}

</script>
<div class="bibiscoCharacter">	
<div class="row-fluid">
	<div class="span12">
		<div class="row-fluid page-header">
			<div class="span8" style="float: left;">
    			<h1 id="bibiscoCharacterH1Title"><span id="bibiscoCharacterSpanTitle"><c:out value="${character.name}"></c:out></span>&nbsp;&nbsp;<button id="bibiscoCharacterButtonUpdateTitle" title="<fmt:message key="jsp.character.button.updateTitle" />" class="btn btn-mini"><i class="icon-pencil"></i></button>
    			</h1>
    		</div>
    		<div class="span4" style="text-align: right;">
    			<a id="bibiscoCharacterABackToCharacterList" class="btn" style="margin-top: 2px;" href="#"><i class="icon-chevron-up icon-white"></i>&nbsp;<fmt:message key="jsp.character.a.backToCharacterList" /></a>
    		</div>
    	</div>
    	<div class="row-fluid" >
			<div class="span3 page-header"  style="margin-top: 0px; margin-bottom: 9px; padding-bottom: 5px;">
				<h3><fmt:message key="jsp.character.h3.whois" /></h3>
    		</div>
    		<div class="span9 page-header" style="margin-top: 0px; margin-bottom: 9px; padding-bottom: 5px;">
				<h3><fmt:message key="jsp.character.h3.seems" /></h3>
    		</div>
    	</div>
    	<section>
    	<div class="row-fluid">
			<div class="span3">
				<tags:bibiscoThumbnail 
					description="jsp.character.thumbnail.personaldata.description" 
					title="jsp.character.thumbnail.personaldata.title" 
					type="characterInfoQuestions" taskStatus="${character.personaldataTaskStatus}"
					id="PERSONAL_DATA__${character.idCharacter}"
					width="810" height="window.innerHeight - 75" positionTop="25" />
			</div>
			<div class="span3">
				<tags:bibiscoThumbnail 
					description="jsp.character.thumbnail.physionomy.description" 
					title="jsp.character.thumbnail.physionomy.title" 
					type="characterInfoQuestions" taskStatus="${character.physionomyTaskStatus}"
					id="PHYSIONOMY__${character.idCharacter}"
					width="810" height="window.innerHeight - 75" positionTop="25" />
			</div>
			<div class="span3">
				<tags:bibiscoThumbnail 
					description="jsp.character.thumbnail.behaviors.description" 
					title="jsp.character.thumbnail.behaviors.title" 
					type="characterInfoQuestions" taskStatus="${character.behaviorsTaskStatus}"
					id="BEHAVIORS__${character.idCharacter}"
					width="810" height="window.innerHeight - 75" positionTop="25" />
			</div>
			<div class="span3">
				<tags:bibiscoThumbnailCharacterImages 
					description="jsp.character.thumbnail.images.description" 
					title="jsp.character.thumbnail.images.title" 
					type="characterInfoImages" taskStatus="DISABLE"
					id="${character.idCharacter}" characterName="${character.name}"
					width="810" height="window.innerHeight - 75" positionTop="25" />
			</div>
		</div>
		</section>
		<div class="row-fluid">
			<div class="span6 page-header" style="margin-top: 10px; margin-bottom: 9px; padding-bottom: 5px;">
				<h3><fmt:message key="jsp.character.h3.think" /></h3>
    		</div>
    		<div class="span6 page-header" style="margin-top: 10px; margin-bottom: 9px; padding-bottom: 5px;">
				<h3><fmt:message key="jsp.character.h3.comesfrom" /></h3>
    		</div>
    	</div>
		<section>
		<div class="row-fluid">
			<div class="span3">
    			<tags:bibiscoThumbnail 
						description="jsp.character.thumbnail.psychology.description" 
						title="jsp.character.thumbnail.psychology.title" 
						type="characterInfoQuestions" taskStatus="${character.psychologyTaskStatus}"
						id="PSYCHOLOGY__${character.idCharacter}"
						width="810" height="window.innerHeight - 75" positionTop="25" />
			</div>
			<div class="span3">
			
				<tags:bibiscoThumbnail 
					description="jsp.character.thumbnail.ideas.description" 
					title="jsp.character.thumbnail.ideas.title" 
					type="characterInfoQuestions" taskStatus="${character.ideasTaskStatus}"
					id="IDEAS__${character.idCharacter}"
					width="810" height="window.innerHeight - 75" positionTop="25" />
			</div>
			<div class="span3">
				<tags:bibiscoThumbnail 
					description="jsp.character.thumbnail.sociology.description" 
					title="jsp.character.thumbnail.sociology.title" 
					type="characterInfoQuestions" taskStatus="${character.sociologyTaskStatus}"
					id="SOCIOLOGY__${character.idCharacter}"
					width="810" height="window.innerHeight - 75" positionTop="25" />
			</div>
			<div class="span3">
				<tags:bibiscoThumbnail 
					description="jsp.character.thumbnail.lifebeforestorybeginning.description" 
					title="jsp.character.thumbnail.lifebeforestorybeginning.title" 
					type="characterInfoWithoutQuestions" taskStatus="${character.lifebeforestorybeginningTaskStatus}"
					id="LIFE_BEFORE_STORY_BEGINNING__${character.idCharacter}"
					width="810" height="window.innerHeight - 75" positionTop="25" />
			</div>
		</div>
		</section>
		<div class="row-fluid">
    		<div class="span6 page-header" style="margin-top: 10px; margin-bottom: 9px; padding-bottom: 5px;">
				<h3><h3><fmt:message key="jsp.character.h3.go" /></h3></h3>
    		</div>
    		<div class="span6">
    		</div>
    	</div>
		<section>
			<div class="row-fluid">
				<div class="span3">
					<tags:bibiscoThumbnail 
					description="jsp.character.thumbnail.conflict.description" 
					title="jsp.character.thumbnail.conflict.title" 
					type="characterInfoWithoutQuestions" taskStatus="${character.conflictTaskStatus}"
					id="CONFLICT__${character.idCharacter}"
					width="810" height="window.innerHeight - 75" positionTop="25" />
				</div>
				<div class="span3">
					<tags:bibiscoThumbnail 
						description="jsp.character.thumbnail.evolutionduringthestory.description" 
						title="jsp.character.thumbnail.evolutionduringthestory.title" 
						type="characterInfoWithoutQuestions" taskStatus="${character.evolutionduringthestoryTaskStatus}"
						id="EVOLUTION_DURING_THE_STORY__${character.idCharacter}"
						width="810" height="window.innerHeight - 75" positionTop="25" />
				</div>
					
				<div class="span6">
					
				</div>
			</div>
		</section>

		
		
	</div>
</div>
</div>

