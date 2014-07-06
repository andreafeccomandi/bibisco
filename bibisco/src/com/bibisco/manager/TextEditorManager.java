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
package com.bibisco.manager;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Node;

import com.bibisco.bean.CharacterWordCount;
import com.bibisco.log.Log;

/**
 * Text editor manager.
 * 
 * @author Andrea Feccomandi
 *
 */
public class TextEditorManager {
	
	private static Log mLog = Log.getInstance(TextEditorManager.class);
	
	public static CharacterWordCount getCharacterWordCount(String pStrText) {
		
		Integer lIntWordsCount = 0;
		
		mLog.debug("Start getCharacterWordCount(String): HTML: [", pStrText,"]");
				
		CharacterWordCount lCharacterWordCount = new CharacterWordCount();
		
		if (StringUtils.isNotBlank(pStrText)) {
			HtmlParsingResult lHtmlParsingResult = parseHtml(pStrText, false);
			lCharacterWordCount.setCharacters(lHtmlParsingResult.characterCount);
			lCharacterWordCount.setWords(lHtmlParsingResult.words.size());
		} else {
			lCharacterWordCount.setCharacters(0);
			lCharacterWordCount.setWords(0);
		}
		
		
		
		mLog.debug("End getCharacterWordCount(String): return " + lIntWordsCount);
		
		return lCharacterWordCount;
	}
	
	public static Map<String,Integer> getWordsOccurrencesMap(String pStrText, boolean pBlnExcludeSpellCheck) {
		
		Map<String,Integer> lMapWordsOccurrences;
		
		mLog.debug("Start getWordsOccurrencesMap(String, boolean)");
		
		lMapWordsOccurrences = new HashMap<String, Integer>();
		HtmlParsingResult lHtmlParsingResult = parseHtml(pStrText, pBlnExcludeSpellCheck);
		List<String> lListWords = lHtmlParsingResult.words;
		for (String lStrWord : lListWords) {
			Integer lIntOccurences;
			if (lMapWordsOccurrences.containsKey(lStrWord)) {
				lIntOccurences = lMapWordsOccurrences.get(lStrWord) + 1;
			} else {
				lIntOccurences = new Integer(1);
			}
			lMapWordsOccurrences.put(lStrWord, lIntOccurences);
		}
		
		mLog.debug("End getWordsOccurrencesMap(String, boolean)");
		
		return lMapWordsOccurrences;
	}
	
	private static HtmlParsingResult parseHtml(String pStrText, boolean pBlnExcludeSpellCheck) {
		
		mLog.debug("Start parseHtml(String, boolean)");
		
		Document lDocument = Jsoup.parse(pStrText);
		
		HtmlParsingResult lHtmlParsingResult = new HtmlParsingResult();
		for (Node lNode : lDocument.childNodes()) {
    		parseNode(lHtmlParsingResult, lNode, pBlnExcludeSpellCheck);
	    }
		
		mLog.debug("End parseHtml(String, boolean)");
		
		return lHtmlParsingResult;
		
	}
	
	private static void parseNode(HtmlParsingResult pHtmlParsingResult, Node pNode, boolean pBlnExcludeSpellCheck) {
		
		mLog.debug("Start parseNode(HtmlParsingResult, Node, boolean): ", pNode.nodeName());
		
		if ("#text".equals(pNode.nodeName())) {
        	parseTextNode(pHtmlParsingResult, pNode);
        } else if ("spellerror".equals(pNode.nodeName()) && pBlnExcludeSpellCheck) {
        	// Do nothing
        } else if ("span".equals(pNode.nodeName()) && pNode.attr("style").equals("display: none;")){
        	// Do nothing
        } else {
        	if ("ul".equals(pNode.nodeName())) {
        		pHtmlParsingResult.ulOpen=true;
        	}
        	if ("ol".equals(pNode.nodeName())) {
        		pHtmlParsingResult.olOpen=true;
        	}
        	if ("li".equals(pNode.nodeName())) {
        		if (pHtmlParsingResult.ulOpen) {
        			pHtmlParsingResult.characterCount += 1;
        		} else if (pHtmlParsingResult.olOpen) {
        			pHtmlParsingResult.characterCount += 1;
        			pHtmlParsingResult.olLiPosition += 1;
        			pHtmlParsingResult.characterCount += String.valueOf(pHtmlParsingResult.olLiPosition).length();
        		}
        	}
        	for (Node lNode : pNode.childNodes()) {
        		parseNode(pHtmlParsingResult, lNode, pBlnExcludeSpellCheck);
    	    }
        	if ("ul".equals(pNode.nodeName())) {
        		pHtmlParsingResult.ulOpen=false;
        	}
        	if ("ol".equals(pNode.nodeName())) {
        		pHtmlParsingResult.olOpen=false;
        		pHtmlParsingResult.olLiPosition = 0;
        	}
        }
		
		mLog.debug("End parseNode(HtmlParsingResult, Node, boolean)");
	}	
	
