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

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Comment;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;

import com.bibisco.log.Log;

/**
 * HTML parser.
 * 
 * @author Andrea Feccomandi
 *
 */
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
			
			String lStrTagName = "";
			if (pNode instanceof Element) {				
				lStrTagName = ((Element) pNode).tag().getName();
			} else if (pNode instanceof Comment) {
				lStrTagName = ((Comment) pNode).outerHtml();
			}
			

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