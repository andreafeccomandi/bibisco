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

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.bibisco.BibiscoException;
import com.bibisco.bean.ChapterDTO;
import com.bibisco.bean.CharacterInfoQuestionsDTO;
import com.bibisco.bean.CharacterInfoWithoutQuestionsDTO;
import com.bibisco.bean.LocationDTO;
import com.bibisco.bean.MainCharacterDTO;
import com.bibisco.bean.ProjectFromSceneChapterDTO;
import com.bibisco.bean.ProjectFromSceneLocationDTO;
import com.bibisco.bean.ProjectFromSceneMainCharacterDTO;
import com.bibisco.bean.ProjectFromSceneSecondaryCharacterDTO;
import com.bibisco.bean.SceneRevisionDTO;
import com.bibisco.bean.SecondaryCharacterDTO;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.ScenesMapper;
import com.bibisco.dao.client.VSelectedSceneRevisionsMapper;
import com.bibisco.dao.model.Scenes;
import com.bibisco.dao.model.VSelectedSceneRevisions;
import com.bibisco.dao.model.VSelectedSceneRevisionsExample;
import com.bibisco.enums.CharacterInfoQuestions;
import com.bibisco.enums.CharacterInfoWithoutQuestions;
import com.bibisco.enums.ElementType;
import com.bibisco.enums.TaskStatus;
import com.bibisco.log.Log;

/**
 * Project from scene manager.
 * 
 * @author Andrea Feccomandi
 * 
 */
public class ProjectFromSceneManager {

	private static Log mLog = Log.getInstance(ProjectFromSceneManager.class);

	public static ProjectFromSceneChapterDTO loadProjectFromSceneChapterByIdScene(Integer pIntIdScene) {

		ProjectFromSceneChapterDTO lProjectFromSceneChapterDTO;

		mLog.debug("Start loadProjectFromSceneChapterByIdScene(" + pIntIdScene + ")");
		
		//load scene
		Scenes lScenes;
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			ScenesMapper lScenesMapper = lSqlSession.getMapper(ScenesMapper.class);
			lScenes = lScenesMapper.selectByPrimaryKey(pIntIdScene.longValue());
		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		lProjectFromSceneChapterDTO = loadProjectFromSceneChapterByIdChapter(lScenes.getIdChapter());
		mLog.debug("End loadProjectFromSceneChapterByIdScene(" + pIntIdScene + ")");
		
		return lProjectFromSceneChapterDTO;
	}
	
	public static ProjectFromSceneChapterDTO loadProjectFromSceneChapterByIdChapter(Integer pIntIdChapter) {

		ProjectFromSceneChapterDTO lProjectFromSceneChapterDTO = new ProjectFromSceneChapterDTO();

		mLog.debug("Start loadProjectFromSceneChapterByIdChapter(" + pIntIdChapter + ")");
		
		// load chapter
		ChapterDTO lChapterDTO = ChapterManager.load(pIntIdChapter);
		lProjectFromSceneChapterDTO.setIdChapter(pIntIdChapter);
		lProjectFromSceneChapterDTO.setChapterNotes(lChapterDTO.getNote());
		lProjectFromSceneChapterDTO.setChapterReason(lChapterDTO.getReason());
		
		// load chapter's scenes
		List<SceneRevisionDTO> lListSceneRevisionDTO = loadScenesByIdChapter(pIntIdChapter);
		lProjectFromSceneChapterDTO.setSceneRevisionDTOList(lListSceneRevisionDTO);

		mLog.debug("End loadProjectFromSceneChapterByIdChapter(" + pIntIdChapter + ")");

		return lProjectFromSceneChapterDTO;
	}
	
