<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
	var richTextEditorSettingsUnsaved = false;

	// init dialog callback
	function bibiscoRichTextEditorSettingsInit(ajaxDialog, idCaller) {

		// set active buttons
		$('#bibiscoRichTextEditorSettingsButtonFont' + '${richTextEditorSettings.font}').addClass("active");
		$('#bibiscoRichTextEditorSettingsButtonFontSize' + '${richTextEditorSettings.size}').addClass("active");
		$('#bibiscoRichTextEditorSettingsButtonSpellCheck' + '${richTextEditorSettings.spellCheckEnabled}').addClass("active");

		$('.fontFamily button').click(function() {
			var id = $(this).attr('id');
			var font = $('#' + id).attr('name');
			var size = $('#bibiscoRichTextEditorSettingsDivFontSize .btn.active').attr('name');
			updateDivSample('bibiscoRichTextEditor-bodyClass-' + font + size);
			richTextEditorSettingsUnsaved = true;
		});

		$('.fontSize button').click(function() {
			var id = $(this).attr('id');
			var font = $('#bibiscoRichTextEditorSettingsDivFont .btn.active').attr('name');
			var size = $('#' + id).attr('name');
			updateDivSample('bibiscoRichTextEditor-bodyClass-' + font + size);
			richTextEditorSettingsUnsaved = true;
		});
		
		$('.spellCheck button').click(function() {
			richTextEditorSettingsUnsaved = true;
		});
		

		$('#bibiscoRichTextEditorSettingsASave').click(function() {
			
			var font = $('#bibiscoRichTextEditorSettingsDivFont .btn.active').attr('name');
			var size = $('#bibiscoRichTextEditorSettingsDivFontSize .btn.active').attr('name');
			var spellcheck = $('#bibiscoRichTextEditorSettingsDivSpellCheck .btn.active').attr('name') == 'true';
			
			$.ajax({
				type : 'POST',
				url : 'BibiscoServlet?action=saveRichTextEditorSettings',
				data : {
					font : font,
					size : size,
					spellcheck: spellcheck
				},
				beforeSend : function() {
					bibiscoOpenLoadingBanner();
				},
				success : function(data) {
					richTextEditorSettingsUnsaved = false;
					$('#bibiscoRichTextEditorSettingsASave').tooltip('hide');
					if (idCaller == 'bibiscoTagRichTextEditorButtonSettings') {
						parent.bibiscoRichTextEditorUpdateSettings('bibiscoRichTextEditor-bodyClass-'+font+size, spellcheck);	
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
	function updateDivSample(styleClass) {
		$('#bibiscoRichTextEditorSettingsDivSample').removeAttr('class');
		$('#bibiscoRichTextEditorSettingsDivSample').addClass('well');
		$('#bibiscoRichTextEditorSettingsDivSample').addClass('richTextEditor');
		$('#bibiscoRichTextEditorSettingsDivSample').addClass(styleClass);
	}
</script>

<div style="margin-top: 10px;">
	<form class="form-horizontal">
		<div class="control-group">
			<label class="control-label" for="inputEmail"><fmt:message key="jsp.richTextEditorSettings.font" /></label>
			<div class="controls">
				<div class="btn-group fontFamily" data-toggle="buttons-radio" id="bibiscoRichTextEditorSettingsDivFont">
					<button id="bibiscoRichTextEditorSettingsButtonFontcourier" name="courier" class="btn" style="font-family: Courier new"><fmt:message key="jsp.richTextEditorSettings.font.courier" /></button>
					<button id="bibiscoRichTextEditorSettingsButtonFonttimes" name="times" class="btn" style="font-family: Times New Roman, Times, serif"><fmt:message key="jsp.richTextEditorSettings.font.times" /></button>
					<button id="bibiscoRichTextEditorSettingsButtonFontarial" name="arial" class="btn" style="font-family: Arial, Helvetica, sans-serif"><fmt:message key="jsp.richTextEditorSettings.font.arial" /></button>
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
			<label class="control-label" for="inputPassword"><fmt:message key="jsp.richTextEditorSettings.spellCheck" /></label>
			<div class="controls">
				<div class="btn-group spellCheck" data-toggle="buttons-radio" id="bibiscoRichTextEditorSettingsDivSpellCheck">
					<button id="bibiscoRichTextEditorSettingsButtonSpellChecktrue" name="true" class="btn"><fmt:message key="jsp.richTextEditorSettings.spellCheck.enabled" /></button>
					<button id="bibiscoRichTextEditorSettingsButtonSpellCheckfalse" name="false" class="btn"><fmt:message key="jsp.richTextEditorSettings.spellCheck.disabled" /></button>
				</div>
			</div>
		</div>
		<div id="bibiscoRichTextEditorSettingsDivSample" class="well richTextEditor bibiscoRichTextEditor-bodyClass-${richTextEditorSettings.font}${richTextEditorSettings.size}"
			style="background-color: white; padding: 10px; margin-top: 30px; width: 530px; height: 120px;">
			<fmt:message key="jsp.richTextEditorSettings.sampletext" />
		</div>	
	</form>
</div>

<div class="bibiscoDialogFooter control-group">
	<table style="width: 100%">
		<tr>
			<td style="text-align: right;">
			<a id="bibiscoRichTextEditorSettingsASave" title="<fmt:message key="jsp.common.button.save" />" class="btn btn-primary" style="margin-left: 5px;" href="#"><i
					class="icon-ok icon-white"></i></a> 
			<a id="bibiscoRichTextEditorSettingsAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" style="margin-left: 5px;"
				href="#"><i class="icon-remove"></i></a></td>
		</tr>
	</table>
</div>
