<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="tags" tagdir="/WEB-INF/tags"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
function bibiscoChapterInitCallback(configChapter) {
	
	// back to chapter list button
	$('#bibiscoChapterABackToChapterList').click(function() {
				
		$.ajax({
            type: 'GET',
            async: true,
            url: 'BibiscoServlet?action=getChapterWordCountTaskStatus',
            data: { 
            	idChapter: ${chapter.idChapter}
            },
            error:function(jqXHR, textStatus, errorThrown) {},
            success:function(chapter){
            	
            	var chapterThumbnail = bibiscoGetThumbnailFromPosition('chapter', ${chapter.position}); 
                chapterThumbnail.find('div.bibiscoTagTaskStatusDiv').html(bibiscoGetBibiscoTaskStatus(chapter.taskStatus, chapter.wordCount, chapter.characterCount));
                chapterThumbnail.find('div.bibiscoTagTaskStatusDiv span').tooltip();
                
                $('#bibiscoChaptersDivChapterList').show();
                $('#bibiscoChaptersDivChapterDetail').html('');
                $('#bibiscoChaptersDivChapterDetail').hide();
            },
          });
	});
	
	// update character name button
	$('#bibiscoChapterButtonUpdateTitle').click(function() {
		openThumbnailUpdateTitle('bibiscoChapterButtonUpdateTitle', configChapter, ${chapter.idChapter}, ${chapter.position});
	});
	$('#bibiscoChapterButtonUpdateTitle').tooltip();
	
	// scene list
	var configScene = {
		family: 'scene',
		rowSlots: 4,
		init: function(position,configScene) { return bibiscoInitScene(position,configScene)},
		select: function(position,configScene) { return bibiscoSelectScene(position,configScene)},
		del: {
			confirmMessage: '<fmt:message key="jsp.chapter.delete.scene.confirm" />'
		},
		dnd: true,
		titleForm : {
			titleMinlength: 2,
			titleMaxlength: 50,
			titleValue: function() {
				return $.trim($('#bibiscoSceneDialogTitle').text());
			},
			updateTitle: function(title,id,config, position) {
				$('#bibiscoSceneDialogTitle').html(title);
				bibiscoSceneButtonUpdateTitleInit(config, id, position);
			},
			titleLabel: "<fmt:message key="jsp.sceneTitle.form.title" />",
			updateTitleLabel: "<fmt:message key="jsp.scene.dialog.title.updateTitle" />"
		}
	};
	<c:if test="${not empty chapter.sceneList}">
		bibiscoShowNotEmptyThumbnailListElements(configScene.family); 
		bibiscoInitAllThumbnail(configScene);
	</c:if>
	<c:if test="${empty chapter.sceneList}">
		bibiscoShowEmptyThumbnailListElements(configScene.family); 
	</c:if>	

	
	$('#bibiscoChapterACreateScene').click(function() {
		bibiscoCreateScene(configScene);
	});
	$('#bibiscoChapterACreateFirstScene').click(function() {
		bibiscoCreateScene(configScene);
	});
	
	$('.bibiscoChapter .bibiscoTagTaskStatusDiv span').tooltip();
}

function bibiscoCreateScene(configScene) {
	var position = bibiscoThumbnailCount('scene') + 1;
	var ajaxDialogContent = { 
			  idCaller: 'bibiscoChapterACreateScene',
			  url: 'jsp/thumbnailTitleForm.jsp?action=createThumbnail&position='+position+'&idParent=${chapter.idChapter}',
			  title: '<fmt:message key="jsp.chapter.dialog.title.createScene" />', 
			  init: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormInit(idAjaxDialog, idCaller, configScene); },
			  close: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormClose(idAjaxDialog, idCaller); },
			  beforeClose: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormBeforeClose(idAjaxDialog, idCaller); },
			  resizable: false, 
			  width: 500, height: 210, positionTop: 100
	};
	  
	bibiscoOpenAjaxDialog(ajaxDialogContent);
}

function bibiscoInitScene(position,configScene) {
	$('.thumbnailSlot[data-thumbnailFamily="'+configScene.family+'"][data-slotPosition="'+position+'"] .thumbnail .bibiscoThumbnailPosition').html('#'+position);
}

