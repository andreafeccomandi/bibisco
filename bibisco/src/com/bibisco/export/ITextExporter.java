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
package com.bibisco.export;

import java.io.File;
import java.io.FileOutputStream;

import com.bibisco.BibiscoException;
import com.bibisco.bean.RichTextEditorSettings;
import com.bibisco.enums.ExportType;
import com.bibisco.log.Log;
import com.lowagie.text.Anchor;
import com.lowagie.text.Chapter;
import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.List;
import com.lowagie.text.ListItem;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Section;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.rtf.RtfWriter2;

/**
 * IText implementation of IExporter interface.
 * 
 * @author Andrea Feccomandi
 *
 */
public class ITextExporter implements IExporter {

	private static Log mLog = Log.getInstance(ITextExporter.class);
	private static int LIST_INDENTATION_LEFT = 25;
	private static final int PARAGRAPH_FIRST_LINE_INDENT = 0;
	
	ExportType mExportType;
	Document mDocument = new Document(PageSize.A4, 68, 68, 80, 80); 
	int mIntChapterPosition;
	Chapter mChapter = null;
	Section mSection = null;
	Section mSubSection = null;
	Paragraph mParagraph = null;
	List mList = null;
	ListItem mListItem = null;
    File mFile = null;
    Font mFont = null;
   
	
	public ITextExporter(ExportType pExportType) {
		mExportType = pExportType;
	}
	
	

	@Override
	public void startChapter(String pStrChapterTitle) {
		
		Font lFont = new Font();
		lFont.setFamily(mFont.getFamilyname());
		lFont.setSize(mFont.getSize());
		lFont.setStyle(Font.BOLD);
		
		Anchor anchor = new Anchor(pStrChapterTitle, lFont);
		anchor.setName(pStrChapterTitle);

		mChapter = new Chapter(new Paragraph(anchor), ++mIntChapterPosition);
		addEmptyLines(1);
	}
	
	@Override
	public void startParagraph(ParagraphAligment pParagraphAligment) {
		
		mLog.debug("Start startParagraph()");
		
		mParagraph = new Paragraph(22);
		mParagraph.setFirstLineIndent(PARAGRAPH_FIRST_LINE_INDENT);
		
		switch (pParagraphAligment) {
		case LEFT:
			mParagraph.setAlignment(Element.ALIGN_LEFT);
			break;
		case CENTER:
			mParagraph.setAlignment(Element.ALIGN_CENTER);
			break;
		case RIGHT:
			mParagraph.setAlignment(Element.ALIGN_RIGHT);
			break;
		case JUSTIFY:
			mParagraph.setAlignment(Element.ALIGN_JUSTIFIED);
			break;	
			
		default:
			break;
		}
		
		mLog.debug("End startParagraph()");
	}
	
	@Override
	public void endParagraph() {
		
		mLog.debug("Start endParagraph()");
		
		try {
			if (mSubSection != null) {
				mSubSection.add(mParagraph);
			} else if (mSection != null) {
				mSection.add(mParagraph);
			} else if (mChapter != null) {
				mChapter.add(mParagraph);
			} else {
				mDocument.add(mParagraph);
			}
			mParagraph = null;
			
		} catch (DocumentException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.IO_EXCEPTION);
		}	
		
