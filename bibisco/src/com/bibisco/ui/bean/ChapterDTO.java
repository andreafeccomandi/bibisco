package com.bibisco.ui.bean;

import java.util.ArrayList;
import java.util.List;

import com.bibisco.TaskStatus;

public class ChapterDTO {
	
	private Integer idChapter;
	private Integer position;
	private String title;
	private List<SceneDTO> sceneList;
	private TaskStatus taskStatus;
	private String reason;
	private TaskStatus reasonTaskStatus;
	private String note;
	
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
	
	
}
