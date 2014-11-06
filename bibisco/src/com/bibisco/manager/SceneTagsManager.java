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
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.collections.CollectionUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.bibisco.BibiscoException;
import com.bibisco.bean.ChapterDTO;
import com.bibisco.bean.CharacterDTO;
import com.bibisco.bean.CharacterSceneDTO;
import com.bibisco.bean.LocationDTO;
import com.bibisco.bean.PointOfView4AnalysisDTO;
import com.bibisco.bean.StrandDTO;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.VCharacterSceneMapper;
import com.bibisco.dao.client.VPointOfView4AnalysisMapper;
import com.bibisco.dao.client.VSceneTagsMapper;
import com.bibisco.dao.model.VCharacterScene;
import com.bibisco.dao.model.VCharacterSceneExample;
import com.bibisco.dao.model.VPointOfView4Analysis;
import com.bibisco.dao.model.VPointOfView4AnalysisExample;
import com.bibisco.dao.model.VSceneTags;
import com.bibisco.dao.model.VSceneTagsExample;
import com.bibisco.enums.PointOfView;
import com.bibisco.log.Log;

/**
 * Scene tags manager.
 * 
 * @author Andrea Feccomandi
 *
 */
public class SceneTagsManager {
		
	private static Log mLog = Log.getInstance(SceneTagsManager.class);
		
	/**
	 * @return a Map as
	 * 
	 *                 Chapter.1 Chapter.2 Chapter.3
	 * - character.1 -     X         X
	 * - character.2 -               X
	 * - character.3 -     X         X          
	 * 
	 */
	public static Map<String, List<Boolean>> getCharactersChaptersPresence() {
		
		Map<String, List<Boolean>> lMapCharacterChapterPresence = new HashMap<String, List<Boolean>>();
		
		mLog.debug("Start getCharactersChaptersDistribution()");
		
		List<com.bibisco.bean.CharacterDTO> lListCharacterDTO = CharacterManager.loadAll();			
		List<ChapterDTO> lListChapters = ChapterManager.loadAll();
		
		if (CollectionUtils.isEmpty(lListCharacterDTO) || CollectionUtils.isEmpty(lListChapters)) {
			mLog.debug("End getStrandsChaptersDistribution()");
			return lMapCharacterChapterPresence;
		}
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    		
    		VSceneTagsMapper lVSceneTagsMapper = lSqlSession.getMapper(VSceneTagsMapper.class);
    		VSceneTagsExample lVSceneTagsExample = new VSceneTagsExample();
    		lVSceneTagsExample.setOrderByClause("chapter_position, id_character");
			List<VSceneTags> lListVSceneTags = lVSceneTagsMapper.selectByExample(lVSceneTagsExample);
			
			if (lListVSceneTags!=null && lListVSceneTags.size()>0) {
				
				Map<Integer,Set<Integer>> lMapCharactersChaptersDistribution = new HashMap<Integer, Set<Integer>>();
				int lIntLastChapter = -1;
				Set<Integer> lSetChapterCharacters = null;
				
				// filter duplicate items using a set
				for (VSceneTags lVSceneTags : lListVSceneTags) {
					if (lVSceneTags.getChapterPosition().intValue() != lIntLastChapter) {
						lSetChapterCharacters = new HashSet<Integer>();
						lMapCharactersChaptersDistribution.put(lVSceneTags.getChapterPosition(), lSetChapterCharacters);
						lIntLastChapter = lVSceneTags.getChapterPosition();
					}
					if (lVSceneTags.getIdCharacter() != null) {
						lSetChapterCharacters.add(lVSceneTags.getIdCharacter().intValue());
					}
				}
				
				// populate result map
				for (CharacterDTO lCharacterDTO : lListCharacterDTO) {
					List<Boolean> lListCharacterChapterPresence = new ArrayList<Boolean>();
					lMapCharacterChapterPresence.put(lCharacterDTO.getIdCharacter().toString(), lListCharacterChapterPresence);
					for (ChapterDTO lChapterDTO : lListChapters) {
						Set<Integer> lSetCharacters = lMapCharactersChaptersDistribution.get(lChapterDTO.getPosition());
						if (lSetCharacters != null && !lSetCharacters.isEmpty() && lSetCharacters.contains(lCharacterDTO.getIdCharacter())) {
							lListCharacterChapterPresence.add(Boolean.TRUE);
						} else {
							lListCharacterChapterPresence.add(Boolean.FALSE);
						}
					}
				}
			}
		
    	} catch(Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End getCharactersChaptersDistribution()");
		
		return lMapCharacterChapterPresence;
	}
	
