package com.bibisco.ui.bean;

import org.json.JSONException;
import org.json.JSONObject;

import com.bibisco.BibiscoException;
import com.bibisco.TaskStatus;
import com.bibisco.log.Log;

public class SecondaryCharacterDTO extends CharacterDTO {
	
	private static Log mLog = Log.getInstance(SecondaryCharacterDTO.class);
	
	private TaskStatus taskStatus;
	private String description;
	
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
