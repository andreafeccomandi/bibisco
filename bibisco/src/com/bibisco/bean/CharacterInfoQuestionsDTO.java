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

import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.bibisco.BibiscoException;
import com.bibisco.enums.CharacterInfoQuestions;
import com.bibisco.enums.TaskStatus;
import com.bibisco.log.Log;

/**
 * Character info question DTO.
 * 
 * @author Andrea Feccomandi
 *
 */
public class CharacterInfoQuestionsDTO {
	
	private static Log mLog = Log.getInstance(CharacterInfoQuestionsDTO.class);
	
	private Integer id;
	private CharacterInfoQuestions characterInfoQuestions;
	private TaskStatus taskStatus;
	private List<String> answerList;
	private Boolean interviewMode;
	private String freeText;

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
			lJSONObject.put("freeText", freeText);
			lJSONObject.put("interviewMode", interviewMode);
			
			JSONArray lJSONArrayAnswers = new JSONArray();
			lJSONObject.put("answers", lJSONArrayAnswers);
			if (answerList != null) {
				for (int i = 0; i < answerList.size(); i++) {
					lJSONArrayAnswers.put(i, answerList.get(i));
				}
			}
			
		} catch (JSONException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.FATAL);
		}
		
		return lJSONObject;
	}
public List<String> getAnswerList() {
	return answerList;
}
public void setAnswerList(List<String> answerList) {
	this.answerList = answerList;
}
public String getFreeText() {
	return freeText;
}
public void setFreeText(String freeText) {
	this.freeText = freeText;
}
public Boolean getInterviewMode() {
	return interviewMode;
}
public void setInterviewMode(Boolean interviewMode) {
	this.interviewMode = interviewMode;
}
public CharacterInfoQuestions getCharacterInfoQuestions() {
	return characterInfoQuestions;
}
public void setCharacterInfoQuestions(CharacterInfoQuestions characterInfoQuestions) {
	this.characterInfoQuestions = characterInfoQuestions;
}

}
