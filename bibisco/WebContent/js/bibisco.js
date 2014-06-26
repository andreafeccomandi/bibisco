/*
 * Copyright (C) 2014 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.gnu.org/licenses/gpl-2.0.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY. 
 * See the GNU General Public License for more details.
 * 
 */

/* Select top menu item*/
function bibiscoSelectTopMenuItem(item) {
	
	// if a character is open back to characters list before change menu item
	if ($('#bibiscoCharacterABackToCharacterList').is(':visible')) {
		$('#bibiscoCharacterABackToCharacterList').click();
	}
	
	// if a chapter is open back to chapters list before change menu item
	if ($('#bibiscoChapterABackToChapterList').is(':visible')) {
		$('#bibiscoChapterABackToChapterList').click();
	}
	
	var oldActiveLi = $("#bibiscoMenuUl .active");
	oldActiveLi.removeClass("active");
	var newActiveLi = $("#bibiscoMenuLi" + item);
	newActiveLi.addClass("active");
	var div2Hide = $("#bibiscoMainDiv" + oldActiveLi.attr("data-div"));
	div2Hide.hide();
	var div2Show = $("#bibiscoMainDiv" + newActiveLi.attr("data-div"));
	div2Show.show();
}


function bibiscoCalculateAjaxDialogPosition(ajaxDialogContent) {
	// RULES to calculate position:
	// 1) if ajaxDialogContent specifies positionTop or positionLeft, use [positionTop, positionLeft]
	// 2) if ajaxDialogContent specifies position, use position object
	// 3) if ajaxDialogContent doesn't specify positionTop/positionLeft or position, use default position
	
	var defaultPositionTop = 100;
	var width = 300;
	if (ajaxDialogContent.width) {
		width = ajaxDialogContent.width;
	}
	var defaultPositionLeft = (window.innerWidth - width) / 2;
	var defaultPosition = { my: "center", at: "center", of: window };
	var position;
	
	// 1) if ajaxDialogContent specifies positionTop or positionLeft, use [positionTop, positionLeft]
	if (ajaxDialogContent.positionTop || ajaxDialogContent.positionLeft) {
		if (ajaxDialogContent.positionLeft) {
			positionLeft = ajaxDialogContent.positionLeft;
		} else {
			positionLeft = defaultPositionLeft;
		}
		if (ajaxDialogContent.positionTop) {
			positionTop = ajaxDialogContent.positionTop;
		} else {
			positionTop = defaultPositionTop;
		}
		position = [positionLeft, positionTop];
	} 
	
	// 2) if ajaxDialogContent specifies position, use position object
	else if (ajaxDialogContent.position) {
		position = ajaxDialogContent.position;
	}
	
	// 3) if ajaxDialogContent doesn't specify positionTop/positionLeft or position, use default position
	else {
		position = defaultPosition;
	}
	
	return position;
}


