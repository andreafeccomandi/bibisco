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
 * Scene DTO.
 * 
 * @author Andrea Feccomandi
 *
 */
public class SceneDTO {
	private Integer idScene;
	private Integer idChapter;
	private Integer position;
	private String description;
	private TaskStatus taskStatus;
	private Integer wordCount;
	private Integer characterCount;
	
	
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
	public Integer getWordCount() {
		return wordCount;
	}
	public void setWordCount(Integer wordsCount) {
		this.wordCount = wordsCount;
	}
	public Integer getCharacterCount() {
		return characterCount;
	}
	public void setCharacterCount(Integer characterCount) {
		this.characterCount = characterCount;
	}
	
}
