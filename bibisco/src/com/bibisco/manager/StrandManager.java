/*
 * Copyright (C) 2014-2015 Andrea Feccomandi
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
import com.bibisco.bean.StrandDTO;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.SceneRevisionStrandsMapper;
import com.bibisco.dao.client.StrandsMapper;
import com.bibisco.dao.model.SceneRevisionStrandsExample;
import com.bibisco.dao.model.SceneRevisionStrandsKey;
import com.bibisco.dao.model.Strands;
import com.bibisco.dao.model.StrandsExample;
import com.bibisco.enums.ElementType;
import com.bibisco.enums.TaskStatus;
import com.bibisco.log.Log;

/**
 * Narrative strand manager.
 * 
 * @author Andrea Feccomandi
 *
 */
public class StrandManager {

	private static Log mLog = Log.getInstance(StrandManager.class);
	
	public static List<StrandDTO> loadAll() {
		
		List<StrandDTO> lListStrandDTO = null;

		mLog.debug("Start loadAll()");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    		
    		StrandsMapper lStrandsMapper = lSqlSession.getMapper(StrandsMapper.class);
    		StrandsExample lStrandsExample = new StrandsExample();
    		lStrandsExample.setOrderByClause("position");
			List<Strands> lListStrands = lStrandsMapper.selectByExampleWithBLOBs(lStrandsExample);
			
			if (lListStrands!=null && lListStrands.size()>0) {
				lListStrandDTO = new ArrayList<StrandDTO>();
				for (Strands lStrands : lListStrands) {					
					lListStrandDTO.add(createStrandDTOFromStrands(lStrands));
				}
			}
		
    	} catch(Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End loadAll()");

		return lListStrandDTO;
	}
	