	/**
	**
	 * @return a Map as
	 * 
	 *                 Chapter.1 Chapter.2 Chapter.3
	 * - location.1 -     X         X
	 * - location.2 -               X
	 * - location.3 -     X         X          
	 * 
	 */
	public static Map<String, List<Boolean>> getLocationsChaptersPresence() {

		Map<String, List<Boolean>> lMapLocationChapterPresence = new HashMap<String, List<Boolean>>();

		mLog.debug("Start getLocationsChaptersDistribution()");

		List<com.bibisco.bean.LocationDTO> lListLocationDTO = LocationManager.loadAll();
		List<ChapterDTO> lListChapters = ChapterManager.loadAll();
		
		if (CollectionUtils.isEmpty(lListLocationDTO) || CollectionUtils.isEmpty(lListChapters)) {
			mLog.debug("End getStrandsChaptersDistribution()");
			return lMapLocationChapterPresence;
		}

		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {

			VSceneTagsMapper lVSceneTagsMapper = lSqlSession.getMapper(VSceneTagsMapper.class);
			VSceneTagsExample lVSceneTagsExample = new VSceneTagsExample();
			lVSceneTagsExample.setOrderByClause("chapter_position, id_location");
			List<VSceneTags> lListVSceneTags = lVSceneTagsMapper.selectByExample(lVSceneTagsExample);

			if (lListVSceneTags != null && lListVSceneTags.size() > 0) {

				Map<Integer, Set<Integer>> lMapLocationsChaptersDistribution = new HashMap<Integer, Set<Integer>>();
				int lIntLastChapter = -1;
				Set<Integer> lSetChapterLocations = null;

				// filter duplicate items using a set
				for (VSceneTags lVSceneTags : lListVSceneTags) {
					if (lVSceneTags.getChapterPosition().intValue() != lIntLastChapter) {
						lSetChapterLocations = new HashSet<Integer>();
						lMapLocationsChaptersDistribution.put(lVSceneTags.getChapterPosition(), lSetChapterLocations);
						lIntLastChapter = lVSceneTags.getChapterPosition();
					}
					if (lVSceneTags.getIdLocation() != null) {
						lSetChapterLocations.add(lVSceneTags.getIdLocation().intValue());
					}
					
				}

				// populate result map
				for (LocationDTO lLocationDTO : lListLocationDTO) {
					List<Boolean> lListLocationChapterPresence = new ArrayList<Boolean>();
					lMapLocationChapterPresence.put(lLocationDTO.getIdLocation().toString(), lListLocationChapterPresence);
					for (ChapterDTO lChapterDTO : lListChapters) {
						Set<Integer> lSetLocations = lMapLocationsChaptersDistribution.get(lChapterDTO.getPosition());
						if (lSetLocations != null && !lSetLocations.isEmpty() && lSetLocations.contains(lLocationDTO.getIdLocation())) {
							lListLocationChapterPresence.add(Boolean.TRUE);
						} else {
							lListLocationChapterPresence.add(Boolean.FALSE);
						}
					}
				}
			}

		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}

		mLog.debug("End getLocationsChaptersDistribution()");

		return lMapLocationChapterPresence;
	}
	
	/**
	 * @return a Map as
	 * 
	 *                 Chapter.1 Chapter.2 Chapter.3
	 * - strand.1 -     X         X
	 * - strand.2 -               X
	 * - strand.3 -     X         X          
	 * 
	 */
	public static Map<String, List<Boolean>> getStrandsChaptersPresence() {

		Map<String, List<Boolean>> lMapStrandChapterPresence = new HashMap<String, List<Boolean>>();

		mLog.debug("Start getStrandsChaptersDistribution()");

		List<com.bibisco.bean.StrandDTO> lListStrandDTO = StrandManager.loadAll();
		List<ChapterDTO> lListChapters = ChapterManager.loadAll();

		if (CollectionUtils.isEmpty(lListStrandDTO) || CollectionUtils.isEmpty(lListChapters)) {
			mLog.debug("End getStrandsChaptersDistribution()");
			return lMapStrandChapterPresence;
		}
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {

			VSceneTagsMapper lVSceneTagsMapper = lSqlSession.getMapper(VSceneTagsMapper.class);
			VSceneTagsExample lVSceneTagsExample = new VSceneTagsExample();
			lVSceneTagsExample.setOrderByClause("chapter_position, id_strand");
			List<VSceneTags> lListVSceneTags = lVSceneTagsMapper.selectByExample(lVSceneTagsExample);

			if (lListVSceneTags != null && lListVSceneTags.size() > 0) {

				Map<Integer, Set<Integer>> lMapStrandsChaptersDistribution = new HashMap<Integer, Set<Integer>>();
				int lIntLastChapter = -1;
				Set<Integer> lSetChapterStrands = null;

				// filter duplicate items using a set
				for (VSceneTags lVSceneTags : lListVSceneTags) {
					if (lVSceneTags.getChapterPosition().intValue() != lIntLastChapter) {
						lSetChapterStrands = new HashSet<Integer>();
						lMapStrandsChaptersDistribution.put(lVSceneTags.getChapterPosition(), lSetChapterStrands);
						lIntLastChapter = lVSceneTags.getChapterPosition();
					}
					if (lVSceneTags.getIdStrand() != null) {
						lSetChapterStrands.add(lVSceneTags.getIdStrand().intValue());
					}
					
				}

				// populate result map
				for (StrandDTO lStrandDTO : lListStrandDTO) {
					List<Boolean> lListStrandChapterPresence = new ArrayList<Boolean>();
					lMapStrandChapterPresence.put(lStrandDTO.getIdStrand().toString(), lListStrandChapterPresence);
					for (ChapterDTO lChapterDTO : lListChapters) {
						Set<Integer> lSetStrands = lMapStrandsChaptersDistribution.get(lChapterDTO.getPosition());
						if (lSetStrands != null && !lSetStrands.isEmpty() && lSetStrands.contains(lStrandDTO.getIdStrand())) {
							lListStrandChapterPresence.add(Boolean.TRUE);
						} else {
							lListStrandChapterPresence.add(Boolean.FALSE);
						}
					}
				}
			}

		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}

		mLog.debug("End getStrandsChaptersDistribution()");

		return lMapStrandChapterPresence;
	}
	
