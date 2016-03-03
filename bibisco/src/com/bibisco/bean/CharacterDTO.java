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

import com.bibisco.enums.TaskStatus;

/**
 * Character DTO.
 * 
 * @author Andrea Feccomandi
 *
 */
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
