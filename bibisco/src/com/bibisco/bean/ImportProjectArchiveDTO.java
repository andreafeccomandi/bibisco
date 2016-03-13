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

/**
 * Import project archive DTO.
 * 
 * @author Andrea Feccomandi
 *
 */
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
