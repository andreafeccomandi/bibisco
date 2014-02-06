package com.bibisco.ui.bean;

public class ImportProjectArchiveDTO {
	String idProject;
	String projectName;
	boolean alreadyPresent;
	boolean archiveFileValid;
	
	public String getProjectName() {
		return projectName;
	}
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	public boolean isAlreadyPresent() {
		return alreadyPresent;
	}
	public void setAlreadyPresent(boolean alreadyPresent) {
		this.alreadyPresent = alreadyPresent;
	}
	public String getIdProject() {
		return idProject;
	}
	public void setIdProject(String idProject) {
		this.idProject = idProject;
	}
	public boolean isArchiveFileValid() {
		return archiveFileValid;
	}
	public void setArchiveFileValid(boolean archiveFileValid) {
		this.archiveFileValid = archiveFileValid;
	}
}
