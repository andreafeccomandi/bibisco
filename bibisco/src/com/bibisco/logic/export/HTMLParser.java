package com.bibisco.logic.export;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;

import com.bibisco.log.Log;

public class HTMLParser {

	private static final Log mLog = Log.getInstance(HTMLParser.class);
	
	public static void parse(String pStrHTML, IExporter pExporter) {

		mLog.debug("Start parse(String, IExporter)");

		// parse html
		Document lDocument = Jsoup.parse(pStrHTML);

		// get body element
		Element lElementBody = lDocument.getElementsByTag("body").get(0);

		// parse body
		parseNode(lElementBody, new TextFormatting(), pExporter);

		mLog.debug("End parse(String, IExporter)");
	}
	
	private static void parseNode(Node pNode, TextFormatting pTextFormatting, IExporter pExporter) {

		mLog.debug("Start parseNode(Node, TextFormatting, IExporter)");

		if (pNode instanceof TextNode) {
			
			TextNode lTextNode = (TextNode) pNode;
			pExporter.addText(lTextNode.text(), pTextFormatting);
			
		} else {
			TextFormatting lTextFormatting = pTextFormatting.clone();
			String lStrTagName = ((Element) pNode).tag().getName();

			if (lStrTagName.equalsIgnoreCase("p")) {
				pExporter.startParagraph(getParagraphAlignment(((Element) pNode).attr("style")));
				parseChildNodes(pNode, lTextFormatting, pExporter);
				pExporter.endParagraph();
			} else if (lStrTagName.equalsIgnoreCase("ol")) {
				pExporter.startOrderedList();
				parseChildNodes(pNode, lTextFormatting, pExporter);
				pExporter.endOrderedList();
			} else if (lStrTagName.equalsIgnoreCase("ul")) {
				pExporter.startUnorderedList();
				parseChildNodes(pNode, lTextFormatting, pExporter);
				pExporter.endUnorderedList();
			} else if (lStrTagName.equalsIgnoreCase("li")) {
				pExporter.startListItem();
				parseChildNodes(pNode, lTextFormatting, pExporter);
				pExporter.endListItem();
			} else if (lStrTagName.equalsIgnoreCase("br")) {
				pExporter.addEmptyLines(1);
				parseChildNodes(pNode, lTextFormatting, pExporter);
			} else if (lStrTagName.equalsIgnoreCase("em")) {
				lTextFormatting.italic = true;
				parseChildNodes(pNode, lTextFormatting, pExporter);
			} else if (lStrTagName.equalsIgnoreCase("strike")) {
				lTextFormatting.strike = true;
				parseChildNodes(pNode, lTextFormatting, pExporter);
			} else if (lStrTagName.equalsIgnoreCase("strong")) {
				lTextFormatting.bold = true;
				parseChildNodes(pNode, lTextFormatting, pExporter);
			} else if (lStrTagName.equalsIgnoreCase("u")) {
				lTextFormatting.underline = true;
				parseChildNodes(pNode, lTextFormatting, pExporter);
			} else  {
				parseChildNodes(pNode, lTextFormatting, pExporter);
			}
		}

		mLog.debug("End parseNode(Node, TextFormatting, IExporter)");
	}


	private static void parseChildNodes(Node pNode, TextFormatting pTextFormatting, IExporter pExporter) {
		List<Node> lListNode = pNode.childNodes();
		for (Node lNode : lListNode) {
			parseNode(lNode, pTextFormatting, pExporter);
		}
	}
	
	private static ParagraphAligment getParagraphAlignment(String pStrStyle) {
		if (StringUtils.contains(pStrStyle, "text-align: center;")) {
			return ParagraphAligment.CENTER;
		} else if (StringUtils.contains(pStrStyle, "text-align: right;")) {
			return ParagraphAligment.RIGHT;
		} else if (StringUtils.contains(pStrStyle, "text-align: left;")) {
			return ParagraphAligment.LEFT;
		}
		
		return ParagraphAligment.JUSTIFY;
	}
}