	/**
	 * @return a Map as
	 * 
	 *                 Chapter.1 Chapter.2 Chapter.3
	 * - pointOfView.1 -     X         X
	 * - pointOfView.2 -               X
	 * - pointOfView.3 -     X         X          
	 * 
	 */
	public static Map<String, List<Boolean>> getPointOfViewsChaptersPresence() {
		
		Map<String, List<Boolean>> lMapPointOfViewChapterPresence = new HashMap<String, List<Boolean>>();

		mLog.debug("Start getPointOfViewsChaptersDistribution()");

		List<PointOfView4AnalysisDTO> lListPointOfViewDTO = getPointOfView4AnalysisList();
		List<ChapterDTO> lListChapters = ChapterManager.loadAll();

		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {

			VSceneTagsMapper lVSceneTagsMapper = lSqlSession.getMapper(VSceneTagsMapper.class);
			VSceneTagsExample lVSceneTagsExample = new VSceneTagsExample();
			lVSceneTagsExample.setOrderByClause("chapter_position, point_of_view, point_of_view_id_character");
			List<VSceneTags> lListVSceneTags = lVSceneTagsMapper.selectByExample(lVSceneTagsExample);

			if (lListVSceneTags != null && lListVSceneTags.size() > 0) {

				Map<Integer, Set<String>> lMapPointOfViewsChaptersDistribution = new HashMap<Integer, Set<String>>();
				int lIntLastChapter = -1;
				Set<String> lSetChapterPointOfViews = null;

				// filter duplicate items using a set
				for (VSceneTags lVSceneTags : lListVSceneTags) {
					if (lVSceneTags.getChapterPosition().intValue() != lIntLastChapter) {
						lSetChapterPointOfViews = new HashSet<String>();
						lMapPointOfViewsChaptersDistribution.put(lVSceneTags.getChapterPosition(), lSetChapterPointOfViews);
						lIntLastChapter = lVSceneTags.getChapterPosition();
					}
					if (lVSceneTags.getPointOfView() != null) {
						lSetChapterPointOfViews.add(lVSceneTags.getIdPointOfView4Analysis());
					}
				}

				// populate result map
				for (PointOfView4AnalysisDTO lPointOfView4AnalysisDTO : lListPointOfViewDTO) {
					List<Boolean> lListPointOfViewChapterPresence = new ArrayList<Boolean>();
					lMapPointOfViewChapterPresence.put(lPointOfView4AnalysisDTO.getIdPointOfView4Analysis(), lListPointOfViewChapterPresence);
					for (ChapterDTO lChapterDTO : lListChapters) {
						Set<String> lSetPointOfViews = lMapPointOfViewsChaptersDistribution.get(lChapterDTO.getPosition());
						if (lSetPointOfViews != null && !lSetPointOfViews.isEmpty() && lSetPointOfViews.contains(lPointOfView4AnalysisDTO.getIdPointOfView4Analysis())) {
							lListPointOfViewChapterPresence.add(Boolean.TRUE);
						} else {
							lListPointOfViewChapterPresence.add(Boolean.FALSE);
						}
					}
				}
			}

		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}

		mLog.debug("End getPointOfViewsChaptersDistribution()");
		
		return lMapPointOfViewChapterPresence;
	}
	
