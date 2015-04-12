package test;

import java.io.File;
import java.io.FileOutputStream;
import java.math.BigInteger;

import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;

public class TestPOI {

	public static void newWordDoc(String filename, String fileContent)   
	         throws Exception {   
	       XWPFDocument document = new XWPFDocument();   

	       String [] fruits = {"Apple", "Banana", "mango", "guava", "pear", "mellon" };
	        // for each item a paragraph is created and the Style and NumId is set
	        for (int i = 0; i < fruits.length; i++) {
	          
	            XWPFParagraph p = document.createParagraph();
	            	        
	            p.setStyle("ListParagraph");
	            // 2 prints bullet as of this code and 1 would print numbers
	            p.setNumID(BigInteger.valueOf(1));
	            // good to see the XML structure
	            System.out.println(p.getCTP());
	            
	        	  XWPFRun r = p.createRun();
	        	  r.setText(fruits[i]);
	        }   
	       /*
	       XWPFNumbering lXwpfNumbering = document.createNumbering();
	       lXwpfNumbering.addNum(BigInteger.valueOf(2), BigInteger.valueOf(2));
	      */  
	       XWPFParagraph tmpParagraph = document.createParagraph();   
	       //tmpParagraph.setIndentationLeft(2000);
	       tmpParagraph.setStyle("ListParagraph");
           // 2 prints bullet as of this code and 1 would print numbers
	       tmpParagraph.setNumID(BigInteger.valueOf(2));
	       
	       XWPFRun tmpRun = tmpParagraph.createRun();   
	       tmpRun.setText(fileContent);   
	       tmpRun.setFontSize(12);   
	       tmpRun = tmpParagraph.createRun();   
	       tmpRun.setText("Testo in grassetto");   
	       tmpRun.setFontSize(12);
	       tmpRun.setBold(true);
	       
	       tmpParagraph = document.createParagraph();   
	       tmpParagraph.setAlignment(ParagraphAlignment.BOTH);
	       tmpRun = tmpParagraph.createRun();   
	       tmpRun.setText(fileContent);   
	       tmpRun.setFontSize(12);   
	       tmpRun = tmpParagraph.createRun();   
	       tmpRun.setText("Testo in corsivo");   
	       tmpRun.setFontSize(12);
	       tmpRun.setItalic(true);
	 
	       
	       FileOutputStream fos = new FileOutputStream(new File(filename + ".docx"));   
	       document.write(fos);   
	       fos.close();   
	    }   
	    public static void main(String[] args) throws Exception {   
	         newWordDoc("C:/temp/testfile", "Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! ");   
	         System.out.println("Fatto!");
	    }   

}
