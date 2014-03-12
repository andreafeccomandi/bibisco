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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.bibisco.BibiscoException;
import com.bibisco.log.Log;

import dk.dren.hunspell.Hunspell;

/**
 * Spell check manager.
 * 
 * @author Andrea Feccomandi
 *
 */
public class SpellCheckManager {

	private static Log mLog = Log.getInstance(SpellCheckManager.class);
	private static Map<String, SpellCheckManager> mMapSpellCheckManager = new HashMap<String, SpellCheckManager>();
	
	private Hunspell.Dictionary mHunspellDictionary;
	private Map<String, Boolean> mMapMispelledWords;
	private Map<String, List<String>> mMapSuggestions;
	
	private SpellCheckManager() {}
	
	public Object clone() throws CloneNotSupportedException {
		throw new CloneNotSupportedException();
	}

	
	private SpellCheckManager(String pStrLocale) {
		
		mLog.debug("Start SpellCheckManager(String): ", pStrLocale);
		try {
			ContextManager lContextManager = ContextManager.getInstance();
			StringBuilder lStringBuilder = new StringBuilder(lContextManager.getAbsolutePath());
			lStringBuilder.append("dictionaries");
			lStringBuilder.append(lContextManager.getPathSeparator());
			lStringBuilder.append(pStrLocale);
			lStringBuilder.append(lContextManager.getPathSeparator());
			lStringBuilder.append(pStrLocale);
			
			mHunspellDictionary = Hunspell.getInstance().getDictionary(lStringBuilder.toString());
			mLog.debug("Hunspell library and dictionary loaded");
			
			mMapMispelledWords = new HashMap<String, Boolean>();
			mMapSuggestions = new HashMap<String, List<String>>();
			
		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.FATAL);
		} 
		
		mLog.debug("End SpellCheckManager(String): ", pStrLocale);
	}
	
	public static SpellCheckManager getInstance(String pStrLocale) {
		
		SpellCheckManager lSpellCheckManager;
		
		mLog.debug("Start getInstance(String)");
		
		if (mMapSpellCheckManager.containsKey(pStrLocale)) {
			lSpellCheckManager = mMapSpellCheckManager.get(pStrLocale);
		} else {
			lSpellCheckManager = new SpellCheckManager(pStrLocale);
			mMapSpellCheckManager.put(pStrLocale, lSpellCheckManager);
		}
		
		mLog.debug("End getInstance(String)");
		
		return lSpellCheckManager;
	}
	
	public boolean misspelled(String pStrWord) {
	
		boolean lBlnResult;
		
		mLog.debug("Start misspelled(String): ", pStrWord);
		if (mMapMispelledWords.containsKey(pStrWord)) {
			lBlnResult =  mMapMispelledWords.get(pStrWord).booleanValue();
		} else {
			lBlnResult = mHunspellDictionary.misspelled(pStrWord);
			mMapMispelledWords.put(pStrWord, Boolean.valueOf(lBlnResult));
		}
		
		lBlnResult = mHunspellDictionary.misspelled(pStrWord);
		mLog.debug("End misspelled(String): " + lBlnResult);
		
		return lBlnResult;
	}
	
	public List<String> getSuggestions(String pStrWord) {
		
		List<String> lListSuggestions;
		
		mLog.debug("Start getSuggestions(String): ", pStrWord);
		if (mMapSuggestions.containsKey(pStrWord)) {
			lListSuggestions = mMapSuggestions.get(pStrWord);
		} else {
			lListSuggestions = mHunspellDictionary.suggest(pStrWord);
			mMapSuggestions.put(pStrWord, lListSuggestions);
		}
		
		mLog.debug("Start getSuggestions(String)");
		
		return lListSuggestions;
	}

	public static JSONObject spell(String pStrText) {
	
		JSONObject lJSONObjectResult;
	
		SpellCheck.mLog.debug("Start spell(String)");
	
		SpellCheckManager lSpellCheckManager = getInstance(ContextManager.getInstance().getProjectLanguage());
		Map<String, Integer> lMapWordOccurences = TextEditorManager.getWordsOccurrencesMap(pStrText, true);
	
		try {
			lJSONObjectResult = new JSONObject();
			JSONArray lJSONArrayMisspelledWords = new JSONArray();
			lJSONObjectResult.put("misspelledWords", lJSONArrayMisspelledWords);
	
			int j = 0;
			for (String lStrWord : lMapWordOccurences.keySet()) {
				if (lSpellCheckManager.misspelled(lStrWord)) {
					List<String> lListSuggestions = lSpellCheckManager.getSuggestions(lStrWord);
					StringBuilder lStringBuilder = new StringBuilder();
					for (int i = 0; i < lListSuggestions.size(); i++) {
						if (i > 0) {
							lStringBuilder.append("|");
						}
						lStringBuilder.append(StringUtils.replace(lListSuggestions.get(i), "'", "&apos;"));
					}
					JSONObject lJSONObject = new JSONObject();
					lJSONObject.put("misspelledWord", lStrWord);
					lJSONObject.put("occurences", lMapWordOccurences.get(lStrWord));
					lJSONObject.put("suggestions", lStringBuilder.toString());
					lJSONArrayMisspelledWords.put(j++, lJSONObject);
				}
			}
		} catch (JSONException e) {
			SpellCheck.mLog.error(e);
			throw new BibiscoException(e, BibiscoException.FATAL);
		}
	
		SpellCheck.mLog.debug("End spell(String)");
		
		return lJSONObjectResult;
	}
	
}
