package com.bibisco.ui.bean;

import org.apache.commons.fileupload.FileItem;

import com.bibisco.ElementType;

public class ImageDTO {
	private Integer idImage;
	private String description;
	private Integer idElement;
	private ElementType elementType;
	private FileItem fileItem;
	
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public ElementType getElementType() {
		return elementType;
	}
	public void setElementType(ElementType elementType) {
		this.elementType = elementType;
	}
	public Integer getIdImage() {
		return idImage;
	}
	public void setIdImage(Integer idImage) {
		this.idImage = idImage;
	}
	public Integer getIdElement() {
		return idElement;
	}
	public void setIdElement(Integer idElement) {
		this.idElement = idElement;
	}
	public FileItem getFileItem() {
		return fileItem;
	}
	public void setFileItem(FileItem pFileItem) {
		this.fileItem = pFileItem;
	}
}
