/*
 * Copyright (C) 2014-2015 Andrea Feccomandi
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
 * Main character DTO.
 * 
 * @author Andrea Feccomandi
 *
 */
public class MainCharacterDTO extends CharacterDTO {
	
	private TaskStatus physionomyTaskStatus;
	private TaskStatus personaldataTaskStatus;
	private TaskStatus psychologyTaskStatus;
	private TaskStatus sociologyTaskStatus;
	private TaskStatus behaviorsTaskStatus;
	private TaskStatus ideasTaskStatus;
	private TaskStatus lifebeforestorybeginningTaskStatus;
	private TaskStatus conflictTaskStatus;
	private TaskStatus evolutionduringthestoryTaskStatus;
		
	public TaskStatus getEvolutionduringthestoryTaskStatus() {
		return evolutionduringthestoryTaskStatus;
	}
	public void setEvolutionduringthestoryTaskStatus(TaskStatus evolutionduringthestoryTaskStatus) {
		this.evolutionduringthestoryTaskStatus = evolutionduringthestoryTaskStatus;
	}
	
	public TaskStatus getTaskStatus() {

		if (behaviorsTaskStatus == TaskStatus.TODO && conflictTaskStatus == TaskStatus.TODO && evolutionduringthestoryTaskStatus == TaskStatus.TODO && ideasTaskStatus == TaskStatus.TODO
				&& lifebeforestorybeginningTaskStatus == TaskStatus.TODO && personaldataTaskStatus == TaskStatus.TODO && physionomyTaskStatus == TaskStatus.TODO
				&& psychologyTaskStatus == TaskStatus.TODO && sociologyTaskStatus == TaskStatus.TODO) {
			return TaskStatus.TODO;
		} else if (behaviorsTaskStatus == TaskStatus.COMPLETED && conflictTaskStatus == TaskStatus.COMPLETED && evolutionduringthestoryTaskStatus == TaskStatus.COMPLETED
				&& ideasTaskStatus == TaskStatus.COMPLETED && lifebeforestorybeginningTaskStatus == TaskStatus.COMPLETED && personaldataTaskStatus == TaskStatus.COMPLETED
				&& physionomyTaskStatus == TaskStatus.COMPLETED && psychologyTaskStatus == TaskStatus.COMPLETED && sociologyTaskStatus == TaskStatus.COMPLETED) {
			return TaskStatus.COMPLETED;
		} else {
			return TaskStatus.TOCOMPLETE;
		}
	}
	
	public TaskStatus getPhysionomyTaskStatus() {
		return physionomyTaskStatus;
	}
	public void setPhysionomyTaskStatus(TaskStatus physiologyTaskStatus) {
		this.physionomyTaskStatus = physiologyTaskStatus;
	}
	public TaskStatus getPersonaldataTaskStatus() {
		return personaldataTaskStatus;
	}
	public void setPersonaldataTaskStatus(TaskStatus personaldataTaskStatus) {
		this.personaldataTaskStatus = personaldataTaskStatus;
	}
	public TaskStatus getPsychologyTaskStatus() {
		return psychologyTaskStatus;
	}
	public void setPsychologyTaskStatus(TaskStatus psychologyTaskStatus) {
		this.psychologyTaskStatus = psychologyTaskStatus;
	}
	public TaskStatus getBehaviorsTaskStatus() {
		return behaviorsTaskStatus;
	}
	public void setBehaviorsTaskStatus(TaskStatus behaviorsTaskStatus) {
		this.behaviorsTaskStatus = behaviorsTaskStatus;
	}
	public TaskStatus getIdeasTaskStatus() {
		return ideasTaskStatus;
	}
	public void setIdeasTaskStatus(TaskStatus ideasTaskStatus) {
		this.ideasTaskStatus = ideasTaskStatus;
	}
	public TaskStatus getConflictTaskStatus() {
		return conflictTaskStatus;
	}
	public void setConflictTaskStatus(TaskStatus conflictandstakesTaskStatus) {
		this.conflictTaskStatus = conflictandstakesTaskStatus;
	}
	public TaskStatus getSociologyTaskStatus() {
		return sociologyTaskStatus;
	}
	public void setSociologyTaskStatus(TaskStatus sociologyTaskStatus) {
		this.sociologyTaskStatus = sociologyTaskStatus;
	}
	public TaskStatus getLifebeforestorybeginningTaskStatus() {
		return lifebeforestorybeginningTaskStatus;
	}
	public void setLifebeforestorybeginningTaskStatus(TaskStatus lifebeforestorybeginningTaskStatus) {
		this.lifebeforestorybeginningTaskStatus = lifebeforestorybeginningTaskStatus;
	}
}
