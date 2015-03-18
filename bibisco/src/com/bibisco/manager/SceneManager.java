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
import com.bibisco.bean.SceneDTO;
import com.bibisco.bean.SceneRevisionDTO;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.SceneRevisionCharactersMapper;
import com.bibisco.dao.client.SceneRevisionStrandsMapper;
import com.bibisco.dao.client.SceneRevisionsMapper;
import com.bibisco.dao.client.ScenesMapper;
import com.bibisco.dao.model.SceneRevisionCharactersExample;
import com.bibisco.dao.model.SceneRevisionCharactersKey;
import com.bibisco.dao.model.SceneRevisionStrandsExample;
import com.bibisco.dao.model.SceneRevisionStrandsKey;
import com.bibisco.dao.model.SceneRevisions;
import com.bibisco.dao.model.SceneRevisionsExample;
import com.bibisco.dao.model.Scenes;
import com.bibisco.enums.PointOfView;
import com.bibisco.enums.TaskStatus;
import com.bibisco.log.Log;

/**
 * Scene manager.
 * 
 * @author Andrea Feccomandi
 *
 */
public class SceneManager {

	private static Log mLog = Log.getInstance(SceneManager.class);


	public static SceneRevisionDTO load(Integer pIntIdScene) {

		SceneRevisionDTO lSceneRevisionDTO = null;
		
		mLog.debug("Start load(Integer)");

		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			lSceneRevisionDTO = load(lSqlSession, pIntIdScene);
			
		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End load(Integer)");
		
		return lSceneRevisionDTO;
	}
	
