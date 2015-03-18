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
import com.bibisco.bean.SceneDTO;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.ChaptersMapper;
import com.bibisco.dao.client.SceneRevisionsMapper;
import com.bibisco.dao.client.ScenesMapper;
import com.bibisco.dao.client.VChaptersMapper;
import com.bibisco.dao.client.VScenesMapper;
import com.bibisco.dao.model.Chapters;
import com.bibisco.dao.model.ChaptersExample;
import com.bibisco.dao.model.ChaptersWithBLOBs;
import com.bibisco.dao.model.VChapters;
import com.bibisco.dao.model.VChaptersExample;
import com.bibisco.dao.model.VChaptersWithBLOBs;
import com.bibisco.dao.model.VScenes;
import com.bibisco.dao.model.VScenesExample;
import com.bibisco.enums.TaskStatus;
import com.bibisco.log.Log;

/**
 * Chapter manager.
 * 
 * @author Andrea Feccomandi
 *
 */
public class ChapterManager {
	
	private static Log mLog = Log.getInstance(ChapterManager.class);
	
	public static ChapterDTO insert(ChapterDTO pChapterDTO) {

		mLog.debug("Start insert(Chapter)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			ChaptersWithBLOBs lChapters = new ChaptersWithBLOBs();
			lChapters.setTitle(pChapterDTO.getTitle());
			lChapters.setPosition(pChapterDTO.getPosition());
			lChapters.setReasonTaskStatus(TaskStatus.TODO.getValue());
			
			ChaptersMapper lChaptersMapper = lSqlSession.getMapper(ChaptersMapper.class);
			lChaptersMapper.insert(lChapters);
			
			pChapterDTO.setIdChapter(lChapters.getIdChapter().intValue());
			pChapterDTO.setTaskStatus(TaskStatus.TODO);
			
			lSqlSession.commit();
			
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End insert(Chapter)");

		return pChapterDTO;
	}
	
	public static ChapterDTO load(Integer pIntIdChapter) {

		ChapterDTO lChapterDTO;

		mLog.debug("Start load(Integer)");

		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {

			VChaptersMapper lChaptersMapper = lSqlSession.getMapper(VChaptersMapper.class);
			VChaptersExample lVChaptersExample = new VChaptersExample();
			lVChaptersExample.createCriteria().andIdChapterEqualTo(pIntIdChapter.longValue());
			VChaptersWithBLOBs lChaptersWithBLOBs = lChaptersMapper.selectByExampleWithBLOBs(lVChaptersExample).get(0);

			lChapterDTO = new ChapterDTO();
			lChapterDTO.setIdChapter(lChaptersWithBLOBs.getIdChapter().intValue());
			lChapterDTO.setPosition(lChaptersWithBLOBs.getPosition());
			lChapterDTO.setTitle(lChaptersWithBLOBs.getTitle());
			lChapterDTO.setReason(lChaptersWithBLOBs.getReason());
			lChapterDTO.setReasonTaskStatus(TaskStatus.getTaskStatusFromValue(lChaptersWithBLOBs.getReasonTaskStatus()));
			lChapterDTO.setNote(lChaptersWithBLOBs.getNote());
			lChapterDTO.setWordCount(lChaptersWithBLOBs.getWords());
			lChapterDTO.setCharacterCount(lChaptersWithBLOBs.getCharacters());
			lChapterDTO.setSceneList(loadScenes(lSqlSession, pIntIdChapter));
			lChapterDTO.setTaskStatus(calculateChapterTaskStatus(lChaptersWithBLOBs));

		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}

		mLog.debug("End load(Integer)");

		return lChapterDTO;
	}
	
	private static TaskStatus calculateChapterTaskStatus(VChapters lVChapters) {
		
		TaskStatus lTaskStatusMaxScene = TaskStatus.getTaskStatusFromValue(lVChapters.getMaxScenesTaskStatus());
		TaskStatus lTaskStatusMinScene = TaskStatus.getTaskStatusFromValue(lVChapters.getMinScenesTaskStatus());
		TaskStatus lTaskStatusReason = TaskStatus.getTaskStatusFromValue(lVChapters.getReasonTaskStatus());
		
		TaskStatus lTaskStatusChapter;
		if(lTaskStatusMaxScene == TaskStatus.TODO 
				&& lTaskStatusMinScene == TaskStatus.TODO
				&& lTaskStatusReason == TaskStatus.TODO) {
			lTaskStatusChapter = TaskStatus.TODO;
		} else if(lTaskStatusMaxScene == TaskStatus.COMPLETED 
				&& lTaskStatusMinScene == TaskStatus.COMPLETED
				&& lTaskStatusReason == TaskStatus.COMPLETED) {
			lTaskStatusChapter = TaskStatus.COMPLETED;
		} else {
			lTaskStatusChapter = TaskStatus.TOCOMPLETE;
		}
		
		return lTaskStatusChapter;
	}
	
	private static List<SceneDTO> loadScenes(SqlSession pSqlSession, Integer pIntIdChapter) {

		List<SceneDTO> lListSceneRevision = null;

		mLog.debug("Start loadScenes(SqlSession, Integer)");

		VScenesMapper lVScenesMapper = pSqlSession.getMapper(VScenesMapper.class);
		VScenesExample lVScenesExample = new VScenesExample();
		lVScenesExample.createCriteria().andIdChapterEqualTo(pIntIdChapter);
		lVScenesExample.setOrderByClause("position");
		List<VScenes> lListVScenes = lVScenesMapper.selectByExample(lVScenesExample);

		if (lListVScenes != null && lListVScenes.size() > 0) {
			lListSceneRevision = new ArrayList<SceneDTO>();
			for (VScenes lVScenes : lListVScenes) {

				SceneDTO lSceneDTO = new SceneDTO();
				lSceneDTO.setIdScene(lVScenes.getIdScene().intValue());
				lSceneDTO.setIdChapter(lVScenes.getIdChapter());
				lSceneDTO.setPosition(lVScenes.getPosition());
				lSceneDTO.setDescription(lVScenes.getDescription());
				lSceneDTO.setTaskStatus(TaskStatus.getTaskStatusFromValue(lVScenes.getTaskStatus()));
				lSceneDTO.setWordCount(lVScenes.getWords());
				lSceneDTO.setCharacterCount(lVScenes.getCharacters());
				lListSceneRevision.add(lSceneDTO);
			}
		}

		mLog.debug("End loadScenes(SqlSession, Integer)");

		return lListSceneRevision;
	}
	

	public static List<ChapterDTO> loadAll() {
	
		List<ChapterDTO> lListChapter = null;
		
		mLog.debug("Start loadAll()");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    		
    		VChaptersMapper lVChaptersMapper = lSqlSession.getMapper(VChaptersMapper.class);
    		VChaptersExample lVChaptersExample = new VChaptersExample();
    		lVChaptersExample.setOrderByClause("position");
			List<VChapters> lListVChapters = lVChaptersMapper.selectByExample(lVChaptersExample);
			
			if (lListVChapters!=null && lListVChapters.size()>0) {
				lListChapter = new ArrayList<ChapterDTO>();
				for (VChapters lVChapters : lListVChapters) {
					
					ChapterDTO lChapterDTO = new ChapterDTO();
					lChapterDTO.setIdChapter(lVChapters.getIdChapter().intValue());
					lChapterDTO.setPosition(lVChapters.getPosition());
					lChapterDTO.setTitle(lVChapters.getTitle());	
					lChapterDTO.setTaskStatus(calculateChapterTaskStatus(lVChapters));
					lChapterDTO.setReasonTaskStatus(TaskStatus.getTaskStatusFromValue(lVChapters.getReasonTaskStatus()));
					lChapterDTO.setWordCount(lVChapters.getWords());
					lChapterDTO.setCharacterCount(lVChapters.getCharacters());
					
					lListChapter.add(lChapterDTO);
				}
			}
		
    	} catch(Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End loadAll()");
		
		return lListChapter;
	}
	
	public static void save(ChapterDTO pChapterDTO) {
		
		mLog.debug("Start save(ChapterDTO)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    		
    		ChaptersWithBLOBs lChapters = new ChaptersWithBLOBs();
    		lChapters.setIdChapter(pChapterDTO.getIdChapter().longValue());
    		lChapters.setPosition(pChapterDTO.getPosition());
    		lChapters.setTitle(pChapterDTO.getTitle());
    		lChapters.setReasonTaskStatus(pChapterDTO.getReasonTaskStatus() != null ? pChapterDTO.getReasonTaskStatus().getValue() : null);
    		lChapters.setReason(pChapterDTO.getReason());
    		lChapters.setNote(pChapterDTO.getNote());
   	
    		ChaptersMapper lChaptersMapper = lSqlSession.getMapper(ChaptersMapper.class);
    		lChaptersMapper.updateByPrimaryKeySelective(lChapters);
    		
    		lSqlSession.commit();
		
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End save(ChapterDTO)");
	}
	
	public static void deleteByPosition(Integer pIntIdPosition) {

		mLog.debug("Start deleteByPosition(Integer)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    		// delete scene revisions
    		SceneRevisionsMapper lSceneRevisionsMapper = lSqlSession.getMapper(SceneRevisionsMapper.class);
    		lSceneRevisionsMapper.deleteByChapterPosition(pIntIdPosition);
    		
    		// delete scenes
    		ScenesMapper lScenesMapper = lSqlSession.getMapper(ScenesMapper.class);
    		lScenesMapper.deleteByChapterPosition(pIntIdPosition);
    		
    		// delete chapter
    		ChaptersMapper lChaptersMapper = lSqlSession.getMapper(ChaptersMapper.class);
    		lChaptersMapper.deleteByPosition(pIntIdPosition);
    		
    		// shift down other chapters
			lChaptersMapper.shiftDown(pIntIdPosition, Integer.MAX_VALUE);

			lSqlSession.commit();
			
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End deleteByPosition(Integer)");

	}
	
	public static void move(Integer pIntSourcePosition, Integer pIntDestPosition) {

		mLog.debug("Start move(Integer, Integer)");
		
		if (pIntSourcePosition != pIntDestPosition) {
			SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
	    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
	    	try {
	    		
				ChaptersExample lChaptersExample = new ChaptersExample();
				lChaptersExample.createCriteria().andPositionEqualTo(pIntSourcePosition);
				
				ChaptersMapper lChaptersMapper = lSqlSession.getMapper(ChaptersMapper.class);
				
				// get chapter to update
				Chapters lChapters = lChaptersMapper.selectByExample(lChaptersExample).get(0);
				
				// update chapter position with fake position to preserve unique index before shift
				lChapters.setPosition(-1);
				lChaptersMapper.updateByPrimaryKey(lChapters);
				
				// update other chapters' position
				Integer lIntStartPosition;
				Integer lIntEndPosition;
				if (pIntSourcePosition > pIntDestPosition) {
					lIntStartPosition = pIntDestPosition;
					lIntEndPosition = pIntSourcePosition;
					lChaptersMapper.shiftUp(lIntStartPosition, lIntEndPosition);
				} else {
					lIntStartPosition = pIntSourcePosition;
					lIntEndPosition = pIntDestPosition;
					lChaptersMapper.shiftDown(lIntStartPosition, lIntEndPosition);
				}
				
				// update chapter position
				lChapters.setPosition(pIntDestPosition);
				lChaptersMapper.updateByPrimaryKey(lChapters);
			
				lSqlSession.commit();
				
	    	} catch(Throwable t) {
				mLog.error(t);
				lSqlSession.rollback();
				throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
			} finally {
				lSqlSession.close();
			}
		}
			
		mLog.debug("End move(Integer, Integer)");
	}
}