	private static List<SceneRevisionDTO> loadScenesByIdChapter(Integer pIntIdChapter) {

		List<SceneRevisionDTO> lListSceneRevisionDTO = null;

		mLog.debug("Start loadScenesByIdChapter(" + pIntIdChapter + ")");

		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			VSelectedSceneRevisionsMapper lVSelectedSceneRevisionsMapper = lSqlSession.getMapper(VSelectedSceneRevisionsMapper.class);
			VSelectedSceneRevisionsExample lVSelectedSceneRevisionsExample = new VSelectedSceneRevisionsExample();
			lVSelectedSceneRevisionsExample.createCriteria().andIdChapterEqualTo(pIntIdChapter.longValue());
			lVSelectedSceneRevisionsExample.setOrderByClause("SCENE_POSITION");
			
			List<VSelectedSceneRevisions> lListVSelectedSceneRevisions = lVSelectedSceneRevisionsMapper.selectByExampleWithBLOBs(lVSelectedSceneRevisionsExample);
			lListSceneRevisionDTO = new ArrayList<SceneRevisionDTO>();
			for (VSelectedSceneRevisions lVSelectedSceneRevisions : lListVSelectedSceneRevisions) {
				SceneRevisionDTO lSceneRevisionDTO = new SceneRevisionDTO();
				lSceneRevisionDTO.setIdScene(lVSelectedSceneRevisions.getIdScene().intValue());
				lSceneRevisionDTO.setTitle(lVSelectedSceneRevisions.getSceneDescription());
				lSceneRevisionDTO.setText(lVSelectedSceneRevisions.getScene());
				lSceneRevisionDTO.setPosition(lVSelectedSceneRevisions.getScenePosition());
				lSceneRevisionDTO.setTaskStatus(TaskStatus.getTaskStatusFromValue(lVSelectedSceneRevisions.getSceneTaskStatus()));
				lSceneRevisionDTO.setIdChapter(lVSelectedSceneRevisions.getIdChapter().intValue());
				lListSceneRevisionDTO.add(lSceneRevisionDTO);
			}

		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		mLog.debug("End loadScenesByIdChapter(" + pIntIdChapter + ")");

		return lListSceneRevisionDTO;
	}

	public static ProjectFromSceneMainCharacterDTO loadProjectFromSceneMainCharacter(Integer pIntIdCharacter) {
		
		ProjectFromSceneMainCharacterDTO lProjectFromSceneMainCharacterDTO;
		
		mLog.debug("Start loadProjectFromSceneMainCharacter(",pIntIdCharacter.toString(),")");
		lProjectFromSceneMainCharacterDTO = new ProjectFromSceneMainCharacterDTO();
		
		// basic info
		MainCharacterDTO lMainCharacterDTO = CharacterManager.loadMainCharacter(pIntIdCharacter);
		
		// character info questions
		List<CharacterInfoQuestionsDTO> lListCharacterInfoQuestionsDTO = new ArrayList<CharacterInfoQuestionsDTO>();
		for (CharacterInfoQuestions lCharacterInfoQuestions : CharacterInfoQuestions.values()) {
			lListCharacterInfoQuestionsDTO.add(CharacterManager.loadCharacterInfoQuestions(lCharacterInfoQuestions, pIntIdCharacter));
		}
		
		// character info without questions
		List<CharacterInfoWithoutQuestionsDTO> lListCharacterInfoWithoutQuestionsDTO = new ArrayList<CharacterInfoWithoutQuestionsDTO>();
		for (CharacterInfoWithoutQuestions lCharacterInfoWithoutQuestions : CharacterInfoWithoutQuestions.values()) {
			lListCharacterInfoWithoutQuestionsDTO.add(CharacterManager.loadCharacterInfoWithoutQuestions(lCharacterInfoWithoutQuestions, pIntIdCharacter));
		}
		
		
		lProjectFromSceneMainCharacterDTO.setIdCharacter(pIntIdCharacter);
		lProjectFromSceneMainCharacterDTO.setName(lMainCharacterDTO.getName());
		lProjectFromSceneMainCharacterDTO.setPosition(lMainCharacterDTO.getPosition());
		lProjectFromSceneMainCharacterDTO.setMainCharacter(true);
		lProjectFromSceneMainCharacterDTO.setCharacterInfoQuestionsDTOList(lListCharacterInfoQuestionsDTO);
		lProjectFromSceneMainCharacterDTO.setCharacterInfoWithoutQuestionsDTOList(lListCharacterInfoWithoutQuestionsDTO);
		lProjectFromSceneMainCharacterDTO.setImageDTOList(ImageManager.loadImagesByElement(pIntIdCharacter, ElementType.CHARACTERS));
		
		mLog.debug("End loadProjectFromSceneMainCharacter(",pIntIdCharacter.toString(),")");
		
		return lProjectFromSceneMainCharacterDTO;
	}