/* Open modal ajax dialog */
function bibiscoOpenAjaxDialog(ajaxDialogContent) {

	var width = 300;
	if (ajaxDialogContent.width) {
		width = ajaxDialogContent.width;
	}
	var height = 'auto';
	if (ajaxDialogContent.height) {
		height = ajaxDialogContent.height;
	}
	
	// create a dialog div
	var idDialog = 'bibiscoDivDialog' + $.now();
	var dialog = $('<div id="' + idDialog + '" style="display:none" class="bibiscoAjaxDialog loading"></div>').appendTo('body');
	// open the dialog
	dialog.dialog({

		beforeclose : function() {

			// callback to beforeClose dialog
			return ajaxDialogContent.beforeClose(dialog, ajaxDialogContent.idCaller, ajaxDialogContent.type, ajaxDialogContent.id);
		},

		// add a close listener to prevent adding multiple divs to the document
		close : function(event, ui) {

			// callback to close dialog
			ajaxDialogContent.close(dialog, ajaxDialogContent.idCaller, ajaxDialogContent.type, ajaxDialogContent.id);

			// remove div
			dialog.remove();
		},
		modal : ajaxDialogContent.modal,
		width : width,
		height : height,
		title : ajaxDialogContent.title,
		resizable : ajaxDialogContent.resizable,
		closeOnEscape : false,
		position: bibiscoCalculateAjaxDialogPosition(ajaxDialogContent),
		draggable: false,
		dialogClass: 'dialog-no-close'
			
		// create FAKE_BUTTON only to force dialog to show footer
		,
		buttons : {
			"" : function() {
			}
		}
	});

	// load remote content
	dialog.load(ajaxDialogContent.url, {}, // omit this param object to issue a
	// GET request instead a POST
	// request, otherwise you may
	// provide post parameters within
	// the object
	function(responseText, textStatus, XMLHttpRequest) {

		// remove FAKE_BUTTON only to force dialog to show footer
		dialog.find('.ui-dialog .ui-dialog-buttonpane button').each(function() {
			$(this).remove();
		});

		// find element with ajaxDialodCloseBtn class to bind on click dialog
		// close
		dialog.find(".ajaxDialogCloseBtn").click(function() {
			dialog.dialog("close")
		});

		// move div with class bibiscoDialogFooter in dialog footer
		var bibiscoDialogFooter = dialog.find('.bibiscoDialogFooter');
		dialog.next().append(bibiscoDialogFooter);
		
		// callback to init function
		ajaxDialogContent.init(dialog, ajaxDialogContent.idCaller, ajaxDialogContent.type, ajaxDialogContent.id);

		// remove the loading class
		dialog.removeClass('loading');
	});

	// full screen function
	dialog.fullscreen = function() {
		dialog.lastHeight = dialog.closest('.ui-dialog').height();
		dialog.lastWidth = dialog.closest('.ui-dialog').width();
		dialog.lastPosition = dialog.closest('.ui-dialog').position();
		dialog.closest('.ui-dialog').removeClass("ui-corner-all");
		dialog.closest('.ui-dialog').removeClass("ui-widget-content");
		dialog.closest('.ui-dialog').addClass("ui-widget-content-fullscreen");
		dialog.dialog("option", "draggable", false);
		dialog.dialog("option", "width", "100%");
		dialog.dialog("option", "height", window.innerHeight - 5);
		dialog.dialog("option", "position", [ 0, 0 ]);
	}

	// exit full screen function
	dialog.exitfullscreen = function() {
		dialog.dialog("option", "draggable", true);
		dialog.dialog("option", "width", dialog.lastWidth);
		dialog.dialog("option", "height", dialog.lastHeight);
		dialog.dialog("option", "position", [ dialog.lastPosition.left, dialog.lastPosition.top ]);
		dialog.closest('.ui-dialog').addClass("ui-corner-all");
		dialog.closest('.ui-dialog').addClass("ui-widget-content");
		dialog.closest('.ui-dialog').removeClass("ui-widget-content-fullscreen");
	}

	// close function
	dialog.close = function() {
		dialog.dialog('close');
	}

	// height function
	dialog.getHeight = function() {
		return dialog.closest('.ui-dialog').height();
	}

	// width function
	dialog.getWidth = function() {
		return dialog.closest('.ui-dialog').width();
	}

	// position function
	dialog.getPosition = function() {
		return dialog.closest('.ui-dialog').position();
	}

	// return dialog id
	return dialog;

}

/* Confirmation modal popup */
function bibiscoConfirm(text, callback) {
	bootbox.setIcons({
		"CANCEL" : "icon-ban-circle",
		"CONFIRM" : "icon-ok icon-white"
	});
	bootbox.confirm(text, jsBibiscoConfirmCancel, jsBibiscoConfirmOk, callback);
}

/* Alert modal popup */
function bibiscoAlert(text) {
	bootbox.setIcons({
		"OK" : "icon-ok icon-white",
	});
	bootbox.alert(text, jsBibiscoAlertOk);
}

/* block user interface */
function bibiscoBlockUI() {
	$.blockUI({baseZ: 5000, message: null});
}