		mLog.debug("End endParagraph()");
	}
	
	
	@Override
	public void startUnorderedList() {
		mList = new List(List.UNORDERED);
		mList.setIndentationLeft(LIST_INDENTATION_LEFT);
		mList.setAlignindent(true);
		mList.setAutoindent(true);
		mList.setListSymbol("*");
	}
	
	@Override
	public void endUnorderedList() {
		endList();
	}
	
	private void endList() {
		try {
			if (mSubSection != null) {
				mSubSection.add(mList);
			} else if (mSection != null) {
				mSection.add(mList);
			} else if (mChapter != null) {
				mChapter.add(mList);
			} else {
				mDocument.add(mList);
			}
			mList = null;
			
		} catch (DocumentException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.IO_EXCEPTION);
		}
	}
		
	@Override
	public void startOrderedList() {
		mList = new List(List.ORDERED);	
		mList.setIndentationLeft(LIST_INDENTATION_LEFT);
		mList.setAlignindent(true);
		mList.setAutoindent(true);
	}
	
	@Override
	public void endOrderedList() {
		endList();
	}
	
	@Override
	public void startListItem() {
		mListItem = new ListItem();
		mListItem.setFont(mFont);
	}
	
	@Override
	public void endListItem() {
		mList.add(mListItem);
		mListItem = null;
	}
	
	@Override
	public void addText(String pStrText, TextFormatting pTextFormatting) {
		
		mLog.debug("Start addText(): " + pStrText);
		
		Font lFont = new Font();
		lFont.setFamily(mFont.getFamilyname());
		lFont.setSize(mFont.getSize());
		
		int lIntStyle = 0;
		if (pTextFormatting.bold) {
			lIntStyle = lIntStyle | Font.BOLD;
		}  
		if (pTextFormatting.italic) {
			lIntStyle = lIntStyle | Font.ITALIC;
		}
		if (pTextFormatting.underline) {
			lIntStyle = lIntStyle | Font.UNDERLINE;
		}
		if (pTextFormatting.strike) {
			lIntStyle = lIntStyle | Font.STRIKETHRU;
		}
		lFont.setStyle(lIntStyle);
		
		Chunk lChunk = new Chunk(pStrText, lFont);
		
		if (mListItem != null) {
			mListItem.add(lChunk);
		} else if (mParagraph != null) {
			mParagraph.add(lChunk);
		}
		
		mLog.debug("End addText()");
	}
	
	
	@Override
	public File end() {
		mDocument.close();
		return mFile;
	}
	
	@Override
	public void init(String pStrFilePath, RichTextEditorSettings pRichTextEditorSettings) {
		try {
			mFile = new File(pStrFilePath);
			
			if (mExportType == ExportType.PDF) {
				PdfWriter.getInstance(mDocument, new FileOutputStream(mFile));
			} else {
				RtfWriter2.getInstance(mDocument, new FileOutputStream(mFile));
			}
			
			initFont(pRichTextEditorSettings);
			mDocument.open();			
			
		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.FATAL);
		}		
	}
	
	private void initFont(RichTextEditorSettings pRichTextEditorSettings) {
		mFont = new Font();
		
		if (pRichTextEditorSettings.getFont().equals("courier")) {
			mFont =  new Font(Font.COURIER);
		} else if (pRichTextEditorSettings.getFont().equals("times")) {
			mFont = new Font(Font.TIMES_ROMAN);
		} else if (pRichTextEditorSettings.getFont().equals("arial")) {
			mFont = new Font(Font.HELVETICA);
		} 
		
		mFont.setSize(12);
	}
	
	@Override
	public void endChapter() {
		try {
			mDocument.add(mChapter);
			mChapter = null;
		} catch (DocumentException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.IO_EXCEPTION);
		}
		
	}
	@Override
	public void addEmptyLines(int pIntLinesNumber) {

		try {
			for (int i = 0; i < pIntLinesNumber; i++) {
				if (mSubSection != null) {
					mSubSection.add(new Paragraph(" "));
				} else if (mSection != null) {
					mSection.add(new Paragraph(" "));
				} else if (mChapter != null) {
					mChapter.add(new Paragraph(" "));
				} else {
					mDocument.add(new Paragraph(" "));
				}
			}
		} catch (DocumentException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.IO_EXCEPTION);
		}
	}



	@Override
	public void startSection(String pStrSectionTitle) {
				
		Font lFont = new Font();
		lFont.setFamily(mFont.getFamilyname());
		lFont.setSize(mFont.getSize());
		lFont.setStyle(Font.ITALIC);
		
		Anchor anchor = new Anchor(pStrSectionTitle, lFont);
		anchor.setName(pStrSectionTitle);

		mSection = mChapter.addSection(new Paragraph(anchor));
	}



	@Override
	public void endSection() {
		mSection = null;
		addEmptyLines(1);
	}



	@Override
	public void startSubSection(String pStrSubSectionTitle) {
		Font lFont = new Font();
		lFont.setFamily(mFont.getFamilyname());
		lFont.setSize(mFont.getSize());
		
		Anchor anchor = new Anchor(pStrSubSectionTitle, lFont);
		anchor.setName(pStrSubSectionTitle);
		
		addEmptyLines(1);
		mSubSection = mSection.addSection(new Paragraph(anchor));
		addEmptyLines(1);
		
	}

	@Override
	public void endSubSection() {
		mSubSection = null;
		addEmptyLines(1);
	}
}