function bibiscoSelectScene(position,configScene) {
	  
	  var idScene = bibiscoGetThumbnailIdFromPosition(configScene.family, position);
	  var title = bibiscoGetThumbnailFromPosition(configScene.family, position).find('.bibiscoThumbnailTitle').html();

	  var ajaxDialogContent = { 
			  idCaller : 'bibiscoTagThumbnailSceneDiv'+idScene,
			  id : idScene,
			  type: 'scene',
			  url : 'BibiscoServlet?action=openScene&idScene='+idScene,
			  title: title, 
			  init: function (idAjaxDialog, idCaller, type, id) { return bibiscoSceneInitCallback(idAjaxDialog, idCaller, type, id, configScene); },
			  close: function (idAjaxDialog, idCaller, type, id) { return bibiscoSceneCloseCallback(idAjaxDialog, idCaller, type, id); },
			  beforeClose: function (idAjaxDialog, idCaller, type, id) { return bibiscoSceneBeforeCloseCallback(idAjaxDialog, idCaller, type, id); },
			  resizable: false, 
			  width: 810, height: window.innerHeight - 75, positionTop: 25
	  };

	  bibiscoOpenAjaxDialog(ajaxDialogContent);
}


</script>
<div class="bibiscoChapter">
<div class="row-fluid">
	<div class="span12">
		<div class="row-fluid page-header">
			<div class="span8" style="float: left;">
				<h1 id="bibiscoChapterH1Title"><span id="bibiscoChapterSpanTitle"><c:out value="${chapter.title}"></c:out></span>&nbsp;&nbsp;<button id="bibiscoChapterButtonUpdateTitle" title="<fmt:message key="jsp.chapter.button.updateTitle" />" class="btn btn-mini"><i class="icon-pencil"></i></button>
    			</h1>
    		</div>
    		<div class="span4" style="text-align: right;">
    			<a id="bibiscoChapterABackToChapterList" class="btn" style="margin-top: 2px;" href="#"><i class="icon-chevron-up icon-white"></i><fmt:message key="jsp.chapter.a.backToChapterList" /></a>
    		</div>
    	</div>
    	
    	<div class="row-fluid">
			<div class="span3">
				<tags:bibiscoThumbnail 
					description="jsp.chapter.thumbnail.reason.description" 
					title="jsp.chapter.thumbnail.reason.title" 
					type="chapterReason" taskStatus="${chapter.reasonTaskStatus}"
					id="${chapter.idChapter}"
					width="810" height="window.innerHeight - 75" positionTop="25" />
			</div>
			<div class="span3">
				<tags:bibiscoThumbnail 
					description="jsp.chapter.thumbnail.notes.description" 
					title="jsp.chapter.thumbnail.notes.title" 
					type="note" taskStatus="DISABLE"
					id="${chapter.idChapter}"
					width="810" height="window.innerHeight - 75" positionTop="25" />
			</div>
			<div class="span3">
				
			</div>
			<div class="span3">
				
			</div>
		</div>
		
		<div class="row-fluid page-header">
			<div class="span2">
				<h2><fmt:message key="jsp.chapter.scene.h2" /></h2>
    		</div>
    		<div class="span6">
    		</div>
    		<div class="span4" style="text-align: right;">
    			<a id="bibiscoChapterACreateScene" class="btn btn-primary notEmptyThumbnailListElements" data-thumbnailFamily="scene" style="margin-top: 2px;" href="#"><i class="icon-plus icon-white"></i><fmt:message key="jsp.chapter.a.createScene" /></a>
    		</div>
    	</div>
    	<div id="bibiscoChapterDivEmptyScenes" data-thumbnailFamily="scene" class="emptyThumbnailListElements">
			<tags:bibiscoEmptyThumbnailListBox text="jsp.chapter.bibiscoEmptyThumbnailListBox.text" createButtonText="jsp.chapter.a.createFirstScene" createButtonId="bibiscoChapterACreateFirstScene"  />
		</div>    	
    	<div class="bibiscoThumbnailPages notEmptyThumbnailListElements" data-thumbnailFamily="scene" style="width: 100%; height: 400px; overflow: scroll;">
	    	<c:forEach items="${chapter.sceneList}" var="scene" varStatus="sceneNumber">
	    		
	    		<c:if test="${sceneNumber.count % 4 == 1}">
	    			<section>
	    			<div class="row-fluid">
	    		</c:if>
	    		
	    		<div class="span3 thumbnailSlot" data-thumbnailFamily="scene" data-slotPosition="${scene.position}">
					<tags:bibiscoThumbnailScene title="${scene.description}" 
					position="${scene.position}" taskStatus="${scene.taskStatus}" 
				    wordCount="${scene.wordCount}" characterCount="${scene.characterCount}"
					id="${scene.idScene}"/>
				</div>
	    		
	    		<c:if test="${sceneNumber.count % 4 == 0 || sceneNumber.count == fn:length(chapter.sceneList)}">
	    			</div>
	    			</section>
	    		</c:if>

	    	</c:forEach>
	    	<c:if test="${fn:length(chapter.sceneList) == 0}">
	    		<section>
	    			<div class="row-fluid"></div>
	    		</section>
	    	</c:if>
    	</div>    	
    </div>
</div>
</div>