/* unblock user interface */
function bibiscoUnblockUI() {
	$.unblockUI();
}

/* Open loading banner */
function bibiscoOpenLoadingBanner() {
	$('<div id="bibiscoMainDivLoading" class="bibiscoMainDivLoadingClass" style="z-index: 6000; text-align: center;"><div class="alert alert-info" style="width: 250px;text-align:center;padding: 8px 8px 8px 8px;"><h4 class="alert-heading"><img src="img/bibisco-loading.gif" />&nbsp;&nbsp;&nbsp;'
					+ jsBibiscoLoadingStart + '</h4></div></div>').appendTo('body');
	$("#bibiscoMainDivLoading").fadeIn().css({
		position : "absolute",
		top : (window.innerHeight - 75) + "px",
		left : ((window.innerWidth - 250) / 2) + "px"
	});
}

/* Close loading banner with success */
function bibiscoCloseLoadingBannerSuccess() {
	$('#bibiscoMainDivLoading').html(
			'<div class="alert alert-success" style="width: 250px;text-align:center;padding: 8px 8px 8px 8px;"><h4 class="alert-heading"> ' + jsBibiscoLoadingEndSuccess + '</h4></div>');
	$("#bibiscoMainDivLoading").delay(1500).fadeOut('slow', function() {
		$(".bibiscoMainDivLoadingClass").remove()
	});

}

/* Close loading banner with error */
function bibiscoCloseLoadingBannerError() {
	$('#bibiscoMainDivLoading').html(
			'<div class="alert alert-error" style="width: 250px;text-align:center;padding: 8px 8px 8px 8px;"><h4 class="alert-heading"> ' + jsBibiscoLoadingEndError + '</h4></div>');
	$("#bibiscoMainDivLoading").delay(2000).fadeOut('slow', function() {
		$("#bibiscoMainDivLoading").remove()
	});
}

/* Close loading banner without message */
function bibiscoCloseLoadingBannerWithoutMessage() {
	$("#bibiscoMainDivLoading").remove();
}


/* Create task status banner */
function bibiscoGetBibiscoTaskStatus(taskStatus, wordCount, characterCount) {
	
	var result = '';
	if (!(wordCount === 'undefined' && characterCount === 'undefined')) {
		result = result + '<span class="label label-info" title="' + jsBibiscoTaskStatusWords +  ' (' + jsBibiscoTaskStatusCharacters + ')">'+ wordCount + ' (' +  characterCount + ')</span>&nbsp;';
	}
	
	if (taskStatus == 'TODO') {
		result = result + '<span class="badge badge-important bibiscoTaskStatusTodo" data-original-title="'+ jsBibiscoTaskStatusTodoDescription +'">' + jsBibiscoTaskStatusTodo + '</span>';
	} else if (taskStatus == 'TOCOMPLETE') {
		result = result + '<span class="badge badge-warning bibiscoTaskStatusToComplete" data-original-title="'+ jsBibiscoTaskStatusToCompleteDescription +'">' + jsBibiscoTaskStatusToComplete + '</span>';
	} else if (taskStatus == 'COMPLETED') {
		result = result + '<span class="badge badge-success bibiscoTaskStatusCompleted" data-original-title="'+ jsBibiscoTaskStatusCompletedDescription +'">' + jsBibiscoTaskStatusCompleted + '</span>';
	}
	
	return result;
}

