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

import java.util.ArrayList;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

import com.bibisco.BibiscoException;
import com.bibisco.enums.TaskStatus;
import com.bibisco.log.Log;

/**
 * Chapter DTO.
 * 
 * @author Andrea Feccomandi
 *
 */
public class ChapterDTO {
	
	private static Log mLog = Log.getInstance(ChapterDTO.class);
	
	private Integer idChapter;
	private Integer position;
	private String title;
	private List<SceneDTO> sceneList;
	private TaskStatus taskStatus;
	private String reason;
	private TaskStatus reasonTaskStatus;
	private String note;
	private Integer wordCount;
	private Integer characterCount;
	
	public ChapterDTO() {
		sceneList = new ArrayList<SceneDTO>();
	}
	
	public Integer getIdChapter() {
		return idChapter;
	}
	public void setIdChapter(Integer idChapter) {
		this.idChapter = idChapter;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public List<SceneDTO> getSceneList() {
		return sceneList;
	}
	public void setSceneList(List<SceneDTO> sceneList) {
		this.sceneList = sceneList;
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

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public TaskStatus getReasonTaskStatus() {
		return reasonTaskStatus;
	}

	public void setReasonTaskStatus(TaskStatus reasonTaskStatus) {
		this.reasonTaskStatus = reasonTaskStatus;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public Integer getWordCount() {
		return wordCount;
	}

	public void setWordCount(Integer wordCount) {
		this.wordCount = wordCount;
	}

	public Integer getCharacterCount() {
		return characterCount;
	}

	public void setCharacterCount(Integer characterCount) {
		this.characterCount = characterCount;
	}

	public JSONObject getWordCountTaskStatusAsJSONObject() {
		
		JSONObject lJSONObject;

		try {
			lJSONObject = new JSONObject();
			lJSONObject.put("idChapter", idChapter);
			lJSONObject.put("position", position);
			lJSONObject.put("taskStatus", taskStatus);
			lJSONObject.put("wordCount", wordCount);
			lJSONObject.put("characterCount", characterCount);
			
		} catch (JSONException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.FATAL);
		}

		return lJSONObject;
	}
	
	
}
