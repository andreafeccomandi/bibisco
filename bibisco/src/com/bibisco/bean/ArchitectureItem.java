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
 * Architecture item bean.
 * 
 * @author Andrea Feccomandi
 *
 */
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