	private static SceneRevisionDTO load(SqlSession pSqlSession, Integer pIntIdScene) {

		SceneRevisionDTO lSceneRevisionDTO = null;

		mLog.debug("Start load(Integer)");

		// load scene
		ScenesMapper lScenesMapper = pSqlSession.getMapper(ScenesMapper.class);
		Scenes lScenes = lScenesMapper.selectByPrimaryKey(pIntIdScene.longValue());

		// load scene revision
		SceneRevisionsMapper lSceneRevisionsMapper = pSqlSession.getMapper(SceneRevisionsMapper.class);
		SceneRevisions lSceneRevisionsSelected = lSceneRevisionsMapper.getSelectedByIdScene(pIntIdScene);
		
		// populate SceneRevisionDTO
		lSceneRevisionDTO = new SceneRevisionDTO();
		lSceneRevisionDTO.setIdScene(pIntIdScene);
		lSceneRevisionDTO.setPosition(lScenes.getPosition());
		lSceneRevisionDTO.setTitle(lScenes.getDescription());
		lSceneRevisionDTO.setTaskStatus(TaskStatus.getTaskStatusFromValue(lScenes.getTaskStatus()));
		lSceneRevisionDTO.setText(lSceneRevisionsSelected.getScene());
		lSceneRevisionDTO.setIdRevision(lSceneRevisionsSelected.getIdSceneRevision().intValue());
		lSceneRevisionDTO.setRevision(lSceneRevisionsSelected.getRevisionNumber());
		lSceneRevisionDTO.setIdLocation(lSceneRevisionsSelected.getIdLocation());
		lSceneRevisionDTO.setPointOfView(lSceneRevisionsSelected.getPointOfView() != null ? PointOfView.getPointOfViewFromValue(lSceneRevisionsSelected.getPointOfView()) : null);
		lSceneRevisionDTO.setIdCharacterPointOfView(lSceneRevisionsSelected.getPointOfViewIdCharacter());
		lSceneRevisionDTO.setSceneDate(lSceneRevisionsSelected.getSceneDate());
        lSceneRevisionDTO.setWordCount(lSceneRevisionsSelected.getWords());
        lSceneRevisionDTO.setCharacterCount(lSceneRevisionsSelected.getCharacters());
		
		// load revisions
		SceneRevisionsExample lSceneRevisionsExample = new SceneRevisionsExample();
		lSceneRevisionsExample.createCriteria()
			.andIdSceneEqualTo(pIntIdScene);
		lSceneRevisionsExample.setOrderByClause("revision_number desc");
		List<SceneRevisions> lSceneRevisionsList = lSceneRevisionsMapper.selectByExample(lSceneRevisionsExample);		
		List<Integer> lListSceneRevision = new ArrayList<Integer>();
		for (SceneRevisions lSceneRevisions : lSceneRevisionsList) {
			lListSceneRevision.add(lSceneRevisions.getIdSceneRevision().intValue());
		}
		lSceneRevisionDTO.setRevisions(lListSceneRevision);

		// load characters
		List<Integer> lListCharacter = new ArrayList<Integer>();
		SceneRevisionCharactersExample lSceneRevisionCharactersExample = new SceneRevisionCharactersExample();
		lSceneRevisionCharactersExample.createCriteria().andIdSceneRevisionEqualTo(lSceneRevisionsSelected.getIdSceneRevision().intValue());
		SceneRevisionCharactersMapper lSceneRevisionCharactersMapper = pSqlSession.getMapper(SceneRevisionCharactersMapper.class);
		List<SceneRevisionCharactersKey> lSceneRevisionCharactersKeyList = lSceneRevisionCharactersMapper.selectByExample(lSceneRevisionCharactersExample);
		if (lSceneRevisionCharactersKeyList!=null && lSceneRevisionCharactersKeyList.size()>0) {
			for (SceneRevisionCharactersKey lSceneRevisionCharactersKey : lSceneRevisionCharactersKeyList) {
				lListCharacter.add(lSceneRevisionCharactersKey.getIdCharacter());	
			}
		}
		lSceneRevisionDTO.setCharacters(lListCharacter);

		// load strands
		List<Integer> lListStrand = new ArrayList<Integer>();
		SceneRevisionStrandsExample lSceneRevisionStrandsExample = new SceneRevisionStrandsExample();
		lSceneRevisionStrandsExample.createCriteria().andIdSceneRevisionEqualTo(lSceneRevisionsSelected.getIdSceneRevision().intValue());
		SceneRevisionStrandsMapper lSceneRevisionStrandsMapper = pSqlSession.getMapper(SceneRevisionStrandsMapper.class);
		List<SceneRevisionStrandsKey> lSceneRevisionStrandsKeyList = lSceneRevisionStrandsMapper.selectByExample(lSceneRevisionStrandsExample);
		if (lSceneRevisionStrandsKeyList!=null && lSceneRevisionStrandsKeyList.size()>0) {
			for (SceneRevisionStrandsKey lSceneRevisionStrandsKey : lSceneRevisionStrandsKeyList) {
				lListStrand.add(lSceneRevisionStrandsKey.getIdStrand());	
			}
		}
		lSceneRevisionDTO.setStrands(lListStrand);
		
		mLog.debug("End load(Integer)");

		return lSceneRevisionDTO;
	}
	
	public static SceneRevisionDTO createRevisionFromScratch(Integer pIntIdScene) {

		SceneRevisionDTO lSceneRevisionDTO = null;

		mLog.debug("Start createRevisionFromScratch(" + pIntIdScene, ")");

		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {

			SceneRevisionsMapper lSceneRevisionsMapper = lSqlSession.getMapper(SceneRevisionsMapper.class);

			// deselect all revisions
			deselectAllRevisions(lSqlSession, pIntIdScene);

			// get actual max revision number
			Integer lIntMaxRevisionNumber = lSceneRevisionsMapper.selectNextRevisionNumber(pIntIdScene).getRevisionNumber();

			// insert new scene revision
			SceneRevisions lSceneRevisions = new SceneRevisions();
			lSceneRevisions.setIdScene(pIntIdScene);
			lSceneRevisions.setRevisionNumber(lIntMaxRevisionNumber + 1);
			lSceneRevisions.setSelected("Y");
			lSceneRevisions.setWords(0);
			lSceneRevisions.setCharacters(0);
			lSceneRevisionsMapper.insert(lSceneRevisions);

			// reload scene with new revision
			lSceneRevisionDTO = load(lSqlSession, pIntIdScene);

			lSqlSession.commit();

		} catch (Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}

		mLog.debug("End createRevisionFromScratch(" + pIntIdScene, ")");

		return lSceneRevisionDTO;
	}
	