/* Get array of word from text node */
function bibiscoGetWordsFromNodeText(nodeText) {
	nodeText = nodeText.replace(/\./g, ' ');
	nodeText = nodeText.replace(/\,/g, ' ');
	nodeText = nodeText.replace(/\;/g, ' ');
	nodeText = nodeText.replace(/\:/g, ' ');
	nodeText = nodeText.replace(/\!/g, ' ');
	nodeText = nodeText.replace(/\?/g, ' ');
	nodeText = nodeText.replace(/\'/g, ' ');
	nodeText = nodeText.replace(/\"/g, ' ');
	nodeText = nodeText.replace(/\n/g, ' ');
	nodeText = nodeText.replace(/\r/g, ' ');
	nodeText = nodeText.replace(/\t/g, ' ');
	nodeText = nodeText.replace(/\b/g, ' ');
	nodeText = nodeText.replace(/\f/g, ' ');

	return nodeText.split(' ');
}

/* Get words from rich text editor */
function bibiscoGetWordsToCheck(pRichTextEditor) {

	var wordsToCheck = new Array();
	var i = 0;
	var range = new CKEDITOR.dom.range(pRichTextEditor.document);
	range.setStartAt(pRichTextEditor.document.getBody(), CKEDITOR.POSITION_AFTER_START);
	range.setEndAt(pRichTextEditor.document.getBody(), CKEDITOR.POSITION_AFTER_END);
	var walker = new CKEDITOR.dom.walker(range);
	walker.guard = function(node) {
		if (node.type == 3 && node.getParent().getName() != 'spellerror') {
			var nodeText = node.getText();
			var words = bibiscoGetWordsFromNodeText(nodeText);
			for ( var j = 0; j < words.length; j++) {
				var wordTrimmed = $.trim(words[j]);
				if (wordTrimmed.length > 0 && $.inArray(wordTrimmed, wordsToCheck) == -1) {
					wordsToCheck[i++] = wordTrimmed;
				}
			}
		}
	};

	while (node = walker.next()) {
	}

	return wordsToCheck;
}


function bibiscoRichTextEditorSpellCheck(pRichTextEditor, pSync) {
	
	// set asynch flag
	var async = true;
	if (pSync) {
		async = false;
	}
	
	// get caret position
	var selectionRange = pRichTextEditor.getSelection().getRanges()[0];
	
	// if selection range is null or undefinde return
	if (!selectionRange) {
		return;
	}
	
	// remove spellerror tags near to caret position
	var parent = selectionRange.startContainer.getParent();
	var previous = selectionRange.startContainer.getPrevious();
	var next = selectionRange.startContainer.getNext();
	
	if(previous!=null && previous.type==1 && previous.getName()=='spellerror') {
		previous.remove(true);
	}
	if(parent!=null && parent.type==1 && parent.getName()=='spellerror') {
		parent.remove(true);
	}
	if(next!=null && next.type==1 && next.getName()=='spellerror') {
		next.remove(true);
	}
	
	// create bookmark to preserve caret position
	var bookmark = selectionRange.createBookmark();
	
	// normalize body to remove empty text nodes and joins adjacent text nodes
	var body = pRichTextEditor.document.getBody().$.normalize();

	$.ajax({
		  type: 'POST',
		  async: async,
		  url: 'BibiscoServlet?action=spellCheck',
		  data: { text: pRichTextEditor.getText() },
		  dataType: 'json',
		  error:function(jqXHR, textStatus, errorThrown) {},
		  success:function(spellCheckResult){
				// if the are misspelled words insert spellerror tags
				if (spellCheckResult.misspelledWords.length > 0) {

					for ( var i = 0; i < spellCheckResult.misspelledWords.length; i++) {
						var misspelledWord = spellCheckResult.misspelledWords[i].misspelledWord;
						
						var misspelledWordRegEx = new RegExp("(^|[^a-zA-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŒœŠšŸ])("+misspelledWord+")([^a-zA-zÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŒœŠšŸ]|$)");
						var misspelledWordOccurences = spellCheckResult.misspelledWords[i].occurences;
						var misspelledWordOccurencesFound = 0;
						var suggestions = spellCheckResult.misspelledWords[i].suggestions;
						
						// check document
						var range = new CKEDITOR.dom.range(pRichTextEditor.document);
						range.setStartAt(pRichTextEditor.document.getBody(), CKEDITOR.POSITION_AFTER_START);
						range.setEndAt(pRichTextEditor.document.getBody(), CKEDITOR.POSITION_AFTER_END);
						var walker = new CKEDITOR.dom.walker(range);
						walker.guard = function(node) {
							
							if (node.type == 3 && misspelledWordRegEx.test(node.getText())  && (node.getParent() == null || node.getParent().getName() !='spellerror')) {
								var nodeText = node.getText();
								do {
									// enclose misspelled words in spellerror tags
									nodeText = nodeText.replace(misspelledWordRegEx, "\$1<spellerror class='spellerror' suggestions='" + suggestions + "'>\$2</spellerror>\$3");
																		
									// count misspelled word occurences
									misspelledWordOccurencesFound++;
									
								} while (misspelledWordRegEx.test(nodeText)  && misspelledWordOccurencesFound < misspelledWordOccurences);
								
								// create a span element to hold parsed text
								var span = new CKEDITOR.dom.element('span');
								span.setHtml(nodeText);

								// insert span element before node
								span.insertBefore(node);								

								// Removes span element from the document DOM, preserving children
								span.remove(true);
								
								// Empty checked text node
								node.setText('');	
							}
						};

						// cycle until the end of the document or until I find all
						// occurrences of the misspelled word
						while (node = walker.next() && misspelledWordOccurencesFound < misspelledWordOccurences) {
						}
					}
				}
				
				// remove bookmark
				bookmark.startNode.remove();
		  },
		});
}

// disable click on button identified by id
function bibiscoDisableButton(id) {
	$('#'+id).bind('click',bibiscoReturnFalse);
	$('#'+id).addClass("disabled");
}

//enable click on button identified by id
function bibiscoEnableButton(id) {
	$('#'+id).unbind('click',bibiscoReturnFalse);
	$('#'+id).removeClass("disabled");
}

function bibiscoReturnFalse() {
	return false;
}

// initialize all thumbanil of a family
function bibiscoInitAllThumbnail(config) {

	// initialize scrollbar
	config.scrollbar = $('.bibiscoThumbnailPages[data-thumbnailFamily="' + config.family + '"]').jScrollPane({
		autoReinitialise: true, animateScroll: true, verticalGutter: 30
	}).data('jsp');
	
	var thumbnailCount = bibiscoThumbnailCount(config.family);
	for ( var i = 1; i <= thumbnailCount; i++) {
		bibiscoInitThumbnail(i, config);
	}
	
	bibiscoSetTooltipOnThumbnailFamily(config.family)
}

// count all thumbnails of a family
function bibiscoThumbnailCount(family) {
	return $('.thumbnailSlot[data-thumbnailFamily="' + family + '"]').length;
}

// initialize thumbnail
function bibiscoInitThumbnail(position, config) {

	var family = config.family;
	var thumbnailCount = bibiscoThumbnailCount(family);
	var thumbnailSelector = '.thumbnailSlot[data-thumbnailFamily="' + family + '"][data-slotPosition="' + position + '"] .thumbnail ';
	var thumbnail = $(thumbnailSelector);
	
	// delete button
	var deleteButton = $(thumbnailSelector + '.bibiscoThumbnailButtonDelete');
	deleteButton.tooltip();
	deleteButton.unbind('click');
	deleteButton.click(function(e) {
		deleteButton.tooltip('hide');
		return bibiscoDeleteThumbnail(position, config);
	});

	// toolbar
	var toolbar = $(thumbnailSelector + '.bibiscoThumbnailToolbar');
	toolbar.hide();
	
	// hover
	thumbnail.hover(function() {
		thumbnail.addClass("thumbnailTagHover");
		toolbar.show();
	}, function() {
		thumbnail.removeClass("thumbnailTagHover");
		toolbar.hide();
	});

	// call custom init function
	if (config.init) {
		config.init(position, config);
	}

	// initialize select function
	if (config.select) {
		//remove previous click function
		thumbnail.unbind('click');
		thumbnail.click(function() {
			config.select(position, config);
		});
	}

	// initialize drag'n drop function
	if (config.dnd == true) {
		thumbnail.draggable({
			appendTo : "body",
			helper : "clone",
			cursor: "move", 
			scroll: false,
			cursorAt: { top: 56, left: 56 },
			start: function(event, ui) {
				$(ui.helper).removeClass("thumbnailTagHover");
				$(ui.helper).addClass("thumbnailTagMove");
				$(ui.helper).find('.bibiscoThumbnailToolbar').hide();
				$(ui.helper).width(thumbnail.width());
				$(ui.helper).height(thumbnail.height());				
            },
            drag: function() {
                
            },
            stop: function(event, ui) {
            
            }
		});

		$('.thumbnailSlot[data-thumbnailFamily="' + family + '"]').droppable({
			hoverClass: 'thumbnailTagHover',
			accept : '.thumbnailSlot[data-thumbnailFamily="' + family + '"] .thumbnail ',
			drop : function(event, ui) {
				var sourcePosition = parseInt(ui.draggable.closest('.thumbnailSlot').attr('data-slotPosition'));
				var destPosition = parseInt($(this).attr('data-slotPosition'));

				$.ajax({
					type : 'POST',
					url : 'BibiscoServlet?action=thumbnailAction',
					data : {
						thumbnailAction : 'move',
						sourcePosition : sourcePosition,
						destPosition : destPosition,
						family : config.family
					},
					beforeSend : function() {
						bibiscoOpenLoadingBanner();
					},
					success : function(data) {
						var thumbnailSlotSource = bibiscoGetThumbnailSlotFromPosition(family, sourcePosition);
						var thumbnailSlotDestination = bibiscoGetThumbnailSlotFromPosition(family, destPosition);

						if (sourcePosition < destPosition) {
							var html = thumbnailSlotSource.html();
							for ( var i = sourcePosition; i < destPosition; i++) {
								var thumbnailSlot = bibiscoGetThumbnailSlotFromPosition(family, i);
								var thumbnailSlotNext = bibiscoGetThumbnailSlotFromPosition(family, i + 1);
								thumbnailSlot.html(thumbnailSlotNext.html());
							}
							thumbnailSlotDestination.html(html);
						} else {
							var html = thumbnailSlotSource.html();
							for ( var i = sourcePosition; i > destPosition; i--) {
								var thumbnailSlot = bibiscoGetThumbnailSlotFromPosition(family, i);
								var thumbnailSlotPrevious = bibiscoGetThumbnailSlotFromPosition(family, i - 1);
								thumbnailSlot.html(thumbnailSlotPrevious.html());
							}
							thumbnailSlotDestination.html(html);
						}

						bibiscoInitAllThumbnail(config);
						bibiscoCloseLoadingBannerSuccess();
						$('.thumbnailSlot[data-thumbnailFamily="' + family + '"] .thumbnail ').removeClass("thumbnailTagHover");
						
					},
					error : function() {
						bibiscoCloseLoadingBannerError();
					}
				});
			}
		});
	}
}

// set tooltip on thumbnail family
function bibiscoSetTooltipOnThumbnailFamily(family) {
	$('.bibiscoThumbnailPages[data-thumbnailFamily="' + family + '"] .bibiscoTagTaskStatusDiv span').tooltip();
}

// get thumbnailSlot of a family at specified position
function bibiscoGetThumbnailSlotFromPosition(family, position) {
	return thumbnailSlot = $('.thumbnailSlot[data-thumbnailFamily="' + family + '"][data-slotPosition="' + position + '"]');
}

//get thumbnail of a family at specified position
function bibiscoGetThumbnailFromPosition(family, position) {
	var thumbnailSlot = bibiscoGetThumbnailSlotFromPosition(family, position);
	return thumbnailSlot.find('div.thumbnail');
}

//get thumbnail id of a family at specified position
function bibiscoGetThumbnailIdFromPosition(family, position) {
	return bibiscoGetThumbnailFromPosition(family, position).attr('data-bibiscoTagThumbnailId');
}

// delete thumbnail 
function bibiscoDeleteThumbnail(position, config) {

	bibiscoConfirm(config.del.confirmMessage, function(result) {
	    if (result) {
	    	$.ajax({
				type : 'POST',
				url : 'BibiscoServlet?action=thumbnailAction',
				data : {
					thumbnailAction : 'delete',
					position : position,
					family : config.family
				},
				beforeSend : function() {
					bibiscoOpenLoadingBanner();
				},
				success : function(data) {
					
					if (data == 'bibisco_delete_ko') {
						bibiscoCloseLoadingBannerWithoutMessage();
						bibiscoAlert(config.del.deleteKoMessage)
					} else {
						
						var family = config.family;
						var thumbnailCount = bibiscoThumbnailCount(family);

						for ( var i = position; i < thumbnailCount + 1; i++) {
							var thumbnailSlot = bibiscoGetThumbnailSlotFromPosition(family,i);
							var thumbnailSlotNext = bibiscoGetThumbnailSlotFromPosition(family,i+1);
							thumbnailSlot.html(thumbnailSlotNext.html());
						}

						if (thumbnailCount == 1) {
							 bibiscoShowEmptyThumbnailListElements(family);
						}
						
						var thumbnailSlotLast = $('.thumbnailSlot[data-thumbnailFamily="' + family + '"][data-slotPosition="' + thumbnailCount + '"]');
						if ((thumbnailCount % config.rowSlots == 1) && (thumbnailCount > 1)) {
							thumbnailSlotLast.closest('section').remove();
						} else {
							thumbnailSlotLast.remove();
						}
												
						bibiscoInitAllThumbnail(config);
						
						if (config.del.action) {
							config.del.action(position, config);
						}
						
						bibiscoCloseLoadingBannerSuccess();						
					}
					
				},
				error : function() {
					bibiscoCloseLoadingBannerError();
				}
			});
	    } 
	});
	
	return false;
}

// add thumbail
function bibiscoAddThumbnail(data, position, config) {

	var family = config.family;
	var position = parseInt(position);
	
	if (position % config.rowSlots == 1 && position > 1) {
		$('.bibiscoThumbnailPages[data-thumbnailFamily="' + family + '"] section:last').after(data);
	} else {
		$('.bibiscoThumbnailPages[data-thumbnailFamily="' + family + '"] section:last .row-fluid').append(data);
	}
	
	if (position == 1) {
		bibiscoShowNotEmptyThumbnailListElements(family);
	}

	bibiscoInitAllThumbnail(config);
	config.scrollbar.scrollToPercentY(100);
}

// open thumbnail title form
function openThumbnailUpdateTitle(idCaller, config, id, position) {
	
	var ajaxDialogContent = { 
		  idCaller: idCaller,
		  url: 'jsp/thumbnailTitleForm.jsp?action=changeThumbnailTitle&position='+position+'&id='+id,	    
		  title: config.titleForm.updateTitleLabel, 
		  init: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormInit(idAjaxDialog, idCaller, config); },
		  close: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormClose(idAjaxDialog, idCaller); },
		  beforeClose: function (idAjaxDialog, idCaller) { return bibiscoThumbnailTitleFormBeforeClose(idAjaxDialog, idCaller); },
		  resizable: false, modal: true,
		  width: 500, height: 210, positionTop: 100
	};

	bibiscoOpenAjaxDialog(ajaxDialogContent);
}


function bibiscoShowEmptyThumbnailListElements(family) {
	$('.emptyThumbnailListElements[data-thumbnailFamily="' + family + '"] ').show();
	$('.notEmptyThumbnailListElements[data-thumbnailFamily="' + family + '"] ').hide();
}

function bibiscoShowNotEmptyThumbnailListElements(family) {
	$('.emptyThumbnailListElements[data-thumbnailFamily="' + family + '"] ').hide();
	$('.notEmptyThumbnailListElements[data-thumbnailFamily="' + family + '"] ').show();
}

function bibiscoOpenDefaultBrowser(url) {

	$.ajax({
		  type: 'GET',
		  async: true,
		  url: 'BibiscoServlet?action=openUrlExternalBrowser&url='+url,
		  error:function(jqXHR, textStatus, errorThrown) {},
		  success:function(spellCheckResult){},
		});
}
