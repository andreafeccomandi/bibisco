<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
	var richTextEditorSettingsUnsaved = false;

	// init dialog callback
	function bibiscoRichTextEditorSettingsInit(ajaxDialog, idCaller, successCallback) {

		var fontSaved = '${richTextEditorSettings.font}';
		var sizeSaved = '${richTextEditorSettings.size}';
		var indentparagraphSaved = '${richTextEditorSettings.indentParagraphEnabled}';
		
		updateDivSample(fontSaved, sizeSaved, indentparagraphSaved);
		
		// set active buttons
		$('#bibiscoRichTextEditorSettingsButtonFont' + fontSaved).addClass("active");
		$('#bibiscoRichTextEditorSettingsButtonFontSize' + sizeSaved).addClass("active");
		$('#bibiscoRichTextEditorSettingsButtonIndentParagraph' + indentparagraphSaved).addClass("active");
		$('#bibiscoRichTextEditorSettingsButtonSpellCheck' + '${richTextEditorSettings.spellCheckEnabled}').addClass("active");
		$('#bibiscoRichTextEditorSettingsButtonAutoSave' + '${richTextEditorSettings.autoSaveEnabled}').addClass("active");
		
		$('.fontFamily button').click(function() {
			var id = $(this).attr('id');
			var font = $('#' + id).attr('name');
			var size = $('#bibiscoRichTextEditorSettingsDivFontSize .btn.active').attr('name');
			var indentparagraph = $('#bibiscoRichTextEditorSettingsDivIndentParagraph .btn.active').attr('name') == 'true';
			updateDivSample(font, size, indentparagraph);
			richTextEditorSettingsUnsaved = true;
		});

		$('.fontSize button').click(function() {
			var id = $(this).attr('id');
			var font = $('#bibiscoRichTextEditorSettingsDivFont .btn.active').attr('name');
			var size = $('#' + id).attr('name');
			var indentparagraph = $('#bibiscoRichTextEditorSettingsDivIndentParagraph .btn.active').attr('name') == 'true';
			updateDivSample(font, size, indentparagraph);
			richTextEditorSettingsUnsaved = true;
		});
		
		$('.indentParagraph button').click(function() {
			var id = $(this).attr('id');
			var font = $('#bibiscoRichTextEditorSettingsDivFont .btn.active').attr('name');
			var size = $('#bibiscoRichTextEditorSettingsDivFontSize .btn.active').attr('name');
			var indentparagraph = $('#' + id).attr('name');
			updateDivSample(font, size, indentparagraph);
			richTextEditorSettingsUnsaved = true;
		});
		
		$('.spellCheck button').click(function() {
			richTextEditorSettingsUnsaved = true;
		});
		
		$('.autoSave button').click(function() {
			richTextEditorSettingsUnsaved = true;
		});
		

		$('#bibiscoRichTextEditorSettingsASave').click(function() {
			
			var font = $('#bibiscoRichTextEditorSettingsDivFont .btn.active').attr('name');
			var size = $('#bibiscoRichTextEditorSettingsDivFontSize .btn.active').attr('name');
			var indentparagraph = $('#bibiscoRichTextEditorSettingsDivIndentParagraph .btn.active').attr('name') == 'true';
			var spellcheck = $('#bibiscoRichTextEditorSettingsDivSpellCheck .btn.active').attr('name') == 'true';
			var autosave = $('#bibiscoRichTextEditorSettingsDivAutoSave .btn.active').attr('name') == 'true';
			
			$.ajax({
				type : 'POST',
				url : 'BibiscoServlet?action=saveRichTextEditorSettings',
				data : {
					font : font,
					size : size,
					indentparagraph: indentparagraph,
					spellcheck: spellcheck,
					autosave: autosave
				},
				beforeSend : function() {
					bibiscoOpenLoadingBanner();
				},
				success : function(data) {
					richTextEditorSettingsUnsaved = false;
					$('#bibiscoRichTextEditorSettingsASave').tooltip('hide');
					if (successCallback) {
						successCallback(font, size, indentparagraph, spellcheck, autosave);
					}
					bibiscoCloseLoadingBannerSuccess();
					ajaxDialog.close();
				},
				error : function() {
					bibiscoCloseLoadingBannerError();
				}
			});
		});

		// tooltip
		$('#bibiscoRichTextEditorSettingsASave').tooltip();
		$('#bibiscoRichTextEditorSettingsAClose').tooltip();
	}

	// close dialog callback
	function bibiscoRichTextEditorSettingsClose(ajaxDialog, idCaller) {
	
	}

	// before close dialog callback
	function bibiscoRichTextEditorSettingsBeforeClose(ajaxDialog, idCaller) {
		$('#bibiscoRichTextEditorSettingsAClose').tooltip('hide');
		if (richTextEditorSettingsUnsaved) {
			bibiscoConfirm(jsCommonMessageConfirmExitWithoutSave, function(result) {
			    if (result) {
			    	richTextEditorSettingsUnsaved = false;
			    	ajaxDialog.close();
			    } 
			});
			return false;
		} else {
			return true;	
		}
	}

	// update sample div
	function updateDivSample(font, size, indentparagraph) {
				
		$('#bibiscoRichTextEditorSettingsDivSample').removeClass();
		$('#bibiscoRichTextEditorSettingsDivSample').addClass('well');
		$('#bibiscoRichTextEditorSettingsDivSample').addClass('richTextEditor');
		$('#bibiscoRichTextEditorSettingsDivSample').addClass('bibiscoRichTextEditor-bodyClass-' + font + size);
		$('#bibiscoRichTextEditorSettingsDivSample').addClass('bibiscoRichTextEditor-bodyClass-indent-'+ indentparagraph);
	}