	private static void parseTextNode(HtmlParsingResult pHtmlParsingResult, Node pNode) {
		
		List<String> lListWords = new ArrayList<String>();	
		
		mLog.debug("Start parseTextNode(HtmlParsingResult, Node): ", pNode.toString());
		
		// character count
		String lStrNodeText =  StringUtils.replace(pNode.toString(), "&nbsp;", " ");
		lStrNodeText = StringUtils.replace(lStrNodeText, "\n", "");
		lStrNodeText = StringEscapeUtils.unescapeHtml(lStrNodeText);	
		pHtmlParsingResult.characterCount += lStrNodeText.length();
		
		// extract words
		lStrNodeText = pNode.toString();
		lStrNodeText = StringUtils.replace(lStrNodeText, "&nbsp;", "");
		lStrNodeText = StringUtils.replace(lStrNodeText, "&laquo;", "");
		lStrNodeText = StringUtils.replace(lStrNodeText, "&raquo;", "");
		lStrNodeText = StringUtils.replace(lStrNodeText, "&mdash;", "");
		lStrNodeText = StringEscapeUtils.unescapeHtml(lStrNodeText);
		lStrNodeText = replaceCharIntervalWithWhiteSpace(lStrNodeText, 33, 38);
		lStrNodeText = replaceCharIntervalWithWhiteSpace(lStrNodeText, 40, 47);
		lStrNodeText = replaceCharIntervalWithWhiteSpace(lStrNodeText, 58, 64);
		lStrNodeText = replaceCharIntervalWithWhiteSpace(lStrNodeText, 91, 96);
		lStrNodeText = replaceCharIntervalWithWhiteSpace(lStrNodeText, 123, 126);
		lStrNodeText = replaceCharIntervalWithWhiteSpace(lStrNodeText, 161, 191);		
		lStrNodeText = StringUtils.replaceChars(lStrNodeText, '“', ' ');
		lStrNodeText = StringUtils.replaceChars(lStrNodeText, '”', ' ');	
		lStrNodeText = StringUtils.replaceChars(lStrNodeText, '—', ' ');
		lStrNodeText = lStrNodeText.trim();
		
		if (StringUtils.isNotBlank(lStrNodeText)) {
			StringTokenizer lStringTokenizer = new StringTokenizer(lStrNodeText);
	    	while (lStringTokenizer.hasMoreTokens()) {
	    		lListWords.add(lStringTokenizer.nextToken());
	    	}
		}
		pHtmlParsingResult.words.addAll(lListWords);
		
    	mLog.debug("End parseTextNode(HtmlParsingResult, Node)");
	}
	
	private static String replaceCharIntervalWithWhiteSpace(String pStr, int pIntFrom, int pIntTo) {
		
		for (int i = pIntFrom; i < pIntTo+1; i++) {
			char lChar = ((char)i);
			pStr = StringUtils.replaceChars(pStr, lChar, ' ');
		}
		
		return pStr;
	}
}

class HtmlParsingResult {
	List<String> words = new ArrayList<String>();
	int characterCount = 0;
	boolean ulOpen = false;
	boolean olOpen = false;
	int olLiPosition = 0;
}
