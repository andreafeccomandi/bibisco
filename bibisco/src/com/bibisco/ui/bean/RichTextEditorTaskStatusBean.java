package com.bibisco.ui.bean;

import org.json.JSONException;
import org.json.JSONObject;

import com.bibisco.BibiscoException;
import com.bibisco.TaskStatus;
import com.bibisco.log.Log;

public class RichTextEditorTaskStatusBean {
	
	private static Log mLog = Log.getInstance(RichTextEditorTaskStatusBean.class);
	
	private String id;
	private TaskStatus taskStatus;
	private String text;
	private String description;
	private boolean readOnly;
	
	public TaskStatus getTaskStatus() {
		return taskStatus;
	}
	public void setTaskStatus(TaskStatus taskStatus) {
		this.taskStatus = taskStatus;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getText() {
		return text;
	}
	public void setText(String detailUrl) {
		this.text = detailUrl;
	}
	public boolean isReadOnly() {
		return readOnly;
	}
	public void setReadOnly(boolean readOnly) {
		this.readOnly = readOnly;
	} 
	
public JSONObject toJSONObject() {
		
		JSONObject lJSONObject;
		
		try {
			lJSONObject = new JSONObject();
			lJSONObject.put("id", id);
			lJSONObject.put("taskStatus", taskStatus);
			lJSONObject.put("text", text);
			lJSONObject.put("title", readOnly);
			lJSONObject.put("description", description);
			
		} catch (JSONException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.FATAL);
		}
		
		return lJSONObject;
	}
public String getDescription() {
	return description;
}
public void setDescription(String description) {
	this.description = description;
}
}