</script>

<div class="bibiscoRichTextEditorSettings">
	<form class="form-horizontal">
		<div class="control-group">
			<label class="control-label" for="inputEmail"><fmt:message key="jsp.richTextEditorSettings.font" /></label>
			<div class="controls">
				<div class="btn-group fontFamily bibiscoRichTextEditorSettingsFont" data-toggle="buttons-radio" id="bibiscoRichTextEditorSettingsDivFont">
					<button id="bibiscoRichTextEditorSettingsButtonFontcourier" name="courier" class="btn"><fmt:message key="jsp.richTextEditorSettings.font.courier" /></button>
					<button id="bibiscoRichTextEditorSettingsButtonFonttimes" name="times" class="btn"><fmt:message key="jsp.richTextEditorSettings.font.times" /></button>
					<button id="bibiscoRichTextEditorSettingsButtonFontarial" name="arial" class="btn"><fmt:message key="jsp.richTextEditorSettings.font.arial" /></button>
				</div>
			</div>
		</div>
		<div class="control-group">
			<label class="control-label" for="inputPassword"><fmt:message key="jsp.richTextEditorSettings.fontSize" /></label>
			<div class="controls">
				<div class="btn-group fontSize" data-toggle="buttons-radio" id="bibiscoRichTextEditorSettingsDivFontSize">
					<button id="bibiscoRichTextEditorSettingsButtonFontSizebig" name="big" class="btn"><fmt:message key="jsp.richTextEditorSettings.fontsize.big" /></button>
					<button id="bibiscoRichTextEditorSettingsButtonFontSizemedium" name="medium" class="btn"><fmt:message key="jsp.richTextEditorSettings.fontsize.medium" /></button>
					<button id="bibiscoRichTextEditorSettingsButtonFontSizesmall" name="small" class="btn"><fmt:message key="jsp.richTextEditorSettings.fontsize.small" /></button>
				</div>
			</div>
		</div>
		<div class="control-group">
			<label class="control-label" for="inputPassword"><fmt:message key="jsp.richTextEditorSettings.indentParagraph" /></label>
			<div class="controls">
				<div class="btn-group indentParagraph" data-toggle="buttons-radio" id="bibiscoRichTextEditorSettingsDivIndentParagraph">
					<button id="bibiscoRichTextEditorSettingsButtonIndentParagraphtrue" name="true" class="btn"><fmt:message key="jsp.common.button.enabled" /></button>
					<button id="bibiscoRichTextEditorSettingsButtonIndentParagraphfalse" name="false" class="btn"><fmt:message key="jsp.common.button.disabled" /></button>
				</div>
			</div>
		</div>
		<c:if test="${OS == 'win' || OS == 'linux32' || OS == 'linux64'}">
		<div class="control-group">
			<label class="control-label" for="inputPassword"><fmt:message key="jsp.richTextEditorSettings.spellCheck" /></label>
			<div class="controls">
				<div class="btn-group spellCheck" data-toggle="buttons-radio" id="bibiscoRichTextEditorSettingsDivSpellCheck">
					<button id="bibiscoRichTextEditorSettingsButtonSpellChecktrue" name="true" class="btn"><fmt:message key="jsp.common.button.enabled" /></button>
					<button id="bibiscoRichTextEditorSettingsButtonSpellCheckfalse" name="false" class="btn"><fmt:message key="jsp.common.button.disabled" /></button>
				</div>
			</div>
		</div>
		</c:if>
		<div class="control-group">
			<label class="control-label" for="inputPassword"><fmt:message key="jsp.richTextEditorSettings.autoSave" /></label>
			<div class="controls">
				<div class="btn-group autoSave" data-toggle="buttons-radio" id="bibiscoRichTextEditorSettingsDivAutoSave">
					<button id="bibiscoRichTextEditorSettingsButtonAutoSavetrue" name="true" class="btn"><fmt:message key="jsp.common.button.enabled" /></button>
					<button id="bibiscoRichTextEditorSettingsButtonAutoSavefalse" name="false" class="btn"><fmt:message key="jsp.common.button.disabled" /></button>
				</div>
			</div>
		</div>
		<div id="bibiscoRichTextEditorSettingsDivSample">
			<fmt:message key="jsp.richTextEditorSettings.sampletext" />
		</div>	
	</form>
</div>

<div class="bibiscoDialogFooter control-group">
	<table>
		<tr>
			<td>
			 <a id="bibiscoRichTextEditorSettingsASave" title="<fmt:message key="jsp.common.button.save" />" class="btn btn-primary" href="#"><i class="icon-ok icon-white"></i></a> 
			 <a id="bibiscoRichTextEditorSettingsAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" href="#"><i class="icon-remove"></i></a>
			</td>
		</tr>
	</table>
</div>
