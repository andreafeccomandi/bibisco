package com.bibisco.ui.bean;

import com.bibisco.TaskStatus;

public class SceneDTO {
	private Integer idScene;
	private Integer idChapter;
	private Integer position;
	private String description;
	private TaskStatus taskStatus;
	public Integer getIdScene() {
		return idScene;
	}
	public void setIdScene(Integer idScene) {
		this.idScene = idScene;
	}
	public Integer getIdChapter() {
		return idChapter;
	}
	public void setIdChapter(Integer idChapter) {
		this.idChapter = idChapter;
	}
	public Integer getPosition() {
		return position;
	}
	public void setPosition(Integer position) {
		this.position = position;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public TaskStatus getTaskStatus() {
		return taskStatus;
	}
	public void setTaskStatus(TaskStatus taskStatus) {
		this.taskStatus = taskStatus;
	}
	
}
