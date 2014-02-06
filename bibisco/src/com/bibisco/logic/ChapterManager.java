package com.bibisco.logic;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.bibisco.BibiscoException;
import com.bibisco.TaskStatus;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.ChaptersMapper;
import com.bibisco.dao.client.SceneRevisionsMapper;
import com.bibisco.dao.client.ScenesMapper;
import com.bibisco.dao.client.VChaptersMapper;
import com.bibisco.dao.model.Chapters;
import com.bibisco.dao.model.ChaptersExample;
import com.bibisco.dao.model.ChaptersWithBLOBs;
import com.bibisco.dao.model.Scenes;
import com.bibisco.dao.model.ScenesExample;
import com.bibisco.dao.model.VChapters;
import com.bibisco.dao.model.VChaptersExample;
import com.bibisco.log.Log;
import com.bibisco.ui.bean.ChapterDTO;
import com.bibisco.ui.bean.SceneDTO;

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

			ChaptersMapper lChaptersMapper = lSqlSession.getMapper(ChaptersMapper.class);
			ChaptersWithBLOBs lChaptersWithBLOBs = lChaptersMapper.selectByPrimaryKey(pIntIdChapter.longValue());

			lChapterDTO = new ChapterDTO();
			lChapterDTO.setIdChapter(lChaptersWithBLOBs.getIdChapter().intValue());
			lChapterDTO.setPosition(lChaptersWithBLOBs.getPosition());
			lChapterDTO.setTitle(lChaptersWithBLOBs.getTitle());
			lChapterDTO.setReason(lChaptersWithBLOBs.getReason());
			lChapterDTO.setReasonTaskStatus(TaskStatus.getTaskStatusFromValue(lChaptersWithBLOBs.getReasonTaskStatus()));
			lChapterDTO.setNote(lChaptersWithBLOBs.getNote());
			lChapterDTO.setSceneList(loadScenes(lSqlSession, pIntIdChapter));

		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}

		mLog.debug("End load(Integer)");

		return lChapterDTO;
	}
	
	private static List<SceneDTO> loadScenes(SqlSession pSqlSession, Integer pIntIdChapter) {

		List<SceneDTO> lListSceneRevision = null;

		mLog.debug("Start loadScenes(SqlSession, Integer)");

		ScenesMapper lScenesMapper = pSqlSession.getMapper(ScenesMapper.class);
		ScenesExample lScenesExample = new ScenesExample();
		lScenesExample.createCriteria().andIdChapterEqualTo(pIntIdChapter);
		lScenesExample.setOrderByClause("position");
		List<Scenes> lListScenes = lScenesMapper.selectByExample(lScenesExample);

		if (lListScenes != null && lListScenes.size() > 0) {
			lListSceneRevision = new ArrayList<SceneDTO>();
			for (Scenes lScenes : lListScenes) {

				SceneDTO lSceneDTO = new SceneDTO();
				lSceneDTO.setIdScene(lScenes.getIdScene().intValue());
				lSceneDTO.setIdChapter(lScenes.getIdChapter());
				lSceneDTO.setPosition(lScenes.getPosition());
				lSceneDTO.setDescription(lScenes.getDescription());
				lSceneDTO.setTaskStatus(TaskStatus.getTaskStatusFromValue(lScenes.getTaskStatus()));
				
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
					lChapterDTO.setTaskStatus(lTaskStatusChapter);
					
					lChapterDTO.setReasonTaskStatus(lTaskStatusReason);
					
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
