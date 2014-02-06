package com.bibisco.logic;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.bibisco.BibiscoException;
import com.bibisco.ElementType;
import com.bibisco.TaskStatus;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.LocationsMapper;
import com.bibisco.dao.client.SceneRevisionsMapper;
import com.bibisco.dao.model.Locations;
import com.bibisco.dao.model.LocationsExample;
import com.bibisco.dao.model.SceneRevisions;
import com.bibisco.dao.model.SceneRevisionsExample;
import com.bibisco.log.Log;
import com.bibisco.ui.bean.LocationDTO;

public class LocationManager {

	private static Log mLog = Log.getInstance(LocationManager.class);

	public static List<LocationDTO> loadAll() {

		List<LocationDTO> lListLocationDTO = null;

		mLog.debug("Start loadAll()");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    		
    		LocationsMapper lLocationsMapper = lSqlSession.getMapper(LocationsMapper.class);
    		LocationsExample lLocationsExample = new LocationsExample();
    		lLocationsExample.setOrderByClause("position");
			List<Locations> lListLocations = lLocationsMapper.selectByExample(lLocationsExample);
			
			if (lListLocations!=null && lListLocations.size()>0) {
				lListLocationDTO = new ArrayList<LocationDTO>();
				for (Locations lLocations : lListLocations) {
					
					LocationDTO lLocationDTO = new LocationDTO();
					lLocationDTO.setIdLocation(lLocations.getIdLocation().intValue());
					lLocationDTO.setName(lLocations.getName());
					lLocationDTO.setPosition(lLocations.getPosition());
					lLocationDTO.setNation(lLocations.getNation());
					lLocationDTO.setState(lLocations.getState());
					lLocationDTO.setCity(lLocations.getCity());
					lLocationDTO.setTaskStatus(TaskStatus.getTaskStatusFromValue(lLocations.getTaskStatus()));
					
					lListLocationDTO.add(lLocationDTO);
				}
			}
		
    	} catch(Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End loadAll()");

		return lListLocationDTO;
	}

