/*
 * Copyright (C) 2014-2016 Andrea Feccomandi
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
package com.bibisco.bean;

import org.json.JSONException;
import org.json.JSONObject;

import com.bibisco.BibiscoException;
import com.bibisco.log.Log;

/**
 * CharacterWordCount
 * 
 * @author Andrea Feccomandi
 *
 */
public class CharacterWordCount {
	
	private Log mLog = Log.getInstance(CharacterWordCount.class);
	
	private Integer characters;
	private Integer words;
	
	public JSONObject toJSONObject() {

		JSONObject lJSONObject;

		try {
			lJSONObject = new JSONObject();
			lJSONObject.put("characters", characters);
			lJSONObject.put("words", words);

		} catch (JSONException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.FATAL);
		}

		return lJSONObject;
	}

	public Integer getCharacters() {
		return characters;
	}

	public void setCharacters(Integer characters) {
		this.characters = characters;
	}

	public Integer getWords() {
		return words;
	}

	public void setWords(Integer words) {
		this.words = words;
	}
}
