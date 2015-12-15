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


import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.CharUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.Validate;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.bibisco.BibiscoException;
import com.bibisco.bean.ArchitectureDTO;
import com.bibisco.bean.ArchitectureItem;
import com.bibisco.bean.ChapterDTO;
import com.bibisco.bean.CharacterDTO;
import com.bibisco.bean.CharacterInfoQuestionsDTO;
import com.bibisco.bean.CharacterInfoWithoutQuestionsDTO;
import com.bibisco.bean.CharacterWordCount;
import com.bibisco.bean.ImportProjectArchiveDTO;
import com.bibisco.bean.LocationDTO;
import com.bibisco.bean.MainCharacterDTO;
import com.bibisco.bean.ProjectDTO;
import com.bibisco.bean.SecondaryCharacterDTO;
import com.bibisco.bean.StrandDTO;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.ProjectMapper;
import com.bibisco.dao.client.ProjectsMapper;
import com.bibisco.dao.client.SceneRevisionsMapper;
import com.bibisco.dao.client.ScenesMapper;
import com.bibisco.dao.client.VSelectedSceneRevisionsMapper;
import com.bibisco.dao.model.Project;
import com.bibisco.dao.model.ProjectWithBLOBs;
import com.bibisco.dao.model.Projects;
import com.bibisco.dao.model.ProjectsExample;
import com.bibisco.dao.model.SceneRevisions;
import com.bibisco.dao.model.SceneRevisionsExample;
import com.bibisco.dao.model.Scenes;
import com.bibisco.dao.model.ScenesExample;
import com.bibisco.dao.model.VSelectedSceneRevisions;
import com.bibisco.dao.model.VSelectedSceneRevisionsExample;
import com.bibisco.enums.CharacterInfoQuestions;
import com.bibisco.enums.CharacterInfoWithoutQuestions;
import com.bibisco.enums.ExportType;
import com.bibisco.enums.TaskStatus;
import com.bibisco.export.HTMLParser;
import com.bibisco.export.IExporter;
import com.bibisco.export.ITextExporter;
import com.bibisco.export.ParagraphAligment;
import com.bibisco.export.TextFormatting;
import com.bibisco.log.Log;
import com.bibisco.manager.ArchitectureItemManager.ArchitectureItemType;

/**
 * Project manager.
 * 
 * @author Andrea Feccomandi
 *
 */
public class ProjectManager {

	private static Log mLog = Log.getInstance(ProjectManager.class);
	private static String INTERNAL_BIBISCO_PROJECTS_DB_DIR = "_internal_bibisco_projects_db_";
	
	public static ProjectDTO load(String pStrIdProject) {
		
		ProjectDTO lProjectDTO;
		
		mLog.debug("Start load(String)");
		
		// validate preconditions
		Validate.notEmpty(pStrIdProject, "Id project cannot be empty");
		Validate.isTrue(ProjectManager.projectExists(pStrIdProject), "Project references non existent directory");
		
		// set project name to context
		ContextManager.getInstance().setIdProject(pStrIdProject);
		
		// load project
		lProjectDTO = load();
						
		// set language to context
		ContextManager.getInstance().setProjectLanguage(lProjectDTO.getLanguage());
		
		mLog.debug("End load(String)");
		
		return lProjectDTO;
	}
	
	private static ProjectDTO load() {

		mLog.debug("Start load()");

		Project lProject;
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			ProjectMapper lProjectMapper = lSqlSession.getMapper(ProjectMapper.class);
			lProject = lProjectMapper.selectByPrimaryKey(ContextManager.getInstance().getIdProject());
			
    	} catch(Throwable t) {
    		mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
    	
		ProjectDTO lProjectDTO = new ProjectDTO();
		lProjectDTO.setIdProject(lProject.getIdProject());
		lProjectDTO.setName(lProject.getName());
		lProjectDTO.setLanguage(lProject.getLanguage());
		lProjectDTO.setBibiscoVersion(lProject.getBibiscoVersion());
		
		ArchitectureDTO lArchitectureDTO = new ArchitectureDTO();
		lArchitectureDTO.setPremiseTaskStatus(TaskStatus.getTaskStatusFromValue(lProject.getPremiseTaskStatus()));
		lArchitectureDTO.setFabulaTaskStatus(TaskStatus.getTaskStatusFromValue(lProject.getFabulaTaskStatus()));
		lArchitectureDTO.setSettingTaskStatus(TaskStatus.getTaskStatusFromValue(lProject.getSettingTaskStatus()));
		lArchitectureDTO.setStrandList(StrandManager.loadAll());
		
		lProjectDTO.setArchitecture(lArchitectureDTO);
		lProjectDTO.setChapterList(ChapterManager.loadAll());
		lProjectDTO.setMainCharacterList(CharacterManager.loadMainCharacters());
		lProjectDTO.setSecondaryCharacterList(CharacterManager.loadSecondaryCharacters());
		lProjectDTO.setLocationList(LocationManager.loadAll());

		mLog.debug("End load(Integer)");

		return lProjectDTO;
	}
	
	public static List<ProjectDTO> loadAll() {

		List<ProjectDTO> lListProjectDTO = null;

		mLog.debug("Start loadAll()");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    		
    		ProjectsMapper lProjectsMapper = lSqlSession.getMapper(ProjectsMapper.class);
    		ProjectsExample lProjectsExample = new ProjectsExample();
    		lProjectsExample.setOrderByClause("UPPER(name) asc");
			List<Projects> lListProjects = lProjectsMapper.selectByExample(lProjectsExample);
			
			if (lListProjects!=null && lListProjects.size()>0) {
				lListProjectDTO = new ArrayList<ProjectDTO>();
				for (Projects lProjects : lListProjects) {
					
					ProjectDTO lProjectDTO = new ProjectDTO();
					lProjectDTO.setIdProject(lProjects.getIdProject());
					lProjectDTO.setName(lProjects.getName());
					
					lListProjectDTO.add(lProjectDTO);
				}
			}
		
    	} catch(Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End loadAll()");

		return lListProjectDTO;
	}

