<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
//<![CDATA[
           
    var bibiscoRichTextEditor;    
           
    <!-- INIT DIALOG CALLBACK -->
    function bibiscoThumbnailInitCallback(ajaxDialog, idCaller, type, id) {
    	
    	characterInfoBean = ${characterInfoBean};
    		
    	// save button
    	$('#bibiscoCharacterInfoDialogASave').click(function() {
    		bibiscoRichTextEditorSpellCheck(bibiscoRichTextEditor, true);
    		
    		// save last answer to characterInfoBean
    		if(characterInfoBean.interviewMode) {
    			var actualQuestion = getActualQuestion();
        		if (questionChangeStatus[actualQuestion]) {
            		characterInfoBean.answers[actualQuestion] = bibiscoRichTextEditor.getText();
            		questionChangeStatus[actualQuestion] = false;
            	}
    		} 
    		// save freeText to characterInfoBean
    		else {
    			characterInfoBean.freeText = bibiscoRichTextEditor.getText();
    		}
    		
        	$.ajax({
      		  type: 'POST',
      		  url: 'BibiscoServlet?action=thumbnailAction&thumbnailAction=save&family='+type+'&id='+id,
      		  data: { taskStatus: bibiscoTaskStatusSelector.getSelected(), 
      			  	  answers: characterInfoBean.answers,
      			  	  freeText: characterInfoBean.freeText,
      			  	  interview: characterInfoBean.interviewMode
      		  },
      		  beforeSend:function(){
      			  bibiscoOpenLoadingBanner();
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
    	$('#bibiscoCharacterInfoDialogASave').tooltip();
    	
    	// close button
    	$('#bibiscoCharacterInfoDialogAClose').tooltip();
    	
    	
    	
    	// interview button
    	$('#bibiscoCharacterInfoAInterview').click(function() {
    		$('#bibiscoCharacterInfoDivInterview').show();
    		$('#bibiscoCharacterInfoDivInterviewButtons').show();
    		$('#bibiscoCharacterInfoDivFreeText').hide();
    		
    		characterInfoBean.freeText = bibiscoRichTextEditor.getText();
    		var actualQuestion = getActualQuestion();
    		bibiscoRichTextEditor.setText(characterInfoBean.answers[actualQuestion]);
    		characterInfoBean.interviewMode = true;
    	});
    	var interviewPopover = "<fmt:message key="jsp.characterInfo.a.interview.popover" />";
    	$('#bibiscoCharacterInfoAInterview').popover({placement	: 'top', content: interviewPopover});
    	
    	// free text button
    	$('#bibiscoCharacterInfoAFreeText').click(function() {
    		$('#bibiscoCharacterInfoDivInterview').hide();
    		$('#bibiscoCharacterInfoDivInterviewButtons').hide();
    		$('#bibiscoCharacterInfoDivFreeText').show();
    		
    		var actualQuestion = getActualQuestion();
    		if (questionChangeStatus[actualQuestion]) {
        		characterInfoBean.answers[actualQuestion] = bibiscoRichTextEditor.getText();
        		questionChangeStatus[actualQuestion] = false;
        	}
    		bibiscoRichTextEditor.setText(characterInfoBean.freeText);
    		characterInfoBean.interviewMode = false;
    	});
    	var freeTextPopover =  "<fmt:message key="jsp.characterInfo.a.freeText.popover" />";
    	$('#bibiscoCharacterInfoAFreeText').popover({placement	: 'top', content: freeTextPopover});
    	
    	
    	// init interview/free text
    	var initialText;
    	if (characterInfoBean.interviewMode == true) {
    		$('#bibiscoCharacterInfoDivFreeText').hide();
    		initialText = characterInfoBean.answers[0];
    		$('#bibiscoCharacterInfoAInterview').addClass('active');
    	} else {
    		$('#bibiscoCharacterInfoDivInterview').hide();
    		$('#bibiscoCharacterInfoDivInterviewButtons').hide();
    		initialText = characterInfoBean.freeText;
    		$('#bibiscoCharacterInfoAFreeText').addClass('active');
    	}
    	
    	// question change status array: this array is necessary to indicate whether the response 
    	// should be stored in the array characterInfoBean.answers. Only the changed answers are saved. 
    	// This is necessary to avoid saving empty answers in the case of fast transition from 
    	// a response to another. This is because bibiscoRichTextEditor is very slow to show answer.
    	questionChangeStatus = new Array();
    	for (i=0;i<characterInfoBean.answers.length;i++) {
    		questionChangeStatus[i] = false;
    	}
    	
    	// interview
    	$('#bibiscoCharacterInfoSelectInterview').select2();
    	$("#bibiscoCharacterInfoSelectInterview").on("change", function(e) {
    		var actualQuestion = getActualQuestion();
    		updateBibiscoRichTextEditor(actualQuestion, e.val);
    		var totalQuestion = getTotalQuestion();
    		if (e.val==0) {
    			$('#bibiscoCharacterInfoAPreviousQuestion').addClass('disabled');
    			$('#bibiscoCharacterInfoANextQuestion').removeClass('disabled');
    		} else if (e.val==totalQuestion-1) {
    			$('#bibiscoCharacterInfoAPreviousQuestion').removeClass('disabled');
    			$('#bibiscoCharacterInfoANextQuestion').addClass('disabled');
    		} else {
    			$('#bibiscoCharacterInfoAPreviousQuestion').removeClass('disabled');
    			$('#bibiscoCharacterInfoANextQuestion').removeClass('disabled');
    		}
    		setActualQuestion(e.val);
    	});
    	$('#bibiscoCharacterInfoAPreviousQuestion').addClass('disabled');
    	
    	// previous question
    	$('#bibiscoCharacterInfoAPreviousQuestion').click(function() {
    		var actualQuestion = getActualQuestion();
    		var previousQuestion = actualQuestion-1;
    		$("#bibiscoCharacterInfoSelectInterview").select2("val", previousQuestion);
    		if (previousQuestion==0) {
    			$('#bibiscoCharacterInfoAPreviousQuestion').addClass('disabled');
    		}
    		if (actualQuestion==0) {
    			return false;
    		}
    		$('#bibiscoCharacterInfoANextQuestion').removeClass('disabled');
    		updateBibiscoRichTextEditor(actualQuestion, previousQuestion);
    		setActualQuestion(previousQuestion);
    	});
    	$('#bibiscoCharacterInfoAPreviousQuestion').unbind('dblclick');
    	$('#bibiscoCharacterInfoAPreviousQuestion').dblclick(function(e){
    	    e.stopPropagation();
    	    e.preventDefault();
    	    return false;
    	});
    	
    	// next question
    	$('#bibiscoCharacterInfoANextQuestion').click(function() {
    		var actualQuestion = getActualQuestion();
    		var nextQuestion = actualQuestion+1;
    		var totalQuestion = getTotalQuestion();
    		if(actualQuestion==(totalQuestion-1)) {
    			return false;
    		}
    		
    		$("#bibiscoCharacterInfoSelectInterview").select2("val", nextQuestion);
    		if (nextQuestion==(totalQuestion-1)) {
    			$('#bibiscoCharacterInfoANextQuestion').addClass('disabled');
    		}
    		$('#bibiscoCharacterInfoAPreviousQuestion').removeClass('disabled');
    		updateBibiscoRichTextEditor(actualQuestion, nextQuestion);
    		setActualQuestion(nextQuestion);
    	});
    	$('#bibiscoCharacterInfoANextQuestion').unbind('dblclick');
    	$('#bibiscoCharacterInfoANextQuestion').dblclick(function(e){
    	    e.stopPropagation();
    	    e.preventDefault();
    	    return false;
    	});
    	
    	// rich text editor	
    	var bibiscoRichTextEditorVerticalPadding = 300;
    	var bibiscoRichTextEditorHeight = (ajaxDialog.getHeight() - bibiscoRichTextEditorVerticalPadding);
    	bibiscoRichTextEditor = bibiscoRichTextEditorInit({text: initialText, height: bibiscoRichTextEditorHeight, width: jsBibiscoRichTextEditorWidth, changeCallback: function() {setActualQuestionChange();}});
    	var bibiscoTaskStatusSelector = bibiscoTaskStatusSelectorInit({value: characterInfoBean.taskStatus, changeCallback: function() { bibiscoRichTextEditor.unSaved = true; } });
    
    }     
    
    function setActualQuestionChange() {
    	var actualQuestion = getActualQuestion();
    	questionChangeStatus[actualQuestion] = true;
    }
    
    function getActualQuestion() {
    	return parseInt($('#bibiscoCharacterInfoSelectInterview').attr('data-actual-question'));
    }
    
    function setActualQuestion(actualQuestion) {
    	$('#bibiscoCharacterInfoSelectInterview').attr('data-actual-question',actualQuestion);
    }
    
    function getTotalQuestion() {
    	return parseInt($('#bibiscoCharacterInfoSelectInterview').attr('data-questions'));
    }
    
    function updateBibiscoRichTextEditor(oldQuestion, newQuestion) {
    	if (questionChangeStatus[oldQuestion]) {
    		characterInfoBean.answers[oldQuestion] = bibiscoRichTextEditor.getText();
    		questionChangeStatus[oldQuestion] = false;
    	}
		bibiscoRichTextEditor.setText(characterInfoBean.answers[newQuestion]);
    }
    
 	// close dialog callback
	function bibiscoThumbnailCloseCallback(ajaxDialog, idCaller, type) {
		bibiscoRichTextEditor.destroy();
    }
	
	// before close dialog callback
	function bibiscoThumbnailBeforeCloseCallback(ajaxDialog, idCaller, type) {
		
		$('#bibiscoCharacterInfoDialogAClose').tooltip('hide');
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
	
//]]>           
</script>


<%@ taglib prefix="tags" tagdir="/WEB-INF/tags"%>
<div class="bibiscoDialogContent">
<div class="bibiscoCharacterInfo">
<div class="row-fluid">
	<div class="span12">
		<div id="bibiscoCharacterInfoDivInterview" class="bibiscoCharacterInfoInterview">
			<em><span>
				<select id="bibiscoCharacterInfoSelectInterview" data-actual-question="0" data-questions="${fn:length(questionList)}" class="selectpicker">
				<c:forEach items="${questionList}" var="question" varStatus="questionNumber">
	    			<c:if test="${questionNumber.count == 1}">
	    				<option value="0" selected="selected"><fmt:message key="jsp.characterInfo.question" />&nbsp;<c:out value="${question}"></c:out></option>
	    			</c:if>
					<c:if test="${questionNumber.count > 1}">
	    				<option value="${questionNumber.count - 1}"><fmt:message key="jsp.characterInfo.question" />&nbsp;<c:out value="${question}"></c:out></option>
	    			</c:if>
	    		</c:forEach>
			</select>
			</span></em>
		</div>
		<div id="bibiscoCharacterInfoDivFreeText" class="bibiscoCharacterInfoFreeText"><em><c:out value="${freeTextDescription}"></c:out></em></div>
	</div>
</div>
<hr />
</div>
<div id="bibiscoRichTextEditorTaskStatusDialogDivRichTextEditor">
<tags:bibiscoRichTextEditor />
</div>
<div id="bibiscoCharacterInfoDivInterviewButtons" class="bibiscoNotSelectableText bibiscoCharacterInfoDivInterviewButtons">
<a id="bibiscoCharacterInfoAPreviousQuestion" class="btn btn-large" href="#"><i class="icon-caret-left"></i>&nbsp;&nbsp;<strong><fmt:message key="jsp.characterInfo.a.previousQuestion" /></strong></a>
<a id="bibiscoCharacterInfoANextQuestion" class="btn btn-large" href="#"><strong><fmt:message key="jsp.characterInfo.a.nextQuestion" /></strong>&nbsp;&nbsp;<i class="icon-caret-right"></i></a>
</div>
</div>
<div class="bibiscoDialogFooter control-group">
	<table><tr>
		<td class="bibiscoCharacterInfoTaskStatusSelector">
			<tags:bibiscoTaskStatusSelector />
		</td>
		<td class="bibiscoCharacterInfoInterviewFreeTextSelector" align="center">
			<div id="bibiscoTagTaskStatusSelectorDiv" class="btn-group" data-toggle="buttons-radio">
				<a id="bibiscoCharacterInfoAInterview" title="<fmt:message key="jsp.characterInfo.a.interview" />" class="btn"><span><fmt:message key="jsp.characterInfo.a.interview" /></span></a>
				<a id="bibiscoCharacterInfoAFreeText" title="<fmt:message key="jsp.characterInfo.a.freeText" />" class="btn"><span><fmt:message key="jsp.characterInfo.a.freeText" /></span></a>
			</div>
		</td>
		<td class="bibiscoCharacterInfoDialogButtons">
			<a id="bibiscoCharacterInfoDialogASave" title="<fmt:message key="jsp.common.button.save" />" class="btn btn-primary" href="#"><i class="icon-ok icon-white"></i></a>
	    	<a id="bibiscoCharacterInfoDialogAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" href="#"><i class="icon-remove"></i></a>
		</td>
	</tr></table>
</div>