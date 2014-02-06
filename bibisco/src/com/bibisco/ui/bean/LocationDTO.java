package com.bibisco.ui.bean;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.bibisco.BibiscoException;
import com.bibisco.TaskStatus;
import com.bibisco.log.Log;

public class LocationDTO implements IAnalysisChapterPresenceItem {
	
	private Log mLog = Log.getInstance(LocationDTO.class);
	
	private Integer idLocation;
	private Integer position;
	private String nation;
	private String state;
	private String city;
	private String name;
	private String description;
	private TaskStatus taskStatus;
	
	public String getFullyQualifiedArea() {
		
		StringBuilder lStringBuilder = new StringBuilder();
		
		if (StringUtils.isNotEmpty(nation)) {
			lStringBuilder.append(nation);
		}
		if (StringUtils.isNotEmpty(state)) {
			if (lStringBuilder.toString().length()>0) {
				lStringBuilder.append(", ");
			}
			lStringBuilder.append(state);
		}
		if (StringUtils.isNotEmpty(city)) {
			if (lStringBuilder.toString().length()>0) {
				lStringBuilder.append(", ");
			}
			lStringBuilder.append(city);
		}
		
		return lStringBuilder.toString();
	}
	
	public TaskStatus getTaskStatus() {
		return taskStatus;
	}
	public void setTaskStatus(TaskStatus taskStatus) {
		this.taskStatus = taskStatus;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Integer getIdLocation() {
		return idLocation;
	}
	public void setIdLocation(Integer idLocation) {
		this.idLocation = idLocation;
	}
	public String getNation() {
		return nation;
	}
	public void setNation(String nation) {
		this.nation = nation;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer getPosition() {
		return position;
	}
	public void setPosition(Integer position) {
		this.position = position;
	}
	
	public JSONObject toJSONObject() {

		JSONObject lJSONObject;

		try {
			lJSONObject = new JSONObject();
			lJSONObject.put("idLocation", idLocation);
			lJSONObject.put("name", name);
			lJSONObject.put("position", position);
			lJSONObject.put("nation", nation);
			lJSONObject.put("state", state);
			lJSONObject.put("city", city);
			lJSONObject.put("description", description);
			lJSONObject.put("taskStatus", taskStatus);
			lJSONObject.put("fullyQualifiedArea", getFullyQualifiedArea());

		} catch (JSONException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.FATAL);
		}

		return lJSONObject;
	}

	@Override
	public String getAnalysisChapterPresenceItemId() {
		return idLocation.toString();
	}

	@Override
	public String getAnalysisChapterPresenceItemDescription() {
		return getFullyQualifiedArea() + " " + name;
	}
}
