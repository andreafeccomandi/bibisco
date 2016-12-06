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
import com.bibisco.bean.ProjectFromSceneArchitectureDTO;
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
import com.bibisco.manager.ArchitectureItemManager.ArchitectureItemType;

/**
 * Project from scene manager.
 * 
 * @author Andrea Feccomandi
 * 
 */
public class ProjectFromSceneManager {

	private static Log mLog = Log.getInstance(ProjectFromSceneManager.class);

	public static ProjectFromSceneChapterDTO loadChapterByIdScene(Integer pIntIdScene) {

		ProjectFromSceneChapterDTO lProjectFromSceneChapterDTO;

		mLog.debug("Start loadChapterByIdScene(" + pIntIdScene + ")");
		
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
		
		lProjectFromSceneChapterDTO = loadChapterByIdChapter(lScenes.getIdChapter());
		mLog.debug("End loadChapterByIdScene(" + pIntIdScene + ")");
		
		return lProjectFromSceneChapterDTO;
	}
	
	public static ProjectFromSceneChapterDTO loadChapterByIdChapter(Integer pIntIdChapter) {

		ProjectFromSceneChapterDTO lProjectFromSceneChapterDTO = new ProjectFromSceneChapterDTO();

		mLog.debug("Start loadChapterByIdChapter(" + pIntIdChapter + ")");
		
		// load chapter
		ChapterDTO lChapterDTO = ChapterManager.load(pIntIdChapter);
		lProjectFromSceneChapterDTO.setIdChapter(pIntIdChapter);
		lProjectFromSceneChapterDTO.setChapterNotes(lChapterDTO.getNote());
		lProjectFromSceneChapterDTO.setChapterReason(lChapterDTO.getReason());
		
		// load chapter's scenes
		List<SceneRevisionDTO> lListSceneRevisionDTO = loadScenesByIdChapter(pIntIdChapter);
		lProjectFromSceneChapterDTO.setSceneRevisionDTOList(lListSceneRevisionDTO);

		mLog.debug("End loadChapterByIdChapter(" + pIntIdChapter + ")");

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

	public static ProjectFromSceneMainCharacterDTO loadMainCharacter(Integer pIntIdCharacter) {
		
		ProjectFromSceneMainCharacterDTO lProjectFromSceneMainCharacterDTO;
		
		mLog.debug("Start loadMainCharacter(",pIntIdCharacter.toString(),")");
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
		
		mLog.debug("End loadMainCharacter(",pIntIdCharacter.toString(),")");
		
		return lProjectFromSceneMainCharacterDTO;
	}

	public static ProjectFromSceneSecondaryCharacterDTO loadSecondaryCharacter(Integer pIntIdCharacter) {
		
		ProjectFromSceneSecondaryCharacterDTO lProjectFromSceneSecondaryCharacterDTO;
		
		mLog.debug("Start loadSecondaryCharacter(",pIntIdCharacter.toString(),")");
		
		SecondaryCharacterDTO lSecondaryCharacterDTO = CharacterManager.loadSecondaryCharacter(pIntIdCharacter);
		lProjectFromSceneSecondaryCharacterDTO = new ProjectFromSceneSecondaryCharacterDTO();
		lProjectFromSceneSecondaryCharacterDTO.setIdCharacter(lSecondaryCharacterDTO.getIdCharacter());
		lProjectFromSceneSecondaryCharacterDTO.setName(lSecondaryCharacterDTO.getName());
		lProjectFromSceneSecondaryCharacterDTO.setDescription(lSecondaryCharacterDTO.getDescription());
		lProjectFromSceneSecondaryCharacterDTO.setPosition(lSecondaryCharacterDTO.getPosition());
		lProjectFromSceneSecondaryCharacterDTO.setMainCharacter(lSecondaryCharacterDTO.isMainCharacter());
		lProjectFromSceneSecondaryCharacterDTO.setImageDTOList(ImageManager.loadImagesByElement(pIntIdCharacter, ElementType.CHARACTERS));
		
		mLog.debug("End loadSecondaryCharacter(",pIntIdCharacter.toString(),")");
		
		return lProjectFromSceneSecondaryCharacterDTO;
	
	}
	
	public static ProjectFromSceneArchitectureDTO loadArchitecture() {
		
		ProjectFromSceneArchitectureDTO lProjectFromSceneArchitectureDTO;
		
		mLog.debug("Start loadArchitecture()");
		
		lProjectFromSceneArchitectureDTO = new ProjectFromSceneArchitectureDTO();
		lProjectFromSceneArchitectureDTO.setFabula(ArchitectureItemManager.load(ArchitectureItemType.FABULA).getText());
		lProjectFromSceneArchitectureDTO.setPremise(ArchitectureItemManager.load(ArchitectureItemType.PREMISE).getText());
		lProjectFromSceneArchitectureDTO.setSetting(ArchitectureItemManager.load(ArchitectureItemType.SETTING).getText());
		lProjectFromSceneArchitectureDTO.setStrandList(StrandManager.loadAll());
		
		mLog.debug("End loadArchitecture()");
		
		return lProjectFromSceneArchitectureDTO;
		
	} 
	
	public static ProjectFromSceneLocationDTO loadLocation(Integer pIntIdLocation) {
		
		ProjectFromSceneLocationDTO lProjectFromSceneLocationDTO;
		
		mLog.debug("Start loadLocation(",pIntIdLocation.toString(),")");
		
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
		
		mLog.debug("End loadLocation(",pIntIdLocation.toString(),")");
		
		return lProjectFromSceneLocationDTO;
	
	}
	
	
}