	public static ProjectDTO insert(ProjectDTO pProjectDTO) {
		
		mLog.debug("Start insert(ProjectDTO)");
		
		// validate preconditions
		Validate.notNull(pProjectDTO, "argument ProjectDTO cannot be null");
		Validate.notEmpty(pProjectDTO.getName(), "argument ProjectDTO.name cannot be empty");
		Validate.notEmpty(pProjectDTO.getLanguage(), "argument ProjectDTO.language cannot be empty");
		Validate.notEmpty(pProjectDTO.getBibiscoVersion(), "argument ProjectDTO.bibiscoVersion cannot be empty");
		
		// generate random UUID to use as db project name
		String lStrIdProject = UUID.randomUUID().toString();
		pProjectDTO.setIdProject(lStrIdProject);
		
		// create project db from template
		createDBProjectFromTemplate(lStrIdProject);
		
		// set project name to context
    	ContextManager.getInstance().setIdProject(lStrIdProject);
    	
    	// set language to context
    	ContextManager.getInstance().setProjectLanguage(pProjectDTO.getLanguage());
		
		// insert project into bibisco db
		insertIntoBibiscoDB(pProjectDTO);
    	
    	// insert project into project db
    	insertIntoProjectDB(pProjectDTO);
    	
    	// load project
    	pProjectDTO = load();
    	
		mLog.debug("End insert(ProjectDTO)");

		return pProjectDTO;
		
	}
	
	private static void insertIntoProjectDB(ProjectDTO pProjectDTO) {
		
		mLog.debug("Start insertIntoProjectDB(ProjectDTO)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
 
    		// insert project
    		ProjectWithBLOBs lProjectWithBLOBs = new ProjectWithBLOBs();
    		lProjectWithBLOBs.setIdProject(pProjectDTO.getIdProject());
    		lProjectWithBLOBs.setName(pProjectDTO.getName());
    		lProjectWithBLOBs.setLanguage(pProjectDTO.getLanguage());
    		lProjectWithBLOBs.setBibiscoVersion(pProjectDTO.getBibiscoVersion());
    		
			ProjectMapper lProjectMapper = lSqlSession.getMapper(ProjectMapper.class);
			lProjectMapper.insertSelective(lProjectWithBLOBs);
				
			lSqlSession.commit();
			
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End insertIntoBibiscoDB(ProjectDTO)");
	}
	
	public static void delete(String pStrIdProject) {
		
		mLog.debug("Start delete(String)");
		
		// validate preconditions
		Validate.notEmpty(pStrIdProject, "Id project cannot be empty");
		Validate.isTrue(ProjectManager.projectExists(pStrIdProject), "Project references non existent directory");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    		
    		// delete entry on bibisco db
			ProjectsMapper lProjectsMapper = lSqlSession.getMapper(ProjectsMapper.class);
			lProjectsMapper.deleteByPrimaryKey(pStrIdProject);
			
			// delete file
			FileUtils.deleteDirectory(new File(getDBProjectDirectory(pStrIdProject)));
			
			lSqlSession.commit();
			
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End delete(String)");
	}

	private static void insertIntoBibiscoDB(ProjectDTO pProjectDTO) {
		
		mLog.debug("Start insertIntoBibiscoDB(ProjectDTO)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    		Projects lProjects = new Projects();
    		lProjects.setIdProject(pProjectDTO.getIdProject());
    		lProjects.setName(pProjectDTO.getName());
    	
			ProjectsMapper lProjectsMapper = lSqlSession.getMapper(ProjectsMapper.class);
			lProjectsMapper.insertSelective(lProjects);
				
			lSqlSession.commit();
			
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
    	mLog.debug("End insertIntoBibiscoDB(ProjectDTO)");	
	}
	
	private static void createDBProjectFromTemplate(String pStrIdProject) {
		
		// create template db file path
		String lStrTemplateDBFile = getTemplateDBFilePath(pStrIdProject);
		
		// create project db file path
		String lStrProjectDBFile = getDBProjectFilePath(pStrIdProject); 
		
		try {
			FileUtils.copyFile(new File(lStrTemplateDBFile), new File(lStrProjectDBFile));
		} catch (IOException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.IO_EXCEPTION);
		}
	}
		
	
	private static String getProjectExportFilePath(ExportType pExportType, String pStrType, String pStrTimestamp, String pStrProjectName) {
		
		ContextManager lContextManager = ContextManager.getInstance();
			
		// create export file path
		StringBuilder lStringBuilder = new StringBuilder();
		lStringBuilder.append(lContextManager.getExportDirectoryPath());
		lStringBuilder.append(getProjectNameForExport(pStrProjectName));
		lStringBuilder.append("_");
		lStringBuilder.append(pStrType);
		lStringBuilder.append("_");
		lStringBuilder.append(pStrTimestamp);
		lStringBuilder.append(pExportType.getExtension());
		
		return lStringBuilder.toString();
	}
	
	private static String getProjectNameForExport(String pStrProjectName) {
		
		StringBuilder lStringBuilder = new StringBuilder();
		
		for (int i = 0; i < pStrProjectName.length(); i++) {
			if (CharUtils.isAsciiAlphanumeric(pStrProjectName.charAt(i))) {
				lStringBuilder.append(pStrProjectName.charAt(i));
			}
		}
		
		return lStringBuilder.toString();
	}
	
	
	private static String getTemplateDBFilePath(String pStrIdProject) {
		
		ContextManager lContextManager = ContextManager.getInstance();
		
		// create template db file path
		StringBuilder lStringBuilder = new StringBuilder();
		lStringBuilder.append(lContextManager.getTemplateDbDirectoryPath());
		lStringBuilder.append("template_project.h2.db");
		
		return lStringBuilder.toString(); 
	}
	
	private static String getDBProjectFilePath(String pStrIdProject) {
				
		// create project db file path
		StringBuilder lStringBuilder = new StringBuilder();
		lStringBuilder.append(getDBProjectDirectory(pStrIdProject));
		lStringBuilder.append(pStrIdProject);
		lStringBuilder.append(".h2.db");
		
		return lStringBuilder.toString(); 
	}
	
	public static String getDBProjectDirectory(String pStrIdProject) {
		
		// validate preconditions
		Validate.notEmpty(pStrIdProject, "Id project cannot be empty");
				
		// create db directory path
		String lStrProjectsDirectory = getProjectsDirectory();
		
		// create project db file path
		StringBuilder lStringBuilder = new StringBuilder();
		lStringBuilder.append(lStrProjectsDirectory);
		lStringBuilder.append(pStrIdProject);
		lStringBuilder.append(ContextManager.getPathSeparator());
		
		return lStringBuilder.toString(); 
	}
	
	public static File exportProjectAsArchive() {
				
		File lFile = null;
		
		mLog.debug("Start exportProjectAsArchive()");
		
		// validate preconditions
		Validate.notEmpty(ContextManager.getInstance().getIdProject(), "There is no project in context");
		Validate.isTrue(ProjectManager.projectExists(ContextManager.getInstance().getIdProject()), "Project references non existent directory");
		
		// load project name
		ProjectDTO lProjectDTO = load();
		String lStrProjectName = lProjectDTO.getName();
		
		// generate archive file name
		String lStrZipFile = getProjectExportFilePath(ExportType.ARCHIVE, "archive", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()), lStrProjectName);
		
		// create archive
		zipIt(lStrZipFile);
		
		// file object to return
		lFile = new File(lStrZipFile);
		
		mLog.debug("End exportProjectAsArchive()");
		
		return lFile;
	}
	