	public static SceneRevisionDTO createRevisionFromActual(Integer pIntIdScene) {

		SceneRevisionDTO lSceneRevisionDTO = null;

		mLog.debug("Start createRevisionFromActual(" + pIntIdScene, ")");

		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {

			SceneRevisionsMapper lSceneRevisionsMapper = lSqlSession.getMapper(SceneRevisionsMapper.class);

			// get actual revision
			SceneRevisions lSceneRevisionsActual = lSceneRevisionsMapper.getSelectedByIdScene(pIntIdScene);

			// deselect all revisions
			deselectAllRevisions(lSqlSession, pIntIdScene);

			// get actual max revision number
			Integer lIntMaxRevisionNumber = lSceneRevisionsMapper.selectNextRevisionNumber(pIntIdScene).getRevisionNumber();

			// insert new scene revision
			lSceneRevisionsActual.setIdSceneRevision(null);
			lSceneRevisionsActual.setRevisionNumber(lIntMaxRevisionNumber+1);
			lSceneRevisionsActual.setSelected("Y");
			lSceneRevisionsMapper.insert(lSceneRevisionsActual);

			// reload scene with new revision
			lSceneRevisionDTO = load(lSqlSession, pIntIdScene);

			lSqlSession.commit();

		} catch (Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}

		mLog.debug("End createRevisionFromActual(" + pIntIdScene, ")");

		return lSceneRevisionDTO;
	}
	
	private static void deselectAllRevisions(SqlSession pSqlSession, Integer pIntIdScene) {
		
		mLog.debug("Start deselectAllRevisions(SqlSession, Integer)");
		
		// deselect all revision scene
		SceneRevisionsExample lSceneRevisionsExample = new SceneRevisionsExample();
		lSceneRevisionsExample.createCriteria().andIdSceneEqualTo(pIntIdScene);
		
		SceneRevisions lSceneRevisions = new SceneRevisions();
		lSceneRevisions.setSelected("N");
		
		SceneRevisionsMapper lSceneRevisionsMapper = pSqlSession.getMapper(SceneRevisionsMapper.class);
		lSceneRevisionsMapper.updateByExampleSelective(lSceneRevisions, lSceneRevisionsExample);
				
		mLog.debug("End deselectAllRevisions(SqlSession, Integer)");			
	}
	
