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

import java.util.List;

/**
 * Project DTO.
 * 
 * @author Andrea Feccomandi
 *
 */
public class ProjectDTO {
	String idProject;
	String name;
	String language;
	String bibiscoVersion;
	ArchitectureDTO architectureDTO;
	List<ChapterDTO> chapterList;
	List<CharacterDTO> mainCharacterList;
	List<CharacterDTO> secondaryCharacterList;
	List<LocationDTO> locationList;
	
	public ArchitectureDTO getArchitecture() {
		return architectureDTO;
	}

	public void setArchitecture(ArchitectureDTO architectureDTO) {
		this.architectureDTO = architectureDTO;
	}

	public List<ChapterDTO> getChapterList() {
		return chapterList;
	}

	public void setChapterList(List<ChapterDTO> chapters) {
		this.chapterList = chapters;
	}

	public List<CharacterDTO> getMainCharacterList() {
		return mainCharacterList;
	}

	public void setMainCharacterList(List<CharacterDTO> characterDTOList) {
		this.mainCharacterList = characterDTOList;
	}

	public List<CharacterDTO> getSecondaryCharacterList() {
		return secondaryCharacterList;
	}

	public void setSecondaryCharacterList(List<CharacterDTO> secondaryCharacterDTOList) {
		this.secondaryCharacterList = secondaryCharacterDTOList;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<LocationDTO> getLocationList() {
		return locationList;
	}

	public void setLocationList(List<LocationDTO> locations) {
		this.locationList = locations;
	}

	public String getIdProject() {
		return idProject;
	}

	public void setIdProject(String idProject) {
		this.idProject = idProject;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public String getBibiscoVersion() {
		return bibiscoVersion;
	}

	public void setBibiscoVersion(String bibiscoVersion) {
		this.bibiscoVersion = bibiscoVersion;
	}
}
