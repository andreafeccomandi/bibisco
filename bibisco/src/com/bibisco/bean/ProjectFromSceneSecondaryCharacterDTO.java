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
package com.bibisco.bean;

import org.json.JSONException;
import org.json.JSONObject;

import com.bibisco.BibiscoException;
import com.bibisco.log.Log;

/**
 * ProjectFromSceneSecondaryCharacterDTO
 * 
 * @author Andrea Feccomandi
 *
 */
public class ProjectFromSceneSecondaryCharacterDTO extends SecondaryCharacterDTO {
	
	private static Log mLog = Log.getInstance(ProjectFromSceneSecondaryCharacterDTO.class);

	
	public JSONObject toJSONObject() {
		
		JSONObject lJSONObject;
		
		try {
			lJSONObject = new JSONObject();
			lJSONObject.put("idCharacter", idCharacter);
			lJSONObject.put("name", name);
			lJSONObject.put("position", position);
			lJSONObject.put("mainCharacter", mainCharacter);
			lJSONObject.put("description", description);
			
		} catch (JSONException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.FATAL);
		}
		
		return lJSONObject;
	}
}
