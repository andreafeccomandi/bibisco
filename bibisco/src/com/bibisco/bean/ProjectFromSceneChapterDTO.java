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
import com.bibisco.log.Log;

/**
 * Project from scene chapter DTO.
 * 
 * @author Andrea Feccomandi
 *
 */
public class ProjectFromSceneChapterDTO {
	
	private static Log mLog = Log.getInstance(ProjectFromSceneChapterDTO.class);
	
	private Integer idChapter;
	private List<SceneRevisionDTO> sceneRevisionDTOList;
	private String chapterReason;
	private String chapterNotes;
	
	public Integer getIdChapter() {
		return idChapter;
	}
	public void setIdChapter(Integer idChapter) {
		this.idChapter = idChapter;
	}
	public List<SceneRevisionDTO> getSceneRevisionDTOList() {
		return sceneRevisionDTOList;
	}
	public void setSceneRevisionDTOList(List<SceneRevisionDTO> sceneRevisionDTOList) {
		this.sceneRevisionDTOList = sceneRevisionDTOList;
	}
	public String getChapterReason() {
		return chapterReason;
	}
	public void setChapterReason(String chapterReason) {
		this.chapterReason = chapterReason;
	}
	public String getChapterNotes() {
		return chapterNotes;
	}
	public void setChapterNotes(String chapterNotes) {
		this.chapterNotes = chapterNotes;
	}
	
	public JSONObject toJSONObject() {
		
		JSONObject lJSONObject;
		
		try {
			lJSONObject = new JSONObject();
			lJSONObject.put("chapterNotes", chapterNotes);
			lJSONObject.put("chapterReason", chapterReason);
			lJSONObject.put("idChapter", idChapter);
			
			int i = 0;
			JSONArray lJSONArrayScenes = new JSONArray();
			if (sceneRevisionDTOList != null) {
				for (SceneRevisionDTO lSceneRevisionDTO : sceneRevisionDTOList) {
					JSONObject lJSONObjectScene = new JSONObject();
					lJSONObjectScene.put("idScene", lSceneRevisionDTO.getIdScene());
					lJSONObjectScene.put("sceneTitle", lSceneRevisionDTO.getTitle());
					lJSONObjectScene.put("sceneText", lSceneRevisionDTO.getText());
					lJSONArrayScenes.put(i++, lJSONObjectScene);
				}
			}
			lJSONObject.put("scenes", lJSONArrayScenes);
			
		} catch (JSONException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.FATAL);
		}
		
		return lJSONObject;
	}
}
