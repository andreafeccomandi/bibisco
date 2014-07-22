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
package com.bibisco.manager;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.bibisco.BibiscoException;
import com.bibisco.bean.CharacterDTO;
import com.bibisco.bean.CharacterInfoQuestionsDTO;
import com.bibisco.bean.CharacterInfoWithoutQuestionsDTO;
import com.bibisco.bean.MainCharacterDTO;
import com.bibisco.bean.SecondaryCharacterDTO;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.CharacterInfosMapper;
import com.bibisco.dao.client.CharactersMapper;
import com.bibisco.dao.client.VCharacterOccurencesMapper;
import com.bibisco.dao.model.CharacterInfos;
import com.bibisco.dao.model.CharacterInfosExample;
import com.bibisco.dao.model.Characters;
import com.bibisco.dao.model.CharactersExample;
import com.bibisco.dao.model.CharactersWithBLOBs;
import com.bibisco.dao.model.VCharacterOccurences;
import com.bibisco.dao.model.VCharacterOccurencesExample;
import com.bibisco.enums.CharacterInfoQuestions;
import com.bibisco.enums.CharacterInfoWithoutQuestions;
import com.bibisco.enums.ElementType;
import com.bibisco.enums.TaskStatus;
import com.bibisco.log.Log;

/**
 * Character manager.
 * 
 * @author Andrea Feccomandi
 *
 */
public class CharacterManager {

	private static Log mLog = Log.getInstance(CharacterManager.class);

	public static List<CharacterDTO> loadAll() {

		List<CharacterDTO> lListCharacterDTO;
		
		mLog.debug("Start loadCharacters()");

		lListCharacterDTO = new ArrayList<CharacterDTO>();
		
		// load main characters
		List<CharacterDTO> lListMainCharacterDTO = loadCharacters(true);
		if (lListMainCharacterDTO!= null) {
			lListCharacterDTO.addAll(lListMainCharacterDTO);
		}
		
		// load secondary characters
		List<CharacterDTO> lListSecondaryCharacterDTO = loadCharacters(false);
		if (lListSecondaryCharacterDTO!= null) {
			lListCharacterDTO.addAll(lListSecondaryCharacterDTO);
		}
		
		mLog.debug("End loadCharacters()");

		return lListCharacterDTO;
	}

	public static List<CharacterDTO> loadMainCharacters() {

		List<CharacterDTO> lListCharacterDTO;
		
		mLog.debug("Start loadMainCharacters()");

		lListCharacterDTO = loadCharacters(true);

		mLog.debug("End loadMainCharacters()");

		return lListCharacterDTO;
	}

	public static List<CharacterDTO> loadSecondaryCharacters() {

		List<CharacterDTO> lListCharacterDTO;
		
		mLog.debug("Start loadSecondaryCharacters()");

		lListCharacterDTO = loadCharacters(false);
		
		mLog.debug("End loadSecondaryCharacters()");

		return lListCharacterDTO;
	}

	private static List<CharacterDTO> loadCharacters(Boolean pBlnMain) {

		List<CharacterDTO> lCharacterDTOList = null;
		
		mLog.debug("Start loadMainCharacters("+pBlnMain+")");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			
			// create select criteria
			CharactersMapper lCharactersMapper = lSqlSession.getMapper(CharactersMapper.class);
			CharactersExample lCharactersExample = new CharactersExample();
			if (pBlnMain != null && pBlnMain.booleanValue()) {
				lCharactersExample.createCriteria().andMainCharacterEqualTo("Y");
			} else if (pBlnMain != null && !pBlnMain.booleanValue()) {
				lCharactersExample.createCriteria().andMainCharacterEqualTo("N");
			} 
			lCharactersExample.setOrderByClause("POSITION");
			
			List<Characters> lCharactersList = lCharactersMapper.selectByExample(lCharactersExample);
			if (lCharactersList!=null && lCharactersList.size()>0) {
				lCharacterDTOList = new ArrayList<CharacterDTO>();
				for (Characters lCharacters : lCharactersList) {
					
					// create CharacterDTO
					CharacterDTO lCharacterDTO;
					if (pBlnMain) {
						lCharacterDTO = createMainCharacterDTOFromCharacters(lCharacters);
					} else {
						lCharacterDTO = createSecondaryCharacterDTOFromCharacters(lCharacters);
					}
					
					// add character to list
					lCharacterDTOList.add(lCharacterDTO);
				}
			}

		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End loadMainCharacters("+pBlnMain+")");
		
		return lCharacterDTOList;

	}