	public static List<File> exportProjectAsPdf() {
		
		List<File> lListFile = null;
		
		mLog.debug("Start exportProjectAsPdf(");
		
		// validate preconditions
		Validate.notEmpty(ContextManager.getInstance().getIdProject(), "There is no project in context");
		Validate.isTrue(ProjectManager.projectExists(ContextManager.getInstance().getIdProject()), "Project references non existent directory");
				
		// get file object to return
		lListFile = exportAsWordOrPdf(ExportType.PDF);
		
		mLog.debug("End exportProjectAsPdf()");
		
		return lListFile;
	}

	public static List<File> exportProjectAsWord() {

		List<File> lListFile = null;
		
		mLog.debug("Start exportProjectAsWord()");
		
		// validate preconditions
		Validate.notEmpty(ContextManager.getInstance().getIdProject(), "There is no project in context");
		Validate.isTrue(ProjectManager.projectExists(ContextManager.getInstance().getIdProject()), "Project references non existent directory");
				
		// get file object to return
		lListFile = exportAsWordOrPdf(ExportType.WORD);
		
		mLog.debug("End exportProjectAsWord()");
		
		return lListFile;
	}
	
	private static List<File> exportAsWordOrPdf(ExportType pExportType) {

		mLog.debug("Start exportAsWordOrPdf(ExportType)");
		
		// create File list
		List<File> lListFile = new ArrayList<File>();
		
		// load project name
		ProjectDTO lProjectDTO = load();
		String lStrProjectName = lProjectDTO.getName();
		
		String pStrTimestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
		
		// novel
		lListFile.add(exportNovelAsWordOrPdf(getProjectExportFilePath(pExportType, "novel", pStrTimestamp, lStrProjectName), pExportType, lStrProjectName));
		
		// project
		lListFile.add(exportProjectAsWordOrPdf(getProjectExportFilePath(pExportType, "project", pStrTimestamp, lStrProjectName), pExportType, lStrProjectName));
		
		mLog.debug("End exportAsWordOrPdf(ExportType)");
		
		return lListFile;
	}
	
	private static File exportProjectAsWordOrPdf(String pStrFilePath, ExportType pExportType, String pStrProjectName) {
		
		mLog.debug("Start exportProjectAsWordOrPdf(IExporter, ExportType, String)");
		
		// init exporter
		IExporter lExporter = new ITextExporter(pExportType);
		lExporter.init(pStrFilePath, RichTextEditorSettingsManager.load()); 
		
		// first page with title
		exportFirstPageProjectName(pStrProjectName, lExporter);
		
		// first page with subtitle
		exportFirstPageProjectNameSubtitle(lExporter);
		
		//architecture
		exportArchitectureAsWordOrPdf(lExporter);
		
		//strands
		exportStrandsAsWordOrPdf(lExporter);
		
		// main characters
		exportMainCharactersAsWordOrPdf(lExporter);
		
		//secondary characters
		exportSecondaryCharactersAsWordOrPdf(lExporter);
		
		//locations
		exportLocationsAsWordOrPdf(lExporter);
		
		//chapters reasons
		exportChaptersReasons(lExporter);
						
		// write file
		File lFile = lExporter.end();
		
		mLog.debug("End exportProjectAsWordOrPdf(IExporter, ExportType, String)");
		
		return lFile;
	}

	private static void exportFirstPageProjectNameSubtitle(IExporter pExporter) {
		
		mLog.debug("Start exportFirstPageProjectName(String, IExporter)");
		
		pExporter.startParagraph(ParagraphAligment.CENTER);
		TextFormatting lTextFormatting = new TextFormatting();
		lTextFormatting.bold = true;
		pExporter.addText(ResourceBundleManager.getString("com.bibisco.manager.projectManager.export.project.subtitle"), lTextFormatting);
		pExporter.endParagraph();
		
		mLog.debug("End exportFirstPageProjectName(String, IExporter)");
		
	}

	private static void exportFirstPageProjectName(String pStrProjectName, IExporter pExporter) {
		
		mLog.debug("Start exportFirstPageProjectName(String, IExporter)");
		
		pExporter.addEmptyLines(14);
		pExporter.startParagraph(ParagraphAligment.CENTER);
		TextFormatting lTextFormatting = new TextFormatting();
		lTextFormatting.bold = true;
		pExporter.addText(pStrProjectName, lTextFormatting);
		pExporter.endParagraph();
		
		mLog.debug("End exportFirstPageProjectName(String, IExporter)");
	}
	
	private static void exportChaptersReasons(IExporter pExporter) {
		
		mLog.debug("Start exportChaptersReasons(IExporter)");
		
		List<ChapterDTO> lListChapters = ChapterManager.loadAll();
		
		if (lListChapters == null || lListChapters.size()==0) {
			return;
		}
				
		pExporter.startChapter(ResourceBundleManager.getString("com.bibisco.manager.projectManager.chapter.reasons"));
		for (ChapterDTO lChapterDTO : lListChapters) {
			ChapterDTO lChapterDTOWithBlobs = ChapterManager.load(lChapterDTO.getIdChapter());
			pExporter.startSection(lChapterDTOWithBlobs.getTitle());
			if (StringUtils.isNotBlank(lChapterDTOWithBlobs.getReason())) {
				HTMLParser.parse(lChapterDTOWithBlobs.getReason(), pExporter);
			}
			pExporter.endSection();
		}
		pExporter.endChapter();
		
		mLog.debug("End exportChaptersReasons(IExporter)");
		
	}