	public static SceneRevisionDTO deleteActualRevision(Integer pIntIdScene) {
		
		SceneRevisionDTO lSceneRevisionDTO = null;
		
		mLog.debug("Start deleteActualRevision(" + pIntIdScene,")");

		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {

			// load scene revision
			SceneRevisionsMapper lSceneRevisionsMapper = lSqlSession.getMapper(SceneRevisionsMapper.class);
			SceneRevisions lSceneRevisionsSelected = lSceneRevisionsMapper.getSelectedByIdScene(pIntIdScene);
			
			// get position of revision to delete
			Integer lIntPositionRevisionToDelete = lSceneRevisionsSelected.getRevisionNumber();
			
			// delete actual revision
			lSceneRevisionsMapper.deleteByPrimaryKey(lSceneRevisionsSelected.getIdSceneRevision());
			
			// shift down the revision number 
			lSceneRevisionsMapper.shiftDown(lIntPositionRevisionToDelete);
			
			// get actual max revision number
			Integer lIntMaxRevisionNumber = lSceneRevisionsMapper.selectNextRevisionNumber(pIntIdScene).getRevisionNumber();

			// select revision with max revision number
			SceneRevisions lSceneRevisions = new SceneRevisions();
			lSceneRevisions.setSelected("Y");
			
			SceneRevisionsExample lSceneRevisionsExample = new SceneRevisionsExample();
			lSceneRevisionsExample.createCriteria().
			andIdSceneEqualTo(pIntIdScene).andRevisionNumberEqualTo(lIntMaxRevisionNumber);
			
			lSceneRevisionsMapper.updateByExampleSelective(lSceneRevisions, lSceneRevisionsExample);

			// reload scene with new revision
			lSceneRevisionDTO = load(lSqlSession, pIntIdScene);

			lSqlSession.commit();

		} catch (Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End deleteActualRevision(" + pIntIdScene, ")");
		
		return lSceneRevisionDTO;
	}
	
	public static void delete(Integer pIntIdScene) {

		mLog.debug("Start delete(Integer)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
		
			// load scene
			ScenesMapper lScenesMapper = lSqlSession.getMapper(ScenesMapper.class);
			Scenes lScenes = lScenesMapper.selectByPrimaryKey(pIntIdScene.longValue());

			// load all scene revisions
			SceneRevisionsExample lSceneRevisionsExample = new SceneRevisionsExample();
			lSceneRevisionsExample.createCriteria().andIdSceneEqualTo(lScenes.getIdScene().intValue());
			SceneRevisionsMapper lSceneRevisionsMapper = lSqlSession.getMapper(SceneRevisionsMapper.class);
			List<SceneRevisions> lListSceneRevisions = lSceneRevisionsMapper.selectByExample(lSceneRevisionsExample);
			
			// delete all scene revision characters and all scene revision strands
			SceneRevisionCharactersMapper lSceneRevisionCharactersMapper = lSqlSession.getMapper(SceneRevisionCharactersMapper.class);
			SceneRevisionStrandsMapper lSceneRevisionStrandsMapper = lSqlSession.getMapper(SceneRevisionStrandsMapper.class);
			for (SceneRevisions lSceneRevisions : lListSceneRevisions) {
				SceneRevisionCharactersExample lSceneRevisionCharactersExample = new SceneRevisionCharactersExample();
				lSceneRevisionCharactersExample.createCriteria().andIdSceneRevisionEqualTo(lSceneRevisions.getIdSceneRevision().intValue());			
				lSceneRevisionCharactersMapper.deleteByExample(lSceneRevisionCharactersExample);
			
				SceneRevisionStrandsExample lSceneRevisionStrandsExample = new SceneRevisionStrandsExample();
				lSceneRevisionStrandsExample.createCriteria().andIdSceneRevisionEqualTo(lSceneRevisions.getIdSceneRevision().intValue());
				lSceneRevisionStrandsMapper.deleteByExample(lSceneRevisionStrandsExample);
			}
			
			// delete all scene revisions
			lSceneRevisionsMapper.deleteByExample(lSceneRevisionsExample);
			
			// delete scene
			lScenesMapper.deleteByPrimaryKey(lScenes.getIdScene());
			
			// shift down scenes
			lScenesMapper.shiftDown(lScenes.getPosition(), Integer.MAX_VALUE, lScenes.getIdChapter());

			lSqlSession.commit();
			
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End delete(Integer)");

	}
	
	public static SceneRevisionDTO changeRevision(Integer pIntIdScene, Integer pIntNewRevision) {
		
		SceneRevisionDTO lSceneRevisionDTO = null;
		
		mLog.debug("Start changeRevision(" + pIntIdScene, "," + pIntNewRevision , ")");

		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
		
		SceneRevisionsMapper lSceneRevisionsMapper = lSqlSession.getMapper(SceneRevisionsMapper.class);
		
		// deselect all revisions
		deselectAllRevisions(lSqlSession, pIntIdScene);
			
		// select new revision
		SceneRevisions lSceneRevisions = new SceneRevisions();
		lSceneRevisions.setIdSceneRevision(pIntNewRevision.longValue());
		lSceneRevisions.setSelected("Y");
		lSceneRevisionsMapper.updateByPrimaryKeySelective(lSceneRevisions);
		
		// reload scene with new revision
		lSceneRevisionDTO = load(lSqlSession, pIntIdScene);
		
		lSqlSession.commit();
		
	    } catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		} 
		
		mLog.debug("End changeRevision(" + pIntIdScene, "," + pIntNewRevision , ")");
		
		return lSceneRevisionDTO;
	}
	
