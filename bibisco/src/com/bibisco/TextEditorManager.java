package com.bibisco;

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

import com.bibisco.log.Log;

public class TextEditorManager {
	
	private static Log mLog = Log.getInstance(TextEditorManager.class);
	
	
	public static Map<String,Integer> getWordsOccurrencesMap(String pStrText, boolean pBlnExcludeSpellCheck) {
		
		Map<String,Integer> lMapWordsOccurrences;
		
		mLog.debug("Start getWordsOccurrencesMap(String, boolean)");
		
		lMapWordsOccurrences = new HashMap<String, Integer>();
		List<String> lListWords = getWordsFromText(pStrText, pBlnExcludeSpellCheck);
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
	
	public static List<String> getWordsFromText(String pStrText, boolean pBlnExcludeSpellCheck) {
		
		List<String> lListWords = new ArrayList<String>();
		
		mLog.debug("Start getWordsFromText(String, boolean)");
		
		Document lDocument = Jsoup.parse(pStrText);
	    
		for (Node lNode : lDocument.childNodes()) {
    		lListWords.addAll(getWordsFromNode(lNode, pBlnExcludeSpellCheck));
	    }
		
		mLog.debug("End getWordsFromText(String, boolean)");
		
		return lListWords;
		
	}
	
	private static List<String> getWordsFromNode(Node pNode, boolean pBlnExcludeSpellCheck) {
		
		List<String> lListWords = new ArrayList<String>();	
		
		mLog.debug("Start getWordsFromNode(Node, boolean): ", pNode.nodeName());
		
		if ("#text".equals(pNode.nodeName())) {
        	lListWords.addAll(getWordsFromTextNode(pNode));
        } else if ("spellerror".equals(pNode.nodeName()) && pBlnExcludeSpellCheck) {
        	// Do nothing
        } else {
        	for (Node lNode : pNode.childNodes()) {
        		lListWords.addAll(getWordsFromNode(lNode, pBlnExcludeSpellCheck));
    	    }
        }
		
		mLog.debug("End getWordsFromNode(Node, boolean)");
		
		return lListWords;
	}	
	
	private static List<String> getWordsFromTextNode(Node pNode) {
		
		List<String> lListWords = new ArrayList<String>();	
		
		mLog.debug("Start getWordsFromTextNode(Node): ", pNode.toString());
		
		String lStrNodeText = pNode.toString();
		
		lStrNodeText = StringUtils.replace(lStrNodeText, "&nbsp;", "");
		lStrNodeText = StringEscapeUtils.unescapeHtml(lStrNodeText);
		lStrNodeText = replaceCharIntervalWithWhiteSpace(lStrNodeText, 33, 38);
		lStrNodeText = replaceCharIntervalWithWhiteSpace(lStrNodeText, 40, 47);
		lStrNodeText = replaceCharIntervalWithWhiteSpace(lStrNodeText, 58, 64);
		lStrNodeText = replaceCharIntervalWithWhiteSpace(lStrNodeText, 91, 96);
		lStrNodeText = replaceCharIntervalWithWhiteSpace(lStrNodeText, 123, 126);
		lStrNodeText = replaceCharIntervalWithWhiteSpace(lStrNodeText, 161, 191);		
		lStrNodeText = StringUtils.replaceChars(lStrNodeText, '“', ' ');
		lStrNodeText = StringUtils.replaceChars(lStrNodeText, '”', ' ');	
		
		lStrNodeText = lStrNodeText.trim();
		
		if (StringUtils.isNotBlank(lStrNodeText)) {
			StringTokenizer lStringTokenizer = new StringTokenizer(lStrNodeText);
	    	while (lStringTokenizer.hasMoreTokens()) {
	    		lListWords.add(lStringTokenizer.nextToken());
	    	}
		}
		
    	mLog.debug("End getWordsFromTextNode(Node)");
    	
    	return lListWords;
	}
	
	private static String replaceCharIntervalWithWhiteSpace(String pStr, int pIntFrom, int pIntTo) {
		
		for (int i = pIntFrom; i < pIntTo+1; i++) {
			char lChar = ((char)i);
			pStr = StringUtils.replaceChars(pStr, lChar, ' ');
		}
		
		return pStr;
	}
}