	public static LocationDTO insert(LocationDTO pLocationDTO) {
		
		mLog.debug("Start insert(LocationDTO)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			Locations lLocations = new Locations();
			lLocations.setName(pLocationDTO.getName());
			lLocations.setPosition(pLocationDTO.getPosition());
			lLocations.setNation(pLocationDTO.getNation());
			lLocations.setState(pLocationDTO.getState());
			lLocations.setCity(pLocationDTO.getCity());
			
			LocationsMapper lLocationsMapper = lSqlSession.getMapper(LocationsMapper.class);
			lLocationsMapper.insertSelective(lLocations);
			
			pLocationDTO.setIdLocation(lLocations.getIdLocation().intValue());
			pLocationDTO.setTaskStatus(TaskStatus.TODO);
			
			lSqlSession.commit();
			
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End insert(LocationDTO)");

		return pLocationDTO;

	}

	public static boolean deleteByPosition(Integer pIntIdPosition) {
		
		boolean lBlnResult;
		
		mLog.debug("Start deleteByPosition(Integer)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    		LocationsExample lLocationsExample = new LocationsExample();
    		lLocationsExample.createCriteria().andPositionEqualTo(pIntIdPosition);
    		
    		LocationsMapper lLocationsMapper = lSqlSession.getMapper(LocationsMapper.class);
    		
    		// get location to delete by position
    		Locations lLocations = lLocationsMapper.selectByExample(lLocationsExample).get(0);
    		
    		// check if location is referenced
    		boolean lBlnIsReferenced = checkIfReferenced(lLocations.getIdLocation().intValue(), lSqlSession);

			// location is not referenced, go on
			if (!lBlnIsReferenced) {

	    		// delete location
	    		lLocationsMapper.deleteByPrimaryKey(lLocations.getIdLocation());
	    		
	    		// delete all images
	    		ImageManager.deleteImagesByElement(lSqlSession, lLocations.getIdLocation().intValue(), ElementType.LOCATIONS);
	    		
	    		// shift down other locations
				lLocationsMapper.shiftDown(pIntIdPosition, Integer.MAX_VALUE);
				
				lBlnResult = true;
			}
			// location is referenced, stop
			else {
				lBlnResult = false;
			}
			
			lSqlSession.commit();
			
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
    	
    	return lBlnResult;
	}
	
	public static void move(Integer pIntSourcePosition, Integer pIntDestPosition) {

		mLog.debug("Start move(Integer, Integer)");
		
		if (pIntSourcePosition != pIntDestPosition) {
			SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
	    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
	    	try {
	    		
				LocationsExample lLocationsExample = new LocationsExample();
				lLocationsExample.createCriteria().andPositionEqualTo(pIntSourcePosition);
				
				LocationsMapper lLocationsMapper = lSqlSession.getMapper(LocationsMapper.class);
				
				// get location to update
				Locations lLocations = lLocationsMapper.selectByExample(lLocationsExample).get(0);
				
				// update other locations' position
				Integer lIntStartPosition;
				Integer lIntEndPosition;
				if (pIntSourcePosition > pIntDestPosition) {
					lIntStartPosition = pIntDestPosition;
					lIntEndPosition = pIntSourcePosition;
					lLocationsMapper.shiftUp(lIntStartPosition, lIntEndPosition);
				} else {
					lIntStartPosition = pIntSourcePosition;
					lIntEndPosition = pIntDestPosition;
					lLocationsMapper.shiftDown(lIntStartPosition, lIntEndPosition);
				}
				
				// update location position
				lLocations.setPosition(pIntDestPosition);
				lLocationsMapper.updateByPrimaryKey(lLocations);
			
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

	public static LocationDTO load(Integer pIntIdLocation) {
		
		LocationDTO lLocationDTO = null;
		
		mLog.debug("Start load(Integer)");
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			
			LocationsMapper lLocationsMapper = lSqlSession.getMapper(LocationsMapper.class);
			Locations lLocations = lLocationsMapper.selectByPrimaryKey(pIntIdLocation.longValue());
			lLocationDTO = createLocationDTOFromLocations(lLocations);
			
		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}	

		mLog.debug("End load(Integer)");

		return lLocationDTO;
	}

	private static LocationDTO createLocationDTOFromLocations(Locations pLocations) {
		
		LocationDTO lLocationDTO = new LocationDTO();
		lLocationDTO.setIdLocation(pLocations.getIdLocation().intValue());
		lLocationDTO.setName(pLocations.getName());
		lLocationDTO.setPosition(pLocations.getPosition());
		lLocationDTO.setNation(pLocations.getNation());
		lLocationDTO.setState(pLocations.getState());
		lLocationDTO.setCity(pLocations.getCity());
		lLocationDTO.setDescription(pLocations.getDescription());
		lLocationDTO.setTaskStatus(TaskStatus.getTaskStatusFromValue(pLocations.getTaskStatus()));
		
		return lLocationDTO;
	}
	

	public static void save(LocationDTO pLocationDTO) {
		
		mLog.debug("Start update(LocationDTO)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			Locations lLocations = new Locations();
			lLocations.setIdLocation(pLocationDTO.getIdLocation().longValue());
			lLocations.setName(pLocationDTO.getName());
			lLocations.setNation(pLocationDTO.getNation());
			lLocations.setState(pLocationDTO.getState());
			lLocations.setCity(pLocationDTO.getCity());
			lLocations.setDescription(pLocationDTO.getDescription());
			if (pLocationDTO.getTaskStatus()!=null) {
				lLocations.setTaskStatus(pLocationDTO.getTaskStatus().getValue());
			}
			
			LocationsMapper lLocationsMapper = lSqlSession.getMapper(LocationsMapper.class);
			lLocationsMapper.updateByPrimaryKeySelective(lLocations);
			
			lSqlSession.commit();
			
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End insert(LocationDTO)");
	}
	
	private static boolean checkIfReferenced(Integer pIntIdLocation, SqlSession pSqlSession) {
		
		boolean lBlnResult = false;
		
		mLog.debug("Start checkIfReferenced(Integer, SqlSession)");
		
		SceneRevisionsExample lSceneRevisionsExample = new SceneRevisionsExample();
		lSceneRevisionsExample.createCriteria().andIdLocationEqualTo(pIntIdLocation);
		SceneRevisionsMapper lSceneRevisionsMapper = pSqlSession.getMapper(SceneRevisionsMapper.class);
		List<SceneRevisions> lSceneRevisionList = lSceneRevisionsMapper.selectByExample(lSceneRevisionsExample);
		
		if(lSceneRevisionList!=null && lSceneRevisionList.size()>0) {
			lBlnResult = true;
		} else {
			lBlnResult = false;
		}
		
		mLog.debug("End checkIfReferenced(Integer, SqlSession): return " + lBlnResult);
		
		return lBlnResult;
	}
}