	private static void exportMainCharactersAsWordOrPdf(IExporter pExporter) {
		
		mLog.debug("Start exportMainCharactersAsWordOrPdf(IExporter)");
		
		List<CharacterDTO> lListMainCharacters = CharacterManager.loadMainCharacters();
		
		if (lListMainCharacters == null || lListMainCharacters.size()==0) {
			return;
		}
		
		pExporter.startChapter(ResourceBundleManager.getString("com.bibisco.manager.projectManager.mainCharacters"));
		for (CharacterDTO lCharacterDTO : lListMainCharacters) {
			MainCharacterDTO lMainCharacterDTO = CharacterManager.loadMainCharacter(lCharacterDTO.getIdCharacter());
			pExporter.startSection(lMainCharacterDTO.getName());
			addCharacterInfoQuestions(pExporter, lCharacterDTO);
			addCharacterInfoWithoutQuestions(pExporter, lCharacterDTO);
			pExporter.endSection();
		}
		pExporter.endChapter();
		
		mLog.debug("End exportMainCharactersAsWordOrPdf(IExporter)");
		
	}

	private static void addCharacterInfoWithoutQuestions(IExporter pExporter, CharacterDTO pCharacterDTO) {
		for (CharacterInfoWithoutQuestions lCharacterInfoWithoutQuestions : CharacterInfoWithoutQuestions.values()) {
			pExporter.startSubSection(ResourceBundleManager.getString("com.bibisco.manager.projectManager."+lCharacterInfoWithoutQuestions));
			CharacterInfoWithoutQuestionsDTO lCharacterInfoWithoutQuestionsDTO = CharacterManager.loadCharacterInfoWithoutQuestions(lCharacterInfoWithoutQuestions, pCharacterDTO.getIdCharacter());
			
			if (StringUtils.isNotBlank(lCharacterInfoWithoutQuestionsDTO.getInfo())) {
				HTMLParser.parse(lCharacterInfoWithoutQuestionsDTO.getInfo(), pExporter);
			}
			
			pExporter.endSubSection();
		} 
		
	}

	private static void addCharacterInfoQuestions(IExporter pExporter, CharacterDTO pCharacterDTO) {
		
		for (CharacterInfoQuestions lCharacterInfoQuestions : CharacterInfoQuestions.values()) {
			pExporter.startSubSection(ResourceBundleManager.getString("com.bibisco.manager.projectManager."+lCharacterInfoQuestions));
			CharacterInfoQuestionsDTO lCharacterInfoQuestionsDTO = CharacterManager.loadCharacterInfoQuestions(lCharacterInfoQuestions, pCharacterDTO.getIdCharacter());
			
			if (lCharacterInfoQuestionsDTO.getInterviewMode().booleanValue()) {
				for (int i = 0; i < lCharacterInfoQuestions.getQuestionList().size(); i++) {
					pExporter.startParagraph(ParagraphAligment.JUSTIFY);
					TextFormatting lTextFormatting = new TextFormatting();
					lTextFormatting.bold = true;
					lTextFormatting.italic = true;
					pExporter.addText(lCharacterInfoQuestions.getQuestionList().get(i), lTextFormatting);
					pExporter.endParagraph();
					String lStrAnswer = lCharacterInfoQuestionsDTO.getAnswerList().get(i);
					if (StringUtils.isNotBlank(lStrAnswer)) {
						HTMLParser.parse(lStrAnswer, pExporter);
					}
				}
			} else {
				String lStrAnswer = lCharacterInfoQuestionsDTO.getFreeText();
				if (StringUtils.isNotBlank(lStrAnswer)) {
					HTMLParser.parse(lStrAnswer, pExporter);
				}
			}
			
			pExporter.endSubSection();
		} 
	}

	private static void exportLocationsAsWordOrPdf(IExporter pExporter) {
		
		mLog.debug("Start exportLocationsAsWordOrPdf(IExporter)");
		
		List<LocationDTO> lListLocations = LocationManager.loadAll();
		
		if (lListLocations == null || lListLocations.size()==0) {
			return;
		}
		
		pExporter.startChapter(ResourceBundleManager.getString("com.bibisco.manager.projectManager.locations"));
		for (LocationDTO lLocationDTO : lListLocations) {
			LocationDTO lLocationDTOWithBlobs = LocationManager.load(lLocationDTO.getIdLocation());
			pExporter.startSection(lLocationDTOWithBlobs.getFullyQualifiedArea() + ", " + lLocationDTOWithBlobs.getName());
			if (StringUtils.isNotBlank(lLocationDTOWithBlobs.getDescription())) {
				HTMLParser.parse(lLocationDTOWithBlobs.getDescription(), pExporter);
			}
			pExporter.endSection();
		}
		pExporter.endChapter();
		
		mLog.debug("End exportLocationsAsWordOrPdf(IExporter)");
	
	}

	private static void exportArchitectureAsWordOrPdf(IExporter pExporter) {
		
		mLog.debug("Start exportArchitectureAsWordOrPdf(IExporter)");
		
		pExporter.startChapter(ResourceBundleManager.getString("com.bibisco.manager.projectManager.architecture"));
		
		// premise
		ArchitectureItem lArchitectureItemPremise =  ArchitectureItemManager.load(ArchitectureItemType.PREMISE);
		pExporter.startSection(ResourceBundleManager.getString("com.bibisco.manager.projectManager.premise"));
		if (StringUtils.isNotBlank(lArchitectureItemPremise.getText())) {
			HTMLParser.parse(lArchitectureItemPremise.getText(), pExporter);
		}
		pExporter.endSection();
		
		// setting
		ArchitectureItem lArchitectureItemSetting =  ArchitectureItemManager.load(ArchitectureItemType.SETTING);
		pExporter.startSection(ResourceBundleManager.getString("com.bibisco.manager.projectManager.setting"));
		if (StringUtils.isNotBlank(lArchitectureItemSetting.getText())) {
			HTMLParser.parse(lArchitectureItemSetting.getText(), pExporter);
		}
		pExporter.endSection();
		
		// fabula
		ArchitectureItem lArchitectureItemFabula =  ArchitectureItemManager.load(ArchitectureItemType.FABULA);
		pExporter.startSection(ResourceBundleManager.getString("com.bibisco.manager.projectManager.fabula"));
		if (StringUtils.isNotBlank(lArchitectureItemFabula.getText())) {
			HTMLParser.parse(lArchitectureItemFabula.getText(), pExporter);
		}
		pExporter.endSection();
		
		pExporter.endChapter();
		
		mLog.debug("End exportArchitectureAsWordOrPdf(IExporter)");
	}
	
