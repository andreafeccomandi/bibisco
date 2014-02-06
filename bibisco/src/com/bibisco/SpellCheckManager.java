package com.bibisco;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.bibisco.log.Log;

import dk.dren.hunspell.Hunspell;

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
	
}
