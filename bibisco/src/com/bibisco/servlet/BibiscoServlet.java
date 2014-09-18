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
package com.bibisco.servlet;

import java.awt.Desktop;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.Writer;
import java.lang.reflect.Method;
import java.net.URI;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.bibisco.BibiscoException;
import com.bibisco.bean.ArchitectureItem;
import com.bibisco.bean.ChapterDTO;
import com.bibisco.bean.CharacterDTO;
import com.bibisco.bean.CharacterInfoQuestionsDTO;
import com.bibisco.bean.CharacterInfoWithoutQuestionsDTO;
import com.bibisco.bean.CharacterSceneDTO;
import com.bibisco.bean.CharacterWordCount;
import com.bibisco.bean.ImageDTO;
import com.bibisco.bean.ImportProjectArchiveDTO;
import com.bibisco.bean.LocationDTO;
import com.bibisco.bean.MainCharacterDTO;
import com.bibisco.bean.PointOfView4AnalysisDTO;
import com.bibisco.bean.ProjectDTO;
import com.bibisco.bean.ProjectFromSceneChapterDTO;
import com.bibisco.bean.ProjectFromSceneLocationDTO;
import com.bibisco.bean.ProjectFromSceneMainCharacterDTO;
import com.bibisco.bean.ProjectFromSceneSecondaryCharacterDTO;
import com.bibisco.bean.RichTextEditorSettings;
import com.bibisco.bean.RichTextEditorTaskStatusBean;
import com.bibisco.bean.SceneDTO;
import com.bibisco.bean.SceneRevisionDTO;
import com.bibisco.bean.SecondaryCharacterDTO;
import com.bibisco.bean.StrandDTO;
import com.bibisco.bean.TipSettings;
import com.bibisco.bean.WebMessage;
import com.bibisco.enums.CharacterInfoQuestions;
import com.bibisco.enums.CharacterInfoWithoutQuestions;
import com.bibisco.enums.ElementType;
import com.bibisco.enums.ExportType;
import com.bibisco.enums.PointOfView;
import com.bibisco.enums.TaskStatus;
import com.bibisco.log.Log;
import com.bibisco.manager.ArchitectureItemManager;
import com.bibisco.manager.ArchitectureItemManager.ArchitectureItemType;
import com.bibisco.manager.ChapterManager;
import com.bibisco.manager.CharacterManager;
import com.bibisco.manager.ContextManager;
import com.bibisco.manager.HttpManager;
import com.bibisco.manager.ImageManager;
import com.bibisco.manager.LocaleManager;
import com.bibisco.manager.LocationManager;
import com.bibisco.manager.ProjectFromSceneManager;
import com.bibisco.manager.ProjectManager;
import com.bibisco.manager.ResourceBundleManager;
import com.bibisco.manager.RichTextEditorSettingsManager;
import com.bibisco.manager.SceneManager;
import com.bibisco.manager.SceneTagsManager;
import com.bibisco.manager.SpellCheckManager;
import com.bibisco.manager.StrandManager;
import com.bibisco.manager.TextEditorManager;
import com.bibisco.manager.TipManager;
import com.bibisco.manager.VersionManager;

/**
 * This servlet handles all operations.
 * 
 * @author Andrea Feccomandi
 *
 */
public class BibiscoServlet extends HttpServlet {
	private static final long serialVersionUID = -5786169245095217631L;
	private static final Log mLog = Log.getInstance(BibiscoServlet.class);

	private static final String ANALYSIS_CHAPTER_LENGTH = "/jsp/analysisChaptersLength.jsp";
	private static final String ANALYSIS_CHARACTER_SCENE = "/jsp/analysisCharacterScene.jsp";
	private static final String ANALYSIS_ITEMS_CHAPTERS = "/jsp/analysisItemsChapters.jsp";
	private static final String CAROUSEL_IMAGE = "/jsp/carouselImage.jsp";	
	private static final String CHAPTER = "/jsp/chapter.jsp";
	private static final String CHARACTER = "/jsp/character.jsp";
	private static final String CHARACTER_INFO = "/jsp/characterInfo.jsp";
	private static final String CLOSE_IMAGE_FORM = "/jsp/closeImageForm.jsp";
	private static final String CLOSE_IMPORT_PROJECT = "/jsp/closeImportProject.jsp";
	private static final String INDEX = "/jsp/index.jsp";
	private static final String LANGUAGE = "/jsp/language.jsp";
	private static final String LOCATION = "/jsp/location.jsp";
	private static final String LOCATION_TITLE_FORM = "/jsp/locationTitleForm.jsp";	
	private static final String MAIN = "/jsp/main.jsp";
	private static final String NEW_CHAPTER = "/jsp/newChapter.jsp";
	private static final String NEW_CHARACTER = "/jsp/newCharacter.jsp";
	private static final String NEW_LOCATION = "/jsp/newLocation.jsp";
	private static final String NEW_SCENE = "/jsp/newScene.jsp";
	private static final String NEW_STRAND = "/jsp/newStrand.jsp";
	private static final String PROJECT_FROM_SCENE = "/jsp/projectFromScene.jsp";
	private static final String RICH_TEXT_EDITOR_TASK_STATUS_DIALOG = "/jsp/richTextEditorTaskStatusDialog.jsp";
	private static final String SECONDARY_CHARACTER = "/jsp/secondaryCharacter.jsp";
	private static final String SELECT_PROJECT = "/jsp/selectProject.jsp";
	private static final String SCENE = "/jsp/scene.jsp";
	private static final String START = "/jsp/start.jsp";
	private static final String STRAND = "/jsp/strand.jsp";
	private static final String STRANDS = "/jsp/strands.jsp";
	