	public static ProjectFromSceneSecondaryCharacterDTO loadProjectFromSceneSecondaryCharacter(Integer pIntIdCharacter) {
		
		ProjectFromSceneSecondaryCharacterDTO lProjectFromSceneSecondaryCharacterDTO;
		
		mLog.debug("Start loadProjectFromSceneSecondaryCharacter(",pIntIdCharacter.toString(),")");
		
		SecondaryCharacterDTO lSecondaryCharacterDTO = CharacterManager.loadSecondaryCharacter(pIntIdCharacter);
		lProjectFromSceneSecondaryCharacterDTO = new ProjectFromSceneSecondaryCharacterDTO();
		lProjectFromSceneSecondaryCharacterDTO.setIdCharacter(lSecondaryCharacterDTO.getIdCharacter());
		lProjectFromSceneSecondaryCharacterDTO.setName(lSecondaryCharacterDTO.getName());
		lProjectFromSceneSecondaryCharacterDTO.setDescription(lSecondaryCharacterDTO.getDescription());
		lProjectFromSceneSecondaryCharacterDTO.setPosition(lSecondaryCharacterDTO.getPosition());
		lProjectFromSceneSecondaryCharacterDTO.setMainCharacter(lSecondaryCharacterDTO.isMainCharacter());
		lProjectFromSceneSecondaryCharacterDTO.setImageDTOList(ImageManager.loadImagesByElement(pIntIdCharacter, ElementType.CHARACTERS));
		
		mLog.debug("End loadProjectFromSceneSecondaryCharacter(",pIntIdCharacter.toString(),")");
		
		return lProjectFromSceneSecondaryCharacterDTO;
	
	}
	
	public static ProjectFromSceneLocationDTO loadProjectFromSceneLocation(Integer pIntIdLocation) {
		
		ProjectFromSceneLocationDTO lProjectFromSceneLocationDTO;
		
		mLog.debug("Start loadProjectFromSceneLocation(",pIntIdLocation.toString(),")");
		
		LocationDTO lLocationDTO = LocationManager.load(pIntIdLocation);
		
		lProjectFromSceneLocationDTO = new ProjectFromSceneLocationDTO();
		lProjectFromSceneLocationDTO.setIdLocation(lLocationDTO.getIdLocation());
		lProjectFromSceneLocationDTO.setDescription(lLocationDTO.getDescription());
		lProjectFromSceneLocationDTO.setCity(lLocationDTO.getCity());
		lProjectFromSceneLocationDTO.setName(lLocationDTO.getName());
		lProjectFromSceneLocationDTO.setNation(lLocationDTO.getNation());
		lProjectFromSceneLocationDTO.setPosition(lLocationDTO.getPosition());
		lProjectFromSceneLocationDTO.setState(lLocationDTO.getState());
		lProjectFromSceneLocationDTO.setImageDTOList(ImageManager.loadImagesByElement(pIntIdLocation, ElementType.LOCATIONS));
		
		mLog.debug("End loadProjectFromSceneLocation(",pIntIdLocation.toString(),")");
		
		return lProjectFromSceneLocationDTO;
	
	}
	
	
}