	public static SceneDTO insert(SceneDTO pSceneDTO) {
		
		mLog.debug("Start insert(SceneDTO)");
				
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    		
    		// Insert scene
    		Scenes lScenes = new Scenes();
    		lScenes.setIdChapter(pSceneDTO.getIdChapter());
    		lScenes.setDescription(pSceneDTO.getDescription());
    		lScenes.setPosition(pSceneDTO.getPosition());

			ScenesMapper lScenesMapper = lSqlSession.getMapper(ScenesMapper.class);
			lScenesMapper.insertSelective(lScenes);
			
			pSceneDTO.setIdScene(lScenes.getIdScene().intValue());
			pSceneDTO.setTaskStatus(TaskStatus.TODO);
			
			// insert scene revision
			SceneRevisions lSceneRevisions = new SceneRevisions();
			lSceneRevisions.setIdScene(lScenes.getIdScene().intValue());
			lSceneRevisions.setRevisionNumber(1);
			lSceneRevisions.setSelected("Y");
			lSceneRevisions.setWords(0);
			lSceneRevisions.setCharacters(0);
			
			SceneRevisionsMapper lSceneRevisionsMapper = lSqlSession.getMapper(SceneRevisionsMapper.class);
			lSceneRevisionsMapper.insert(lSceneRevisions);
			
			lSqlSession.commit();
			
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End insert(SceneRevisionDTO)");	
		
		return pSceneDTO;
	}
	
	public static void move(Integer pIntIdScene, Integer pIntDestPosition) {

		mLog.debug("Start move(Integer, Integer)");

		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();

		try {

			// get scene to update
			ScenesMapper lScenesMapper = lSqlSession.getMapper(ScenesMapper.class);
			Scenes lScenes = lScenesMapper.selectByPrimaryKey(pIntIdScene.longValue());
			Integer pIntSourcePosition = lScenes.getPosition();

			if (pIntSourcePosition.intValue() != pIntDestPosition.intValue()) {

				// update scene position with fake position to preserve unique index before shift
				lScenes.setPosition(-1);
				lScenesMapper.updateByPrimaryKey(lScenes);
				
				
				// update other scenes' position
				Integer lIntStartPosition;
				Integer lIntEndPosition;
				if (pIntSourcePosition > pIntDestPosition) {
					lIntStartPosition = pIntDestPosition;
					lIntEndPosition = pIntSourcePosition;
					lScenesMapper.shiftUp(lIntStartPosition, lIntEndPosition, lScenes.getIdChapter());
				} else {
					lIntStartPosition = pIntSourcePosition;
					lIntEndPosition = pIntDestPosition;
					lScenesMapper.shiftDown(lIntStartPosition, lIntEndPosition, lScenes.getIdChapter());
				}

				// update scene position
				lScenes.setPosition(pIntDestPosition);
				lScenesMapper.updateByPrimaryKey(lScenes);

				lSqlSession.commit();
			}

		} catch (Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}

		mLog.debug("End move(Integer, Integer)");
	}
	
