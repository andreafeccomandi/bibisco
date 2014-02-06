package com.bibisco.ui.bean;

import org.json.JSONException;
import org.json.JSONObject;

import com.bibisco.BibiscoException;
import com.bibisco.TaskStatus;
import com.bibisco.log.Log;
import com.bibisco.logic.CharacterInfoWithoutQuestions;

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
