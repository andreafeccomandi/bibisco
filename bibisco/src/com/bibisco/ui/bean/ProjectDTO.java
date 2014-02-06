package com.bibisco.ui.bean;

import java.util.List;

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