	public static void save(SceneDTO pSceneDTO) {
		
		mLog.debug("Start save(SceneDTO)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    		
    		Scenes lScenes = new Scenes();
    		lScenes.setIdScene(pSceneDTO.getIdScene().longValue());
    		lScenes.setPosition(pSceneDTO.getPosition());
    		lScenes.setDescription(pSceneDTO.getDescription());
    		lScenes.setIdChapter(pSceneDTO.getIdChapter());
    		lScenes.setTaskStatus(pSceneDTO.getTaskStatus() != null ? pSceneDTO.getTaskStatus().getValue() : null);
    		
    		ScenesMapper lScenesMapper = lSqlSession.getMapper(ScenesMapper.class);
    		lScenesMapper.updateByPrimaryKeySelective(lScenes);
    		
    		lSqlSession.commit();
		
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End save(SceneDTO)");
	}


 public static void save(SceneRevisionDTO pSceneRevisionDTO) {
	
	mLog.debug("Start save(SceneDTO)");
	
	SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
	SqlSession lSqlSession = lSqlSessionFactory.openSession();
	try {
		
		Scenes lScenes = new Scenes();
		lScenes.setIdScene(pSceneRevisionDTO.getIdScene().longValue());
		lScenes.setPosition(pSceneRevisionDTO.getPosition());
		lScenes.setTaskStatus(pSceneRevisionDTO.getTaskStatus() != null ? pSceneRevisionDTO.getTaskStatus().getValue() : null);
		
		ScenesMapper lScenesMapper = lSqlSession.getMapper(ScenesMapper.class);
		lScenesMapper.updateByPrimaryKeySelective(lScenes);
		
		SceneRevisions lSceneRevisions = new SceneRevisions();
		lSceneRevisions.setIdScene(pSceneRevisionDTO.getIdScene());
		lSceneRevisions.setIdSceneRevision(pSceneRevisionDTO.getIdRevision().longValue());
		lSceneRevisions.setRevisionNumber(pSceneRevisionDTO.getRevision());
		lSceneRevisions.setSelected("Y");
		lSceneRevisions.setIdLocation(pSceneRevisionDTO.getIdLocation());
		lSceneRevisions.setPointOfView(pSceneRevisionDTO.getPointOfView() != null ? pSceneRevisionDTO.getPointOfView().getValue(): null);
		lSceneRevisions.setPointOfViewIdCharacter(pSceneRevisionDTO.getIdCharacterPointOfView());
		lSceneRevisions.setScene(pSceneRevisionDTO.getText());
		lSceneRevisions.setSceneDate(pSceneRevisionDTO.getSceneDate());
		lSceneRevisions.setWords(pSceneRevisionDTO.getWordCount());
		lSceneRevisions.setCharacters(pSceneRevisionDTO.getCharacterCount());
		SceneRevisionsMapper lSceneRevisionsMapper = lSqlSession.getMapper(SceneRevisionsMapper.class);
		lSceneRevisionsMapper.updateByPrimaryKeyWithBLOBs(lSceneRevisions);
		
		// save characters
		SceneRevisionCharactersMapper lSceneRevisionCharactersMapper = lSqlSession.getMapper(SceneRevisionCharactersMapper.class);
		SceneRevisionCharactersExample lSceneRevisionCharactersExample = new SceneRevisionCharactersExample();
		lSceneRevisionCharactersExample.createCriteria().andIdSceneRevisionEqualTo((pSceneRevisionDTO.getIdRevision()));
		lSceneRevisionCharactersMapper.deleteByExample(lSceneRevisionCharactersExample);
		
		if(pSceneRevisionDTO.getCharacters()!=null && pSceneRevisionDTO.getCharacters().size() > 0) {
			for (Integer lIntIdCharacter : pSceneRevisionDTO.getCharacters()) {
				SceneRevisionCharactersKey lSceneRevisionCharactersKey = new SceneRevisionCharactersKey();
				lSceneRevisionCharactersKey.setIdCharacter(lIntIdCharacter);
				lSceneRevisionCharactersKey.setIdSceneRevision(pSceneRevisionDTO.getIdRevision());
				lSceneRevisionCharactersMapper.insert(lSceneRevisionCharactersKey);
			}
		}
		
		// save strands
		SceneRevisionStrandsMapper lSceneRevisionStrandsMapper = lSqlSession.getMapper(SceneRevisionStrandsMapper.class);
		SceneRevisionStrandsExample lSceneRevisionStrandsExample = new SceneRevisionStrandsExample();
		lSceneRevisionStrandsExample.createCriteria().andIdSceneRevisionEqualTo((pSceneRevisionDTO.getIdRevision()));
		lSceneRevisionStrandsMapper.deleteByExample(lSceneRevisionStrandsExample);
		
		if(pSceneRevisionDTO.getStrands()!=null && pSceneRevisionDTO.getStrands().size() > 0) {
			for (Integer lIntIdStrand : pSceneRevisionDTO.getStrands()) {
				SceneRevisionStrandsKey lSceneRevisionStrands = new SceneRevisionStrandsKey();
				lSceneRevisionStrands.setIdStrand(lIntIdStrand);
				lSceneRevisionStrands.setIdSceneRevision(pSceneRevisionDTO.getIdRevision());
				lSceneRevisionStrandsMapper.insert(lSceneRevisionStrands);
			}
		}
		
		lSqlSession.commit();
	
	} catch(Throwable t) {
		mLog.error(t);
		lSqlSession.rollback();
		throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
	} finally {
		lSqlSession.close();
	}
	
	mLog.debug("End save(SceneDTO)");
}
}