	private static CharacterDTO createCharacterDTOFromCharacters(Characters pCharacters) {
		CharacterDTO lCharacterDTO = new CharacterDTO();
		lCharacterDTO.setIdCharacter(pCharacters.getIdCharacter().intValue());
		lCharacterDTO.setName(pCharacters.getName());
		lCharacterDTO.setPosition(pCharacters.getPosition());
		lCharacterDTO.setMainCharacter(pCharacters.getMainCharacter().equals("Y") ? true : false);
			
		return lCharacterDTO;
	}
	
	private static SecondaryCharacterDTO createSecondaryCharacterDTOFromCharacters(Characters pCharacters) {
		SecondaryCharacterDTO lSecondaryCharacterDTO = new SecondaryCharacterDTO();
		lSecondaryCharacterDTO.setIdCharacter(pCharacters.getIdCharacter().intValue());
		lSecondaryCharacterDTO.setName(pCharacters.getName());
		lSecondaryCharacterDTO.setPosition(pCharacters.getPosition());
		lSecondaryCharacterDTO.setMainCharacter(false);
		lSecondaryCharacterDTO.setTaskStatus(TaskStatus.getTaskStatusFromValue(pCharacters.getSecondaryCharacterDescriptionTaskStatus()));
		
		return lSecondaryCharacterDTO;
	}
	
	private static MainCharacterDTO createMainCharacterDTOFromCharacters(Characters pCharacters) {
		MainCharacterDTO lMainCharacterDTO = new MainCharacterDTO();
		lMainCharacterDTO.setIdCharacter(pCharacters.getIdCharacter().intValue());
		lMainCharacterDTO.setName(pCharacters.getName());
		lMainCharacterDTO.setPosition(pCharacters.getPosition());
		lMainCharacterDTO.setMainCharacter(true);
		lMainCharacterDTO.setBehaviorsTaskStatus(TaskStatus.getTaskStatusFromValue(pCharacters.getBehaviorsTaskStatus()));
		lMainCharacterDTO.setConflictTaskStatus(TaskStatus.getTaskStatusFromValue(pCharacters.getConflictTaskStatus()));
		lMainCharacterDTO.setEvolutionduringthestoryTaskStatus(TaskStatus.getTaskStatusFromValue(pCharacters.getEvolutionduringthestoryTaskStatus()));
		lMainCharacterDTO.setIdeasTaskStatus(TaskStatus.getTaskStatusFromValue(pCharacters.getIdeasTaskStatus()));
		lMainCharacterDTO.setLifebeforestorybeginningTaskStatus(TaskStatus.getTaskStatusFromValue(pCharacters.getLifebeforestorybeginningTaskStatus()));
		lMainCharacterDTO.setPersonaldataTaskStatus(TaskStatus.getTaskStatusFromValue(pCharacters.getPersonalDataTaskStatus()));
		lMainCharacterDTO.setPhysionomyTaskStatus(TaskStatus.getTaskStatusFromValue(pCharacters.getPhysionomyTaskStatus()));
		lMainCharacterDTO.setPsychologyTaskStatus(TaskStatus.getTaskStatusFromValue(pCharacters.getPsychologyTaskStatus()));
		lMainCharacterDTO.setSociologyTaskStatus(TaskStatus.getTaskStatusFromValue(pCharacters.getSociologyTaskStatus()));
		return lMainCharacterDTO;
	}

