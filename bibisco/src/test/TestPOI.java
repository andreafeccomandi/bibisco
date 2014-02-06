package test;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Reader;
import java.io.Writer;
import java.math.BigInteger;
import java.util.List;

import javax.xml.namespace.QName;
import javax.xml.stream.XMLStreamReader;

import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.apache.poi.xwpf.usermodel.XWPFAbstractNum;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFNumbering;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.xmlbeans.QNameSet;
import org.apache.xmlbeans.SchemaType;
import org.apache.xmlbeans.XmlCursor;
import org.apache.xmlbeans.XmlDocumentProperties;
import org.apache.xmlbeans.XmlObject;
import org.apache.xmlbeans.XmlOptions;
import org.apache.xmlbeans.xml.stream.XMLInputStream;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTAbstractNum;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTDecimalNumber;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTNum;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTNumbering;
import org.w3c.dom.Node;
import org.xml.sax.ContentHandler;
import org.xml.sax.SAXException;
import org.xml.sax.ext.LexicalHandler;

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