	public static StrandDTO insert(StrandDTO pStrandDTO) {
		
		mLog.debug("Start insert(StrandDTO)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			Strands lStrands = new Strands();
			lStrands.setName(pStrandDTO.getName());
			lStrands.setPosition(pStrandDTO.getPosition());
			
			StrandsMapper lStrandsMapper = lSqlSession.getMapper(StrandsMapper.class);
			lStrandsMapper.insertSelective(lStrands);
			
			pStrandDTO.setIdStrand(lStrands.getIdStrand().intValue());
			pStrandDTO.setTaskStatus(TaskStatus.TODO);
			
			lSqlSession.commit();
			
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End insert(StrandDTO)");

		return pStrandDTO;
	}
	
	public static boolean deleteByPosition(Integer pIntPosition) {

		boolean lBlnResult;

		mLog.debug("Start deleteByPosition(" + pIntPosition + ")");

		// get strand by position
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {

			StrandsMapper lStrandsMapper = lSqlSession.getMapper(StrandsMapper.class);

			// get strand by position
			StrandsExample lStrandsExample = new StrandsExample();
			lStrandsExample.createCriteria().andPositionEqualTo(pIntPosition);
			Strands lStrands = lStrandsMapper.selectByExample(lStrandsExample).get(0);

			// check if strand is referenced
			boolean lBlnIsReferenced = checkIfReferenced(lStrands.getIdStrand().intValue(), lSqlSession);

			// strand is not referenced, go on
			if (!lBlnIsReferenced) {

				// delete strand
				lStrandsMapper.deleteByPrimaryKey(lStrands.getIdStrand());

				// shift down other strand
				lStrandsMapper.shiftDown(pIntPosition, Integer.MAX_VALUE);

				// delete images
				ImageManager.deleteImagesByElement(lSqlSession, lStrands.getIdStrand().intValue(), ElementType.CHARACTERS);

				lBlnResult = true;
			}
			// strand is referenced, stop
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

		mLog.debug("End deleteStrandByPosition(" + pIntPosition + ")");

		return lBlnResult;
	}
	
	private static boolean checkIfReferenced(Integer pIntIdStrand, SqlSession pSqlSession) {
		
		boolean lBlnResult = false;
		
		mLog.debug("Start checkIfReferenced(Integer, SqlSession)");
		
		SceneRevisionStrandsExample lSceneRevisionStrandExample = new SceneRevisionStrandsExample();
		lSceneRevisionStrandExample.createCriteria().andIdStrandEqualTo(pIntIdStrand);
		SceneRevisionStrandsMapper lSceneRevisionStrandsMapper = pSqlSession.getMapper(SceneRevisionStrandsMapper.class);
		List<SceneRevisionStrandsKey> lSceneRevisionStrandsKeyList = lSceneRevisionStrandsMapper.selectByExample(lSceneRevisionStrandExample);
		
		if(lSceneRevisionStrandsKeyList!=null && lSceneRevisionStrandsKeyList.size()>0) {
			lBlnResult = true;
		} else {
			lBlnResult = false;
		}
		
		mLog.debug("End checkIfReferenced(Integer, SqlSession): return " + lBlnResult);
		
		return lBlnResult;
	}
	
	public static void move(Integer pIntSourcePosition, Integer pIntDestPosition) {

		mLog.debug("Start move(Integer, Integer)");
		
		if (!pIntSourcePosition.equals(pIntDestPosition)) {
			SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
	    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
	    	try {
	    		
				StrandsExample lStrandsExample = new StrandsExample();
				lStrandsExample.createCriteria().andPositionEqualTo(pIntSourcePosition);
				
				StrandsMapper lStrandsMapper = lSqlSession.getMapper(StrandsMapper.class);
				
				// get strand to update
				Strands lStrands = lStrandsMapper.selectByExample(lStrandsExample).get(0);
				
				// update strand position with fake position to preserve unique index before shift
				lStrands.setPosition(-1);
				lStrandsMapper.updateByPrimaryKey(lStrands);
				
				// update other strands' position
				Integer lIntStartPosition;
				Integer lIntEndPosition;
				if (pIntSourcePosition > pIntDestPosition) {
					lIntStartPosition = pIntDestPosition;
					lIntEndPosition = pIntSourcePosition;
					lStrandsMapper.shiftUp(lIntStartPosition, lIntEndPosition);
				} else {
					lIntStartPosition = pIntSourcePosition;
					lIntEndPosition = pIntDestPosition;
					lStrandsMapper.shiftDown(lIntStartPosition, lIntEndPosition);
				}
				
				// update strand position
				lStrands.setPosition(pIntDestPosition);
				lStrandsMapper.updateByPrimaryKey(lStrands);
			
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
	
	public static StrandDTO load(Integer pIntIdStrand) {
		
		StrandDTO lStrandDTO = null;
		
		mLog.debug("Start load(Integer)");
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			
			StrandsMapper lStrandsMapper = lSqlSession.getMapper(StrandsMapper.class);
			Strands lStrands = lStrandsMapper.selectByPrimaryKey(pIntIdStrand.longValue());
			lStrandDTO = createStrandDTOFromStrands(lStrands);
			
		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}	

		mLog.debug("End load(Integer)");

		return lStrandDTO;
	}
	
	private static StrandDTO createStrandDTOFromStrands(Strands pStrands) {
		
		StrandDTO lStrandDTO = new StrandDTO();
		lStrandDTO.setIdStrand(pStrands.getIdStrand().intValue());
		lStrandDTO.setName(pStrands.getName());
		lStrandDTO.setPosition(pStrands.getPosition());
		lStrandDTO.setDescription(pStrands.getDescription());
		lStrandDTO.setTaskStatus(TaskStatus.getTaskStatusFromValue(pStrands.getTaskStatus()));
		
		return lStrandDTO;
	}
	
	public static void save(StrandDTO pStrandDTO) {
		
		mLog.debug("Start update(StrandDTO)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			Strands lStrands = new Strands();
			lStrands.setIdStrand(pStrandDTO.getIdStrand().longValue());
			lStrands.setName(pStrandDTO.getName());
			lStrands.setDescription(pStrandDTO.getDescription());
			if (pStrandDTO.getTaskStatus()!=null) {
				lStrands.setTaskStatus(pStrandDTO.getTaskStatus().getValue());
			}
			
			StrandsMapper lStrandsMapper = lSqlSession.getMapper(StrandsMapper.class);
			lStrandsMapper.updateByPrimaryKeySelective(lStrands);
			
			lSqlSession.commit();
			
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End insert(StrandDTO)");
	}
}
