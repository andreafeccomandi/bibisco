package com.bibisco.logic.export;

import java.io.File;

import com.bibisco.ui.bean.RichTextEditorSettings;

public interface IExporter {
	
	public void init(String pStrFilePath, RichTextEditorSettings pRichTextEditorSettings);
	public void startChapter(String pStrChapterTitle);
	public void endChapter();
	public void startSection(String pStrSectionTitle);
	public void endSection();
	public void startSubSection(String pStrSubSectionTitle);
	public void endSubSection();
	public void startParagraph(ParagraphAligment pParagraphAligment);
	public void endParagraph();
	public void startUnorderedList();
	public void endUnorderedList();
	public void startOrderedList();
	public void endOrderedList();
	public void startListItem();
	public void endListItem();
	public void addText(String pStrText, TextFormatting pTextFormatting);
	public File end();
	public void addEmptyLines(int pIntLinesNumber);
	
	
}
