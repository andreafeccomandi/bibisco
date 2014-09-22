package com.bibisco.servlet;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.bibisco.BibiscoException;
import com.bibisco.bean.StrandDTO;
import com.bibisco.log.Log;

public class ProjectFromSceneArchitectureDTO {
	
	private static Log mLog = Log.getInstance(ProjectFromSceneArchitectureDTO.class);
	String premise;
	String fabula;
	String setting;
	List<StrandDTO> strandList;
	
	public String getPremise() {
		return premise;
	}
	public void setPremise(String premise) {
		this.premise = premise;
	}
	public String getFabula() {
		return fabula;
	}
	public void setFabula(String fabula) {
		this.fabula = fabula;
	}
	public String getSetting() {
		return setting;
	}
	public void setSetting(String setting) {
		this.setting = setting;
	}
	public List<StrandDTO> getStrandList() {
		return strandList;
	}
	public void setStrandList(List<StrandDTO> strandList) {
		this.strandList = strandList;
	}
	
	public JSONObject toJSONObject() {
		
		JSONObject lJSONObject;
		
		try {
			lJSONObject = new JSONObject();
			lJSONObject.put("fabula", fabula);
			lJSONObject.put("premise", premise);
			lJSONObject.put("setting", setting);

			// images
			if (strandList != null) {
				JSONArray lJSONArrayStrands = new JSONArray();
				for (StrandDTO lStrandDTO : strandList) {
					JSONObject lJsonObjectStrand = new JSONObject();
					lJsonObjectStrand.put("name", lStrandDTO.getName());
					lJsonObjectStrand.put("description", lStrandDTO.getDescription());
					lJSONArrayStrands.put(lJsonObjectStrand);
				}
				lJSONObject.put("strands", lJSONArrayStrands);
			}
			
		} catch (JSONException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.FATAL);
		}
		
		return lJSONObject;
	}
}
