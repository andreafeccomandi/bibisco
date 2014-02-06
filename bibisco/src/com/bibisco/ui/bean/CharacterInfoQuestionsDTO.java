package com.bibisco.ui.bean;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.bibisco.BibiscoException;
import com.bibisco.TaskStatus;
import com.bibisco.log.Log;
import com.bibisco.logic.CharacterInfoQuestions;

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
