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
import com.bibisco.enums.TaskStatus;
import com.bibisco.log.Log;

/**
 * Secondary character DTO.
 * 
 * @author Andrea Feccomandi
 *
 */
public class SecondaryCharacterDTO extends CharacterDTO {
	
	private static Log mLog = Log.getInstance(SecondaryCharacterDTO.class);
	
	TaskStatus taskStatus;
	String description;
	
	public String getDescription() {
		return description;
	}
	public void setDescription(String secondaryCharacterDescription) {
		this.description = secondaryCharacterDescription;
	}
	public TaskStatus getTaskStatus() {
		return taskStatus;
	}
	public void setTaskStatus(TaskStatus taskStatus) {
		this.taskStatus = taskStatus;
	}
	
public JSONObject toJSONObject() {
		
		JSONObject lJSONObject;
		
		try {
			lJSONObject = new JSONObject();
			lJSONObject.put("idCharacter", idCharacter);
			lJSONObject.put("name", name);
			lJSONObject.put("position", position);
			lJSONObject.put("description", description);
			lJSONObject.put("taskStatus", taskStatus);
			
		} catch (JSONException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.FATAL);
		}
		
		return lJSONObject;
	}
}
