package com.bibisco.bean;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.bibisco.BibiscoException;
import com.bibisco.log.Log;

public class ProjectFromSceneMainCharacterDTO extends CharacterDTO {
	
	private static Log mLog = Log.getInstance(ProjectFromSceneMainCharacterDTO.class);

	List<CharacterInfoQuestionsDTO> characterInfoQuestionsDTOList;
	List<CharacterInfoWithoutQuestionsDTO> characterInfoWithoutQuestionsDTOList;
	
	
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
				JSONObject lJSONObjectCharacterInfoWithoutQuestion = new JSONObject();								
				for (CharacterInfoWithoutQuestionsDTO lCharacterInfoWithoutQuestionsDTO : characterInfoWithoutQuestionsDTOList) {
					lJSONObjectCharacterInfoWithoutQuestion.put("info", StringUtils.defaultString(lCharacterInfoWithoutQuestionsDTO.getInfo()));
					lJSONObject.put(lCharacterInfoWithoutQuestionsDTO.getCharacterInfoWithoutQuestions().name(), lJSONObjectCharacterInfoWithoutQuestion);				
				}
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
}
