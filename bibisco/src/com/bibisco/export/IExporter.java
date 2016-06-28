/*
 * Copyright (C) 2014-2016 Andrea Feccomandi
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
package com.bibisco.export;

import java.io.File;

import com.bibisco.bean.RichTextEditorSettings;

/**
 * Exporter interface.
 * 
 * @author Andrea Feccomandi
 *
 */
public interface IExporter {
	
	public void init(String pStrFilePath, RichTextEditorSettings pRichTextEditorSettings);
	public void startChapter(String pStrChapterTitle);
	public void endChapter();
	public void startSection(String pStrSectionTitle);
	public void endSection();
	public void startSubSection(String pStrSubSectionTitle);
	public void endSubSection();
	public void startParagraph(ParagraphAligment pParagraphAligment);
	public void startParagraph(ParagraphAligment pParagraphAligment, boolean pParagraphIndent);
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
