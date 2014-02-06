package com.bibisco.logic;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.bibisco.BibiscoException;
import com.bibisco.ContextManager;
import com.bibisco.SpellCheckManager;
import com.bibisco.TextEditorManager;
import com.bibisco.log.Log;

public class SpellCheck {

	private static Log mLog = Log.getInstance(SpellCheck.class);

	public static JSONObject execute(String pStrText) {

		JSONObject lJSONObjectResult;

		mLog.debug("Start execute(String)");

		SpellCheckManager lSpellCheckManager = SpellCheckManager.getInstance(ContextManager.getInstance().getProjectLanguage());
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
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.FATAL);
		}

		mLog.debug("End execute(String)");
		
		return lJSONObjectResult;
	}
}
