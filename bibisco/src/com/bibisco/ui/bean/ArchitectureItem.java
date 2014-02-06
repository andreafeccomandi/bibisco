package com.bibisco.ui.bean;

import com.bibisco.TaskStatus;

public class ArchitectureItem {
	private String text;
	private TaskStatus taskStatus;
	
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public TaskStatus getTaskStatus() {
		return taskStatus;
	}
	public void setTaskStatus(TaskStatus taskStatus) {
		this.taskStatus = taskStatus;
	}
}