	private static void exportStrandsAsWordOrPdf(IExporter pExporter) {
		
		mLog.debug("Start exportStrandsAsWordOrPdf(IExporter)");
		
		List<StrandDTO> lListStrands = StrandManager.loadAll();
		
		if (lListStrands == null || lListStrands.size()==0) {
			return;
		}
		
		pExporter.startChapter(ResourceBundleManager.getString("com.bibisco.manager.projectManager.strands"));
		for (StrandDTO lStrandDTO : lListStrands) {
			StrandDTO lStrandDTOWithBlobs = StrandManager.load(lStrandDTO.getIdStrand());
			pExporter.startSection(lStrandDTOWithBlobs.getName());
			if (StringUtils.isNotBlank(lStrandDTOWithBlobs.getDescription())) {
				HTMLParser.parse(lStrandDTOWithBlobs.getDescription(), pExporter);
			}
			pExporter.endSection();
		}
		pExporter.endChapter();
		
		mLog.debug("End exportStrandsAsWordOrPdf(IExporter)");
	}
	
	private static void exportSecondaryCharactersAsWordOrPdf(IExporter pExporter) {
		
		mLog.debug("Start exportSecondaryCharactersAsWordOrPdf(IExporter)");
		
		List<CharacterDTO> lListSecondaryCharacters = CharacterManager.loadSecondaryCharacters();
		
		if (lListSecondaryCharacters == null || lListSecondaryCharacters.size()==0) {
			return;
		}
		
		pExporter.startChapter(ResourceBundleManager.getString("com.bibisco.manager.projectManager.secondaryCharacters"));
		for (CharacterDTO lCharacterDTO : lListSecondaryCharacters) {
			SecondaryCharacterDTO lSecondaryCharacterDTO = CharacterManager.loadSecondaryCharacter(lCharacterDTO.getIdCharacter());
			pExporter.startSection(lSecondaryCharacterDTO.getName());
			if (StringUtils.isNotBlank(lSecondaryCharacterDTO.getDescription())) {
				HTMLParser.parse(lSecondaryCharacterDTO.getDescription(), pExporter);
			}
			pExporter.endSection();
		}
		pExporter.endChapter();
		
		mLog.debug("End exportSecondaryCharactersAsWordOrPdf(IExporter)");
		
		
	}

	private static File exportNovelAsWordOrPdf(String pStrFilePath, ExportType pExportType, String pStrProjectName) {

		mLog.debug("Start exportNovelAsWordOrPdf(IExporter, ExportType)");
		
		// init exporter
		IExporter lExporter = new ITextExporter(pExportType);
		lExporter.init(pStrFilePath, RichTextEditorSettingsManager.load()); 
		
		// first page
		exportFirstPageProjectName(pStrProjectName, lExporter);
		
		// get all selected scenes
		List<VSelectedSceneRevisions> lListVSelectedSceneRevisions = getAllSelectedScenes();
		
		// cycle on scenes
		String lStrLastChapterTitle = null;
		for (VSelectedSceneRevisions lVSelectedSceneRevisions : lListVSelectedSceneRevisions) {
			if (!lVSelectedSceneRevisions.getChapterTitle().equals(lStrLastChapterTitle)) {
				
				if (lStrLastChapterTitle!=null) {
					// close last chapter
					lExporter.endChapter();
				}
				
				// start new chapter
				lStrLastChapterTitle = lVSelectedSceneRevisions.getChapterTitle();
				lExporter.startChapter(lVSelectedSceneRevisions.getChapterTitle());
			}
			
			// add scene
			if (StringUtils.isNotBlank(lVSelectedSceneRevisions.getScene())) {
				HTMLParser.parse(lVSelectedSceneRevisions.getScene(), lExporter);
				// add empty line after scene
				lExporter.addEmptyLines(1);
			}
		}
		
		// close last chapter
		if (lStrLastChapterTitle!=null) {
			// close last chapter
			lExporter.endChapter();
		}
		
		// write file
		File lFile = lExporter.end();
		
		mLog.debug("End exportNovelAsWordOrPdf(IExporter, ExportType)");
		
		return lFile;
	}

	private static List<VSelectedSceneRevisions> getAllSelectedScenes() {
		
		List<VSelectedSceneRevisions> lListVSelectedSceneRevisions = null;
		
		mLog.debug("Start getAllSelectedScenes()");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		
		try {
			VSelectedSceneRevisionsMapper lVSelectedSceneRevisionsMapper = lSqlSession.getMapper(VSelectedSceneRevisionsMapper.class);
			VSelectedSceneRevisionsExample lVSelectedSceneRevisionsExample = new VSelectedSceneRevisionsExample();
			lVSelectedSceneRevisionsExample.setOrderByClause("chapter_position, scene_position");
			lListVSelectedSceneRevisions = lVSelectedSceneRevisionsMapper.selectByExampleWithBLOBs(lVSelectedSceneRevisionsExample);
		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End getAllSelectedScenes()");
		
		return lListVSelectedSceneRevisions;
	}
	
	public static ProjectDTO importProject(ImportProjectArchiveDTO pImportProjectArchiveDTO) {

		ProjectDTO lProjectDTO = null;

		mLog.debug("Start exportProject(String)");
		
		// validate preconditions
		Validate.notNull(pImportProjectArchiveDTO, "ImportProjectArchiveDTO cannot be null");
		Validate.notNull(pImportProjectArchiveDTO.getIdProject(), "id project cannot be null");
		Validate.notEmpty(pImportProjectArchiveDTO.getProjectName(), "project name cannot be null");
		Validate.isTrue(pImportProjectArchiveDTO.isArchiveFileValid());
		
		try {
			
			ContextManager lContextManager = ContextManager.getInstance();
			
			// get temp directory
			String lStrTempDirectory = lContextManager.getTempDirectoryPath();
			
			// if there is already a directory for the project, delete it	
			if (pImportProjectArchiveDTO.isAlreadyPresent()) {
				FileUtils.deleteDirectory(new File(getDBProjectDirectory(pImportProjectArchiveDTO.getIdProject())));
			}
			
			// copy files to db project directory
			FileUtils.copyDirectoryToDirectory(new File(lStrTempDirectory + pImportProjectArchiveDTO.getIdProject()), 
					new File(getProjectsDirectory()));
			    
			// set project name to context
	    	ContextManager.getInstance().setIdProject(pImportProjectArchiveDTO.getIdProject());
	    	
	    	// check if project is created with previous version of bibisco and update it
	    	checkProjectVersionAndUpdateIfNecessary(pImportProjectArchiveDTO.getIdProject());
	    	
	    	// load project
	    	lProjectDTO = load();
	    		
	    	// set language to context
			ContextManager.getInstance().setProjectLanguage(lProjectDTO.getLanguage());
	    	
			// if not exists, insert project into bibisco db
	    	if (!pImportProjectArchiveDTO.isAlreadyPresent()) {
	    		insertIntoBibiscoDB(lProjectDTO);
	    	}
	    	
	    	// delete temp directory content
			FileUtils.cleanDirectory(new File(lStrTempDirectory));

		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.IO_EXCEPTION);
		}

		mLog.debug("End exportProject(String)");

		return lProjectDTO;
	}
	
	
	private static void zipIt(String zipFile) {
		
		mLog.debug("Start zipIt(String)");
		
		ContextManager lContextManager = ContextManager.getInstance();
		
		String lStrDBDirectoryPath = lContextManager.getDbDirectoryPath();
		String lStrDbProjectDirectory = getDBProjectDirectory(lContextManager.getIdProject());
		List<String> lFileList = getDirectoryFileList(new File(lStrDbProjectDirectory));
		
		try {
			File lFile = new File(zipFile);
			
			lFile.createNewFile();
			FileOutputStream lFileOutputStream = new FileOutputStream(lFile);
			ZipOutputStream lZipOutputStream = new ZipOutputStream(lFileOutputStream);
		
			byte[] buffer = new byte[1024];
			for (String lStrFile : lFileList) {

				ZipEntry lZipEntry = new ZipEntry(lStrFile.substring(lStrDBDirectoryPath.length(), lStrFile.length()));
				lZipOutputStream.putNextEntry(lZipEntry);

				FileInputStream lFileInputStream = new FileInputStream(lStrFile);

				int lIntLen;
				while ((lIntLen = lFileInputStream.read(buffer)) > 0) {
					lZipOutputStream.write(buffer, 0, lIntLen);
				}

				lFileInputStream.close();
			}

			lZipOutputStream.closeEntry();
			lZipOutputStream.close();

			mLog.debug("Folder successfully compressed");
		} catch (IOException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.IO_EXCEPTION);
		}
		
