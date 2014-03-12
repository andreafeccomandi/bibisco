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
import com.bibisco.enums.CharacterInfoWithoutQuestions;
import com.bibisco.enums.TaskStatus;
import com.bibisco.log.Log;

/**
 * Character info without question DTO.
 * 
 * @author Andrea Feccomandi
 *
 */
public class CharacterInfoWithoutQuestionsDTO {
	
	private static Log mLog = Log.getInstance(CharacterInfoWithoutQuestionsDTO.class);
	
	private Integer id;
	private TaskStatus taskStatus;
	private String info;
	private CharacterInfoWithoutQuestions characterInfoWithoutQuestions;
	
	public TaskStatus getTaskStatus() {
		return taskStatus;
	}
	public void setTaskStatus(TaskStatus taskStatus) {
		this.taskStatus = taskStatus;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
 
	
public JSONObject toJSONObject() {
		
		JSONObject lJSONObject;
		
		try {
			lJSONObject = new JSONObject();
			lJSONObject.put("id", id);
			lJSONObject.put("taskStatus", taskStatus);
			lJSONObject.put("info", info);
			
		} catch (JSONException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.FATAL);
		}
		
		return lJSONObject;
	}
public String getInfo() {
	return info;
}
public void setInfo(String info) {
	this.info = info;
}
public CharacterInfoWithoutQuestions getCharacterInfoWithoutQuestions() {
	return characterInfoWithoutQuestions;
}
public void setCharacterInfoWithoutQuestions(CharacterInfoWithoutQuestions characterInfoWithoutQuestions) {
	this.characterInfoWithoutQuestions = characterInfoWithoutQuestions;
}

}
