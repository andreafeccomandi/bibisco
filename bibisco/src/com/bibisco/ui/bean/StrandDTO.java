package com.bibisco.ui.bean;

import org.json.JSONException;
import org.json.JSONObject;

import com.bibisco.BibiscoException;
import com.bibisco.TaskStatus;
import com.bibisco.log.Log;

public class StrandDTO implements IAnalysisChapterPresenceItem{
	
	private Log mLog = Log.getInstance(StrandDTO.class);
	
	private String description;
	private Integer idStrand;
	private String name;
	private Integer position;
	private TaskStatus taskStatus;
	
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Integer getIdStrand() {
		return idStrand;
	}
	public void setIdStrand(Integer idStrand) {
		this.idStrand = idStrand;
	}
	public String getName() {
		return name;
	}
	public void setName(String title) {
		this.name = title;
	}
	public Integer getPosition() {
		return position;
	}
	public void setPosition(Integer position) {
		this.position = position;
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
			lJSONObject.put("idStrand", idStrand);
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
	@Override
	public String getAnalysisChapterPresenceItemId() {
		return idStrand.toString();
	}
	@Override
	public String getAnalysisChapterPresenceItemDescription() {
		return name;
	}
}