		mLog.debug("End zipIt(String)");
	}
	
	private static List<String> getDirectoryFileList(File pFileNode) {

		List<String> lFileList = new ArrayList<String>();

		// add file only
		if (pFileNode.isFile()) {
			lFileList.add(pFileNode.toString());

		}

		if (pFileNode.isDirectory()) {
			String[] lStrSubNodes = pFileNode.list();
			if (lStrSubNodes != null && lStrSubNodes.length > 0) {
				for (String filename : lStrSubNodes) {
					lFileList.addAll(getDirectoryFileList(new File(pFileNode, filename)));
				}
			}
		}
		
		return lFileList;
	}

	public static ImportProjectArchiveDTO importProjectArchiveFile(String pStrFileName, byte[] pBytes) {
		
		ImportProjectArchiveDTO lImportProjectArchiveDTO = null;
		
		mLog.debug("Start importProjectArchiveFile(String, byte[])");
		
		// validate preconditions
		Validate.notEmpty(pStrFileName, "file name cannot be null");
		Validate.notNull(pBytes, "byte array cannot be null");
		
		try {
			
			ContextManager lContextManager = ContextManager.getInstance();
			
			// get temp directory
			String lStrTempDirectory = lContextManager.getTempDirectoryPath();
			
			// delete temp directory content
			FileUtils.cleanDirectory(new File(lStrTempDirectory));
			
			// get archive file path
			String lStrFilePath = lStrTempDirectory + pStrFileName;
			
			// copy archive file to temp directory
			File lFile = new File(lStrFilePath);
			lFile.createNewFile();
			FileOutputStream lFileOutputStream = new FileOutputStream(lFile);
			lFileOutputStream.write(pBytes);
			lFileOutputStream.close();
			
			// unzip archive file
			unZipIt(lStrFilePath);
			
			// check if file archive is valid and if project already exist in bibisco installation
			lImportProjectArchiveDTO = checkImportProjectArchive();
			
		} catch (Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.IO_EXCEPTION);
		} 
		
		mLog.debug("End importProjectArchiveFile(String, byte[])");
		
		return lImportProjectArchiveDTO;
		
	}
	
	
	private static ImportProjectArchiveDTO checkImportProjectArchive() {

		ImportProjectArchiveDTO lImportProjectArchiveDTO = null;
		
		mLog.debug("Start checkIfProjectAlreadyExists(String)");
		
		String lStrIdProject = null;
		File[] lFiles = new File(ContextManager.getInstance().getTempDirectoryPath()).listFiles();
	    
		// search file with extensions h2.db
		boolean lBlnIsProjectValid = false;
		if(lFiles!=null) { 
	        for(File lFile: lFiles) {
	        	if (lFile.isDirectory()) {
	        		lStrIdProject = lFile.getName();
	        		lBlnIsProjectValid = lStrIdProject.matches("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}");
	        		if (lBlnIsProjectValid) {
	        			break;
	        		}
	        	}
	        }
	    }
	    
		// check if project exists
		Projects lProjects = null;
		if (lBlnIsProjectValid) {
			SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
	    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
	    	try {
				ProjectsMapper lProjectsMapper = lSqlSession.getMapper(ProjectsMapper.class);
				lProjects = lProjectsMapper.selectByPrimaryKey(lStrIdProject);
				
	    	} catch(Throwable t) {
				mLog.error(t);
				throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
			} finally {
				lSqlSession.close();
			}
		}
			    
    	// create ImportProjectArchiveDTO
    	lImportProjectArchiveDTO = new ImportProjectArchiveDTO();
    	if (lBlnIsProjectValid) {
    		lImportProjectArchiveDTO.setArchiveFileValid(true);
    		lImportProjectArchiveDTO.setIdProject(lStrIdProject);
    		if (lProjects != null) {
        		lImportProjectArchiveDTO.setAlreadyPresent(true);
        		lImportProjectArchiveDTO.setProjectName(lProjects.getName());
        	} else {
        		lImportProjectArchiveDTO.setAlreadyPresent(false);
        	}
    	} else {
    		lImportProjectArchiveDTO.setArchiveFileValid(false);
    	}
    	
		
		mLog.debug("End checkIfProjectAlreadyExists(String): alreadyPresent "+ lImportProjectArchiveDTO.isAlreadyPresent());
		
		return lImportProjectArchiveDTO;
	}

	private static void unZipIt(String pStrZipFile) {

		mLog.debug("Start unZipIt(String)");

		try {
			// get temp directory path
			String lStrTempDirectory = ContextManager.getInstance().getTempDirectoryPath();

			// get the zip file content
			ZipInputStream lZipInputStream = new ZipInputStream(new FileInputStream(pStrZipFile));
			
			// get the zipped file list entry
			ZipEntry lZipEntry = lZipInputStream.getNextEntry();

			while (lZipEntry != null) {

				String lStrFileName = lZipEntry.getName();
				File lFileZipEntry = new File(lStrTempDirectory + File.separator + lStrFileName);

				// create all non exists folders
				new File(lFileZipEntry.getParent()).mkdirs();

				FileOutputStream lFileOutputStream = new FileOutputStream(lFileZipEntry);

				byte[] buffer = new byte[1024];
				int lIntLen;
				while ((lIntLen = lZipInputStream.read(buffer)) > 0) {
					lFileOutputStream.write(buffer, 0, lIntLen);
				}

				lFileOutputStream.close();
				lZipEntry = lZipInputStream.getNextEntry();
			}

			lZipInputStream.closeEntry();
			lZipInputStream.close();

		} catch (IOException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.IO_EXCEPTION);
		}

		mLog.debug("End unZipIt(String)");
	}    
	
	public static void deleteDirectoryContent(File pFileDirectory, boolean pBlnDeleteDirectory) {
	    File[] lFiles = pFileDirectory.listFiles();
	    if(lFiles!=null) { //some JVMs return null for empty dirs
	        for(File lFile: lFiles) {
	            if(lFile.isDirectory()) {
	            	deleteDirectoryContent(lFile, true);
	            } else {
	                lFile.delete();
	            }
	        }
	    }
	    
	    if (pBlnDeleteDirectory) {
	    	pFileDirectory.delete();
	    } 
	    
	}

	public static void exit() {
		mLog.debug("Start exit()");
		
		SqlSessionFactoryManager.getInstance().cleanSqlSessionFactoryProject();
		
		mLog.debug("End exit()");
	}

	public static void save(ProjectDTO pProjectDTO) {
		
		mLog.debug("Start save(ProjectDTO)");
		
		// validate preconditions
		Validate.notNull(pProjectDTO, "argument ProjectDTO cannot be null");
		Validate.notEmpty(pProjectDTO.getIdProject(), "argument ProjectDTO.idProject cannot be empty");

		
		// open session in bibisco db
		SqlSessionFactory lSqlSessionFactoryBibisco = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
    	SqlSession lSqlSessionBibisco = lSqlSessionFactoryBibisco.openSession();
    	
    	// open session in project db
    	SqlSessionFactory lSqlSessionFactoryProject = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSessionProject = lSqlSessionFactoryProject.openSession();
    	
    	try {
    		
    		Projects lProjects = new Projects();
    		lProjects.setIdProject(ContextManager.getInstance().getIdProject());
    		lProjects.setName(pProjectDTO.getName());
    		
    		ProjectsMapper lProjectsMapper = lSqlSessionBibisco.getMapper(ProjectsMapper.class);
    		lProjectsMapper.updateByPrimaryKey(lProjects);
    		
    		ProjectWithBLOBs lProjectWithBLOBs = new ProjectWithBLOBs();
    		lProjectWithBLOBs.setIdProject(ContextManager.getInstance().getIdProject());
    		lProjectWithBLOBs.setName(pProjectDTO.getName());
    		
    		ProjectMapper lProjectMapper = lSqlSessionProject.getMapper(ProjectMapper.class);
    		lProjectMapper.updateByPrimaryKeySelective(lProjectWithBLOBs);
    		
    		lSqlSessionBibisco.commit();
    		lSqlSessionProject.commit();
		
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSessionBibisco.rollback();
			lSqlSessionProject.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSessionBibisco.close();
			lSqlSessionProject.close();
		}
		
    	mLog.debug("End save(ProjectDTO)");
	}
	
	public static boolean isProjectsDirectoryEmpty() {
		
		boolean lBlnResult;
		
		mLog.debug("Start isProjectsDirectoryEmpty()");
		lBlnResult = StringUtils.isBlank(PropertiesManager.getInstance().getProperty("projectsDirectory"));
		mLog.debug("End isProjectsDirectoryEmpty(): return " + lBlnResult);
		
		return lBlnResult;
	}
	
	public static boolean projectsDirectoryExists() {
		
		boolean lBlnResult = false;
		
		mLog.debug("Start doesProjectsDirectoryExists()");
		if (!isProjectsDirectoryEmpty()) {
			File lFile = new File(getProjectsDirectory());
			lBlnResult = lFile.exists();
		}
		mLog.debug("End doesProjectsDirectoryExists(): return " + lBlnResult);
		
		return lBlnResult;
	}
	
	public static boolean projectExists(String pStrIdProject) {
		
		boolean lBlnResult = false;
		
		mLog.debug("Start doesProjectsDirectoryExists()");
		
		Validate.notEmpty(pStrIdProject, "Id project cannot be empty");
		
		if (!isProjectsDirectoryEmpty()) {
			StringBuilder lStringBuilder = new StringBuilder();
			lStringBuilder.append(getProjectsDirectory());
			lStringBuilder.append(pStrIdProject);
			lStringBuilder.append(ContextManager.getPathSeparator());
			lStringBuilder.append(pStrIdProject);
			lStringBuilder.append(".h2.db");
			
			File lFile = new File(lStringBuilder.toString());
			lBlnResult = lFile.exists();
		}
		mLog.debug("End doesProjectsDirectoryExists(): return " + lBlnResult);
		
		return lBlnResult;
	}
	
	public static String getProjectsDirectory() {
		
		String lStrProjectsDirectory;
		
		mLog.debug("Start getProjectsDirectory()");
		
		lStrProjectsDirectory = PropertiesManager.getInstance().getProperty("projectsDirectory");
		StringBuilder lStringBuilder = new StringBuilder();
		lStringBuilder.append(lStrProjectsDirectory);
		lStringBuilder.append(ContextManager.getPathSeparator());
		lStringBuilder.append(INTERNAL_BIBISCO_PROJECTS_DB_DIR);
		lStringBuilder.append(ContextManager.getPathSeparator());
		
		mLog.debug("End getProjectsDirectory()");
		
		return lStringBuilder.toString();
	}
	
	public static void setProjectsDirectory(String pStrProjectsDirectory) {
		
		mLog.debug("Start setProjectsDirectory(", pStrProjectsDirectory , ")");
		
		// validate preconditions
		Validate.notEmpty(pStrProjectsDirectory, "projects directory cannot be empty");
		Validate.isTrue(new File(pStrProjectsDirectory).exists(), "projects directory not exists");
		
		// update property
		PropertiesManager.getInstance().updateProperty("projectsDirectory", pStrProjectsDirectory);
		
		// import projects from project directory
		int lIntImportedProjects = importProjectsFromProjectsDirectory();
		
		mLog.info("Set project directory: ", pStrProjectsDirectory, " - " + lIntImportedProjects, " imported projects.");
		
		mLog.debug("End setProjectsDirectory(", pStrProjectsDirectory , ")");
	}
	
	public static int importProjectsFromProjectsDirectory() {
		
		int lIntResult = 0;
		
		mLog.debug("Start importProjectsFromProjectsDirectory()");
		
		// validate preconditions
		Validate.notEmpty(getProjectsDirectory(), "projects directory cannot be empty");
		Validate.isTrue(projectsDirectoryExists(), "projects directory not exists");
		
		File[] lFiles = new File(getProjectsDirectory()).listFiles();
	    
		// search file with extensions h2.db
		boolean lBlnIsProjectValid = false;
		if(lFiles!=null) { 
	        for(File lFile: lFiles) {
	        	if (lFile.isDirectory()) {
	        		String lStrIdProject = lFile.getName();
	        		lBlnIsProjectValid = lStrIdProject.matches("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}");
	        		if (lBlnIsProjectValid) {
	        			
	        			// set project name to context
	        	    	ContextManager.getInstance().setIdProject(lStrIdProject);
	        	    	
	        	    	// check if project is created with previous version of bibisco and update it
	        	    	checkProjectVersionAndUpdateIfNecessary(lStrIdProject);
	        	    	
	        	    	// load project
	        	    	ProjectDTO lProjectDTO = load();
	        			
	        			//import project into bibisco db
	        			insertIntoBibiscoDB(lProjectDTO);
	        			
	        			//increment counter
	        			lIntResult++;
	        		}
	        	}
	        }
	    }
		
		mLog.debug("End importProjectsFromProjectsDirectory(), imported projects: " + lIntResult);
		
		return lIntResult;
	}
	
	private static void checkProjectVersionAndUpdateIfNecessary(String pStrIdProject) {

		mLog.debug("Start checkProjectVersionAndUpdateIfNecessary(String)");

		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			ProjectMapper lProjectMapper = lSqlSession.getMapper(ProjectMapper.class);
			String lStrBibiscoVersion = lProjectMapper.getProjectVersion(pStrIdProject);

			// update version if necessary
			if (VersionManager.compare(lStrBibiscoVersion, "1.1.0") == -1) {
				update_to_1_1_0(lSqlSession, lProjectMapper);
			}
			if (VersionManager.compare(lStrBibiscoVersion, "1.1.2") == -1) {
				update_to_1_1_2(lSqlSession, lProjectMapper);
			}
			if (VersionManager.compare(lStrBibiscoVersion, "1.2.0") == -1) {
				update_to_1_2_0(lSqlSession, lProjectMapper);
			}
			
			// update project version
			ProjectWithBLOBs lProjectWithBLOBs = new ProjectWithBLOBs();
			lProjectWithBLOBs.setIdProject(pStrIdProject);
			lProjectWithBLOBs.setBibiscoVersion(VersionManager.getInstance().getVersion());
			lProjectMapper.updateByPrimaryKeySelective(lProjectWithBLOBs);
			
			lSqlSession.commit();

		} catch (Throwable t) {
			lSqlSession.rollback();
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}

		mLog.debug("End checkProjectVersionAndUpdateIfNecessary(String)");
	}

	private static void update_to_1_1_0(SqlSession pSqlSession, ProjectMapper pProjectMapper) {
		
		mLog.debug("Start update_to_1_1_0(SqlSession, ProjectMapper");
		
		// run ddl script
		pProjectMapper.update_to_1_1_0();

		// update character and word count
		SceneRevisionsMapper lSceneRevisionsMapper = pSqlSession.getMapper(SceneRevisionsMapper.class);
		List<SceneRevisions> lListSceneRevisions = lSceneRevisionsMapper.selectByExampleWithBLOBs(new SceneRevisionsExample());
		if (lListSceneRevisions != null && lListSceneRevisions.size() > 0) {
			for (SceneRevisions lSceneRevisions : lListSceneRevisions) {
				String lStrSceneText = lSceneRevisions.getScene();
				CharacterWordCount lCharacterWordCount = TextEditorManager.getCharacterWordCount(lStrSceneText);
				lSceneRevisions.setCharacters(lCharacterWordCount.getCharacters());
				lSceneRevisions.setWords(lCharacterWordCount.getWords());
				lSceneRevisionsMapper.updateByPrimaryKey(lSceneRevisions);
			}
		}

		mLog.debug("End update_to_1_1_0(SqlSession, ProjectMapper");
	}
	
	private static void update_to_1_1_2(SqlSession pSqlSession, ProjectMapper pProjectMapper) {
		
		mLog.debug("Start update_to_1_1_2(SqlSession, ProjectMapper");
		
		// repair scenes' position
		ScenesMapper lScenesMapper = pSqlSession.getMapper(ScenesMapper.class);
		ScenesExample lScenesExample = new ScenesExample();
		lScenesExample.setOrderByClause("id_chapter, position, id_scene");
		List<Scenes> lListScenes = lScenesMapper.selectByExample(lScenesExample);
		
		Integer lIntLastChapter = null;
		int i=0;
		for (Scenes lScenes : lListScenes) {
			if (!lScenes.getIdChapter().equals(lIntLastChapter)) {
				lIntLastChapter = lScenes.getIdChapter();
				i=0;
			}
			lScenes.setPosition(++i);
			lScenesMapper.updateByPrimaryKey(lScenes);
		}
		
		
		// run ddl script
		pProjectMapper.update_to_1_1_2();


		mLog.debug("End update_to_1_1_2(SqlSession, ProjectMapper");
	}
	
	
	private static void update_to_1_2_0(SqlSession pSqlSession, ProjectMapper pProjectMapper) {
		
		mLog.debug("Start update_to_1_2_0(SqlSession, ProjectMapper");
		
		// run ddl script
		pProjectMapper.update_to_1_2_0();

		mLog.debug("End update_to_1_2_0(SqlSession, ProjectMapper");
	}
}
