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

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.bibisco.BibiscoException;
import com.bibisco.log.Log;

/**
 * ProjectFromSceneMainCharacterDTO
 * 
 * @author Andrea Feccomandi
 *
 */
public class ProjectFromSceneMainCharacterDTO extends CharacterDTO {
	
	private static Log mLog = Log.getInstance(ProjectFromSceneMainCharacterDTO.class);

	List<CharacterInfoQuestionsDTO> characterInfoQuestionsDTOList;
	List<CharacterInfoWithoutQuestionsDTO> characterInfoWithoutQuestionsDTOList;
	List<ImageDTO> imageDTOList;
	
	
	public JSONObject toJSONObject() {
		
		JSONObject lJSONObject;
		
		try {
			lJSONObject = new JSONObject();
			lJSONObject.put("idCharacter", idCharacter);
			lJSONObject.put("name", name);
			lJSONObject.put("position", position);
			lJSONObject.put("mainCharacter", mainCharacter);
			
			// character info questions
			if (characterInfoQuestionsDTOList != null) {
				
				for (CharacterInfoQuestionsDTO lCharacterInfoQuestionsDTO : characterInfoQuestionsDTOList) {
					
					JSONObject lJSONObjectCharacterInfoQuestion = new JSONObject();
					lJSONObjectCharacterInfoQuestion.put("interviewMode", lCharacterInfoQuestionsDTO.getInterviewMode().booleanValue());
					
					// interview mode
					if (!lCharacterInfoQuestionsDTO.getInterviewMode().booleanValue()) {
						lJSONObjectCharacterInfoQuestion.put("freeText", StringUtils.defaultString(lCharacterInfoQuestionsDTO.getFreeText()));
					}
					
					// questions
					else {
						int i = 0;
						JSONArray lJSONArrayCharacterInfoQuestionQuestionsAnswers = new JSONArray();
						for (int j = 0; j < lCharacterInfoQuestionsDTO.getCharacterInfoQuestions().getTotalQuestions(); j++) {
							JSONObject lJSONObjectInfoQuestion = new JSONObject();
							lJSONObjectInfoQuestion.put("question", lCharacterInfoQuestionsDTO.getCharacterInfoQuestions().getQuestionList().get(j));
							lJSONObjectInfoQuestion.put("answer", StringUtils.defaultString(lCharacterInfoQuestionsDTO.getAnswerList().get(j)));
							lJSONArrayCharacterInfoQuestionQuestionsAnswers.put(i++, lJSONObjectInfoQuestion);
						}
						lJSONObjectCharacterInfoQuestion.put("questionsAnswers", lJSONArrayCharacterInfoQuestionQuestionsAnswers);
					}
					
					lJSONObject.put(lCharacterInfoQuestionsDTO.getCharacterInfoQuestions().name(), lJSONObjectCharacterInfoQuestion);
				}
			}
			
			// character info without questions
			if (characterInfoWithoutQuestionsDTOList != null) {
				for (CharacterInfoWithoutQuestionsDTO lCharacterInfoWithoutQuestionsDTO : characterInfoWithoutQuestionsDTOList) {
					JSONObject lJSONObjectCharacterInfoWithoutQuestion = new JSONObject();								
					lJSONObjectCharacterInfoWithoutQuestion.put("info", StringUtils.defaultString(lCharacterInfoWithoutQuestionsDTO.getInfo()));
					lJSONObject.put(lCharacterInfoWithoutQuestionsDTO.getCharacterInfoWithoutQuestions().name(), lJSONObjectCharacterInfoWithoutQuestion);				
				}
			}
			
			// images
			if (imageDTOList != null) {
				JSONArray lJSONArrayImages = new JSONArray();
				for (ImageDTO lImageDTO : imageDTOList) {
					JSONObject lJsonObjectImage = new JSONObject();
					lJsonObjectImage.put("idImage", lImageDTO.getIdImage());
					lJsonObjectImage.put("description", lImageDTO.getDescription());
					lJSONArrayImages.put(lJsonObjectImage);
				}
				lJSONObject.put("images", lJSONArrayImages);
			}
			
			
		} catch (JSONException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.FATAL);
		}

		return lJSONObject;
	}


	public List<CharacterInfoQuestionsDTO> getCharacterInfoQuestionsDTOList() {
		return characterInfoQuestionsDTOList;
	}


	public void setCharacterInfoQuestionsDTOList(List<CharacterInfoQuestionsDTO> characterInfoQuestionsDTOList) {
		this.characterInfoQuestionsDTOList = characterInfoQuestionsDTOList;
	}


	public List<CharacterInfoWithoutQuestionsDTO> getCharacterInfoWithoutQuestionsDTOList() {
		return characterInfoWithoutQuestionsDTOList;
	}


	public void setCharacterInfoWithoutQuestionsDTOList(List<CharacterInfoWithoutQuestionsDTO> characterInfoWithoutQuestionsDTOList) {
		this.characterInfoWithoutQuestionsDTOList = characterInfoWithoutQuestionsDTOList;
	}


	public List<ImageDTO> getImageDTOList() {
		return imageDTOList;
	}


	public void setImageDTOList(List<ImageDTO> imageDTOList) {
		this.imageDTOList = imageDTOList;
	}
}
