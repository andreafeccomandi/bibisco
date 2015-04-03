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

/**
 * Bean that represents a message from bibisco web site
 * 
 * @author Andrea Feccomandi
 *
 */
public class WebMessage {
	private Integer idMessage;
	private String message;
	private String title;
	private Integer numberOfViewsAllowed;
	
	public Integer getIdMessage() {
		return idMessage;
	}
	public void setIdMessage(Integer idMessage) {
		this.idMessage = idMessage;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public Integer getNumberOfViewsAllowed() {
		return numberOfViewsAllowed;
	}
	public void setNumberOfViewsAllowed(Integer numberOfViewsAllowed) {
		this.numberOfViewsAllowed = numberOfViewsAllowed;
	}
}