	public static List<PointOfView4AnalysisDTO> getPointOfView4AnalysisList() {
		
		mLog.debug("Start getPointOfView4AnalysisList()");
		
		List<PointOfView4AnalysisDTO> lListPointOfView4AnalysisDTO = new ArrayList<PointOfView4AnalysisDTO>();
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			VPointOfView4AnalysisExample lVPointOfView4AnalysisExample = new VPointOfView4AnalysisExample();
			lVPointOfView4AnalysisExample.setOrderByClause("point_of_view, position");
			VPointOfView4AnalysisMapper lVPointOfView4AnalysisMapper = lSqlSession.getMapper(VPointOfView4AnalysisMapper.class);
			List<VPointOfView4Analysis> lListVPointOfView4Analysis = lVPointOfView4AnalysisMapper.selectByExample(lVPointOfView4AnalysisExample);

			if (lListVPointOfView4Analysis != null && lListVPointOfView4Analysis.size() > 0) {
				for (VPointOfView4Analysis lVPointOfView4Analysis : lListVPointOfView4Analysis) {
					PointOfView4AnalysisDTO lPointOfView4AnalysisDTO = new PointOfView4AnalysisDTO();
					lPointOfView4AnalysisDTO.setIdPointOfView4Analysis(lVPointOfView4Analysis.getIdPointOfView4Analysis());
					lPointOfView4AnalysisDTO.setCharacterName(lVPointOfView4Analysis.getPointOfViewCharacterName());
					lPointOfView4AnalysisDTO.setIdCharacter(lVPointOfView4Analysis.getPointOfViewIdCharacter());
					lPointOfView4AnalysisDTO.setPointOfView(PointOfView.getPointOfViewFromValue(lVPointOfView4Analysis.getPointOfView()));
					lListPointOfView4AnalysisDTO.add(lPointOfView4AnalysisDTO);
				}				
			}

		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End getPointOfView4AnalysisList()");
		
		return lListPointOfView4AnalysisDTO;
	}
	
	public static Map<Integer, List<CharacterSceneDTO>> getCharacterSceneAnalysis() {
		
		Map<Integer, List<CharacterSceneDTO>> lMapCharacterSceneAnalysis = new HashMap<Integer, List<CharacterSceneDTO>>();
		
		mLog.debug("Start getCharacterSceneAnalysis()");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			VCharacterSceneExample lVCharacterSceneExample = new VCharacterSceneExample();
			lVCharacterSceneExample.setOrderByClause("main_character desc, character_position, scene_date ");
			VCharacterSceneMapper lVCharacterSceneMapper = lSqlSession.getMapper(VCharacterSceneMapper.class);
			List<VCharacterScene> lListVCharacterScene = lVCharacterSceneMapper.selectByExample(lVCharacterSceneExample);

			if (lListVCharacterScene != null && lListVCharacterScene.size() > 0) {
				
				int lIntLastCharacter = -1;
				List<CharacterSceneDTO> lListCharacterSceneDTO = null;
				
				for (VCharacterScene lVCharacterScene : lListVCharacterScene) {
					
					if (lVCharacterScene.getIdCharacter().intValue() != lIntLastCharacter) {
						lListCharacterSceneDTO = new ArrayList<CharacterSceneDTO>();
						lMapCharacterSceneAnalysis.put(lVCharacterScene.getIdCharacter().intValue(), lListCharacterSceneDTO);
						lIntLastCharacter = lVCharacterScene.getIdCharacter().intValue();
					}
					
					CharacterSceneDTO lCharacterSceneDTO = new CharacterSceneDTO();
					lCharacterSceneDTO.setIdCharacter(lVCharacterScene.getIdCharacter().intValue());
					lCharacterSceneDTO.setCharacterName(lVCharacterScene.getCharacterName());
					lCharacterSceneDTO.setIdChapter(lVCharacterScene.getIdChapter().intValue());
					lCharacterSceneDTO.setChapterPosition(lVCharacterScene.getChapterPosition());
					lCharacterSceneDTO.setChapterTitle(lVCharacterScene.getChapterTitle());
					lCharacterSceneDTO.setIdScene(lVCharacterScene.getIdScene().intValue());
					lCharacterSceneDTO.setSceneDate(lVCharacterScene.getSceneDate());
					lCharacterSceneDTO.setSceneDescription(lVCharacterScene.getSceneDescription());
					if (lVCharacterScene.getIdLocation() != null) {
						lCharacterSceneDTO.setIdLocation(lVCharacterScene.getIdLocation().intValue());	
					}
					lCharacterSceneDTO.setLocationNation(lVCharacterScene.getLocationNation());
					lCharacterSceneDTO.setLocationState(lVCharacterScene.getLocationState());
					lCharacterSceneDTO.setLocationCity(lVCharacterScene.getLocationCity());
					lCharacterSceneDTO.setLocationName(lVCharacterScene.getLocationName());
					lListCharacterSceneDTO.add(lCharacterSceneDTO);
				}				
			}

		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End getCharacterSceneAnalysis()");
		
		return lMapCharacterSceneAnalysis;
	} 
}
