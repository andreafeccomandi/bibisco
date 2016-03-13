package com.bibisco.test;

import java.io.File;
import java.io.FileOutputStream;

import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.apache.poi.xwpf.usermodel.UnderlinePatterns;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;

import com.bibisco.BibiscoException;
import com.bibisco.export.ParagraphAligment;
import com.bibisco.export.TextFormatting;
import com.bibisco.log.Log;

public class MSWordExporterTest  {

	private static Log mLog = Log.getInstance(MSWordExporterTest.class);
	
	private XWPFDocument mXWPFDocument = new XWPFDocument(); 
	private String mStrFilePath = null;
	private XWPFParagraph mXWPFParagraph = null;
	
	
	public void startChapter(String pStrChapterTitle) {
		mXWPFParagraph = mXWPFDocument.createParagraph();
		mXWPFParagraph.setPageBreak(true);
		
		XWPFRun lXWPFRun = mXWPFParagraph.createRun();
		lXWPFRun.setText(pStrChapterTitle);
		lXWPFRun.setFontSize(14);
		
		mXWPFParagraph = mXWPFDocument.createParagraph();
	}

	
	public void startParagraph(ParagraphAligment pParagraphAligment) {
		mXWPFParagraph = mXWPFDocument.createParagraph();  
		mXWPFParagraph.setAlignment(ParagraphAlignment.BOTH);
	}

	
	public void addText(String pStrText, TextFormatting pTextFormatting) {
		XWPFRun lXWPFRun = mXWPFParagraph.createRun();
		lXWPFRun.setText(pStrText);
		lXWPFRun.setFontSize(12);
		lXWPFRun.setItalic(pTextFormatting.italic);
		lXWPFRun.setBold(pTextFormatting.bold);
		lXWPFRun.setStrike(pTextFormatting.strike);
		if (pTextFormatting.underline) {
			lXWPFRun.setUnderline(UnderlinePatterns.SINGLE);
		}

		lXWPFRun = mXWPFParagraph.createRun();
	}

	
	public File end() {
		File lFile = null;

		FileOutputStream fos;
		try {
			lFile = new File(mStrFilePath);
			fos = new FileOutputStream(lFile);
			mXWPFDocument.write(fos);
			fos.close();
			
		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.IO_EXCEPTION);
		}
		

		return lFile;
	}

	
	public void startListItem() {
		mXWPFParagraph = mXWPFDocument.createParagraph();  
		mXWPFParagraph.setAlignment(ParagraphAlignment.BOTH);
		mXWPFParagraph.setStyle("ListParagraph");
		
		
	}

	
	public void startUnorderedList() {
		
	}

	
	public void startOrderedList() {
		
	}

	
	public void endUnorderedList() {
		// TODO Auto-generated method stub
		
	}

	
	public void endOrderedList() {
		// TODO Auto-generated method stub
		
	}

	
	public void init(String pStrFilePath) {
		mStrFilePath = pStrFilePath;
	}

	
	public void endParagraph() {
		// TODO Auto-generated method stub
		
	}

	
	public void endChapter() {
		// TODO Auto-generated method stub
		
	}

	
	public void addEmptyLines(int pIntLinesNumber) {
		// TODO Auto-generated method stub
		
	}


}
