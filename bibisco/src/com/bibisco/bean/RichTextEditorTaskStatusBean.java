/*
 * Copyright (C) 2014-2015 Andrea Feccomandi
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
 * Rich text editor task status bean.
 * 
 * @author Andrea Feccomandi
 *
 */
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
