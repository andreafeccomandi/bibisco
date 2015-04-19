<script type="text/javascript">
$(function() {
		
	var config = {
		family: 'chapter',
		rowSlots: 4,
		init: function(position,config) { return bibiscoInitChapter(position,config)},
		select: function(position,config) { return bibiscoSelectChapter(position,config)},
		del: {
			confirmMessage: '<fmt:message key="jsp.chapters.delete.confirm" />'
		},
		dnd: true,
		titleForm : {
			titleMandatory: false,
			titleMinlength: 0,
			titleMaxlength: 50,
			titleValue: function() {
				return $('#bibiscoChapterSpanTitle').html();
			},
			updateTitle: function(title,id,config, position) {
				$('#bibiscoChapterSpanTitle').html(title);
			},
			titleLabel: "<fmt:message key="jsp.chapterTitle.form.title" />",
			updateTitleLabel: "<fmt:message key="jsp.chapter.dialog.title.updateTitle" />",
			tipCode : 'chaptersdndTip'
		}
	};
	
	<c:if test="${not empty project.chapterList}">
		bibiscoShowNotEmptyThumbnailListElements(config.family); 
		bibiscoInitAllThumbnail(config);
	</c:if>
	<c:if test="${empty project.chapterList}">
		bibiscoShowEmptyThumbnailListElements(config.family); 
	</c:if>

	$('#bibiscoChaptersACreateChapter').click(function() {
		bibiscoCreateChapter(config);
	});
	
	$('#bibiscoChaptersACreateFirstChapter').click(function() {
		bibiscoCreateChapter(config);
	});
	
});

function bibiscoCreateChapter(config) {
	var position = bibiscoThumbnailCount('chapter') + 1;

	var ajaxDialogContent = { 
			  idCaller: 'bibiscoChaptersACreateChapter',
			  url: 'jsp/thumbnailTitleForm.jsp?action=createThumbnail&position='+position,
			  title: '<fmt:message key="jsp.chapters.dialog.title.createChapter" />', 
			  init: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormInit(idAjaxDialog, idCaller, config); },
			  close: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormClose(idAjaxDialog, idCaller); },
			  beforeClose: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormBeforeClose(idAjaxDialog, idCaller); },
			  resizable: false, modal: true, 
			  width: 500, height: 210, positionTop: 100
	  };
	  
	  bibiscoOpenAjaxDialog(ajaxDialogContent);
}

function bibiscoInitChapter(position,config) {
	$('.thumbnailSlot[data-thumbnailFamily="'+config.family+'"][data-slotPosition="'+position+'"] .thumbnail .bibiscoThumbnailPosition').html('#'+position);
}

function bibiscoSelectChapter(position,config) {
	  
	  var idChapter = bibiscoGetThumbnailIdFromPosition(config.family, position);

	  $.ajax({
  		  type: 'GET',
  		  url : 'BibiscoServlet?action=openChapter&idChapter='+idChapter,
  		  beforeSend:function(){
  			  bibiscoOpenLoadingBanner();
  		  },
  		  success:function(data){
  			  $('#bibiscoChaptersDivChapterList').hide();
  			  $('#bibiscoChaptersDivChapterDetail').html(data);
  			  bibiscoChapterInitCallback(config);
  			  $('#bibiscoChaptersDivChapterDetail').show();
  			  bibiscoCloseLoadingBannerSuccess();
  		  },
  		  error:function(){
  			  bibiscoCloseLoadingBannerError();
  		  }
  	});
}

</script>

<div id="bibiscoChaptersDivChapterList">
<div class="row-fluid">
	<div class="span12">
		<div class="row-fluid page-header">
			<div class="span2">
				<h1><fmt:message key="jsp.chapters.h1" /></h1>
    		</div>
    		<div class="span6">
    		</div>
    		<div class="span4 pagination-right">
    			<a id="bibiscoChaptersACreateChapter" data-thumbnailFamily="chapter" class="btn btn-primary bibiscoHeaderButton" href="#"><i class="icon-plus icon-white"></i><fmt:message key="jsp.chapters.a.createChapter" /></a>
    		</div>
    	</div>
    	<div id="bibiscoChaptersDivEmptyChapters" data-thumbnailFamily="chapter" class="bibiscoEmptyThumbnailListElements">
			<tags:bibiscoEmptyThumbnailListBox text="jsp.chapters.bibiscoEmptyThumbnailListBox.text" createButtonText="jsp.chapters.a.createFirstChapter" createButtonId="bibiscoChaptersACreateFirstChapter"  />
		</div>	
    	<div id="bibiscoChaptersDivNotEmptyChapters" class="bibiscoThumbnailPages bibiscoNotEmptyThumbnailListElements bibiscoChaptersNotEmptyThumbnailListElements" data-thumbnailFamily="chapter">
	    	<c:forEach items="${project.chapterList}" var="chapter" varStatus="chapterNumber">
	    		
	    		<c:if test="${chapterNumber.count % 4 == 1}">
	    			<section>
	    			<div class="row-fluid">
	    		</c:if>
	    		
	    		<div class="span3 thumbnailSlot" data-thumbnailFamily="chapter" data-slotPosition="${chapter.position}">
					<tags:bibiscoThumbnailChapter title="${chapter.title}" position="${chapter.position}" 
					taskStatus="${chapter.taskStatus}" id="${chapter.idChapter}" 
					wordCount="${chapter.wordCount}" characterCount="${chapter.characterCount}" />
				</div>
	    		
	    		<c:if test="${chapterNumber.count % 4 == 0 || chapterNumber.count == fn:length(project.chapterList)}">
	    			</div>
	    			</section>
	    		</c:if>

	    	</c:forEach>
	    	<c:if test="${fn:length(project.chapterList) == 0}">
	    		<section>
	    			<div class="row-fluid"></div>
	    		</section>
	    	</c:if>
    	</div>    	
    </div>
</div>
</div>
<div id="bibiscoChaptersDivChapterDetail"></div>