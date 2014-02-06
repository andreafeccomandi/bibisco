package com.bibisco.ui.bean;

import com.bibisco.TaskStatus;


public class CharacterDTO implements IAnalysisChapterPresenceItem {
	
	Integer idCharacter;
	String name;
	Integer position;
	boolean mainCharacter;
	TaskStatus taskStatus;
	
	public void setTaskStatus(TaskStatus taskStatus) {
		this.taskStatus = taskStatus;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer getIdCharacter() {
		return idCharacter;
	}
	public void setIdCharacter(Integer idCharacter) {
		this.idCharacter = idCharacter;
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
	public boolean isMainCharacter() {
		return mainCharacter;
	}
	public void setMainCharacter(boolean mainCharacter) {
		this.mainCharacter = mainCharacter;
	}
	@Override
	public String getAnalysisChapterPresenceItemId() {
		return idCharacter.toString();
	}
	@Override
	public String getAnalysisChapterPresenceItemDescription() {
		return name;
	}
}
