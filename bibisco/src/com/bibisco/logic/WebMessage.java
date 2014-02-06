package com.bibisco.logic;

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