	public static CharacterDTO insert(CharacterDTO pCharacterDTO) {

		mLog.debug("Start insert(CharacterDTO)");

		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			
			CharactersWithBLOBs lCharacters = new CharactersWithBLOBs();
			lCharacters.setMainCharacter(pCharacterDTO.isMainCharacter() ? "Y" : "N");
			lCharacters.setName(pCharacterDTO.getName());
			lCharacters.setPosition(pCharacterDTO.getPosition());
			
			CharactersMapper lCharactersMapper = lSqlSession.getMapper(CharactersMapper.class);
			lCharactersMapper.insertSelective(lCharacters);
			
			pCharacterDTO = createCharacterDTOFromCharacters(lCharacters);
			pCharacterDTO.setTaskStatus(TaskStatus.TODO);
			
			if (pCharacterDTO.isMainCharacter()) {
				// populate character info
				CharacterInfosMapper lCharacterInfosMapper= lSqlSession.getMapper(CharacterInfosMapper.class);
				for (CharacterInfoQuestions lCharacterInfoQuestions : CharacterInfoQuestions.values()) {
					for (int i = 0; i < lCharacterInfoQuestions.getTotalQuestions(); i++) {
						CharacterInfos lCharacterInfos = new CharacterInfos();
						lCharacterInfos.setCharacterInfoType(lCharacterInfoQuestions.name());
						lCharacterInfos.setIdCharacter(lCharacters.getIdCharacter().intValue());
						lCharacterInfos.setQuestion(i+1);
						lCharacterInfosMapper.insert(lCharacterInfos);
					}
				}
			}
			
			lSqlSession.commit();
			
		} catch (Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End insert(CharacterDTO)");

		return pCharacterDTO;
	}

	public static MainCharacterDTO loadMainCharacter(Integer lIntIdCharacter) {

		MainCharacterDTO lMainCharacterDTO = null;
		
		mLog.debug("Start loadMainCharacter(Integer)");
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			
			CharactersMapper lCharactersMapper = lSqlSession.getMapper(CharactersMapper.class);
			CharactersWithBLOBs lCharacters = lCharactersMapper.selectByPrimaryKey(lIntIdCharacter.longValue());
			
			lMainCharacterDTO = createMainCharacterDTOFromCharacters(lCharacters);
			
		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}	

		mLog.debug("End loadMainCharacter(Integer)");