	protected void doGet(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {
		doPost(pRequest, pResponse);
	}

	protected void doPost(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {
		mLog.debug("Start doPost(pRequest, pResponse)");

		String lStrAction = pRequest.getParameter("action");
		mLog.debug("requested action=", lStrAction);

		if (StringUtils.isBlank(lStrAction)) {
			mLog.error("Called BibiscoServlet without action!");
			throw new BibiscoException(BibiscoException.FATAL);
		} else {
			try {
				Method lMethod = BibiscoServlet.class.getMethod(lStrAction, HttpServletRequest.class, HttpServletResponse.class);
				lMethod.invoke(this, pRequest, pResponse);
			} catch (Exception e) {
				mLog.error(e);
				throw new BibiscoException(BibiscoException.REFLECTION_EXCEPTION);
			} 
			
		}
		
		mLog.debug("End doPost(pRequest, pResponse)");
	}

	public void start(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		
		mLog.debug("Start start(HttpServletRequest, HttpServletResponse)");
		
		// get messages from bibisco.com
		WebMessage lWebMessage = HttpManager.getMessageFromBibiscoWebSite();
		pRequest.setAttribute("webMessage", lWebMessage);

		pRequest.getRequestDispatcher(INDEX).forward(pRequest, pResponse);

		mLog.debug("End start(HttpServletRequest, HttpServletResponse)");
	}
	
	public void selectProject(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start selectProject(HttpServletRequest, HttpServletResponse)");
		
		// get projects
		List<ProjectDTO> lListProjectDTO = ProjectManager.loadAll();
		pRequest.getSession().getServletContext().setAttribute("projectList", lListProjectDTO);
		
		pRequest.getRequestDispatcher(SELECT_PROJECT).forward(pRequest, pResponse);

		mLog.debug("End selectProject(HttpServletRequest, HttpServletResponse)");
	}
	

	public void openChapter(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		
		mLog.debug("Start openChapter(HttpServletRequest, HttpServletResponse)");
		
		Integer lIntIdChapter = Integer.valueOf(pRequest.getParameter("idChapter"));
		mLog.debug("idChapter = "+ lIntIdChapter);
		ChapterDTO lChapter = ChapterManager.load(lIntIdChapter);
		pRequest.setAttribute("chapter", lChapter);
		pRequest.getRequestDispatcher(CHAPTER).forward(pRequest, pResponse);
		
		mLog.debug("End openChapter(HttpServletRequest, HttpServletResponse)");
		
	}
	
	public void getChapterWordCountTaskStatus(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		
		mLog.debug("Start getChapterWordCountTaskStatus(HttpServletRequest, HttpServletResponse)");
		
		Integer lIntIdChapter = Integer.valueOf(pRequest.getParameter("idChapter"));
		mLog.debug("idChapter = "+ lIntIdChapter);
		ChapterDTO lChapterDTO = ChapterManager.load(lIntIdChapter);
	
		pResponse.setContentType("application/json; charset=UTF-8");
		Writer lWriter = pResponse.getWriter();
		lWriter.write(lChapterDTO.getWordCountTaskStatusAsJSONObject().toString());
		
		mLog.debug("End getChapterWordCountTaskStatus(HttpServletRequest, HttpServletResponse)");
		
	}
	
	public void openMainCharacter(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		
		mLog.debug("Start openMainCharacter(HttpServletRequest, HttpServletResponse)");
		
		Integer lIntIdCharacter = Integer.valueOf(pRequest.getParameter("idCharacter"));
		mLog.debug("idCharacter = "+ lIntIdCharacter);
		
		MainCharacterDTO lMainCharacterDTO = CharacterManager.loadMainCharacter(lIntIdCharacter);
		
		pRequest.setAttribute("character", lMainCharacterDTO);
		pRequest.getRequestDispatcher(CHARACTER).forward(pRequest, pResponse);
		
		mLog.debug("End openMainCharacter(HttpServletRequest, HttpServletResponse)");
		
	}
	
	public void openSecondaryCharacter(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		
		mLog.debug("Start openSecondaryCharacter(HttpServletRequest, HttpServletResponse)");
		
		Integer lIntIdCharacter = Integer.valueOf(pRequest.getParameter("idCharacter"));
		mLog.debug("idCharacter = "+ lIntIdCharacter);
		
		SecondaryCharacterDTO lSecondaryCharacterDTO = CharacterManager.loadSecondaryCharacter(lIntIdCharacter);
		pRequest.setAttribute("secondaryCharacter", lSecondaryCharacterDTO.toJSONObject());
		pRequest.getRequestDispatcher(SECONDARY_CHARACTER).forward(pRequest, pResponse);
		
		mLog.debug("End openSecondaryCharacter(HttpServletRequest, HttpServletResponse)");
		
	}
	
	public void openLocation(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		
		mLog.debug("Start openLocation(HttpServletRequest, HttpServletResponse)");
		
		Integer lIntIdLocation = Integer.valueOf(pRequest.getParameter("idLocation"));
		mLog.debug("idLocation = "+ lIntIdLocation);
		
		LocationDTO lLocationDTO = LocationManager.load(lIntIdLocation);

		pRequest.setAttribute("location", lLocationDTO.toJSONObject());
		pRequest.getRequestDispatcher(LOCATION).forward(pRequest, pResponse);
		
		mLog.debug("End openLocation(HttpServletRequest, HttpServletResponse)");	
	}
	
	public void openLanguage(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		
		mLog.debug("Start openLanguage(HttpServletRequest, HttpServletResponse)");
		
		pRequest.getRequestDispatcher(LANGUAGE).forward(pRequest, pResponse);
		
		mLog.debug("End openLanguage(HttpServletRequest, HttpServletResponse)");	
	}
	
	public void openStrand(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		
		mLog.debug("Start openStrand(HttpServletRequest, HttpServletResponse)");
		
		Integer lIntIdStrand = Integer.valueOf(pRequest.getParameter("idStrand"));
		mLog.debug("idStrand = "+ lIntIdStrand);
		
		StrandDTO lStrandDTO = StrandManager.load(lIntIdStrand);		
		pRequest.setAttribute("strand", lStrandDTO.toJSONObject());
		pRequest.getRequestDispatcher(STRAND).forward(pRequest, pResponse);
		
		mLog.debug("End openStrand(HttpServletRequest, HttpServletResponse)");
		
	}
	
	public void openCarouselImage(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		
		mLog.debug("Start openCarouselImage(HttpServletRequest, HttpServletResponse)");
		
		Integer lIntIdElement = Integer.valueOf(pRequest.getParameter("idElement"));
		ElementType lElementType = ElementType.valueOf(pRequest.getParameter("elementType"));
		
		List<ImageDTO> lListImageDTO = ImageManager.loadImagesByElement(lIntIdElement, lElementType);
		
		pRequest.setAttribute("idElement", lIntIdElement);
		pRequest.setAttribute("elementType", lElementType);
		pRequest.setAttribute("images", lListImageDTO);
		
		pRequest.getRequestDispatcher(CAROUSEL_IMAGE).forward(pRequest, pResponse);
		
		mLog.debug("End openCarouselImage(HttpServletRequest, HttpServletResponse)");
	}
	
	public void openScene(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		
		mLog.debug("Start openScene(HttpServletRequest, HttpServletResponse)");
		
		Integer lIntIdScene = Integer.valueOf(pRequest.getParameter("idScene"));
		mLog.debug("idScene = "+ lIntIdScene);
		SceneRevisionDTO lScene = SceneManager.load(lIntIdScene);
		pRequest.setAttribute("scene", lScene.toJSONObject().toString());
		mLog.debug(lScene.toJSONObject().toString());
		
		List<StrandDTO> lListStrand = StrandManager.loadAll();
		pRequest.setAttribute("strands", lListStrand);
		
		List<com.bibisco.bean.CharacterDTO> lListCharacterDTO = CharacterManager.loadAll();
		pRequest.setAttribute("characters", lListCharacterDTO);
		
		List<LocationDTO> lListLocationDTO = LocationManager.loadAll();
		pRequest.setAttribute("locations", lListLocationDTO);
		
		pRequest.getRequestDispatcher(SCENE).forward(pRequest, pResponse);
		
		mLog.debug("End openScene(HttpServletRequest, HttpServletResponse)");
	}

	public void thumbnailAction(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		
		mLog.debug("Start thumbnailAction(HttpServletRequest, HttpServletResponse)");
		
		String lStrThumbnailAction = pRequest.getParameter("thumbnailAction"); 
		String lStrFamily = pRequest.getParameter("family"); 
		String lStrId = pRequest.getParameter("id");
		String lStrPosition = pRequest.getParameter("position");		
		
		mLog.debug("thumbnailAction=",lStrThumbnailAction, " family=", lStrFamily, " id= ", lStrId, " position=", lStrPosition);
		
		try {
			Method lMethod = BibiscoServlet.class.getMethod(lStrThumbnailAction+StringUtils.capitalize(lStrFamily), HttpServletRequest.class, HttpServletResponse.class);
			lMethod.invoke(this, pRequest, pResponse);
		} catch (Exception e) {
			mLog.error(e);
			throw new BibiscoException(BibiscoException.REFLECTION_EXCEPTION);
		} 
		
		mLog.debug("End thumbnailAction(HttpServletRequest, HttpServletResponse)");
	}
	
	
	public void createMaincharacter(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		mLog.debug("Start createMaincharacter(HttpServletRequest, HttpServletResponse)");
		createcharacter(pRequest, pResponse, true);
		mLog.debug("End createMaincharacter(HttpServletRequest, HttpServletResponse)");
	}
	
	public void createSecondarycharacter(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		
		mLog.debug("Start createSecondarycharacter(HttpServletRequest, HttpServletResponse)");
		createcharacter(pRequest, pResponse, false);
		mLog.debug("End createSecondarycharacter(HttpServletRequest, HttpServletResponse)");
	}
	
	private void createcharacter(HttpServletRequest pRequest, HttpServletResponse pResponse, boolean pBlnMainCharacter) throws ServletException, IOException {
		mLog.debug("Start createcharacter(HttpServletRequest, HttpServletResponse, boolean)");
		
		String lStrTitle = pRequest.getParameter("title");
		Integer lIntPosition = Integer.valueOf(pRequest.getParameter("position"));
		
		mLog.debug("title=",lStrTitle);
		
		com.bibisco.bean.CharacterDTO lCharacterDTO = new com.bibisco.bean.CharacterDTO();
		lCharacterDTO.setName(lStrTitle);
		lCharacterDTO.setPosition(lIntPosition);
		lCharacterDTO.setMainCharacter(pBlnMainCharacter);
		lCharacterDTO = CharacterManager.insert(lCharacterDTO);
		
		String lStrFamily;
		if (pBlnMainCharacter) {
			lStrFamily = "maincharacter";
		} else {
			lStrFamily = "secondarycharacter";
		}
		
		pRequest.setAttribute("family", lStrFamily);
		pRequest.setAttribute("character", lCharacterDTO);
		
		// pResponse ajax
		pRequest.getRequestDispatcher(NEW_CHARACTER).forward(pRequest, pResponse);
		
		mLog.debug("End createcharacter(HttpServletRequest, HttpServletResponse, boolean)");
	}
	
	public void createProject(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		mLog.debug("Start createProject(HttpServletRequest, HttpServletResponse)");
					
		ProjectDTO lProjectDTO = new ProjectDTO();
		lProjectDTO.setName(pRequest.getParameter("name"));
		lProjectDTO.setLanguage(pRequest.getParameter("language"));
		lProjectDTO.setBibiscoVersion(VersionManager.getInstance().getVersion());
		
		lProjectDTO = ProjectManager.insert(lProjectDTO);
		
		pRequest.setAttribute("project", lProjectDTO);
		pRequest.getRequestDispatcher(MAIN).forward(pRequest, pResponse);
		
		mLog.debug("End createProject(HttpServletRequest, HttpServletResponse)");
	}
	
	public void createChapter(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		mLog.debug("Start createChapter(HttpServletRequest, HttpServletResponse)");
		
		String lStrTitle = pRequest.getParameter("title");
		Integer lIntPosition = Integer.valueOf(pRequest.getParameter("position"));
				
		ChapterDTO lChapter = new ChapterDTO();
		lChapter.setTitle(lStrTitle);
		lChapter.setPosition(lIntPosition);
		
		lChapter = ChapterManager.insert(lChapter);
		
		pRequest.setAttribute("chapter", lChapter);
		pRequest.getRequestDispatcher(NEW_CHAPTER).forward(pRequest, pResponse);
		mLog.debug("End createChapter(HttpServletRequest, HttpServletResponse)");
		
	}
	
	public void createScene(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		mLog.debug("Start createScene(HttpServletRequest, HttpServletResponse)");
		
		String lStrTitle = pRequest.getParameter("title");
		Integer lIntPosition = Integer.valueOf(pRequest.getParameter("position"));
		Integer lIntIdChapter = Integer.valueOf(pRequest.getParameter("idParent"));
			
		SceneDTO lSceneDTO = new SceneDTO();
		lSceneDTO.setDescription(lStrTitle);
		lSceneDTO.setPosition(lIntPosition);
		lSceneDTO.setIdChapter(lIntIdChapter);
		
		lSceneDTO = SceneManager.insert(lSceneDTO);
		
		pRequest.setAttribute("scene", lSceneDTO);
		pRequest.getRequestDispatcher(NEW_SCENE).forward(pRequest, pResponse);
		mLog.debug("End createScene(HttpServletRequest, HttpServletResponse)");
		
	}
	
	public void createStrand(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		mLog.debug("Start createStrand(HttpServletRequest, HttpServletResponse)");
		
		StrandDTO lStrandDTO = new StrandDTO();
		lStrandDTO.setName(pRequest.getParameter("title"));
		lStrandDTO.setPosition(Integer.valueOf(pRequest.getParameter("position")));
		
		lStrandDTO = StrandManager.insert(lStrandDTO);
		
		pRequest.setAttribute("strand", lStrandDTO);
		pRequest.getRequestDispatcher(NEW_STRAND).forward(pRequest, pResponse);
		
		mLog.debug("End createStrand(HttpServletRequest, HttpServletResponse)");
		
	}
	
	public void startCreateLocation(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		mLog.debug("Start startCreateLocation(HttpServletRequest, HttpServletResponse)");
	
		editLocationParams(pRequest, pResponse, "createThumbnail");
		
		mLog.debug("Start startCreateLocation(HttpServletRequest, HttpServletResponse)");
	}
	
	public void startUpdateLocationTitle(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		mLog.debug("Start startCreateLocation(HttpServletRequest, HttpServletResponse)");
	
		LocationDTO lLocationDTO = LocationManager.load(Integer.valueOf(pRequest.getParameter("idLocation")));
		pRequest.setAttribute("location", lLocationDTO);
		editLocationParams(pRequest, pResponse, "changeThumbnailTitle");
		
		mLog.debug("Start startCreateLocation(HttpServletRequest, HttpServletResponse)");
	}
	
		
	private void editLocationParams(HttpServletRequest pRequest, HttpServletResponse pResponse, String pStrAction) throws ServletException, IOException {
		mLog.debug("Start editLocationParams(HttpServletRequest, HttpServletResponse)");
		
		List<LocationDTO> lListLocation = LocationManager.loadAll();
		
		if (lListLocation!=null && lListLocation.size()>0) {
			List<String> lListStrNation = new ArrayList<String>();
			List<String> lListStrState = new ArrayList<String>();
			List<String> lListStrCity = new ArrayList<String>();
			
			for (LocationDTO lLocationDTO : lListLocation) {
				lListStrNation.add(lLocationDTO.getNation());
				lListStrState.add(lLocationDTO.getState());
				lListStrCity.add(lLocationDTO.getCity());
				
				pRequest.setAttribute("nations", getListAsTypeheadDataSource(lListStrNation));
				pRequest.setAttribute("states", getListAsTypeheadDataSource(lListStrState));
				pRequest.setAttribute("cities", getListAsTypeheadDataSource(lListStrCity));
			}
		}

		pRequest.setAttribute("action", pStrAction);	
		pRequest.setAttribute("position", pRequest.getParameter("position"));	
		pRequest.setAttribute("idLocation", pRequest.getParameter("idLocation"));	
		
		pRequest.getRequestDispatcher(LOCATION_TITLE_FORM).forward(pRequest, pResponse);
		
		mLog.debug("End editLocationParams(HttpServletRequest, HttpServletResponse)");
	}
	
	private String getListAsTypeheadDataSource(List<String> pList) {
		
		Set<String> lSet = new TreeSet<String>(pList);
		StringBuilder lStringBuilder = new StringBuilder(); 
		lStringBuilder.append("[");
		for (String lString : lSet) {
			if (StringUtils.isNotBlank(lString)) {
				if (lStringBuilder.toString().length()>1) {
					lStringBuilder.append(",");
				}
				lStringBuilder.append("&quot;");
				lStringBuilder.append(lString);
				lStringBuilder.append("&quot;");
			}
		}
		lStringBuilder.append("]");
		
		return lStringBuilder.toString();
	}
	
	public void createLocation(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		mLog.debug("Start createLocation(HttpServletRequest, HttpServletResponse)");
		
		LocationDTO lLocationDTO = new LocationDTO();
		lLocationDTO.setName(pRequest.getParameter("title"));
		lLocationDTO.setNation(pRequest.getParameter("nation"));
		lLocationDTO.setState(pRequest.getParameter("state"));
		lLocationDTO.setCity(pRequest.getParameter("city"));
		lLocationDTO.setPosition(Integer.valueOf(pRequest.getParameter("position")));
		
		lLocationDTO = LocationManager.insert(lLocationDTO);
		
		pRequest.setAttribute("location", lLocationDTO);
		pRequest.getRequestDispatcher(NEW_LOCATION).forward(pRequest, pResponse);
		
		mLog.debug("End createLocation(HttpServletRequest, HttpServletResponse)");
		
	}
	
	
	public void changeProjectName(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		
		mLog.debug("Start changeProjectName(HttpServletRequest, HttpServletResponse)");
				
		ProjectDTO lProjectDTO = new ProjectDTO();
		lProjectDTO.setName(pRequest.getParameter("title"));
		ProjectManager.save(lProjectDTO);
		
		mLog.debug("End changeProjectName(HttpServletRequest, HttpServletResponse)");
		
	}
	
	public void changeTitleChapter(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		
		mLog.debug("Start changeTitleChapter(HttpServletRequest, HttpServletResponse)");
				
		ChapterDTO lChapter = new ChapterDTO();
		lChapter.setIdChapter(Integer.valueOf(pRequest.getParameter("id")));
		lChapter.setTitle(pRequest.getParameter("title"));
		
		ChapterManager.save(lChapter);
		
		mLog.debug("End changeTitleChapter(HttpServletRequest, HttpServletResponse)");
		
	}
	
	public void addImage(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		
		mLog.debug("Start addImage(HttpServletRequest, HttpServletResponse)");
		
		ImageDTO lImageDTO = new ImageDTO();
		
		// get file item
		FileItem lFileItem = (FileItem) pRequest.getAttribute("file-document_file");
		if (lFileItem.getName() == null || lFileItem.getName().length() == 0) {
			lFileItem = null;
		} else {
			lImageDTO.setFileItem(lFileItem);
			mLog.debug("FileItem " + lFileItem.getName());
		}
		lImageDTO.setDescription(pRequest.getParameter("bibiscoAddImageDescription"));
		lImageDTO.setIdElement(Integer.valueOf(pRequest.getParameter("idElement")));
		lImageDTO.setElementType(ElementType.valueOf(pRequest.getParameter("elementType")));
		
		lImageDTO = ImageManager.insert(lImageDTO);
		
		pRequest.setAttribute("image", lImageDTO);
		pRequest.getRequestDispatcher(CLOSE_IMAGE_FORM).forward(pRequest, pResponse);
		
		mLog.debug("End addImage(HttpServletRequest, HttpServletResponse)");
	}
	
	public void importProjectArchiveFile(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		
		mLog.debug("Start importProjectArchiveFile(HttpServletRequest, HttpServletResponse)");
		
		byte[] lBytes = null;
		
		// get file item
		FileItem lFileItem = (FileItem) pRequest.getAttribute("file-document_file");
		if (lFileItem.getName() == null || lFileItem.getName().length() == 0) {
			lFileItem = null;
		} else {
			lBytes = lFileItem.get();
			mLog.debug("FileItem " + lFileItem.getName());
		}

		ImportProjectArchiveDTO lImportProjectArchiveDTO = ProjectManager.importProjectArchiveFile(lFileItem.getName(), lBytes);
		
		pRequest.setAttribute("importProjectArchive", lImportProjectArchiveDTO);
		pRequest.getRequestDispatcher(CLOSE_IMPORT_PROJECT).forward(pRequest, pResponse);
		
		mLog.debug("End importProjectArchiveFile(HttpServletRequest, HttpServletResponse)");
	}
	
	public void importProject(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		
		mLog.debug("Start importProject(HttpServletRequest, HttpServletResponse)");
		
		ImportProjectArchiveDTO lImportProjectArchiveDTO = new ImportProjectArchiveDTO();
		lImportProjectArchiveDTO.setIdProject(pRequest.getParameter("idProject"));
		lImportProjectArchiveDTO.setAlreadyPresent(Boolean.parseBoolean(pRequest.getParameter("alreadyPresent")));
		
		ProjectDTO lProjectDTO = ProjectManager.importProject(lImportProjectArchiveDTO);
		
		pRequest.setAttribute("project", lProjectDTO);
		pRequest.getRequestDispatcher(MAIN).forward(pRequest, pResponse);
		
		mLog.debug("End importProjectArchiveFile(HttpServletRequest, HttpServletResponse)");
	}
	
	public void deleteCurrentImage(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		
		mLog.debug("Start deleteCurrentImage(HttpServletRequest, HttpServletResponse)");
		
		Integer lIntIdImage = Integer.valueOf(pRequest.getParameter("idImage"));
		ImageManager.delete(lIntIdImage);
		
		mLog.debug("End deleteCurrentImage(HttpServletRequest, HttpServletResponse)");
	}
	
	public void getImage(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		
		mLog.debug("Start getImage(HttpServletRequest, HttpServletResponse)");
		
		String lStrFileName = ImageManager.load(Integer.valueOf(pRequest.getParameter("idImage")));
		
		pResponse.setHeader("Content-Type", getServletContext().getMimeType("img/png"));
		pResponse.setHeader("Content-Disposition", "inline");

		BufferedOutputStream lBufferedOutputStream = null;
		
		FileInputStream lFileInputStream = new FileInputStream(new File(ProjectManager.getDBProjectDirectory(ContextManager.getInstance().getIdProject())+System.getProperty("file.separator")+lStrFileName));

		try {
		    lBufferedOutputStream = new BufferedOutputStream(pResponse.getOutputStream());
		    byte[] lBytesBuffer = new byte[8192];
		    for (int lIntLength = 0; (lIntLength = lFileInputStream.read(lBytesBuffer)) > 0;) {
		        lBufferedOutputStream.write(lBytesBuffer, 0, lIntLength);
		    }
		} finally {
		    if (lBufferedOutputStream != null) {
		    	try { 
		    		lBufferedOutputStream.close(); 
		    	} catch (IOException e) {
		    		mLog.error(e);
		    		throw new BibiscoException(e, BibiscoException.IO_EXCEPTION);
		    	}
		    }
		    if (lFileInputStream != null) {
		    	try { 
		    		lFileInputStream.close(); 
		    	}
		    	catch (IOException e) {
		    		mLog.error(e);
		    		throw new BibiscoException(e, BibiscoException.IO_EXCEPTION);
		    	}
		    }
		}
	
		mLog.debug("End getImage(HttpServletRequest, HttpServletResponse)");
	}

	public void openProject(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start openProject(HttpServletRequest, HttpServletResponse)");
		
		ProjectDTO lProjectDTO = ProjectManager.load(pRequest.getParameter("idProject"));
		pRequest.setAttribute("project", lProjectDTO);
		pRequest.getRequestDispatcher(MAIN).forward(pRequest, pResponse);

		mLog.debug("End openProject(HttpServletRequest, HttpServletResponse)");
	}
	
	public void exitProject(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start exitProject(HttpServletRequest, HttpServletResponse)");
		
		ProjectManager.exit();
		
		// get projects
		List<ProjectDTO> lListProjectDTO = ProjectManager.loadAll();
		pRequest.getSession().getServletContext().setAttribute("projectList", lListProjectDTO);
		
		pRequest.getRequestDispatcher(START).forward(pRequest, pResponse);

		mLog.debug("End exitProject(HttpServletRequest, HttpServletResponse)");
	}
	
	public void saveLocation(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		mLog.debug("Start saveLocation(HttpServletRequest, HttpServletResponse)");
		
		LocationDTO lLocationDTO = new LocationDTO();
		lLocationDTO.setIdLocation(Integer.parseInt(pRequest.getParameter("idLocation")));
		lLocationDTO.setTaskStatus(TaskStatus.valueOf(pRequest.getParameter("taskStatus")));
		lLocationDTO.setDescription(pRequest.getParameter("description"));
		
		LocationManager.save(lLocationDTO);
		
		mLog.debug("End saveLocation(HttpServletRequest, HttpServletResponse)");
	}	
	
	public void saveStrand(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		mLog.debug("Start saveStrand(HttpServletRequest, HttpServletResponse)");
		
		StrandDTO lStrandDTO = new StrandDTO();
		lStrandDTO.setIdStrand(Integer.parseInt(pRequest.getParameter("idStrand")));
		lStrandDTO.setTaskStatus(TaskStatus.valueOf(pRequest.getParameter("taskStatus")));
		lStrandDTO.setDescription(pRequest.getParameter("description"));
		
		StrandManager.save(lStrandDTO);
		
		mLog.debug("End saveStrand(HttpServletRequest, HttpServletResponse)");
	}
	
	
	public void saveSecondaryCharacter(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		mLog.debug("Start saveSecondaryCharacter(HttpServletRequest, HttpServletResponse)");
		
		SecondaryCharacterDTO lSecondaryCharacterDTO = new SecondaryCharacterDTO();
		lSecondaryCharacterDTO.setIdCharacter(Integer.parseInt(pRequest.getParameter("idCharacter")));
		lSecondaryCharacterDTO.setTaskStatus(TaskStatus.valueOf(pRequest.getParameter("taskStatus")));
		lSecondaryCharacterDTO.setDescription(pRequest.getParameter("description"));
		
		CharacterManager.saveSecondaryCharacter(lSecondaryCharacterDTO);
		
		mLog.debug("End saveSecondaryCharacter(HttpServletRequest, HttpServletResponse)");
	}	
	
	public void saveScene(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		mLog.debug("Start saveScene(HttpServletRequest, HttpServletResponse)");
		
		SceneRevisionDTO lSceneRevisionDTO = new SceneRevisionDTO();
		lSceneRevisionDTO.setIdScene(Integer.parseInt(pRequest.getParameter("idScene")));
		lSceneRevisionDTO.setRevision(Integer.parseInt(pRequest.getParameter("revision")));
		lSceneRevisionDTO.setIdRevision(Integer.parseInt(pRequest.getParameter("idRevision")));
		lSceneRevisionDTO.setTaskStatus(TaskStatus.valueOf(pRequest.getParameter("taskStatus")));
		lSceneRevisionDTO.setText(pRequest.getParameter("text"));
		lSceneRevisionDTO.setPointOfView(pRequest.getParameter("pointOfView") != null ? PointOfView.valueOf(pRequest.getParameter("pointOfView")) : null);
		lSceneRevisionDTO.setIdCharacterPointOfView(pRequest.getParameter("pointOfViewCharacter")!=null ? Integer.parseInt(pRequest.getParameter("pointOfViewCharacter")) : null);
		lSceneRevisionDTO.setIdLocation(pRequest.getParameter("location")!=null ? Integer.parseInt(pRequest.getParameter("location")) : null);
		lSceneRevisionDTO.setWordCount(Integer.parseInt(pRequest.getParameter("wordCount")));
		lSceneRevisionDTO.setCharacterCount(Integer.parseInt(pRequest.getParameter("characterCount")));
		
		if(StringUtils.isNotEmpty(pRequest.getParameter("time"))) {
			String lStrPattern = ResourceBundleManager.getString("pattern.timestamp");
			SimpleDateFormat lSimpleDateFormat = new SimpleDateFormat(lStrPattern);
			try {
				lSceneRevisionDTO.setSceneDate(lSimpleDateFormat.parse(pRequest.getParameter("time")));
			} catch (ParseException e) {
				mLog.error(e);
				throw new BibiscoException(e, BibiscoException.FATAL);
			}
		}
	
		String lStrCharacters[] = pRequest.getParameterValues("characters[]");
		if (lStrCharacters!=null && lStrCharacters.length>0) {
			List<Integer> lIdCharacterList = new ArrayList<Integer>();
			for (int i = 0; i < lStrCharacters.length; i++) {
				lIdCharacterList.add(Integer.valueOf(lStrCharacters[i]));
			}
			lSceneRevisionDTO.setCharacters(lIdCharacterList);
		}
		
		String lStrStrands[] = pRequest.getParameterValues("strands[]");
		if (lStrStrands!=null && lStrStrands.length>0) {
			List<Integer> lIdStrandList = new ArrayList<Integer>();
			for (int i = 0; i < lStrStrands.length; i++) {
				lIdStrandList.add(Integer.valueOf(lStrStrands[i]));
			}
			lSceneRevisionDTO.setStrands(lIdStrandList);
		}

		SceneManager.save(lSceneRevisionDTO);
		
		mLog.debug("End saveScene(HttpServletRequest, HttpServletResponse)");
		
	}

	public void openThumbnailStrands(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {
		mLog.debug("Start openThumbnailStrands(HttpServletRequest, HttpServletResponse)");
		pRequest.getRequestDispatcher(STRANDS).forward(pRequest,pResponse);
		mLog.debug("End openThumbnailStrands(HttpServletRequest, HttpServletResponse)");
	}
	
	public void openCharacterInfoWithoutQuestions(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start openCharacterInfoWithoutQuestions(HttpServletRequest, HttpServletResponse)");
		
		String[] lStrIdSplitted = pRequest.getParameter("id").split("__");
		CharacterInfoWithoutQuestions lCharacterInfoWithoutQuestions = CharacterInfoWithoutQuestions.valueOf(lStrIdSplitted[0]);
		Integer lIntIdCharacter = Integer.valueOf(lStrIdSplitted[1]);
		
		CharacterInfoWithoutQuestionsDTO lCharacterInfoWithoutQuestionsDTO = 
				CharacterManager.loadCharacterInfoWithoutQuestions(lCharacterInfoWithoutQuestions, lIntIdCharacter);
		
		RichTextEditorTaskStatusBean lRichTextEditorTaskStatusBean = new RichTextEditorTaskStatusBean();
		lRichTextEditorTaskStatusBean.setId(lIntIdCharacter.toString());
		lRichTextEditorTaskStatusBean.setText(lCharacterInfoWithoutQuestionsDTO.getInfo());
		lRichTextEditorTaskStatusBean.setTaskStatus(lCharacterInfoWithoutQuestionsDTO.getTaskStatus());
		lRichTextEditorTaskStatusBean.setReadOnly(false);
		lRichTextEditorTaskStatusBean.setDescription(ResourceBundleManager.getString(pRequest.getParameter("description")));
		pRequest.setAttribute("richTextEditorTaskStatus", lRichTextEditorTaskStatusBean.toJSONObject().toString());
		pRequest.getRequestDispatcher(RICH_TEXT_EDITOR_TASK_STATUS_DIALOG).forward(pRequest,
				pResponse);
	
		mLog.debug("End openCharacterInfoWithoutQuestions(HttpServletRequest, HttpServletResponse)");
	}
	
	public void openCharacterInfoQuestions(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start openCharacterInfo(HttpServletRequest, HttpServletResponse, pCharacterInfoQuestions)");
		
		String[] lStrIdSplitted = pRequest.getParameter("id").split("__");
		CharacterInfoQuestions lCharacterInfoQuestions = CharacterInfoQuestions.valueOf(lStrIdSplitted[0]);
		Integer lIntIdCharacter = Integer.valueOf(lStrIdSplitted[1]);
		
		CharacterInfoQuestionsDTO lCharacterInfoQuestionsDTO = CharacterManager.loadCharacterInfoQuestions(lCharacterInfoQuestions, lIntIdCharacter);
		pRequest.setAttribute("characterInfoBean", lCharacterInfoQuestionsDTO.toJSONObject().toString());
		pRequest.setAttribute("questionList", lCharacterInfoQuestions.getQuestionList());
		pRequest.setAttribute("freeTextDescription", lCharacterInfoQuestions.getFreeTextDescription());
		
		pRequest.getRequestDispatcher(CHARACTER_INFO).forward(pRequest,pResponse);
	
		mLog.debug("End openCharacterInfoPsychology(HttpServletRequest, pCharacterInfoQuestions)");
	}
	
	public void saveCharacterInfoWithoutQuestions(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		
		mLog.debug("Start saveCharacterInfoWithoutQuestions(HttpServletRequest, HttpServletResponse, CharacterInfoWithoutQuestions)");
		
		String[] lStrIdSplitted = pRequest.getParameter("id").split("__");
		CharacterInfoWithoutQuestions lCharacterInfoWithoutQuestions = CharacterInfoWithoutQuestions.valueOf(lStrIdSplitted[0]);
		Integer lIntIdCharacter = Integer.valueOf(lStrIdSplitted[1]);
		
		CharacterInfoWithoutQuestionsDTO lCharacterInfoQuestionsDTO = new CharacterInfoWithoutQuestionsDTO();
		lCharacterInfoQuestionsDTO.setId(lIntIdCharacter);
		lCharacterInfoQuestionsDTO.setInfo(pRequest.getParameter("text"));
		lCharacterInfoQuestionsDTO.setCharacterInfoWithoutQuestions(lCharacterInfoWithoutQuestions);
		lCharacterInfoQuestionsDTO.setTaskStatus(TaskStatus.valueOf(pRequest.getParameter("taskStatus")));
		CharacterManager.saveCharacterInfoWithoutQuestions(lCharacterInfoQuestionsDTO);
		
		mLog.debug("End saveCharacterInfoWithoutQuestions(HttpServletRequest, HttpServletResponse, CharacterInfoWithoutQuestions)");
	}

	public void saveCharacterInfoQuestions(HttpServletRequest pRequest,
			HttpServletResponse pResponse) {
		mLog.debug("Start saveCharacterInfoQuestions(HttpServletRequest, HttpServletResponse)");
		
		String[] lStrIdSplitted = pRequest.getParameter("id").split("__");
		CharacterInfoQuestions lCharacterInfoQuestions = CharacterInfoQuestions.valueOf(lStrIdSplitted[0]);
		Integer lIntIdCharacter = Integer.valueOf(lStrIdSplitted[1]);
		
		CharacterInfoQuestionsDTO lCharacterInfoQuestionsDTO = new CharacterInfoQuestionsDTO();
		lCharacterInfoQuestionsDTO.setId(lIntIdCharacter);
		lCharacterInfoQuestionsDTO.setCharacterInfoQuestions(lCharacterInfoQuestions);
		lCharacterInfoQuestionsDTO.setInterviewMode(Boolean.valueOf(pRequest.getParameter("interview")));
		lCharacterInfoQuestionsDTO.setAnswerList(Arrays.asList(pRequest.getParameterValues("answers[]")));
		lCharacterInfoQuestionsDTO.setFreeText(pRequest.getParameter("freeText"));
		lCharacterInfoQuestionsDTO.setTaskStatus(TaskStatus.valueOf(pRequest.getParameter("taskStatus")));
		
		CharacterManager.saveCharacterInfoQuestions(lCharacterInfoQuestionsDTO);
		
		mLog.debug("Start saveCharacterInfoPsychology(HttpServletRequest, HttpServletResponse)");
		
	}
	
	
	public void openArchitectureItem(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start openArchitectureItem(HttpServletRequest, HttpServletResponse)");
	
		String lStrArchitectureItemType = pRequest.getParameter("id");
	
		ArchitectureItem lArchitectureItem = ArchitectureItemManager.load(ArchitectureItemType.valueOf(lStrArchitectureItemType)); 
		
		RichTextEditorTaskStatusBean lRichTextEditorTaskStatusBean = new RichTextEditorTaskStatusBean();
		lRichTextEditorTaskStatusBean.setId(lStrArchitectureItemType);
		lRichTextEditorTaskStatusBean.setText(lArchitectureItem.getText());
		lRichTextEditorTaskStatusBean.setTaskStatus(lArchitectureItem.getTaskStatus());
		lRichTextEditorTaskStatusBean.setReadOnly(false);
		lRichTextEditorTaskStatusBean.setDescription(ResourceBundleManager.getString(pRequest.getParameter("description")));
		pRequest.setAttribute("richTextEditorTaskStatus", lRichTextEditorTaskStatusBean.toJSONObject().toString());
		
		pRequest.getRequestDispatcher(RICH_TEXT_EDITOR_TASK_STATUS_DIALOG).forward(pRequest,
				pResponse);
	
		mLog.debug("End openArchitectureItem(HttpServletRequest, HttpServletResponse)");
	}
	
	public void openAnalysisCharactersChapters(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start openAnalysisCharactersChapters(HttpServletRequest, HttpServletResponse)");
				
		List<com.bibisco.bean.CharacterDTO> lListCharacterDTO = CharacterManager.loadAll();
		pRequest.setAttribute("items", lListCharacterDTO);
		
		List<ChapterDTO> lListChapters = ChapterManager.loadAll();
		pRequest.setAttribute("chapters", lListChapters);
		
		Map<String, List<Boolean>> lMapCharacterChapterPresence = SceneTagsManager.getCharactersChaptersPresence();
		pRequest.setAttribute("characterItemPresence", lMapCharacterChapterPresence);
		
		pRequest.setAttribute("itemType", "characters");
		
		pRequest.getRequestDispatcher(ANALYSIS_ITEMS_CHAPTERS).forward(pRequest, pResponse);
	
		mLog.debug("End openAnalysisCharactersChapters(HttpServletRequest, HttpServletResponse)");
	}
	
	public void openAnalysisLocationsChapters(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start openAnalysisLocationsChapters(HttpServletRequest, HttpServletResponse)");
				
		List<com.bibisco.bean.LocationDTO> lListLocationDTO = LocationManager.loadAll();
		pRequest.setAttribute("items", lListLocationDTO);
		
		List<ChapterDTO> lListChapters = ChapterManager.loadAll();
		pRequest.setAttribute("chapters", lListChapters);
		
		Map<String, List<Boolean>> lMapLocationChapterPresence = SceneTagsManager.getLocationsChaptersPresence();
		pRequest.setAttribute("characterItemPresence", lMapLocationChapterPresence);
		
		pRequest.setAttribute("itemType", "locations");
		
		pRequest.getRequestDispatcher(ANALYSIS_ITEMS_CHAPTERS).forward(pRequest, pResponse);
	
		mLog.debug("End openAnalysisLocationsChapters(HttpServletRequest, HttpServletResponse)");
	}
	
	public void openAnalysisStrandsChapters(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start openAnalysisStrandsChapters(HttpServletRequest, HttpServletResponse)");
				
		List<com.bibisco.bean.StrandDTO> lListStrandDTO = StrandManager.loadAll();
		pRequest.setAttribute("items", lListStrandDTO);
		
		List<ChapterDTO> lListChapters = ChapterManager.loadAll();
		pRequest.setAttribute("chapters", lListChapters);
		
		Map<String, List<Boolean>> lMapStrandChapterPresence = SceneTagsManager.getStrandsChaptersPresence();
		pRequest.setAttribute("characterItemPresence", lMapStrandChapterPresence);
		
		pRequest.setAttribute("itemType", "strands");
		
		pRequest.getRequestDispatcher(ANALYSIS_ITEMS_CHAPTERS).forward(pRequest, pResponse);
	
		mLog.debug("End openAnalysisStrandsChapters(HttpServletRequest, HttpServletResponse)");
	}
	
	public void openAnalysisPointOfViewsChapters(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start openAnalysisPointOfViewsChapters(HttpServletRequest, HttpServletResponse)");
				
		List<PointOfView4AnalysisDTO> lListPointOfViewsDTO = SceneTagsManager.getPointOfView4AnalysisList();
		pRequest.setAttribute("items", lListPointOfViewsDTO);
		
		List<ChapterDTO> lListChapters = ChapterManager.loadAll();
		pRequest.setAttribute("chapters", lListChapters);
		
		Map<String, List<Boolean>> lMapPointOfViewsChapterPresence = SceneTagsManager.getPointOfViewsChaptersPresence();
		pRequest.setAttribute("characterItemPresence", lMapPointOfViewsChapterPresence);
		
		pRequest.setAttribute("itemType", "pointOfViews");
		
		pRequest.getRequestDispatcher(ANALYSIS_ITEMS_CHAPTERS).forward(pRequest, pResponse);
	
		mLog.debug("End openAnalysisPointOfViewsChapters(HttpServletRequest, HttpServletResponse)");
	}
	
	public void openProjectFromScene(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start openProjectFromScene(HttpServletRequest, HttpServletResponse)");
				
		Integer lIntIdScene = Integer.parseInt(pRequest.getParameter("idScene"));
		pRequest.setAttribute("idActualScene", lIntIdScene);
		
		// load architecture
		ProjectFromSceneArchitectureDTO lProjectFromSceneArchitectureDTO = ProjectFromSceneManager.loadArchitecture();
		pRequest.setAttribute("projectFromSceneArchitecture", lProjectFromSceneArchitectureDTO.toJSONObject());
		
		// load chapters
		List<ChapterDTO> lListChapterDTO = ChapterManager.loadAll();
		pRequest.setAttribute("chapters", lListChapterDTO);
		
		// load  actual chapter
		ProjectFromSceneChapterDTO lProjectFromSceneChapterDTO = ProjectFromSceneManager.loadChapterByIdScene(lIntIdScene);
		pRequest.setAttribute("projectFromSceneChapter", lProjectFromSceneChapterDTO.toJSONObject());
		pRequest.setAttribute("idActualChapter", lProjectFromSceneChapterDTO.getSceneRevisionDTOList().get(0).getIdChapter());
		
		// load characters
		List<CharacterDTO> lListCharacterDTO = CharacterManager.loadAll();
		pRequest.setAttribute("characters", lListCharacterDTO);
		
		// load first character
		if(lListCharacterDTO!=null && lListCharacterDTO.size()>0) {
			CharacterDTO lCharacterDTO = lListCharacterDTO.get(0);
			if (lCharacterDTO.isMainCharacter()) {
				ProjectFromSceneMainCharacterDTO lProjectFromSceneMainCharacterDTO = ProjectFromSceneManager.loadMainCharacter(lCharacterDTO.getIdCharacter());
				pRequest.setAttribute("projectFromSceneMainCharacter", lProjectFromSceneMainCharacterDTO.toJSONObject());				
			} else {
				ProjectFromSceneSecondaryCharacterDTO lProjectFromSceneSecondaryCharacterDTO = ProjectFromSceneManager.loadSecondaryCharacter(lCharacterDTO.getIdCharacter());
			    pRequest.setAttribute("projectFromSceneSecondaryCharacter", lProjectFromSceneSecondaryCharacterDTO.toJSONObject());
			}
		}
		
		// load locations
		List<LocationDTO> lListLocationDTO = LocationManager.loadAll();
		pRequest.setAttribute("locations", lListLocationDTO);
		
		// load first location
		if(lListLocationDTO!=null && lListLocationDTO.size()>0) {
			ProjectFromSceneLocationDTO lProjectFromSceneLocationDTO = ProjectFromSceneManager.loadLocation(lListLocationDTO.get(0).getIdLocation());
			pRequest.setAttribute("projectFromSceneLocation", lProjectFromSceneLocationDTO.toJSONObject());
		}
		
		pRequest.getRequestDispatcher(PROJECT_FROM_SCENE).forward(pRequest, pResponse);
	
		mLog.debug("End openProjectFromScene(HttpServletRequest, HttpServletResponse)");
	}
	
	public void changeMainCharacterInProjectFromScene(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start changeMainCharacterInProjectFromScene(HttpServletRequest, HttpServletResponse)");
		
		Integer lIntIdCharacter = Integer.valueOf(pRequest.getParameter("idCharacter"));
		
		// load ProjectFromSceneChapterDTO
		ProjectFromSceneMainCharacterDTO lProjectFromSceneMainCharacterDTO = ProjectFromSceneManager.loadMainCharacter(lIntIdCharacter);
								
		pResponse.setContentType("text/html; charset=UTF-8");
		Writer lWriter = pResponse.getWriter();
		lWriter.write(lProjectFromSceneMainCharacterDTO.toJSONObject().toString());
		
		mLog.debug("End changeMainCharacterInProjectFromScene(HttpServletRequest, HttpServletResponse)");
	}
	
	public void changeSecondaryCharacterInProjectFromScene(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start changeSecondaryCharacterInProjectFromScene(HttpServletRequest, HttpServletResponse)");
		
		Integer lIntIdCharacter = Integer.valueOf(pRequest.getParameter("idCharacter"));
		
		// load ProjectFromSceneChapterDTO
		ProjectFromSceneSecondaryCharacterDTO lProjectFromSceneSecondaryCharacterDTO = ProjectFromSceneManager.loadSecondaryCharacter(lIntIdCharacter);
								
		pResponse.setContentType("text/html; charset=UTF-8");
		Writer lWriter = pResponse.getWriter();
		lWriter.write(lProjectFromSceneSecondaryCharacterDTO.toJSONObject().toString());
		
		mLog.debug("End changeSecondaryCharacterInProjectFromScene(HttpServletRequest, HttpServletResponse)");
	}
	
	public void changeChapterInProjectFromScene(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start changeChapterInProjectFromScene(HttpServletRequest, HttpServletResponse)");
				
		Integer lIntIdChapter = Integer.parseInt(pRequest.getParameter("idChapter"));

		ProjectFromSceneChapterDTO lProjectFromSceneChapterDTO = ProjectFromSceneManager.loadChapterByIdChapter(lIntIdChapter);
		
		pResponse.setContentType("text/html; charset=UTF-8");
		Writer lWriter = pResponse.getWriter();
		lWriter.write(lProjectFromSceneChapterDTO.toJSONObject().toString());
	
		mLog.debug("End changeChapterInProjectFromScene(HttpServletRequest, HttpServletResponse)");
	}
	
	public void changeLocationInProjectFromScene(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start changeLocationInProjectFromScene(HttpServletRequest, HttpServletResponse)");
				
		Integer lIntIdLocation = Integer.parseInt(pRequest.getParameter("idLocation"));

		ProjectFromSceneLocationDTO lProjectFromSceneLocationDTO = ProjectFromSceneManager.loadLocation(lIntIdLocation);
		
		pResponse.setContentType("text/html; charset=UTF-8");
		Writer lWriter = pResponse.getWriter();
		lWriter.write(lProjectFromSceneLocationDTO.toJSONObject().toString());
	
		mLog.debug("End changeLocationInProjectFromScene(HttpServletRequest, HttpServletResponse)");
	}
	
	public void openAnalysisWordCountChapters(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start openAnalysisWordCountChapters(HttpServletRequest, HttpServletResponse)");
		
		List<ChapterDTO> lListChapterDTO = ChapterManager.loadAll();
		
		pRequest.setAttribute("chapters", lListChapterDTO);
		pRequest.getRequestDispatcher(ANALYSIS_CHAPTER_LENGTH+"?version="+(new java.util.Date()).getTime()).forward(pRequest, pResponse);
		
		mLog.debug("Start openAnalysisWordCountChapters(HttpServletRequest, HttpServletResponse)");
		
	}
	
	public void openAnalysisCharacterScene(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start openAnalysisCharacterScene(HttpServletRequest, HttpServletResponse)");
				
		List<CharacterDTO> lListCharacterDTO = CharacterManager.loadAll();
		pRequest.setAttribute("characters", lListCharacterDTO);
		
		Map<Integer,List<CharacterSceneDTO>> lMapCharacterSceneAnalysis = SceneTagsManager.getCharacterSceneAnalysis();
		pRequest.setAttribute("characterSceneAnalysis", lMapCharacterSceneAnalysis);
		
		pRequest.getRequestDispatcher(ANALYSIS_CHARACTER_SCENE).forward(pRequest, pResponse);
	
		mLog.debug("End openAnalysisCharacterScene(HttpServletRequest, HttpServletResponse)");
	}
	
	
	public void openChapterReason(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start openChapterReason(HttpServletRequest, HttpServletResponse)");
			
		ChapterDTO lChapter = ChapterManager.load(Integer.valueOf(pRequest.getParameter("id")));
		
		RichTextEditorTaskStatusBean lRichTextEditorTaskStatusBean = new RichTextEditorTaskStatusBean();
		lRichTextEditorTaskStatusBean.setId(String.valueOf(lChapter.getIdChapter()));
		lRichTextEditorTaskStatusBean.setText(lChapter.getReason());
		lRichTextEditorTaskStatusBean.setTaskStatus(lChapter.getReasonTaskStatus());
		lRichTextEditorTaskStatusBean.setReadOnly(false);
		lRichTextEditorTaskStatusBean.setDescription(ResourceBundleManager.getString(pRequest.getParameter("description")));
		pRequest.setAttribute("richTextEditorTaskStatus", lRichTextEditorTaskStatusBean.toJSONObject().toString());
		
		pRequest.getRequestDispatcher(RICH_TEXT_EDITOR_TASK_STATUS_DIALOG).forward(pRequest,
				pResponse);
	
		mLog.debug("End openChapterReason(HttpServletRequest, HttpServletResponse)");
	}
	
	public void openNote(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start openNote(HttpServletRequest, HttpServletResponse)");
		
		ChapterDTO lChapter = ChapterManager.load(Integer.valueOf(pRequest.getParameter("id")));
		
		RichTextEditorTaskStatusBean lRichTextEditorTaskStatusBean = new RichTextEditorTaskStatusBean();
		lRichTextEditorTaskStatusBean.setId(lChapter.getIdChapter().toString());
		lRichTextEditorTaskStatusBean.setText(lChapter.getNote());
		lRichTextEditorTaskStatusBean.setTaskStatus(TaskStatus.DISABLE);
		lRichTextEditorTaskStatusBean.setReadOnly(false);
		lRichTextEditorTaskStatusBean.setDescription(ResourceBundleManager.getString(pRequest.getParameter("description")));
		pRequest.setAttribute("richTextEditorTaskStatus", lRichTextEditorTaskStatusBean.toJSONObject().toString());
		pRequest.getRequestDispatcher(RICH_TEXT_EDITOR_TASK_STATUS_DIALOG).forward(pRequest,
				pResponse);
	
		mLog.debug("End openNote(HttpServletRequest, HttpServletResponse)");
	}
	

	public void saveArchitectureItem(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start saveArchitectureItem(HttpServletRequest, HttpServletResponse)");
		String lStrTaskStatus = pRequest.getParameter("taskStatus");
		String lStrText = pRequest.getParameter("text");
		String lStrId = pRequest.getParameter("id");

		ArchitectureItem lArchitectureItem = new ArchitectureItem();
		lArchitectureItem.setTaskStatus(TaskStatus.valueOf(lStrTaskStatus));
		lArchitectureItem.setText(lStrText);
		
		ArchitectureItemManager.save(lArchitectureItem, ArchitectureItemType.valueOf(lStrId));
		
		mLog.debug("End saveArchitectureItem(HttpServletRequest, HttpServletResponse)");
	}
	
	public void saveLocale(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {
		
		mLog.debug("Start saveLocale(HttpServletRequest, HttpServletResponse)");
		
		String lStrLocale = pRequest.getParameter("locale");
		LocaleManager.getInstance().saveLocale(lStrLocale);
		
		// set new language to servlet context
		pRequest.getSession().getServletContext().setAttribute("language", LocaleManager.getInstance().getLocale().getLanguage());
				
		String lStrFrom = pRequest.getParameter("from");
		if (lStrFrom.equals("settings")) {
			// open project with saved locale
			ProjectDTO lProjectDTO = ProjectManager.load(ContextManager.getInstance().getIdProject());
			pRequest.setAttribute("project", lProjectDTO);
		} 
		pRequest.getRequestDispatcher(INDEX).forward(pRequest, pResponse);
		
		mLog.debug("End saveLocale(HttpServletRequest, HttpServletResponse)");
	}
	
	public void saveChapterReason(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start saveChapterReason(HttpServletRequest, HttpServletResponse)");
		
		ChapterDTO lChapter = new ChapterDTO();
		lChapter.setIdChapter(Integer.valueOf(pRequest.getParameter("id")));
		lChapter.setReason(pRequest.getParameter("text"));
		lChapter.setReasonTaskStatus(TaskStatus.valueOf(pRequest.getParameter("taskStatus")));
		
		ChapterManager.save(lChapter);
		
		mLog.debug("End saveChapterReason(HttpServletRequest, HttpServletResponse)");
	}
	
	public void saveNote(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {

		mLog.debug("Start saveNote(HttpServletRequest, HttpServletResponse)");
		
		ChapterDTO lChapter = new ChapterDTO();
		lChapter.setIdChapter(Integer.valueOf(pRequest.getParameter("id")));
		lChapter.setNote(pRequest.getParameter("text"));
		
		ChapterManager.save(lChapter);
		
		mLog.debug("End saveNote(HttpServletRequest, HttpServletResponse)");
	}
	
	public void saveRichTextEditorSettings(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		mLog.debug("Start saveRichTextEditorSettings(HttpServletRequest, HttpServletResponse)");
		
		RichTextEditorSettings lRichTextEditorSettings = new RichTextEditorSettings();
		lRichTextEditorSettings.setFont(pRequest.getParameter("font"));
		lRichTextEditorSettings.setSize(pRequest.getParameter("size"));
		lRichTextEditorSettings.setSpellCheckEnabled(Boolean.valueOf(pRequest.getParameter("spellcheck")));
		
		RichTextEditorSettingsManager.save(lRichTextEditorSettings);
		
		pRequest.getSession().getServletContext().setAttribute("richTextEditorSettings", lRichTextEditorSettings);
	
		mLog.debug("End saveRichTextEditorSettings(HttpServletRequest, HttpServletResponse)");
	}

	
	public void spellCheck(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws IOException {
		mLog.debug("Start spellCheck(HttpServletRequest, HttpServletResponse)");
		
		String lStrText = pRequest.getParameter("text");
		mLog.debug("text= ", lStrText);
		
		JSONObject lJSONObjectResult = SpellCheckManager.spell(lStrText);
		pResponse.setContentType("text/html; charset=UTF-8");
		Writer lWriter = pResponse.getWriter();
		lWriter.write(lJSONObjectResult.toString());
		
		mLog.debug("End spellCheck(HttpServletRequest, HttpServletResponse)");
	}
	
	public void characterWordCount(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws IOException {
		
		mLog.debug("Start characterWordCount(HttpServletRequest, HttpServletResponse)");
		
		String lStrText = pRequest.getParameter("text");
		mLog.debug("text= ", lStrText);		
		CharacterWordCount lCharacterWordCount = TextEditorManager.getCharacterWordCount(lStrText);
		
		pResponse.setContentType("application/json; charset=UTF-8");
		Writer lWriter = pResponse.getWriter();
		lWriter.write(lCharacterWordCount.toJSONObject().toString());
		
		mLog.debug("End characterWordCount(HttpServletRequest, HttpServletResponse)");
	}
	
	public void sceneRevisionChange(HttpServletRequest pRequest, HttpServletResponse pResponse) throws IOException {
		
		SceneRevisionDTO lSceneRevisionDTO;
		
		mLog.debug("Start sceneRevisionChange(HttpServletRequest, HttpServletResponse)");
		
		Integer lIntIdScene = Integer.parseInt(pRequest.getParameter("idScene"));
		
		String lStrOperation = pRequest.getParameter("operation");	
		if(lStrOperation.equals("createRevisionFromScratch")) {
			lSceneRevisionDTO = SceneManager.createRevisionFromScratch(lIntIdScene);
		} else if(lStrOperation.equals("createRevisionFromActual")) {
			lSceneRevisionDTO = SceneManager.createRevisionFromActual(lIntIdScene);
		} else if(lStrOperation.equals("deleteCurrentRevision")) {
			lSceneRevisionDTO = SceneManager.deleteActualRevision(lIntIdScene);
		} else {
			Integer lIntIdRevision = Integer.parseInt(pRequest.getParameter("idRevision"));
			lSceneRevisionDTO = SceneManager.changeRevision(lIntIdScene, lIntIdRevision);
		}
		
		pResponse.setContentType("text/html; charset=UTF-8");
		
		Writer lWriter = pResponse.getWriter();
		lWriter.write(lSceneRevisionDTO.toJSONObject().toString());
		
		mLog.debug("End sceneRevisionChange(HttpServletRequest, HttpServletResponse)");
		
	}
	
	
	public void deleteStrand(HttpServletRequest pRequest, HttpServletResponse pResponse) throws IOException {
		mLog.debug("Start deleteStrand(HttpServletRequest, HttpServletResponse)");
		
		boolean lBlnResult = StrandManager.deleteByPosition(Integer.valueOf(pRequest.getParameter("position")));
		if (!lBlnResult) {
			pResponse.setContentType("text/html; charset=UTF-8");
			Writer lWriter = pResponse.getWriter();
			lWriter.write("bibisco_delete_ko");
		}
		
		mLog.debug("End deleteStrand(HttpServletRequest, HttpServletResponse)");
	}
	
	public void exportProject(HttpServletRequest pRequest, HttpServletResponse pResponse) throws IOException {
		mLog.debug("Start exportProject(HttpServletRequest, HttpServletResponse)");
				
		ExportType lExportType = ExportType.valueOf(pRequest.getParameter("type"));
		
		List<File> lListFile = null;
		switch (lExportType) {
		case ARCHIVE:
			lListFile = new ArrayList<File>();
			lListFile.add(ProjectManager.exportProjectAsArchive());
			break;
		case PDF:
			lListFile = ProjectManager.exportProjectAsPdf();
			break;
		case WORD:
			lListFile = ProjectManager.exportProjectAsWord();
			break;
			
		default:
			break;
		}
		
		// open folder in file system
		if (Desktop.isDesktopSupported()) {
		    Desktop.getDesktop().open(lListFile.get(0).getParentFile());
		}
		
		JSONObject lJSONObject;
		try {
			lJSONObject = new JSONObject();
			JSONArray lJSONArrayFiles = new JSONArray();
			for (int j = 0; j < lListFile.size(); j++) {
				JSONObject lJSONObjectFile = new JSONObject();
				lJSONObjectFile.put("filepath", lListFile.get(j).getAbsolutePath());
				lJSONArrayFiles.put(j, lJSONObjectFile);
			}
			lJSONObject.put("files", lJSONArrayFiles);
		} catch (JSONException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.FATAL);
		}
		
		pResponse.setContentType("application/json; charset=UTF-8");
		Writer lWriter = pResponse.getWriter();
		lWriter.write(lJSONObject.toString());
		
		mLog.debug("End exportProject(HttpServletRequest, HttpServletResponse)");
	}
	
	public void deleteProject(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		
		mLog.debug("Start deleteProject(HttpServletRequest, HttpServletResponse)");
		
		ProjectManager.deleteProject(pRequest.getParameter("idProject"));
		
		mLog.debug("End deleteProject(HttpServletRequest, HttpServletResponse)");
	}
	
	public void deleteMaincharacter(HttpServletRequest pRequest, HttpServletResponse pResponse) throws IOException {
		mLog.debug("Start deleteMaincharacter(HttpServletRequest, HttpServletResponse)");
		
		boolean lBlnResult = CharacterManager.deleteMainCharacterByPosition(Integer.valueOf(pRequest.getParameter("position")));
		if (!lBlnResult) {
			pResponse.setContentType("text/html; charset=UTF-8");
			Writer lWriter = pResponse.getWriter();
			lWriter.write("bibisco_delete_ko");
		}
		
		mLog.debug("End deleteMaincharacter(HttpServletRequest, HttpServletResponse)");
	}
	
	public void deleteSecondarycharacter(HttpServletRequest pRequest, HttpServletResponse pResponse) throws IOException {
		mLog.debug("Start deleteSecondarycharacter(HttpServletRequest, HttpServletResponse)");
		
		boolean lBlnResult = CharacterManager.deleteSecondaryCharacterByPosition(Integer.valueOf(pRequest.getParameter("position")));
		if (!lBlnResult) {
			pResponse.setContentType("text/html; charset=UTF-8");
			Writer lWriter = pResponse.getWriter();
			lWriter.write("bibisco_delete_ko");
		}
		
		mLog.debug("End deleteSecondarycharacter(HttpServletRequest, HttpServletResponse)");
	}
	
	public void disableTip(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		mLog.debug("Start disableTip(HttpServletRequest, HttpServletResponse)");
		
		TipManager.disableTip(pRequest.getParameter("tipCode"));
		
		// get tip settings
		TipSettings lTipSettings = TipManager.load();
		getServletContext().setAttribute("tipSettings", lTipSettings);
		
		mLog.debug("End disableTip(HttpServletRequest, HttpServletResponse)");
	}
	
	public void deleteChapter(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		mLog.debug("Start deletechapter(HttpServletRequest, HttpServletResponse)");
		
		ChapterManager.deleteByPosition(Integer.valueOf(pRequest.getParameter("position")));
		
		mLog.debug("End deletechapter(HttpServletRequest, HttpServletResponse)");
	}
	
	public void deleteLocation(HttpServletRequest pRequest, HttpServletResponse pResponse) throws IOException {
		mLog.debug("Start deleteLocation(HttpServletRequest, HttpServletResponse)");
		
		boolean lBlnResult = LocationManager.deleteByPosition(Integer.valueOf(pRequest.getParameter("position")));
		if (!lBlnResult) {
			pResponse.setContentType("text/html; charset=UTF-8");
			Writer lWriter = pResponse.getWriter();
			lWriter.write("bibisco_delete_ko");
		}
		
		mLog.debug("End deleteLocation(HttpServletRequest, HttpServletResponse)");
	}
	
	
	public void deleteScene(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		mLog.debug("Start deleteScene(HttpServletRequest, HttpServletResponse)");
		
		SceneManager.deleteByPosition(Integer.valueOf(pRequest.getParameter("position")));
		
		mLog.debug("End deleteScene(HttpServletRequest, HttpServletResponse)");
	}
	
	public void moveChapter(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		mLog.debug("Start moveChapter(HttpServletRequest, HttpServletResponse)");
		
		ChapterManager.move(Integer.valueOf(pRequest.getParameter("sourcePosition")), 
				Integer.valueOf(pRequest.getParameter("destPosition"))); 

		mLog.debug("End moveChapter(HttpServletRequest, HttpServletResponse)");
	}
	
	public void moveLocation(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		mLog.debug("Start moveLocation(HttpServletRequest, HttpServletResponse)");
		LocationManager.move(Integer.valueOf(pRequest.getParameter("sourcePosition")), 
				Integer.valueOf(pRequest.getParameter("destPosition"))); 

		mLog.debug("End moveLocation(HttpServletRequest, HttpServletResponse)");
	}
	
	public void moveStrand(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		mLog.debug("Start moveStrand(HttpServletRequest, HttpServletResponse)");
		StrandManager.move(Integer.valueOf(pRequest.getParameter("sourcePosition")), 
				Integer.valueOf(pRequest.getParameter("destPosition"))); 

		mLog.debug("End moveStrand(HttpServletRequest, HttpServletResponse)");
	}
	
	public void moveMaincharacter(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		mLog.debug("Start moveMaincharacter(HttpServletRequest, HttpServletResponse)");
		
		CharacterManager.moveMainCharacter(Integer.valueOf(pRequest.getParameter("sourcePosition")), 
				Integer.valueOf(pRequest.getParameter("destPosition")));
		
		mLog.debug("End moveMaincharacter(HttpServletRequest, HttpServletResponse)");
	}
	
	public void moveSecondarycharacter(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		mLog.debug("Start movesecondarycharacter(HttpServletRequest, HttpServletResponse)");
		
		CharacterManager.moveSecondaryCharacter(Integer.valueOf(pRequest.getParameter("sourcePosition")), 
				Integer.valueOf(pRequest.getParameter("destPosition")));
		
		mLog.debug("End movesecondarycharacter(HttpServletRequest, HttpServletResponse)");
	}
	
	public void moveScene(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		mLog.debug("Start moveScene(HttpServletRequest, HttpServletResponse)");
		
		SceneManager.move(Integer.valueOf(pRequest.getParameter("sourcePosition")), 
				Integer.valueOf(pRequest.getParameter("destPosition"))); 
		
		mLog.debug("End moveScene(HttpServletRequest, HttpServletResponse)");
	}
	
	public void changeTitleScene(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		mLog.debug("Start changeTitleScene(HttpServletRequest, HttpServletResponse)");
		
		SceneDTO lSceneDTO = new SceneDTO();
		lSceneDTO.setIdScene(Integer.valueOf(pRequest.getParameter("id")));
		lSceneDTO.setDescription(pRequest.getParameter("title"));
		
		SceneManager.save(lSceneDTO);
		
		mLog.debug("End changeTitleScene(HttpServletRequest, HttpServletResponse)");
	}
	
	
	public void changeTitleStrand(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		mLog.debug("Start changeTitleStrand(HttpServletRequest, HttpServletResponse)");
		
		StrandDTO lStrandDTO = new StrandDTO();
		lStrandDTO.setIdStrand(Integer.valueOf(pRequest.getParameter("id")));
		lStrandDTO.setName(pRequest.getParameter("title"));
		
		StrandManager.save(lStrandDTO);
		
		mLog.debug("End changeTitleStrand(HttpServletRequest, HttpServletResponse)");
	}
	
	public void changeTitleMaincharacter(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		mLog.debug("Start changeTitleMaincharacter(HttpServletRequest, HttpServletResponse)");
		
		changeTitleCharacter(pRequest, pResponse);
		
		mLog.debug("End changeTitleMaincharacter(HttpServletRequest, HttpServletResponse)");
	}
	
	
	public void changeTitleSecondarycharacter(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		mLog.debug("Start changeTitleSecondarycharacter(HttpServletRequest, HttpServletResponse)");
		
		changeTitleCharacter(pRequest, pResponse);
		
		mLog.debug("End changeTitleSecondarycharacter(HttpServletRequest, HttpServletResponse)");
	}
	
	public void changeTitleLocation(HttpServletRequest pRequest, HttpServletResponse pResponse) throws IOException {
		mLog.debug("Start changeTitleLocation(HttpServletRequest, HttpServletResponse)");
		
		LocationDTO lLocationDTO = new LocationDTO();
		lLocationDTO.setName(pRequest.getParameter("title"));
		lLocationDTO.setNation(pRequest.getParameter("nation"));
		lLocationDTO.setState(pRequest.getParameter("state"));
		lLocationDTO.setCity(pRequest.getParameter("city"));
		lLocationDTO.setIdLocation(Integer.valueOf(pRequest.getParameter("idLocation")));
		
		LocationManager.save(lLocationDTO);
		
		pResponse.setContentType("application/json; charset=UTF-8");
		Writer lWriter = pResponse.getWriter();
		lWriter.write(lLocationDTO.toJSONObject().toString());
		
		mLog.debug("End changeTitleLocation(HttpServletRequest, HttpServletResponse)");
	}
	
	private void changeTitleCharacter(HttpServletRequest pRequest, HttpServletResponse pResponse) {
		mLog.debug("Start changeTitleCharacter(HttpServletRequest, HttpServletResponse)");
		
		CharacterDTO lCharacterDTO = new CharacterDTO();
		lCharacterDTO.setIdCharacter(Integer.valueOf(pRequest.getParameter("id")));
		lCharacterDTO.setName(pRequest.getParameter("title"));
		
		CharacterManager.changeCharacterName(lCharacterDTO);
		
		mLog.debug("End changeTitleCharacter(HttpServletRequest, HttpServletResponse)");
	}
	
	public void openUrlExternalBrowser(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws IOException {
		mLog.debug("Start openUrlExternalBrowser(HttpServletRequest, HttpServletResponse)");
		
		String lStrUrl = pRequest.getParameter("url");
		mLog.debug("url= ", lStrUrl);
		
		if(Desktop.isDesktopSupported()){
            Desktop desktop = Desktop.getDesktop();
            try {
                desktop.browse(new URI(lStrUrl));
            } catch (Exception e) {
                mLog.error(e);
                throw new BibiscoException(e, BibiscoException.IO_EXCEPTION);
            }
        }else{
            Runtime runtime = Runtime.getRuntime();
            try {
                runtime.exec("xdg-open " + lStrUrl);
            } catch (Exception e) {
            	mLog.error(e);
                throw new BibiscoException(e, BibiscoException.IO_EXCEPTION);
            }
        }
		
		pResponse.setContentType("text/html; charset=UTF-8");
		Writer lWriter = pResponse.getWriter();
		lWriter.write("ok");
		
		mLog.debug("End openUrlExternalBrowser(HttpServletRequest, HttpServletResponse)");
	}

	@Override
	public void init() throws ServletException {
		
		mLog.debug("Start init()");
		
		// get language
		getServletContext().setAttribute("language", LocaleManager.getInstance().getLocale().getLanguage());

		// get rich text editor settings
		RichTextEditorSettings lRichTextEditorSettings = RichTextEditorSettingsManager.load();
		getServletContext().setAttribute("richTextEditorSettings", lRichTextEditorSettings);
		
		// get tip settings
		TipSettings lTipSettings = TipManager.load();
		getServletContext().setAttribute("tipSettings", lTipSettings);

		// get projects
		List<ProjectDTO> lListProjectDTO = ProjectManager.loadAll();
		getServletContext().setAttribute("projectList", lListProjectDTO);
		
		mLog.debug("End init()");
	}
}