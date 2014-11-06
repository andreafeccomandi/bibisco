/*
 * Copyright (C) 2014 Andrea Feccomandi
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

import java.util.Date;

import org.apache.commons.lang.StringUtils;

/**
 * Character scene  DTO.
 * 
 * @author Andrea Feccomandi
 *
 */
public class CharacterSceneDTO {
	
	private Integer idCharacter;
	private String characterName;
	private Integer idChapter;
	private Integer chapterPosition;
	private String chapterTitle;
	private Integer idScene;
	private Date sceneDate;
	private String sceneDescription;
	private Integer idLocation;
	private String locationNation;
	private String locationState;
	private String locationCity;
	private String locationName;
	
	
	public String getLocation() {
		
		StringBuilder lStringBuilder = new StringBuilder();
		
		if (StringUtils.isNotEmpty(locationNation)) {
			lStringBuilder.append(locationNation);
		}
		if (StringUtils.isNotEmpty(locationState)) {
			if (lStringBuilder.toString().length()>0) {
				lStringBuilder.append(", ");
			}
			lStringBuilder.append(locationState);
		}
		if (StringUtils.isNotEmpty(locationCity)) {
			if (lStringBuilder.toString().length()>0) {
				lStringBuilder.append(", ");
			}
			lStringBuilder.append(locationCity);
		}
		if (StringUtils.isNotEmpty(locationName)) {
			lStringBuilder.append(" ");
			lStringBuilder.append(locationName);
		}
		
		return lStringBuilder.toString();
	}


	public Integer getIdCharacter() {
		return idCharacter;
	}


	public void setIdCharacter(Integer idCharacter) {
		this.idCharacter = idCharacter;
	}


	public String getCharacterName() {
		return characterName;
	}


	public void setCharacterName(String characterName) {
		this.characterName = characterName;
	}


	public Integer getIdChapter() {
		return idChapter;
	}


	public void setIdChapter(Integer idChapter) {
		this.idChapter = idChapter;
	}


	public String getChapterTitle() {
		return chapterTitle;
	}


	public void setChapterTitle(String chapterTitle) {
		this.chapterTitle = chapterTitle;
	}


	public Integer getIdScene() {
		return idScene;
	}


	public void setIdScene(Integer idScene) {
		this.idScene = idScene;
	}


	public Date getSceneDate() {
		return sceneDate;
	}


	public void setSceneDate(Date sceneDate) {
		this.sceneDate = sceneDate;
	}


	public String getSceneDescription() {
		return sceneDescription;
	}


	public void setSceneDescription(String sceneTitle) {
		this.sceneDescription = sceneTitle;
	}


	public Integer getIdLocation() {
		return idLocation;
	}


	public void setIdLocation(Integer idLocation) {
		this.idLocation = idLocation;
	}


	public String getLocationNation() {
		return locationNation;
	}


	public void setLocationNation(String nation) {
		this.locationNation = nation;
	}


	public String getLocationState() {
		return locationState;
	}


	public void setLocationState(String state) {
		this.locationState = state;
	}


	public String getLocationCity() {
		return locationCity;
	}


	public void setLocationCity(String city) {
		this.locationCity = city;
	}


	public String getLocationName() {
		return locationName;
	}


	public void setLocationName(String locationName) {
		this.locationName = locationName;
	}


	public Integer getChapterPosition() {
		return chapterPosition;
	}


	public void setChapterPosition(Integer chapterPosition) {
		this.chapterPosition = chapterPosition;
	}
}