		return lMainCharacterDTO;

	}

	public static boolean deleteMainCharacterByPosition(Integer pIntPosition) {
		
		boolean lBlnResult;
		
		mLog.debug("Start deleteMainCharacterByPosition("+pIntPosition+")");
		lBlnResult = deleteCharacterByPosition(pIntPosition, true);
		mLog.debug("End deleteMainCharacterByPosition("+pIntPosition+"): " + lBlnResult);
		
		return lBlnResult;
	}
	
	public static boolean deleteSecondaryCharacterByPosition(Integer pIntPosition) {
		
		boolean lBlnResult;
		
		mLog.debug("Start deleteSecondaryCharacterByPosition("+pIntPosition+")");
		lBlnResult =  deleteCharacterByPosition(pIntPosition, false);
		mLog.debug("End deleteSecondaryCharacterByPosition("+pIntPosition+")");
		
		return lBlnResult;
	}
	
	private static boolean deleteCharacterByPosition(Integer pIntPosition, boolean pBlnMainCharacter) {
		
		boolean lBlnResult;
		
		mLog.debug("Start deleteCharacterByPosition("+pIntPosition+","+pBlnMainCharacter+")");
		
		// get character by position
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			
			CharactersMapper lCharactersMapper = lSqlSession.getMapper(CharactersMapper.class);
			
			//get character by position and main flag
			CharactersExample lCharactersExample = new CharactersExample();
			lCharactersExample.createCriteria().andPositionEqualTo(pIntPosition).andMainCharacterEqualTo(pBlnMainCharacter ? "Y" : "N");
			Characters lCharacters = lCharactersMapper.selectByExample(lCharactersExample).get(0);
			
			// check if character is referenced
			boolean lBlnIsReferenced = checkIfReferenced(lCharacters.getIdCharacter().intValue(), lSqlSession);
		
			// character is not referenced, go on
			if (!lBlnIsReferenced) {
								
				// delete character infos
				deleteCharacterInfosByIdCharacter(lCharacters.getIdCharacter().intValue(), lSqlSession);
				
				// delete character
				lCharactersMapper.deleteByPrimaryKey(lCharacters.getIdCharacter());
				
				// shift down other character
				lCharactersMapper.shiftDown(pIntPosition, Integer.MAX_VALUE, pBlnMainCharacter ? "Y" : "N");
				
				// delete images
				ImageManager.deleteImagesByElement(lSqlSession, lCharacters.getIdCharacter().intValue(), ElementType.CHARACTERS);
				
				lBlnResult = true;
			}
			// character is referenced, stop
			else {
				lBlnResult = false;
			}
			
			lSqlSession.commit();
			
		} catch (Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		} 
				
		mLog.debug("End deleteCharacterByPosition("+pIntPosition+","+pBlnMainCharacter+")");
	
		return lBlnResult;
	}

	private static void deleteCharacterInfosByIdCharacter(Integer pIntIdCharacter, SqlSession pSqlSession) {
		
		mLog.debug("Start deleteCharacterInfoByIdCharacter(Integer, SqlSession)");
		
		CharacterInfosExample lCharacterInfosExample = new CharacterInfosExample();
		lCharacterInfosExample.createCriteria().andIdCharacterEqualTo(pIntIdCharacter);
		CharacterInfosMapper lCharacterInfosMapper = pSqlSession.getMapper(CharacterInfosMapper.class);
		lCharacterInfosMapper.deleteByExample(lCharacterInfosExample);
		
		mLog.debug("End deleteCharacterInfoByIdCharacter(Integer, SqlSession)");
	}

	private static boolean checkIfReferenced(Integer pIntIdCharacter, SqlSession pSqlSession) {
		
		boolean lBlnResult;
		
		mLog.debug("Start checkIfReferenced(Integer, SqlSession)");
		
		VCharacterOccurencesExample lVCharacterOccurencesExample = new VCharacterOccurencesExample();
		lVCharacterOccurencesExample.createCriteria().andIdCharacterEqualTo(pIntIdCharacter);
		VCharacterOccurencesMapper lVCharacterOccurencesMapper = pSqlSession.getMapper(VCharacterOccurencesMapper.class);
		List<VCharacterOccurences> lListVCharacterOccurences = lVCharacterOccurencesMapper.selectByExample(lVCharacterOccurencesExample);
		if(lListVCharacterOccurences!=null && lListVCharacterOccurences.size()>0) {
			lBlnResult = true;
		} else {
			lBlnResult = false;
		}
		
		mLog.debug("End checkIfReferenced(Integer, SqlSession): return " + lBlnResult);
		
		return lBlnResult;
	}


	public static void moveMainCharacter(Integer pIntSourcePosition, Integer pIntDestPosition) {

		mLog.debug("Start moveMainCharacter(Integer, Integer)");
		move(pIntSourcePosition, pIntDestPosition, true);
		mLog.debug("End moveMainCharacter(Integer, Integer)");
	}
	
	public static void moveSecondaryCharacter(Integer pIntSourcePosition, Integer pIntDestPosition) {

		mLog.debug("Start moveSecondaryCharacter(Integer, Integer)");
		move(pIntSourcePosition, pIntDestPosition, false);
		mLog.debug("End moveSecondaryCharacter(Integer, Integer)");
	}

	
	private static void move(Integer pIntSourcePosition, Integer pIntDestPosition, boolean pBlnMainCharacter) {

		mLog.debug("Start move(Integer, Integer, boolean)");
		
		if (pIntSourcePosition != pIntDestPosition) {
			SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
	    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
	    	try {
				
				CharactersMapper lCharactersMapper = lSqlSession.getMapper(CharactersMapper.class);
				
				//get character by position and main flag
				CharactersExample lCharactersExample = new CharactersExample();
				lCharactersExample.createCriteria().andPositionEqualTo(pIntSourcePosition).andMainCharacterEqualTo(pBlnMainCharacter ? "Y" : "N");
				Characters lCharacters = lCharactersMapper.selectByExample(lCharactersExample).get(0);
				
				// update other Characters' position
				Integer lIntStartPosition;
				Integer lIntEndPosition;
				if (pIntSourcePosition > pIntDestPosition) {
					lIntStartPosition = pIntDestPosition;
					lIntEndPosition = pIntSourcePosition;
					lCharactersMapper.shiftUp(lIntStartPosition, lIntEndPosition, pBlnMainCharacter ? "Y" : "N");
				} else {
					lIntStartPosition = pIntSourcePosition;
					lIntEndPosition = pIntDestPosition;
					lCharactersMapper.shiftDown(lIntStartPosition, lIntEndPosition, pBlnMainCharacter ? "Y" : "N");
				}
				
				// update chapter position
				lCharacters.setPosition(pIntDestPosition);
				lCharactersMapper.updateByPrimaryKey(lCharacters);
			
				lSqlSession.commit();
				
	    	} catch(Throwable t) {
				mLog.error(t);
				lSqlSession.rollback();
				throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
			} finally {
				lSqlSession.close();
			}
		}
			
		mLog.debug("End move(Integer, Integer, boolean)");
	}
	
	public static CharacterInfoQuestionsDTO loadCharacterInfoQuestions(CharacterInfoQuestions pCharacterInfoQuestions, Integer lIntIdCharacter) {

		CharacterInfoQuestionsDTO lCharacterInfoQuestionsDTO;
		
		mLog.debug("Start loadCharacterInfo(CharacterInfoQuestions, Integer)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			
			CharactersMapper lCharactersMapper = lSqlSession.getMapper(CharactersMapper.class);
			CharactersWithBLOBs lCharacters = lCharactersMapper.selectByPrimaryKey(lIntIdCharacter.longValue());
			
			lCharacterInfoQuestionsDTO = new CharacterInfoQuestionsDTO();
			lCharacterInfoQuestionsDTO.setId(lIntIdCharacter);
			lCharacterInfoQuestionsDTO.setCharacterInfoQuestions(pCharacterInfoQuestions);
			
			switch(pCharacterInfoQuestions) {
			
			case BEHAVIORS:
				lCharacterInfoQuestionsDTO.setFreeText(lCharacters.getBehaviorsFreeText());
				lCharacterInfoQuestionsDTO.setTaskStatus(TaskStatus.getTaskStatusFromValue(lCharacters.getBehaviorsTaskStatus()));
				lCharacterInfoQuestionsDTO.setInterviewMode(lCharacters.getBehaviorsInterview().equals("Y") ? true : false);
				break;
			
			case IDEAS:
				lCharacterInfoQuestionsDTO.setFreeText(lCharacters.getIdeasFreeText());
				lCharacterInfoQuestionsDTO.setTaskStatus(TaskStatus.getTaskStatusFromValue(lCharacters.getIdeasTaskStatus()));
				lCharacterInfoQuestionsDTO.setInterviewMode(lCharacters.getIdeasInterview().equals("Y") ? true : false);
				break;
			
			case PERSONAL_DATA:
				lCharacterInfoQuestionsDTO.setFreeText(lCharacters.getPersonalDataFreeText());
				lCharacterInfoQuestionsDTO.setTaskStatus(TaskStatus.getTaskStatusFromValue(lCharacters.getPersonalDataTaskStatus()));
				lCharacterInfoQuestionsDTO.setInterviewMode(lCharacters.getPersonalDataInterview().equals("Y") ? true : false);
				break;
				
			case PHYSIONOMY:
				lCharacterInfoQuestionsDTO.setFreeText(lCharacters.getPhysionomyFreeText());
				lCharacterInfoQuestionsDTO.setTaskStatus(TaskStatus.getTaskStatusFromValue(lCharacters.getPhysionomyTaskStatus()));
				lCharacterInfoQuestionsDTO.setInterviewMode(lCharacters.getPhysionomyInterview().equals("Y") ? true : false);
				break;
				
			case PSYCHOLOGY:	
				lCharacterInfoQuestionsDTO.setFreeText(lCharacters.getPsychologyFreeText());
				lCharacterInfoQuestionsDTO.setTaskStatus(TaskStatus.getTaskStatusFromValue(lCharacters.getPsychologyTaskStatus()));
				lCharacterInfoQuestionsDTO.setInterviewMode(lCharacters.getPsychologyInterview().equals("Y") ? true : false);
				break;
				
			case SOCIOLOGY:	
				lCharacterInfoQuestionsDTO.setFreeText(lCharacters.getSociologyFreeText());
				lCharacterInfoQuestionsDTO.setTaskStatus(TaskStatus.getTaskStatusFromValue(lCharacters.getSociologyTaskStatus()));
				lCharacterInfoQuestionsDTO.setInterviewMode(lCharacters.getSociologyInterview().equals("Y") ? true : false);
				break;
			default:
				break;
			}
			
			// get answers
			CharacterInfosExample lCharacterInfosExample = new CharacterInfosExample();
			lCharacterInfosExample.createCriteria().andCharacterInfoTypeEqualTo(pCharacterInfoQuestions.name())
				.andIdCharacterEqualTo(lCharacters.getIdCharacter().intValue());
			lCharacterInfosExample.setOrderByClause("question");
			
			CharacterInfosMapper lCharacterInfosMapper = lSqlSession.getMapper(CharacterInfosMapper.class);
			List<CharacterInfos> lListCharacterInfos = lCharacterInfosMapper.selectByExampleWithBLOBs(lCharacterInfosExample);
			
			List<String> lListAnswers = new ArrayList<String>();
			for (CharacterInfos lCharacterInfos : lListCharacterInfos) {
				lListAnswers.add(StringUtils.defaultString(lCharacterInfos.getInfo()));
			}
			lCharacterInfoQuestionsDTO.setAnswerList(lListAnswers);
			
			
		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}	
		
		mLog.debug("End loadCharacterInfo(CharacterInfoQuestions, Integer)");

		return lCharacterInfoQuestionsDTO;
	}
	
	public static CharacterInfoWithoutQuestionsDTO loadCharacterInfoWithoutQuestions(CharacterInfoWithoutQuestions pCharacterInfoWithoutQuestions, Integer lIntIdCharacter) {

		CharacterInfoWithoutQuestionsDTO lCharacterInfoWithoutQuestionsDTO;
		
		mLog.debug("Start loadCharacterInfoWithoutQuestions(CharacterInfoWithoutQuestions, Integer)");
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			
			CharactersMapper lCharactersMapper = lSqlSession.getMapper(CharactersMapper.class);
			CharactersWithBLOBs lCharacters = lCharactersMapper.selectByPrimaryKey(lIntIdCharacter.longValue());
			
			lCharacterInfoWithoutQuestionsDTO = new CharacterInfoWithoutQuestionsDTO();
			lCharacterInfoWithoutQuestionsDTO.setId(lIntIdCharacter);
			lCharacterInfoWithoutQuestionsDTO.setCharacterInfoWithoutQuestions(pCharacterInfoWithoutQuestions);
			
			switch(pCharacterInfoWithoutQuestions) {
			
			case CONFLICT:
				lCharacterInfoWithoutQuestionsDTO.setTaskStatus(TaskStatus.getTaskStatusFromValue(lCharacters.getConflictTaskStatus()));
				lCharacterInfoWithoutQuestionsDTO.setInfo(lCharacters.getConflict());
				break;
			
			case EVOLUTION_DURING_THE_STORY:
				lCharacterInfoWithoutQuestionsDTO.setTaskStatus(TaskStatus.getTaskStatusFromValue(lCharacters.getEvolutionduringthestoryTaskStatus()));
				lCharacterInfoWithoutQuestionsDTO.setInfo(lCharacters.getEvolutionduringthestory());
				break;
			
			case LIFE_BEFORE_STORY_BEGINNING:
				lCharacterInfoWithoutQuestionsDTO.setTaskStatus(TaskStatus.getTaskStatusFromValue(lCharacters.getLifebeforestorybeginningTaskStatus()));
				lCharacterInfoWithoutQuestionsDTO.setInfo(lCharacters.getLifebeforestorybeginning());
				break;
				
			default:
				break;
			}
						
		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}	
		
		mLog.debug("End loadCharacterInfoWithoutQuestions(CharacterInfoWithoutQuestions, Integer)");

		return lCharacterInfoWithoutQuestionsDTO;
	}

	public static void saveCharacterInfoQuestions(CharacterInfoQuestionsDTO pCharacterInfoQuestionsDTO) {
		
		mLog.debug("Start saveCharacterInfoQuestions(CharacterInfoQuestionsDTO)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			
			//update characters table
			
			CharactersWithBLOBs lCharacters = new CharactersWithBLOBs();
			lCharacters.setIdCharacter(pCharacterInfoQuestionsDTO.getId().longValue());
			
			switch(pCharacterInfoQuestionsDTO.getCharacterInfoQuestions()) {
			
			case BEHAVIORS:
				lCharacters.setBehaviorsFreeText(pCharacterInfoQuestionsDTO.getFreeText());
				lCharacters.setBehaviorsInterview(pCharacterInfoQuestionsDTO.getInterviewMode() ? "Y": "N");
				lCharacters.setBehaviorsTaskStatus(pCharacterInfoQuestionsDTO.getTaskStatus().getValue());
				break;
			
			case IDEAS:
				lCharacters.setIdeasFreeText(pCharacterInfoQuestionsDTO.getFreeText());
				lCharacters.setIdeasInterview(pCharacterInfoQuestionsDTO.getInterviewMode() ? "Y": "N");
				lCharacters.setIdeasTaskStatus(pCharacterInfoQuestionsDTO.getTaskStatus().getValue());
				break;
			
			case PERSONAL_DATA:
				lCharacters.setPersonalDataFreeText(pCharacterInfoQuestionsDTO.getFreeText());
				lCharacters.setPersonalDataInterview(pCharacterInfoQuestionsDTO.getInterviewMode() ? "Y": "N");
				lCharacters.setPersonalDataTaskStatus(pCharacterInfoQuestionsDTO.getTaskStatus().getValue());
				break;
				
			case PHYSIONOMY:
				lCharacters.setPhysionomyFreeText(pCharacterInfoQuestionsDTO.getFreeText());
				lCharacters.setPhysionomyInterview(pCharacterInfoQuestionsDTO.getInterviewMode() ? "Y": "N");
				lCharacters.setPhysionomyTaskStatus(pCharacterInfoQuestionsDTO.getTaskStatus().getValue());
				break;
								
			case PSYCHOLOGY:	
				lCharacters.setPsychologyFreeText(pCharacterInfoQuestionsDTO.getFreeText());
				lCharacters.setPsychologyInterview(pCharacterInfoQuestionsDTO.getInterviewMode() ? "Y": "N");
				lCharacters.setPsychologyTaskStatus(pCharacterInfoQuestionsDTO.getTaskStatus().getValue());
				break;
				
			case SOCIOLOGY:	
				lCharacters.setSociologyFreeText(pCharacterInfoQuestionsDTO.getFreeText());
				lCharacters.setSociologyInterview(pCharacterInfoQuestionsDTO.getInterviewMode() ? "Y": "N");
				lCharacters.setSociologyTaskStatus(pCharacterInfoQuestionsDTO.getTaskStatus().getValue());
				break;
				
			default:
				break;
			}
			
			CharactersMapper lCharactersMapper = lSqlSession.getMapper(CharactersMapper.class);
			lCharactersMapper.updateByPrimaryKeySelective(lCharacters);
			
			
			//update character info table
			CharacterInfosMapper lCharacterInfosMapper= lSqlSession.getMapper(CharacterInfosMapper.class);
			CharacterInfosExample lCharacterInfosExample = new CharacterInfosExample();
			lCharacterInfosExample.createCriteria().
				andCharacterInfoTypeEqualTo(pCharacterInfoQuestionsDTO.getCharacterInfoQuestions().name()).
				andIdCharacterEqualTo(pCharacterInfoQuestionsDTO.getId());
			
			lCharacterInfosMapper.deleteByExample(lCharacterInfosExample);
			
			for (int i = 1; i <= pCharacterInfoQuestionsDTO.getAnswerList().size(); i++) {				
				CharacterInfos lCharacterInfos = new CharacterInfos();
				lCharacterInfos.setCharacterInfoType(pCharacterInfoQuestionsDTO.getCharacterInfoQuestions().name());
				lCharacterInfos.setIdCharacter(pCharacterInfoQuestionsDTO.getId());
				lCharacterInfos.setQuestion(i);
				lCharacterInfos.setInfo(pCharacterInfoQuestionsDTO.getAnswerList().get(i-1));			
				lCharacterInfosMapper.insert(lCharacterInfos);
			}
			
			lSqlSession.commit();
			
		} catch (Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End saveCharacterInfoQuestions(CharacterInfoQuestionsDTO)");
		
	}
	
	
	public static void saveCharacterInfoWithoutQuestions(CharacterInfoWithoutQuestionsDTO pCharacterInfoWithoutQuestionsDTO) {
		
		mLog.debug("Start saveCharacterInfoWithoutQuestions(CharacterInfoQuestionsDTO)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			
			//update characters table
			CharactersWithBLOBs lCharacters = new CharactersWithBLOBs();
			lCharacters.setIdCharacter(pCharacterInfoWithoutQuestionsDTO.getId().longValue());
			
			switch(pCharacterInfoWithoutQuestionsDTO.getCharacterInfoWithoutQuestions()) {
			
			case CONFLICT:
				lCharacters.setConflict(pCharacterInfoWithoutQuestionsDTO.getInfo());
				lCharacters.setConflictTaskStatus(pCharacterInfoWithoutQuestionsDTO.getTaskStatus().getValue());
				break;
			
			case EVOLUTION_DURING_THE_STORY:
				lCharacters.setEvolutionduringthestory(pCharacterInfoWithoutQuestionsDTO.getInfo());
				lCharacters.setEvolutionduringthestoryTaskStatus(pCharacterInfoWithoutQuestionsDTO.getTaskStatus().getValue());
				break;
			
			case LIFE_BEFORE_STORY_BEGINNING:
				lCharacters.setLifebeforestorybeginning(pCharacterInfoWithoutQuestionsDTO.getInfo());
				lCharacters.setLifebeforestorybeginningTaskStatus(pCharacterInfoWithoutQuestionsDTO.getTaskStatus().getValue());
				break;
				
			default:
				break;
			}
			
			CharactersMapper lCharactersMapper = lSqlSession.getMapper(CharactersMapper.class);
			lCharactersMapper.updateByPrimaryKeySelective(lCharacters);
						
			lSqlSession.commit();
			
		} catch (Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End saveCharacterInfoWithoutQuestions(CharacterInfoQuestionsDTO)");
		
	}

	public static void changeCharacterName(CharacterDTO pCharacterDTO) {
		
		mLog.debug("Start save(CharacterDTO)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			
			CharactersWithBLOBs lCharacters = new CharactersWithBLOBs();
			lCharacters.setIdCharacter(pCharacterDTO.getIdCharacter().longValue());
			lCharacters.setName(pCharacterDTO.getName());

			CharactersMapper lCharactersMapper = lSqlSession.getMapper(CharactersMapper.class);
			lCharactersMapper.updateByPrimaryKeySelective(lCharacters);
						
			lSqlSession.commit();
			
		} catch (Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End save(CharacterDTO)");
	}

	public static SecondaryCharacterDTO loadSecondaryCharacter(Integer lIntIdCharacter) {
		
		SecondaryCharacterDTO lSecondaryCharacterDTO = null;
		
		mLog.debug("Start loadSecondaryCharacter(Integer)");
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			
			CharactersMapper lCharactersMapper = lSqlSession.getMapper(CharactersMapper.class);
			CharactersWithBLOBs lCharacters = lCharactersMapper.selectByPrimaryKey(lIntIdCharacter.longValue());
			lSecondaryCharacterDTO = createSecondaryCharacterDTOFromCharacters(lCharacters);
			lSecondaryCharacterDTO.setDescription(lCharacters.getSecondaryCharacterDescription());
			
		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}	

		mLog.debug("End loadSecondaryCharacter(Integer)");

		return lSecondaryCharacterDTO;
	}

	public static void saveSecondaryCharacter(SecondaryCharacterDTO pSecondaryCharacterDTO) {
		mLog.debug("Start saveSecondaryCharacter(SecondaryCharacterDTO)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			
			CharactersWithBLOBs lCharacters = new CharactersWithBLOBs();
			lCharacters.setIdCharacter(pSecondaryCharacterDTO.getIdCharacter().longValue());
			lCharacters.setSecondaryCharacterDescription(pSecondaryCharacterDTO.getDescription());
			lCharacters.setSecondaryCharacterDescriptionTaskStatus(pSecondaryCharacterDTO.getTaskStatus().getValue());

			CharactersMapper lCharactersMapper = lSqlSession.getMapper(CharactersMapper.class);
			lCharactersMapper.updateByPrimaryKeySelective(lCharacters);
						
			lSqlSession.commit();
			
		} catch (Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End saveSecondaryCharacter(SecondaryCharacterDTO)");
		
	}
}
