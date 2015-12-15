/*
 * Copyright (C) 2014-2015 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.gnu.org/licenses/gpl-2.0.html
 *
 * but WITHOUT ANY WARRANTY. 
 * See the GNU General Public License for more details.
 * 
 */
package com.bibisco.test;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.json.JSONException;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.bibisco.bean.ArchitectureDTO;
import com.bibisco.bean.ChapterDTO;
import com.bibisco.bean.CharacterDTO;
import com.bibisco.bean.ImportProjectArchiveDTO;
import com.bibisco.bean.LocationDTO;
import com.bibisco.bean.ProjectDTO;
import com.bibisco.dao.client.ChaptersMapper;
import com.bibisco.dao.client.CharacterInfosMapper;
import com.bibisco.dao.client.CharactersMapper;
import com.bibisco.dao.client.LocationsMapper;
import com.bibisco.dao.client.ProjectMapper;
import com.bibisco.dao.client.ProjectsMapper;
import com.bibisco.dao.client.PropertiesMapper;
import com.bibisco.dao.client.SceneRevisionCharactersMapper;
import com.bibisco.dao.client.SceneRevisionStrandsMapper;
import com.bibisco.dao.client.SceneRevisionsMapper;
import com.bibisco.dao.client.ScenesMapper;
import com.bibisco.dao.client.StrandsMapper;
import com.bibisco.dao.model.ChaptersExample;
import com.bibisco.dao.model.ChaptersWithBLOBs;
import com.bibisco.dao.model.CharacterInfos;
import com.bibisco.dao.model.CharacterInfosExample;
import com.bibisco.dao.model.CharactersExample;
import com.bibisco.dao.model.CharactersWithBLOBs;
import com.bibisco.dao.model.Locations;
import com.bibisco.dao.model.LocationsExample;
import com.bibisco.dao.model.Project;
import com.bibisco.dao.model.ProjectExample;
import com.bibisco.dao.model.ProjectWithBLOBs;
import com.bibisco.dao.model.Projects;
import com.bibisco.dao.model.ProjectsExample;
import com.bibisco.dao.model.Properties;
import com.bibisco.dao.model.SceneRevisionCharactersExample;
import com.bibisco.dao.model.SceneRevisionCharactersKey;
import com.bibisco.dao.model.SceneRevisionStrandsExample;
import com.bibisco.dao.model.SceneRevisionStrandsKey;
import com.bibisco.dao.model.SceneRevisions;
import com.bibisco.dao.model.SceneRevisionsExample;
import com.bibisco.dao.model.Scenes;
import com.bibisco.dao.model.ScenesExample;
import com.bibisco.dao.model.Strands;
import com.bibisco.dao.model.StrandsExample;
import com.bibisco.enums.CharacterInfoQuestions;
import com.bibisco.enums.TaskStatus;
import com.bibisco.manager.ContextManager;
import com.bibisco.manager.LocaleManager;
import com.bibisco.manager.ProjectManager;
import com.bibisco.manager.PropertiesManager;
import com.bibisco.manager.VersionManager;

public class ProjectManagerTest {

	@Before 
	@After
	public void init() throws ConfigurationException, IOException {
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			Properties lProperties = new Properties();
			lProperties.setProperty("projectsDirectory");
			lProperties.setValue("C:/temp/bibisco/projects");
			lPropertiesMapper.updateByPrimaryKey(lProperties);	
			lSqlSession.commit();
    	} catch (Throwable t) {	
			lSqlSession.rollback();
    	} finally {
			lSqlSession.close();
		}
    	
    	PropertiesManager.getInstance().reload();	
	}
	
	@Test
	public void testIsProjectsDirectoryEmptyWithEmptyProjectsDirectory() {
		emptyProjectsDirectory();
		Assert.assertTrue(ProjectManager.isProjectsDirectoryEmpty());
	}
	
	@Test
	public void testIsProjectsDirectoryEmptyWithExistingProjectsDirectory() {
		Assert.assertFalse(ProjectManager.isProjectsDirectoryEmpty());
	}
	
	@Test
	public void testProjectsDirectoryExistsWithProjectsDirectoryEmpty() {
		emptyProjectsDirectory();
		Assert.assertEquals(ProjectManager.projectsDirectoryExists(), false);
	}
	
	@Test
	public void testProjectsDirectoryExistsWithWrongProjectsDirectory() {
		setNonExistentProjectDir();
    	
    	PropertiesManager.getInstance().reload();
		Assert.assertEquals(ProjectManager.projectsDirectoryExists(), false);
	}
	
	@Test
	public void testProjectExists() {
		Assert.assertTrue(ProjectManager.projectExists(AllTests.TEST_PROJECT_ID));
	}
	
	@Test
	public void testProjectExistsWithInexistentProject() {
		Assert.assertFalse(ProjectManager.projectExists("XXX"));
	}
	
	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
	public void testProjectExistsWithNullIdProject() {
		ProjectManager.projectExists(null);
	}
	
	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
	public void testProjectExistsWithEmptyIdProject() {
		ProjectManager.projectExists("");
	}
	
	@Test
	public void testProjectsDirectoryExistsWithCorrectProjectsDirectory() {
		Assert.assertTrue(ProjectManager.projectsDirectoryExists());
	}
	
	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
	public void testSetProjectsDirectoryWithEmptyDirectory() {
		ProjectManager.setProjectsDirectory(null);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testSetProjectsDirectoryWithNonExistingDirectory() {
		ProjectManager.setProjectsDirectory("C:\\Users\\AndreaDocuments\\");
	}
	
	@Test
	public void testSetProjectsDirectory() {
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			ProjectsMapper lProjectMapper = lSqlSession.getMapper(ProjectsMapper.class);
			lProjectMapper.deleteByExample(new ProjectsExample());
			lSqlSession.commit();
    	} finally {
			lSqlSession.close();
		}	
		
		ProjectManager.setProjectsDirectory("C:/temp/bibisco/projects");
		
    	lSqlSession = lSqlSessionFactory.openSession();
    	Properties lProperties;
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			lProperties = lPropertiesMapper.selectByPrimaryKey("projectsDirectory");
    	} finally {
			lSqlSession.close();
		}
    	
    	Assert.assertEquals(lProperties.getValue(), "C:/temp/bibisco/projects");
	}
	
	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
	public void testInsertProjectWithNullProjectDTO() {
		ProjectManager.insert(null);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testInsertProjectWithEmptyName() {
		ProjectDTO lProjectDTO = new ProjectDTO();
		lProjectDTO.setLanguage(LocaleManager.getInstance().getLocale().getLanguage());
		lProjectDTO.setBibiscoVersion(VersionManager.getInstance().getVersion());
		ProjectManager.insert(lProjectDTO);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testInsertProjectWithEmptyProjectsDirectory() {
		emptyProjectsDirectory();
		ProjectDTO lProjectDTO = new ProjectDTO();
		lProjectDTO.setLanguage(LocaleManager.getInstance().getLocale().getLanguage());
		lProjectDTO.setBibiscoVersion(VersionManager.getInstance().getVersion());
		ProjectManager.insert(lProjectDTO);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testInsertProjectWithEmptyLanguage() {
		ProjectDTO lProjectDTO = new ProjectDTO();
		lProjectDTO.setName("Test 1");
		lProjectDTO.setBibiscoVersion(VersionManager.getInstance().getVersion());
		ProjectManager.insert(lProjectDTO);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testInsertProjectWithEmptyBibiscoVersion() {
		ProjectDTO lProjectDTO = new ProjectDTO();
		lProjectDTO.setName("Test 1");
		lProjectDTO.setLanguage(LocaleManager.getInstance().getLocale().getLanguage());
		ProjectManager.insert(lProjectDTO);
	}
	
	private void setNonExistentProjectDir() {
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			Properties lProperties = new Properties();
			lProperties.setProperty("projectsDirectory");
			lProperties.setValue("C:/temp/bibiscotto/projects");
			lPropertiesMapper.updateByPrimaryKey(lProperties);	
			lSqlSession.commit();
    	} catch (Throwable t) {	
			lSqlSession.rollback();
    	} finally {
			lSqlSession.close();
		}
    	
    	PropertiesManager.getInstance().reload();
	}
	
	
	@Test
	public void testInsertProject() throws IOException {
		ProjectDTO lProjectDTO = new ProjectDTO();
		lProjectDTO.setName("Test Insert");
		lProjectDTO.setLanguage(LocaleManager.getInstance().getLocale().getLanguage());
		lProjectDTO.setBibiscoVersion(VersionManager.getInstance().getVersion());
		lProjectDTO = ProjectManager.insert(lProjectDTO);
		
		Assert.assertNotNull(lProjectDTO.getIdProject());
		Assert.assertEquals(lProjectDTO.getName(), "Test Insert");
		Assert.assertEquals(lProjectDTO.getLanguage(), LocaleManager.getInstance().getLocale().getLanguage());
		Assert.assertEquals(lProjectDTO.getBibiscoVersion(), VersionManager.getInstance().getVersion());
		Assert.assertNotNull(lProjectDTO.getArchitecture());
		Assert.assertEquals(lProjectDTO.getArchitecture().getPremiseTaskStatus(), TaskStatus.TODO);
		Assert.assertEquals(lProjectDTO.getArchitecture().getFabulaTaskStatus(), TaskStatus.TODO);
		Assert.assertEquals(lProjectDTO.getArchitecture().getSettingTaskStatus(), TaskStatus.TODO);
		Assert.assertNull(lProjectDTO.getArchitecture().getStrandList());
		Assert.assertNull(lProjectDTO.getChapterList());
		Assert.assertNull(lProjectDTO.getLocationList());
		Assert.assertNull(lProjectDTO.getMainCharacterList());
		Assert.assertNull(lProjectDTO.getSecondaryCharacterList());
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(lProjectDTO.getIdProject());
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		List<Project> lListProject;
		try {
			ProjectMapper lProjectMapper = lSqlSession.getMapper(ProjectMapper.class);
			ProjectExample lProjectExample = new ProjectExample();
			lProjectExample.createCriteria()
			.andNameEqualTo("Test Insert")
			.andLanguageEqualTo(LocaleManager.getInstance().getLocale().getLanguage())
			.andBibiscoVersionEqualTo(VersionManager.getInstance().getVersion());
			lListProject = lProjectMapper.selectByExample(lProjectExample);			
    	} finally {
			lSqlSession.close();
		}	
		Assert.assertEquals(lListProject.size(), 1);
		
		lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
		lSqlSession = lSqlSessionFactory.openSession();
		List<Projects> lListProjects;
		try {
			ProjectsMapper lProjectsMapper = lSqlSession.getMapper(ProjectsMapper.class);
			ProjectsExample lProjectsExample = new ProjectsExample();
			lProjectsExample.createCriteria()
			.andIdProjectEqualTo(lProjectDTO.getIdProject())
			.andNameEqualTo("Test Insert");
			lListProjects = lProjectsMapper.selectByExample(lProjectsExample);			
    	} finally {
			lSqlSession.close();
		}	
		Assert.assertEquals(lListProjects.size(), 1);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testImportProjectsFromProjectsDirectoryWithEmptyProjectsDirectory() {
		emptyProjectsDirectory();
		ProjectManager.importProjectsFromProjectsDirectory();
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testImportProjectsFromProjectsDirectoryWithWrongProjectsDirectory() {
		
		setNonExistentProjectDir();
    	
    	PropertiesManager.getInstance().reload();
		
		ProjectManager.importProjectsFromProjectsDirectory();
	}
	

	public void testImportProjectsFromProjectsDirectory() throws ConfigurationException, IOException, ParseException {
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			ProjectsMapper lProjectMapper = lSqlSession.getMapper(ProjectsMapper.class);
			lProjectMapper.deleteByExample(new ProjectsExample());
			lSqlSession.commit();
    	} finally {
			lSqlSession.close();
		}	
		
		int lIntResult = ProjectManager.importProjectsFromProjectsDirectory();
		Assert.assertEquals(3, lIntResult);
		
		List<Projects> lListProjects;
		lSqlSession = lSqlSessionFactory.openSession();
		try {
			ProjectsMapper lProjectMapper = lSqlSession.getMapper(ProjectsMapper.class);
			ProjectsExample lProjectsExample = new ProjectsExample();
			lProjectsExample.setOrderByClause("id_project");
			lListProjects = lProjectMapper.selectByExample(lProjectsExample);
    	} finally {
			lSqlSession.close();
		}	
		
		Assert.assertEquals(AllTests.TEST_PROJECT_ID, lListProjects.get(0).getIdProject());
		Assert.assertEquals(AllTests.TEST_PROJECT2_ID, lListProjects.get(1).getIdProject());
		Assert.assertEquals(AllTests.TEST_PROJECT3_ID, lListProjects.get(2).getIdProject());
		
		checkTestProjectDB();
		
		Project lProject;
		lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT2_ID);
		lSqlSession = lSqlSessionFactory.openSession();
		try {
			ProjectMapper lProjectMapper = lSqlSession.getMapper(ProjectMapper.class);
			lProject = lProjectMapper.selectByPrimaryKey(AllTests.TEST_PROJECT2_ID);
    	} finally {
			lSqlSession.close();
		}	
		Assert.assertEquals(AllTests.TEST_PROJECT2_ID, lProject.getIdProject());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getFabulaTaskStatus());
		Assert.assertEquals("1.3.0", lProject.getBibiscoVersion());
		Assert.assertEquals("en_US", lProject.getLanguage());
		Assert.assertEquals("Test 2", lProject.getName());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getPremiseTaskStatus());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getSettingTaskStatus());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getStrandTaskStatus());
		
		lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT3_ID);
		lSqlSession = lSqlSessionFactory.openSession();
		try {
			ProjectMapper lProjectMapper = lSqlSession.getMapper(ProjectMapper.class);
			lProject = lProjectMapper.selectByPrimaryKey(AllTests.TEST_PROJECT3_ID);
    	} finally {
			lSqlSession.close();
		}	
		Assert.assertEquals(AllTests.TEST_PROJECT3_ID, lProject.getIdProject());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getFabulaTaskStatus());
		Assert.assertEquals("1.3.0", lProject.getBibiscoVersion());
		Assert.assertEquals("en_US", lProject.getLanguage());
		Assert.assertEquals("Test 3 à è ì ç ù £ $ ! /", lProject.getName());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getPremiseTaskStatus());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getSettingTaskStatus());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getStrandTaskStatus());
		
	}
	
	public void emptyProjectsDirectory() {
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			
			Properties lProperties = new Properties();
			lProperties.setProperty("projectsDirectory");
			lProperties.setValue("");
			lPropertiesMapper.updateByPrimaryKey(lProperties);
			
			lSqlSession.commit();
    	} catch (Throwable t) {	
			lSqlSession.rollback();
    	} finally {
			lSqlSession.close();
		}
    	
    	PropertiesManager.getInstance().reload();
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testLoadProjectWithNullProjectId() {
		ProjectManager.load(null);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testLoadProjectWithEmptyProjectId() {
		ProjectManager.load("");
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testLoadProjectWithWrongProjectId() {
		ProjectManager.load("xxx");
	}
	
	@Test
	public void testLoadProject() throws JSONException {
		ProjectDTO lProjectDTO = ProjectManager.load(AllTests.TEST_PROJECT_ID);
		Assert.assertEquals(AllTests.TEST_PROJECT_ID, lProjectDTO.getIdProject());
		Assert.assertEquals("1.3.0", lProjectDTO.getBibiscoVersion());
		Assert.assertEquals("Test", lProjectDTO.getName());
		Assert.assertEquals("en_US", lProjectDTO.getLanguage());
		
		// ARCHITECTURE
		
		Assert.assertEquals(TaskStatus.TODO, lProjectDTO.getArchitecture().getFabulaTaskStatus());
		Assert.assertEquals(TaskStatus.TODO, lProjectDTO.getArchitecture().getPremiseTaskStatus());
		Assert.assertEquals(TaskStatus.TODO, lProjectDTO.getArchitecture().getSettingTaskStatus());
		Assert.assertEquals(3, lProjectDTO.getArchitecture().getStrandList().size());
		Assert.assertEquals("Strand 1", lProjectDTO.getArchitecture().getStrandList().get(0).getName());
		Assert.assertEquals(new Integer(1), lProjectDTO.getArchitecture().getStrandList().get(0).getPosition());
		Assert.assertEquals(TaskStatus.TODO, lProjectDTO.getArchitecture().getStrandList().get(0).getTaskStatus());
		Assert.assertEquals("<p>Strand 1</p>", lProjectDTO.getArchitecture().getStrandList().get(0).getDescription());
		Assert.assertEquals("Strand 2", lProjectDTO.getArchitecture().getStrandList().get(1).getName());
		Assert.assertEquals(new Integer(2), lProjectDTO.getArchitecture().getStrandList().get(1).getPosition());
		Assert.assertEquals(TaskStatus.TOCOMPLETE, lProjectDTO.getArchitecture().getStrandList().get(1).getTaskStatus());
		Assert.assertEquals("<p>Strand 2</p>", lProjectDTO.getArchitecture().getStrandList().get(1).getDescription());
		Assert.assertEquals("Strand 3", lProjectDTO.getArchitecture().getStrandList().get(2).getName());
		Assert.assertEquals(new Integer(3), lProjectDTO.getArchitecture().getStrandList().get(2).getPosition());
		Assert.assertEquals(TaskStatus.COMPLETED, lProjectDTO.getArchitecture().getStrandList().get(2).getTaskStatus());
		Assert.assertEquals("<p>Strand 3</p>", lProjectDTO.getArchitecture().getStrandList().get(2).getDescription());
		
		
		
		// CHAPTERS
		
		Assert.assertEquals(3, lProjectDTO.getChapterList().size());
		Assert.assertEquals(new Integer(1), lProjectDTO.getChapterList().get(0).getIdChapter());
		Assert.assertEquals(null, lProjectDTO.getChapterList().get(0).getNote());
		Assert.assertEquals(new Integer(1), lProjectDTO.getChapterList().get(0).getPosition());
		Assert.assertEquals("Chapter 1", lProjectDTO.getChapterList().get(0).getTitle());
		Assert.assertEquals(null, lProjectDTO.getChapterList().get(0).getReason());
		Assert.assertEquals(TaskStatus.TODO, lProjectDTO.getChapterList().get(0).getReasonTaskStatus());
		Assert.assertEquals(new Integer(1), (Integer) lProjectDTO.getChapterList().get(0).getWordCountTaskStatusAsJSONObject().get("idChapter"));
		Assert.assertEquals(new Integer(1), (Integer) lProjectDTO.getChapterList().get(0).getWordCountTaskStatusAsJSONObject().get("position"));
		Assert.assertEquals(TaskStatus.TOCOMPLETE, (TaskStatus) lProjectDTO.getChapterList().get(0).getWordCountTaskStatusAsJSONObject().get("taskStatus"));
		Assert.assertEquals(new Integer(13), (Integer) lProjectDTO.getChapterList().get(0).getWordCountTaskStatusAsJSONObject().get("wordCount"));
		Assert.assertEquals(new Integer(60), (Integer) lProjectDTO.getChapterList().get(0).getWordCountTaskStatusAsJSONObject().get("characterCount"));
		Assert.assertEquals(0, lProjectDTO.getChapterList().get(0).getSceneList().size());
		Assert.assertEquals(TaskStatus.TOCOMPLETE, lProjectDTO.getChapterList().get(0).getTaskStatus());
		Assert.assertEquals(new Integer(13), lProjectDTO.getChapterList().get(0).getWordCount());
		Assert.assertEquals(new Integer(60), lProjectDTO.getChapterList().get(0).getCharacterCount());
		
		Assert.assertEquals(new Integer(2), lProjectDTO.getChapterList().get(1).getIdChapter());
		Assert.assertEquals(null, lProjectDTO.getChapterList().get(1).getNote());
		Assert.assertEquals(new Integer(2), lProjectDTO.getChapterList().get(1).getPosition());
		Assert.assertEquals("Chapter 2", lProjectDTO.getChapterList().get(1).getTitle());
		Assert.assertEquals(null, lProjectDTO.getChapterList().get(1).getReason());
		Assert.assertEquals(TaskStatus.TOCOMPLETE, lProjectDTO.getChapterList().get(1).getReasonTaskStatus());
		Assert.assertEquals(new Integer(2), (Integer) lProjectDTO.getChapterList().get(1).getWordCountTaskStatusAsJSONObject().get("idChapter"));
		Assert.assertEquals(new Integer(2), (Integer) lProjectDTO.getChapterList().get(1).getWordCountTaskStatusAsJSONObject().get("position"));
		Assert.assertEquals(TaskStatus.TOCOMPLETE, (TaskStatus) lProjectDTO.getChapterList().get(1).getWordCountTaskStatusAsJSONObject().get("taskStatus"));
		Assert.assertEquals(new Integer(0), (Integer) lProjectDTO.getChapterList().get(1).getWordCountTaskStatusAsJSONObject().get("wordCount"));
		Assert.assertEquals(new Integer(0), (Integer) lProjectDTO.getChapterList().get(1).getWordCountTaskStatusAsJSONObject().get("characterCount"));
		Assert.assertEquals(0, lProjectDTO.getChapterList().get(1).getSceneList().size());
		Assert.assertEquals(TaskStatus.TOCOMPLETE, lProjectDTO.getChapterList().get(1).getTaskStatus());
		
		Assert.assertEquals(new Integer(3), lProjectDTO.getChapterList().get(2).getIdChapter());
		Assert.assertEquals(null, lProjectDTO.getChapterList().get(2).getNote());
		Assert.assertEquals(new Integer(3), lProjectDTO.getChapterList().get(2).getPosition());
		Assert.assertEquals("Chapter 3", lProjectDTO.getChapterList().get(2).getTitle());
		Assert.assertEquals(null, lProjectDTO.getChapterList().get(2).getReason());
		Assert.assertEquals(TaskStatus.COMPLETED, lProjectDTO.getChapterList().get(2).getReasonTaskStatus());
		Assert.assertEquals(new Integer(3), (Integer) lProjectDTO.getChapterList().get(2).getWordCountTaskStatusAsJSONObject().get("idChapter"));
		Assert.assertEquals(new Integer(3), (Integer) lProjectDTO.getChapterList().get(2).getWordCountTaskStatusAsJSONObject().get("position"));
		Assert.assertEquals(TaskStatus.TOCOMPLETE, (TaskStatus) lProjectDTO.getChapterList().get(2).getWordCountTaskStatusAsJSONObject().get("taskStatus"));
		Assert.assertEquals(new Integer(0), (Integer) lProjectDTO.getChapterList().get(2).getWordCountTaskStatusAsJSONObject().get("wordCount"));
		Assert.assertEquals(new Integer(0), (Integer) lProjectDTO.getChapterList().get(2).getWordCountTaskStatusAsJSONObject().get("characterCount"));
		Assert.assertEquals(0, lProjectDTO.getChapterList().get(2).getSceneList().size());
		Assert.assertEquals(TaskStatus.TOCOMPLETE, lProjectDTO.getChapterList().get(2).getTaskStatus());
		
		
		// LOCATIONS
		
		Assert.assertEquals(3, lProjectDTO.getLocationList().size());
		Assert.assertEquals("Nation 1, State 1, City 1 Location's name 1", lProjectDTO.getLocationList().get(0).getAnalysisChapterPresenceItemDescription());
		Assert.assertEquals("71", lProjectDTO.getLocationList().get(0).getAnalysisChapterPresenceItemId());
		Assert.assertEquals("City 1", lProjectDTO.getLocationList().get(0).getCity());
		Assert.assertEquals(null, lProjectDTO.getLocationList().get(0).getDescription());
		Assert.assertEquals("Nation 1, State 1, City 1", lProjectDTO.getLocationList().get(0).getFullyQualifiedArea());
		Assert.assertEquals(new Integer(71), lProjectDTO.getLocationList().get(0).getIdLocation());		
		Assert.assertEquals("Location's name 1", lProjectDTO.getLocationList().get(0).getName());
		Assert.assertEquals("Nation 1", lProjectDTO.getLocationList().get(0).getNation());
		Assert.assertEquals(new Integer(1), lProjectDTO.getLocationList().get(0).getPosition());
		Assert.assertEquals("State 1", lProjectDTO.getLocationList().get(0).getState());
		Assert.assertEquals(TaskStatus.TODO, lProjectDTO.getLocationList().get(0).getTaskStatus());
		
		Assert.assertEquals("Nation 2, State 2, City 2 Location's name 2", lProjectDTO.getLocationList().get(1).getAnalysisChapterPresenceItemDescription());
		Assert.assertEquals("72", lProjectDTO.getLocationList().get(1).getAnalysisChapterPresenceItemId());
		Assert.assertEquals("City 2", lProjectDTO.getLocationList().get(1).getCity());
		Assert.assertEquals(null, lProjectDTO.getLocationList().get(1).getDescription());
		Assert.assertEquals("Nation 2, State 2, City 2", lProjectDTO.getLocationList().get(1).getFullyQualifiedArea());
		Assert.assertEquals(new Integer(72), lProjectDTO.getLocationList().get(1).getIdLocation());		
		Assert.assertEquals("Location's name 2", lProjectDTO.getLocationList().get(1).getName());
		Assert.assertEquals("Nation 2", lProjectDTO.getLocationList().get(1).getNation());
		Assert.assertEquals(new Integer(2), lProjectDTO.getLocationList().get(1).getPosition());
		Assert.assertEquals("State 2", lProjectDTO.getLocationList().get(1).getState());
		Assert.assertEquals(TaskStatus.TOCOMPLETE, lProjectDTO.getLocationList().get(1).getTaskStatus());
		
		Assert.assertEquals("Nation 3, State 3, City 3 Location's name 3", lProjectDTO.getLocationList().get(2).getAnalysisChapterPresenceItemDescription());
		Assert.assertEquals("73", lProjectDTO.getLocationList().get(2).getAnalysisChapterPresenceItemId());
		Assert.assertEquals("City 3", lProjectDTO.getLocationList().get(2).getCity());
		Assert.assertEquals(null, lProjectDTO.getLocationList().get(2).getDescription());
		Assert.assertEquals("Nation 3, State 3, City 3", lProjectDTO.getLocationList().get(2).getFullyQualifiedArea());
		Assert.assertEquals(new Integer(73), lProjectDTO.getLocationList().get(2).getIdLocation());		
		Assert.assertEquals("Location's name 3", lProjectDTO.getLocationList().get(2).getName());
		Assert.assertEquals("Nation 3", lProjectDTO.getLocationList().get(2).getNation());
		Assert.assertEquals(new Integer(3), lProjectDTO.getLocationList().get(2).getPosition());
		Assert.assertEquals("State 3", lProjectDTO.getLocationList().get(2).getState());
		Assert.assertEquals(TaskStatus.COMPLETED, lProjectDTO.getLocationList().get(2).getTaskStatus());
		
		
		// MAIN CHARACTERS
		
		Assert.assertEquals(3, lProjectDTO.getMainCharacterList().size());
		Assert.assertEquals("Main character 1", lProjectDTO.getMainCharacterList().get(0).getAnalysisChapterPresenceItemDescription());
		Assert.assertEquals("67", lProjectDTO.getMainCharacterList().get(0).getAnalysisChapterPresenceItemId());
		Assert.assertEquals(new Integer(67), lProjectDTO.getMainCharacterList().get(0).getIdCharacter());
		Assert.assertEquals("Main character 1", lProjectDTO.getMainCharacterList().get(0).getName());
		Assert.assertEquals(new Integer(1), lProjectDTO.getMainCharacterList().get(0).getPosition());
		Assert.assertEquals(TaskStatus.TODO, lProjectDTO.getMainCharacterList().get(0).getTaskStatus());
		Assert.assertTrue(lProjectDTO.getMainCharacterList().get(0).isMainCharacter());
		
		Assert.assertEquals("Main character 2", lProjectDTO.getMainCharacterList().get(1).getAnalysisChapterPresenceItemDescription());
		Assert.assertEquals("68", lProjectDTO.getMainCharacterList().get(1).getAnalysisChapterPresenceItemId());
		Assert.assertEquals(new Integer(68), lProjectDTO.getMainCharacterList().get(1).getIdCharacter());
		Assert.assertEquals("Main character 2", lProjectDTO.getMainCharacterList().get(1).getName());
		Assert.assertEquals(new Integer(2), lProjectDTO.getMainCharacterList().get(1).getPosition());
		Assert.assertEquals(TaskStatus.TOCOMPLETE, lProjectDTO.getMainCharacterList().get(1).getTaskStatus());
		Assert.assertTrue(lProjectDTO.getMainCharacterList().get(1).isMainCharacter());
		
		Assert.assertEquals("Main character 3", lProjectDTO.getMainCharacterList().get(2).getAnalysisChapterPresenceItemDescription());
		Assert.assertEquals("69", lProjectDTO.getMainCharacterList().get(2).getAnalysisChapterPresenceItemId());
		Assert.assertEquals(new Integer(69), lProjectDTO.getMainCharacterList().get(2).getIdCharacter());
		Assert.assertEquals("Main character 3", lProjectDTO.getMainCharacterList().get(2).getName());
		Assert.assertEquals(new Integer(3), lProjectDTO.getMainCharacterList().get(2).getPosition());
		Assert.assertEquals(TaskStatus.COMPLETED, lProjectDTO.getMainCharacterList().get(2).getTaskStatus());
		Assert.assertTrue(lProjectDTO.getMainCharacterList().get(2).isMainCharacter());

		Assert.assertEquals(3, lProjectDTO.getSecondaryCharacterList().size());
		Assert.assertEquals("Secondary character 1", lProjectDTO.getSecondaryCharacterList().get(0).getAnalysisChapterPresenceItemDescription());
		Assert.assertEquals("70", lProjectDTO.getSecondaryCharacterList().get(0).getAnalysisChapterPresenceItemId());
		Assert.assertEquals(new Integer(70), lProjectDTO.getSecondaryCharacterList().get(0).getIdCharacter());
		Assert.assertEquals("Secondary character 1", lProjectDTO.getSecondaryCharacterList().get(0).getName());
		Assert.assertEquals(new Integer(1), lProjectDTO.getSecondaryCharacterList().get(0).getPosition());
		Assert.assertEquals(TaskStatus.TODO, lProjectDTO.getSecondaryCharacterList().get(0).getTaskStatus());
		Assert.assertFalse(lProjectDTO.getSecondaryCharacterList().get(0).isMainCharacter());
		
		Assert.assertEquals("Secondary character 2", lProjectDTO.getSecondaryCharacterList().get(1).getAnalysisChapterPresenceItemDescription());
		Assert.assertEquals("71", lProjectDTO.getSecondaryCharacterList().get(1).getAnalysisChapterPresenceItemId());
		Assert.assertEquals(new Integer(71), lProjectDTO.getSecondaryCharacterList().get(1).getIdCharacter());
		Assert.assertEquals("Secondary character 2", lProjectDTO.getSecondaryCharacterList().get(1).getName());
		Assert.assertEquals(new Integer(2), lProjectDTO.getSecondaryCharacterList().get(1).getPosition());
		Assert.assertEquals(TaskStatus.TOCOMPLETE, lProjectDTO.getSecondaryCharacterList().get(1).getTaskStatus());
		Assert.assertFalse(lProjectDTO.getSecondaryCharacterList().get(1).isMainCharacter());
		
		Assert.assertEquals("Secondary character 3", lProjectDTO.getSecondaryCharacterList().get(2).getAnalysisChapterPresenceItemDescription());
		Assert.assertEquals("72", lProjectDTO.getSecondaryCharacterList().get(2).getAnalysisChapterPresenceItemId());
		Assert.assertEquals(new Integer(72), lProjectDTO.getSecondaryCharacterList().get(2).getIdCharacter());
		Assert.assertEquals("Secondary character 3", lProjectDTO.getSecondaryCharacterList().get(2).getName());
		Assert.assertEquals(new Integer(3), lProjectDTO.getSecondaryCharacterList().get(2).getPosition());
		Assert.assertEquals(TaskStatus.COMPLETED, lProjectDTO.getSecondaryCharacterList().get(2).getTaskStatus());
		Assert.assertFalse(lProjectDTO.getSecondaryCharacterList().get(2).isMainCharacter());

	}
	
	@Test
	public void testLoadAllWithNoProjects() {
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			ProjectsMapper lProjectMapper = lSqlSession.getMapper(ProjectsMapper.class);
			lProjectMapper.deleteByExample(new ProjectsExample());
			lSqlSession.commit();
		} finally {
			lSqlSession.close();
		}	
		
		List<ProjectDTO> lListProjectDTOs = ProjectManager.loadAll();
		Assert.assertNull(lListProjectDTOs);
	}
	
	@Test
	public void testLoadAll() {
		
		List<ProjectDTO> lListProjectDTOs = ProjectManager.loadAll();
		
		Assert.assertEquals(3, lListProjectDTOs.size());
		Assert.assertNull(lListProjectDTOs.get(0).getArchitecture());
		Assert.assertNull(lListProjectDTOs.get(0).getBibiscoVersion());
		Assert.assertEquals(AllTests.TEST_PROJECT_ID, lListProjectDTOs.get(0).getIdProject());
		Assert.assertNull(lListProjectDTOs.get(0).getLanguage());
		Assert.assertEquals("Test", lListProjectDTOs.get(0).getName());
		Assert.assertNull(lListProjectDTOs.get(0).getArchitecture());
		Assert.assertNull(lListProjectDTOs.get(0).getChapterList());
		Assert.assertNull(lListProjectDTOs.get(0).getLocationList());
		Assert.assertNull(lListProjectDTOs.get(0).getMainCharacterList());
		Assert.assertNull(lListProjectDTOs.get(0).getSecondaryCharacterList());
		
		Assert.assertNull(lListProjectDTOs.get(1).getArchitecture());
		Assert.assertNull(lListProjectDTOs.get(1).getBibiscoVersion());
		Assert.assertEquals(AllTests.TEST_PROJECT2_ID, lListProjectDTOs.get(1).getIdProject());
		Assert.assertNull(lListProjectDTOs.get(1).getLanguage());
		Assert.assertEquals("Test 2", lListProjectDTOs.get(1).getName());
		Assert.assertNull(lListProjectDTOs.get(1).getArchitecture());
		Assert.assertNull(lListProjectDTOs.get(1).getChapterList());
		Assert.assertNull(lListProjectDTOs.get(1).getLocationList());
		Assert.assertNull(lListProjectDTOs.get(1).getMainCharacterList());
		Assert.assertNull(lListProjectDTOs.get(1).getSecondaryCharacterList());
		
		Assert.assertNull(lListProjectDTOs.get(2).getArchitecture());
		Assert.assertNull(lListProjectDTOs.get(2).getBibiscoVersion());
		Assert.assertEquals(AllTests.TEST_PROJECT3_ID, lListProjectDTOs.get(2).getIdProject());
		Assert.assertNull(lListProjectDTOs.get(2).getLanguage());
		Assert.assertEquals("Test 3 à è ì ç ù £ $ ! /", lListProjectDTOs.get(2).getName());
		Assert.assertNull(lListProjectDTOs.get(2).getArchitecture());
		Assert.assertNull(lListProjectDTOs.get(2).getChapterList());
		Assert.assertNull(lListProjectDTOs.get(2).getLocationList());
		Assert.assertNull(lListProjectDTOs.get(2).getMainCharacterList());
		Assert.assertNull(lListProjectDTOs.get(2).getSecondaryCharacterList());
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testDeleteProjectWithEmptyIdProject() {
		ProjectManager.delete("");
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testDeleteProjectWithNullIdProject() {
		ProjectManager.delete(null);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testDeleteProjectWithWrongIdProject() {
		ProjectManager.delete("MarcChagall");
	}
	
	@Test
	public void testDeleteProject() throws ConfigurationException, IOException, SQLException {
				
		File lFile = new File(AllTests.BIBISCO_INTERNAL_PROJECTS_DIR + System.getProperty("file.separator") + AllTests.TEST_PROJECT3_ID);
		Assert.assertTrue(lFile.exists());
		
		ProjectManager.delete(AllTests.TEST_PROJECT3_ID);
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		Projects lProjects;
		try {
			ProjectsMapper lProjectMapper = lSqlSession.getMapper(ProjectsMapper.class);
			lProjects = lProjectMapper.selectByPrimaryKey(AllTests.TEST_PROJECT3_ID);
		} finally {
			lSqlSession.close();
		}	
		Assert.assertNull(lProjects);
		Assert.assertFalse(lFile.exists());
	}
	
	@Test
	public void testExportProjectAsArchive() {
		
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT_ID);
		File lFile = ProjectManager.exportProjectAsArchive();
		Assert.assertNotNull(lFile);
		Assert.assertEquals("C:\\Users\\afeccomandi\\git\\bibisco\\bibisco\\export", lFile.getParent());
		Assert.assertTrue(lFile.getName().startsWith("Test_archive"));
		Assert.assertTrue(lFile.getName().endsWith(".bibisco"));
		Assert.assertTrue(lFile.getTotalSpace() > 0);
		
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT2_ID);
		lFile = ProjectManager.exportProjectAsArchive();
		Assert.assertNotNull(lFile);
		Assert.assertEquals("C:\\Users\\afeccomandi\\git\\bibisco\\bibisco\\export", lFile.getParent());
		Assert.assertTrue(lFile.getName().startsWith("Test2_archive"));
		Assert.assertTrue(lFile.getName().endsWith(".bibisco"));
		Assert.assertTrue(lFile.getTotalSpace() > 0);
		
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT3_ID);
		lFile = ProjectManager.exportProjectAsArchive();
		Assert.assertNotNull(lFile);
		Assert.assertEquals("C:\\Users\\afeccomandi\\git\\bibisco\\bibisco\\export", lFile.getParent());
		Assert.assertTrue(lFile.getName().startsWith("Test3_archive"));
		Assert.assertTrue(lFile.getName().endsWith(".bibisco"));
		Assert.assertTrue(lFile.getTotalSpace() > 0);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testExportProjectAsArchiveWithEmptyIdProject() {
		ContextManager.getInstance().setIdProject("");
		ProjectManager.exportProjectAsArchive();
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testExportProjectAsArchiveWithNullIdProject() {
		ContextManager.getInstance().setIdProject(null);
		ProjectManager.exportProjectAsArchive();
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testExportProjectAsArchiveWitWrongIdProject() {
		ContextManager.getInstance().setIdProject("Smashing Pumpkins");
		ProjectManager.exportProjectAsArchive();
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testExportProjectAsPdfWithEmptyIdProject() {
		ContextManager.getInstance().setIdProject("");
		ProjectManager.exportProjectAsPdf();
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testExportProjectAsPdfWithNullIdProject() {
		ContextManager.getInstance().setIdProject(null);
		ProjectManager.exportProjectAsPdf();
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testExportProjectAsPdfWitWrongIdProject() {
		ContextManager.getInstance().setIdProject("Smashing Pumpkins");
		ProjectManager.exportProjectAsPdf();
	}
	
	@Test
	public void testExportProjectAsPdf() {
		
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT_ID);
		List<File> lListFile = ProjectManager.exportProjectAsPdf();
		Assert.assertNotNull(lListFile);
		Assert.assertEquals(2, lListFile.size());
		Assert.assertEquals("C:\\Users\\afeccomandi\\git\\bibisco\\bibisco\\export", lListFile.get(0).getParent());
		Assert.assertEquals("C:\\Users\\afeccomandi\\git\\bibisco\\bibisco\\export", lListFile.get(1).getParent());
		Assert.assertTrue(lListFile.get(0).getName().startsWith("Test_novel"));
		Assert.assertTrue(lListFile.get(0).getName().endsWith(".pdf"));
		Assert.assertTrue(lListFile.get(0).getTotalSpace() > 0);
		Assert.assertTrue(lListFile.get(1).getName().startsWith("Test_project"));
		Assert.assertTrue(lListFile.get(1).getName().endsWith(".pdf"));
		Assert.assertTrue(lListFile.get(1).getTotalSpace() > 0);
		
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT2_ID);
		lListFile = ProjectManager.exportProjectAsPdf();
		Assert.assertNotNull(lListFile);
		Assert.assertEquals(2, lListFile.size());
		Assert.assertEquals("C:\\Users\\afeccomandi\\git\\bibisco\\bibisco\\export", lListFile.get(0).getParent());
		Assert.assertEquals("C:\\Users\\afeccomandi\\git\\bibisco\\bibisco\\export", lListFile.get(1).getParent());
		Assert.assertTrue(lListFile.get(0).getName().startsWith("Test2_novel"));
		Assert.assertTrue(lListFile.get(0).getName().endsWith(".pdf"));
		Assert.assertTrue(lListFile.get(0).getTotalSpace() > 0);
		Assert.assertTrue(lListFile.get(1).getName().startsWith("Test2_project"));
		Assert.assertTrue(lListFile.get(1).getName().endsWith(".pdf"));
		Assert.assertTrue(lListFile.get(1).getTotalSpace() > 0);
		
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT3_ID);
		lListFile = ProjectManager.exportProjectAsPdf();
		Assert.assertNotNull(lListFile);
		Assert.assertEquals(2, lListFile.size());
		Assert.assertEquals("C:\\Users\\afeccomandi\\git\\bibisco\\bibisco\\export", lListFile.get(0).getParent());
		Assert.assertEquals("C:\\Users\\afeccomandi\\git\\bibisco\\bibisco\\export", lListFile.get(1).getParent());
		Assert.assertTrue(lListFile.get(0).getName().startsWith("Test3_novel"));
		Assert.assertTrue(lListFile.get(0).getName().endsWith(".pdf"));
		Assert.assertTrue(lListFile.get(0).getTotalSpace() > 0);
		Assert.assertTrue(lListFile.get(1).getName().startsWith("Test3_project"));
		Assert.assertTrue(lListFile.get(1).getName().endsWith(".pdf"));
		Assert.assertTrue(lListFile.get(1).getTotalSpace() > 0);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testExportProjectAsWordWithEmptyIdProject() {
		ContextManager.getInstance().setIdProject("");
		ProjectManager.exportProjectAsWord();
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testExportProjectAsWordWithNullIdProject() {
		ContextManager.getInstance().setIdProject(null);
		ProjectManager.exportProjectAsWord();
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testExportProjectAsWordWitWrongIdProject() {
		ContextManager.getInstance().setIdProject("Smashing Pumpkins");
		ProjectManager.exportProjectAsWord();
	}
	
	@Test
	public void testExportProjectAsWord() {
		
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT_ID);
		List<File> lListFile = ProjectManager.exportProjectAsWord();
		Assert.assertNotNull(lListFile);
		Assert.assertEquals(2, lListFile.size());
		Assert.assertEquals("C:\\Users\\afeccomandi\\git\\bibisco\\bibisco\\export", lListFile.get(0).getParent());
		Assert.assertEquals("C:\\Users\\afeccomandi\\git\\bibisco\\bibisco\\export", lListFile.get(1).getParent());
		Assert.assertTrue(lListFile.get(0).getName().startsWith("Test_novel"));
		Assert.assertTrue(lListFile.get(0).getName().endsWith(".rtf"));
		Assert.assertTrue(lListFile.get(0).getTotalSpace() > 0);
		Assert.assertTrue(lListFile.get(1).getName().startsWith("Test_project"));
		Assert.assertTrue(lListFile.get(1).getName().endsWith(".rtf"));
		Assert.assertTrue(lListFile.get(1).getTotalSpace() > 0);
		
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT2_ID);
		lListFile = ProjectManager.exportProjectAsWord();
		Assert.assertNotNull(lListFile);
		Assert.assertEquals(2, lListFile.size());
		Assert.assertEquals("C:\\Users\\afeccomandi\\git\\bibisco\\bibisco\\export", lListFile.get(0).getParent());
		Assert.assertEquals("C:\\Users\\afeccomandi\\git\\bibisco\\bibisco\\export", lListFile.get(1).getParent());
		Assert.assertTrue(lListFile.get(0).getName().startsWith("Test2_novel"));
		Assert.assertTrue(lListFile.get(0).getName().endsWith(".rtf"));
		Assert.assertTrue(lListFile.get(0).getTotalSpace() > 0);
		Assert.assertTrue(lListFile.get(1).getName().startsWith("Test2_project"));
		Assert.assertTrue(lListFile.get(1).getName().endsWith(".rtf"));
		Assert.assertTrue(lListFile.get(1).getTotalSpace() > 0);
		
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT3_ID);
		lListFile = ProjectManager.exportProjectAsWord();
		Assert.assertNotNull(lListFile);
		Assert.assertEquals(2, lListFile.size());
		Assert.assertEquals("C:\\Users\\afeccomandi\\git\\bibisco\\bibisco\\export", lListFile.get(0).getParent());
		Assert.assertEquals("C:\\Users\\afeccomandi\\git\\bibisco\\bibisco\\export", lListFile.get(1).getParent());
		Assert.assertTrue(lListFile.get(0).getName().startsWith("Test3_novel"));
		Assert.assertTrue(lListFile.get(0).getName().endsWith(".rtf"));
		Assert.assertTrue(lListFile.get(0).getTotalSpace() > 0);
		Assert.assertTrue(lListFile.get(1).getName().startsWith("Test3_project"));
		Assert.assertTrue(lListFile.get(1).getName().endsWith(".rtf"));
		Assert.assertTrue(lListFile.get(1).getTotalSpace() > 0);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testGetDBProjectDirectoryWithEmptyIdProject() {
		ProjectManager.getDBProjectDirectory("");
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testGetDBProjectDirectoryWithNullIdProject() {
		ProjectManager.getDBProjectDirectory(null);
	}
	
	@Test
	public void testGetDBProjectDirectory() {
		Assert.assertEquals(AllTests.BIBISCO_INTERNAL_PROJECTS_DIR + AllTests.getPathSeparator() + 
				AllTests.TEST_PROJECT_ID + AllTests.getPathSeparator(), 
				ProjectManager.getDBProjectDirectory(AllTests.TEST_PROJECT_ID));
	}
	
	@Test
	public void testGetProjectsDirectory() {
		Assert.assertEquals(AllTests.BIBISCO_INTERNAL_PROJECTS_DIR + AllTests.getPathSeparator(), ProjectManager.getProjectsDirectory());
	}
	
	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
	public void testImportProjectWithNullImportProjectArchiveDTO() {
		ProjectManager.importProject(null);
	}
	
	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
	public void testImportProjectWithNullIdProject() {
		ImportProjectArchiveDTO lImportProjectArchiveDTO = new ImportProjectArchiveDTO();
		lImportProjectArchiveDTO.setProjectName("Test 4");
		lImportProjectArchiveDTO.setArchiveFileValid(true);
		lImportProjectArchiveDTO.setAlreadyPresent(false);
		ProjectManager.importProject(null);
	}
	
	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
	public void testImportProjectWithNullProjectName() {
		ImportProjectArchiveDTO lImportProjectArchiveDTO = new ImportProjectArchiveDTO();
		lImportProjectArchiveDTO.setIdProject(AllTests.TEST_PROJECT4_ID);
		lImportProjectArchiveDTO.setArchiveFileValid(true);
		lImportProjectArchiveDTO.setAlreadyPresent(false);
		ProjectManager.importProject(null);
	}
	
	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
	public void testImportProjectWithEmptyProjectName() {
		ImportProjectArchiveDTO lImportProjectArchiveDTO = new ImportProjectArchiveDTO();
		lImportProjectArchiveDTO.setIdProject(AllTests.TEST_PROJECT4_ID);
		lImportProjectArchiveDTO.setProjectName("");
		lImportProjectArchiveDTO.setArchiveFileValid(true);
		lImportProjectArchiveDTO.setAlreadyPresent(false);
		ProjectManager.importProject(null);
	}
	
	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
	public void testImportProjectWithArchiveFileNotValid() {
		ImportProjectArchiveDTO lImportProjectArchiveDTO = new ImportProjectArchiveDTO();
		lImportProjectArchiveDTO.setIdProject(AllTests.TEST_PROJECT4_ID);
		lImportProjectArchiveDTO.setProjectName("");
		lImportProjectArchiveDTO.setArchiveFileValid(false);
		lImportProjectArchiveDTO.setAlreadyPresent(false);
		ProjectManager.importProject(lImportProjectArchiveDTO);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testImportProjectWithNonExistentProjectDir() {
		setNonExistentProjectDir();
		ImportProjectArchiveDTO lImportProjectArchiveDTO = new ImportProjectArchiveDTO();
		lImportProjectArchiveDTO.setIdProject(AllTests.TEST_PROJECT_ID);
		lImportProjectArchiveDTO.setProjectName("Test");
		lImportProjectArchiveDTO.setArchiveFileValid(false);
		lImportProjectArchiveDTO.setAlreadyPresent(false);
		ProjectManager.importProject(lImportProjectArchiveDTO);
	}
		
	@Test
	public void testImportProjectWithNonExistingProject() throws IOException {
		
		FileUtils.copyDirectoryToDirectory(new File(AllTests.getTestProject4DBFilePath()), new File(AllTests.getTempPath()));
		
		ImportProjectArchiveDTO lImportProjectArchiveDTO = new ImportProjectArchiveDTO();
		lImportProjectArchiveDTO.setIdProject(AllTests.TEST_PROJECT4_ID);
		lImportProjectArchiveDTO.setProjectName("Test 4");
		lImportProjectArchiveDTO.setArchiveFileValid(true);
		lImportProjectArchiveDTO.setAlreadyPresent(false);
		ProjectManager.importProject(lImportProjectArchiveDTO);
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		Projects lProjects;
		try {
			ProjectsMapper lProjectMapper = lSqlSession.getMapper(ProjectsMapper.class);
			lProjects = lProjectMapper.selectByPrimaryKey(AllTests.TEST_PROJECT4_ID);
    	} finally {
			lSqlSession.close();
		}	
		Assert.assertNotNull(lProjects);
		Assert.assertEquals(AllTests.TEST_PROJECT4_ID, lProjects.getIdProject());
		Assert.assertEquals("Test 4", lProjects.getName());
		
	
		ProjectWithBLOBs lProject;
		List<ChaptersWithBLOBs> lListChapters;
		List<CharactersWithBLOBs> lListMainCharacters;
		List<CharactersWithBLOBs> lListSecondaryCharacters;
		List<CharacterInfos> lListCharacterInfos;
		List<Locations> lListLocations;
		List<Scenes> lListScenes;
		List<SceneRevisions> lListSceneRevisions;
		List<SceneRevisionCharactersKey> lListRevisionCharactersKeys;
		List<SceneRevisionStrandsKey> lListRevisionStrandsKeys;
		List<Strands> lListStrands;
		
		lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT4_ID);
		lSqlSession = lSqlSessionFactory.openSession();
		try {
			ProjectMapper lProjectMapper = lSqlSession.getMapper(ProjectMapper.class);
			lProject = lProjectMapper.selectByPrimaryKey(AllTests.TEST_PROJECT4_ID);
			
			ChaptersMapper lChaptersMapper = lSqlSession.getMapper(ChaptersMapper.class);
			ChaptersExample lChaptersExample = new ChaptersExample();
			lChaptersExample.setOrderByClause("position");
			lListChapters = lChaptersMapper.selectByExampleWithBLOBs(lChaptersExample);
		
			CharactersMapper lCharactersMapper = lSqlSession.getMapper(CharactersMapper.class);
			CharactersExample lMainCharactersExample = new CharactersExample();
			lMainCharactersExample.createCriteria().andMainCharacterEqualTo("Y");
			lMainCharactersExample.setOrderByClause("position");
			lListMainCharacters = lCharactersMapper.selectByExampleWithBLOBs(lMainCharactersExample);
			
			CharactersExample lSecondaryCharactersExample = new CharactersExample();
			lSecondaryCharactersExample.createCriteria().andMainCharacterEqualTo("N");
			lSecondaryCharactersExample.setOrderByClause("position");
			lListSecondaryCharacters = lCharactersMapper.selectByExampleWithBLOBs(lSecondaryCharactersExample);
			
			CharacterInfosMapper lCharacterInfosMapper = lSqlSession.getMapper(CharacterInfosMapper.class);
			lListCharacterInfos = lCharacterInfosMapper.selectByExampleWithBLOBs(new CharacterInfosExample());
				
			LocationsMapper lLocationsMapper = lSqlSession.getMapper(LocationsMapper.class);
			LocationsExample lLocationsExample = new LocationsExample();
			lLocationsExample.setOrderByClause("position");
			lListLocations = lLocationsMapper.selectByExampleWithBLOBs(lLocationsExample);
			
			ScenesMapper lScenesMapper = lSqlSession.getMapper(ScenesMapper.class);
			ScenesExample lScenesExample = new ScenesExample();
			lScenesExample.setOrderByClause("position");
			lListScenes = lScenesMapper.selectByExample(lScenesExample);
			
			SceneRevisionsMapper lSceneRevisionsMapper = lSqlSession.getMapper(SceneRevisionsMapper.class);
			SceneRevisionsExample lSceneRevisionsExample = new SceneRevisionsExample();
			lSceneRevisionsExample.setOrderByClause("id_scene, revision_number");
			lListSceneRevisions = lSceneRevisionsMapper.selectByExampleWithBLOBs(lSceneRevisionsExample);
			
			SceneRevisionCharactersMapper lSceneRevisionCharactersMapper = lSqlSession.getMapper(SceneRevisionCharactersMapper.class);
			SceneRevisionCharactersExample lSceneRevisionCharactersExample = new SceneRevisionCharactersExample();
			lSceneRevisionCharactersExample.setOrderByClause("id_scene_revision, id_character");
			lListRevisionCharactersKeys = lSceneRevisionCharactersMapper.selectByExample(lSceneRevisionCharactersExample);
			
			SceneRevisionStrandsMapper lSceneRevisionStrandsMapper = lSqlSession.getMapper(SceneRevisionStrandsMapper.class);
			SceneRevisionStrandsExample lSceneRevisionStrandsExample = new SceneRevisionStrandsExample();
			lSceneRevisionStrandsExample.setOrderByClause("id_scene_revision, id_strand");
			lListRevisionStrandsKeys = lSceneRevisionStrandsMapper.selectByExample(lSceneRevisionStrandsExample);
			
			StrandsMapper lStrandsMapper = lSqlSession.getMapper(StrandsMapper.class);
			StrandsExample lStrandsExample = new StrandsExample();
			lStrandsExample.setOrderByClause("id_strand");
			lListStrands = lStrandsMapper.selectByExampleWithBLOBs(lStrandsExample);
	
		} finally {
			lSqlSession.close();
		}	
			
		Assert.assertEquals(AllTests.TEST_PROJECT4_ID, lProject.getIdProject());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getFabulaTaskStatus());
		Assert.assertEquals("1.3.0", lProject.getBibiscoVersion());
		Assert.assertEquals("en_US", lProject.getLanguage());
		Assert.assertEquals("Test 4", lProject.getName());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getPremiseTaskStatus());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getSettingTaskStatus());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getStrandTaskStatus());
		
		Assert.assertEquals(0, lListChapters.size());
		Assert.assertEquals(0, lListMainCharacters.size());
		Assert.assertEquals(0, lListSecondaryCharacters.size());
		Assert.assertEquals(0, lListCharacterInfos.size());
		Assert.assertEquals(0, lListLocations.size());
		Assert.assertEquals(0, lListScenes.size());
		Assert.assertEquals(0, lListSceneRevisions.size());
		Assert.assertEquals(0, lListRevisionCharactersKeys.size());
		Assert.assertEquals(0, lListRevisionStrandsKeys.size());
		Assert.assertEquals(0, lListStrands.size());
	}
	
	public void checkTestProjectDB() throws IOException, ParseException {
		checkTestProjectDBProject();
		checkTestProjectDBChapters();
		checkTestProjectDBStrands();
		checkTestProjectDBLocations();
		checkTestProjectDBCharacters();		
	}
	
	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
	public void testimportProjectArchiveFileWithEmptyFileName() {
		byte[] lBytes = new byte[100];
		ProjectManager.importProjectArchiveFile(null, lBytes);
	}
	
	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
	public void testimportProjectArchiveFileWithNullFileName() {
		byte[] lBytes = new byte[100];
		ProjectManager.importProjectArchiveFile("", lBytes);
	}
	
	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
	public void testimportProjectArchiveFileWithNullByteArray() {
		ProjectManager.importProjectArchiveFile("test", null);
	}
	
	@Test
	public void testimportProjectArchiveFileNotValid() {
		byte[] lBytes = new byte[100];
		ImportProjectArchiveDTO lImportProjectArchiveDTO = ProjectManager.importProjectArchiveFile("test.zip", lBytes);
		Assert.assertFalse(lImportProjectArchiveDTO.isArchiveFileValid());
		Assert.assertNull(lImportProjectArchiveDTO.getIdProject());
		Assert.assertNull(lImportProjectArchiveDTO.getProjectName());
		Assert.assertFalse(lImportProjectArchiveDTO.isAlreadyPresent());
		
		File lFileProjectToImportZip = new File(AllTests.getTempPath()+AllTests.getPathSeparator()+ "test.zip");
		Assert.assertTrue(lFileProjectToImportZip.exists());
	}
	
	@Test
	public void testimportProjectArchiveAlreadyPresent() throws IOException {
		
		File lFile = new File(AllTests.getTestProjectArchiveFilePath());
		FileInputStream lFileInputStream = new FileInputStream(lFile);
		
		ImportProjectArchiveDTO lImportProjectArchiveDTO = ProjectManager.importProjectArchiveFile(AllTests.TEST_PROJECT_ARCHIVE_FILE, IOUtils.toByteArray(lFileInputStream));
		Assert.assertTrue(lImportProjectArchiveDTO.isArchiveFileValid());
		Assert.assertTrue(lImportProjectArchiveDTO.isAlreadyPresent());
		Assert.assertEquals(AllTests.TEST_PROJECT_ID, lImportProjectArchiveDTO.getIdProject());
		Assert.assertEquals("Test", lImportProjectArchiveDTO.getProjectName());
		
		File lFileProjectToImportZip = new File(AllTests.getTempPath()+AllTests.getPathSeparator()+ AllTests.TEST_PROJECT_ARCHIVE_FILE);
		Assert.assertTrue(lFileProjectToImportZip.exists());
		
		File lFileProjectToImportDir = new File(AllTests.getTempPath()+AllTests.getPathSeparator()+ lImportProjectArchiveDTO.getIdProject());
		Assert.assertTrue(lFileProjectToImportDir.exists());
	}
	
	@Test
	public void testimportProjectArchiveNotPresent() throws IOException {
		
		File lFile = new File(AllTests.getTestProjectArchiveNotPresentFilePath());
		FileInputStream lFileInputStream = new FileInputStream(lFile);
		
		ImportProjectArchiveDTO lImportProjectArchiveDTO = ProjectManager.importProjectArchiveFile(AllTests.TEST_PROJECT_ARCHIVE_NOT_PRESENT_FILE, IOUtils.toByteArray(lFileInputStream));
		Assert.assertTrue(lImportProjectArchiveDTO.isArchiveFileValid());
		Assert.assertFalse(lImportProjectArchiveDTO.isAlreadyPresent());
		Assert.assertEquals(AllTests.TEST_PROJECT_ARCHIVE_NOT_PRESENT_ID, lImportProjectArchiveDTO.getIdProject());
		Assert.assertNull(lImportProjectArchiveDTO.getProjectName());
		
		File lFileProjectToImportZip = new File(AllTests.getTempPath()+AllTests.getPathSeparator()+ AllTests.TEST_PROJECT_ARCHIVE_NOT_PRESENT_FILE);
		Assert.assertTrue(lFileProjectToImportZip.exists());
		
		File lFileProjectToImportDir = new File(AllTests.getTempPath()+AllTests.getPathSeparator()+ lImportProjectArchiveDTO.getIdProject());
		Assert.assertTrue(lFileProjectToImportDir.exists());
	}
	

	@Test
	public void testImportProjectWithExistingProject() throws IOException, ParseException {
		
		FileUtils.copyDirectoryToDirectory(new File(AllTests.getTestProjectDBFilePath()), new File(AllTests.getTempPath()));
		
		ImportProjectArchiveDTO lImportProjectArchiveDTO = new ImportProjectArchiveDTO();
		lImportProjectArchiveDTO.setIdProject(AllTests.TEST_PROJECT_ID);
		lImportProjectArchiveDTO.setProjectName("Test");
		lImportProjectArchiveDTO.setArchiveFileValid(true);
		lImportProjectArchiveDTO.setAlreadyPresent(true);
		ProjectManager.importProject(lImportProjectArchiveDTO);
		
		checkTestProjectDB();	
	}
	
	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
	public void testSaveWithNullProjectDTO() {
		ProjectManager.save(null);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testSaveWithNullIdProject() {
		ProjectManager.save(new ProjectDTO());
	}
	
	@Test
	public void testSave() throws IOException, ParseException, ConfigurationException, InterruptedException {
	
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT_ID);
		
		ProjectDTO lProjectDTO = new ProjectDTO(); 
		lProjectDTO.setIdProject(AllTests.TEST_PROJECT_ID);
		lProjectDTO.setName("Test name updated");
		
		lProjectDTO.setArchitecture(new ArchitectureDTO());
		lProjectDTO.setBibiscoVersion("X.X.X");
		lProjectDTO.setChapterList(new ArrayList<ChapterDTO>());
		lProjectDTO.setLanguage("xx_XX");
		lProjectDTO.setLocationList(new ArrayList<LocationDTO>());
		lProjectDTO.setMainCharacterList(new ArrayList<CharacterDTO>());
		lProjectDTO.setSecondaryCharacterList(new ArrayList<CharacterDTO>());
		
		ProjectManager.save(lProjectDTO);
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		Projects lProjects;
		try {
			ProjectsMapper lProjectMapper = lSqlSession.getMapper(ProjectsMapper.class);
			lProjects = lProjectMapper.selectByPrimaryKey(AllTests.TEST_PROJECT_ID);
		} finally {
			lSqlSession.close();
		}	
		Assert.assertNotNull(lProjects);
		Assert.assertEquals(AllTests.TEST_PROJECT_ID, lProjects.getIdProject());
		Assert.assertEquals("Test name updated", lProjects.getName());
		
		ProjectWithBLOBs lProject;
		
		lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT_ID);
		lSqlSession = lSqlSessionFactory.openSession();
		try {
			ProjectMapper lProjectMapper = lSqlSession.getMapper(ProjectMapper.class);
			lProject = lProjectMapper.selectByPrimaryKey(AllTests.TEST_PROJECT_ID);
				
		} finally {
			lSqlSession.close();
		}	
		
		// PROJECT
		
		Assert.assertEquals(AllTests.TEST_PROJECT_ID, lProject.getIdProject());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getFabulaTaskStatus());
		Assert.assertEquals("1.3.0", lProject.getBibiscoVersion());
		Assert.assertEquals("en_US", lProject.getLanguage());
		Assert.assertEquals("Test name updated", lProject.getName());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getStrandTaskStatus());
		Assert.assertEquals("<p>Fabula</p>", lProject.getFabula());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getFabulaTaskStatus());
		Assert.assertEquals("<p>Premise</p>", lProject.getPremise());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getPremiseTaskStatus());
		Assert.assertEquals("<p>Setting</p>", lProject.getSetting());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getSettingTaskStatus());		

		
		checkTestProjectDBChapters();
		checkTestProjectDBStrands();
		checkTestProjectDBLocations();
		checkTestProjectDBCharacters();	
		
		AllTests.cleanTestProjectDB();
	}
		
	@After
	public void cleanExportAndTempDirectory() throws IOException, ConfigurationException {		
		FileUtils.cleanDirectory(new File(AllTests.getExportPath()));
		FileUtils.cleanDirectory(new File(AllTests.getTempPath()));
	}

	
	public void checkTestProjectDBChapters() throws IOException, ParseException {
			
		List<ChaptersWithBLOBs> lListChapters;
		List<Scenes> lListScenes;
		List<SceneRevisions> lListSceneRevisions;
		List<SceneRevisionCharactersKey> lListRevisionCharactersKeys;
		List<SceneRevisionStrandsKey> lListRevisionStrandsKeys;
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT_ID);
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			ChaptersMapper lChaptersMapper = lSqlSession.getMapper(ChaptersMapper.class);
			ChaptersExample lChaptersExample = new ChaptersExample();
			lChaptersExample.setOrderByClause("position");
			lListChapters = lChaptersMapper.selectByExampleWithBLOBs(lChaptersExample);
			ScenesMapper lScenesMapper = lSqlSession.getMapper(ScenesMapper.class);
			ScenesExample lScenesExample = new ScenesExample();
			lScenesExample.setOrderByClause("position");
			lListScenes = lScenesMapper.selectByExample(lScenesExample);
			
			SceneRevisionsMapper lSceneRevisionsMapper = lSqlSession.getMapper(SceneRevisionsMapper.class);
			SceneRevisionsExample lSceneRevisionsExample = new SceneRevisionsExample();
			lSceneRevisionsExample.setOrderByClause("id_scene, revision_number");
			lListSceneRevisions = lSceneRevisionsMapper.selectByExampleWithBLOBs(lSceneRevisionsExample);
			
			SceneRevisionCharactersMapper lSceneRevisionCharactersMapper = lSqlSession.getMapper(SceneRevisionCharactersMapper.class);
			SceneRevisionCharactersExample lSceneRevisionCharactersExample = new SceneRevisionCharactersExample();
			lSceneRevisionCharactersExample.setOrderByClause("id_scene_revision, id_character");
			lListRevisionCharactersKeys = lSceneRevisionCharactersMapper.selectByExample(lSceneRevisionCharactersExample);
			
			SceneRevisionStrandsMapper lSceneRevisionStrandsMapper = lSqlSession.getMapper(SceneRevisionStrandsMapper.class);
			SceneRevisionStrandsExample lSceneRevisionStrandsExample = new SceneRevisionStrandsExample();
			lSceneRevisionStrandsExample.setOrderByClause("id_scene_revision, id_strand");
			lListRevisionStrandsKeys = lSceneRevisionStrandsMapper.selectByExample(lSceneRevisionStrandsExample);
			
		} finally {
			lSqlSession.close();
		}	
		

		// CHAPTERS
		
		Assert.assertEquals(new Long(1), lListChapters.get(0).getIdChapter());
		Assert.assertEquals("<p>Notes 1</p>", lListChapters.get(0).getNote());
		Assert.assertEquals(new Integer(1), lListChapters.get(0).getPosition());
		Assert.assertEquals("<p>Reason 1</p>", lListChapters.get(0).getReason());
		Assert.assertEquals(new Integer(0), lListChapters.get(0).getReasonTaskStatus());
		Assert.assertEquals("Chapter 1", lListChapters.get(0).getTitle());
		
		Assert.assertEquals(new Long(2), lListChapters.get(1).getIdChapter());
		Assert.assertEquals("<p>Notes 2</p>", lListChapters.get(1).getNote());
		Assert.assertEquals(new Integer(2), lListChapters.get(1).getPosition());
		Assert.assertEquals("<p>Reason 2</p>", lListChapters.get(1).getReason());
		Assert.assertEquals(new Integer(1), lListChapters.get(1).getReasonTaskStatus());
		Assert.assertEquals("Chapter 2", lListChapters.get(1).getTitle());
		
		Assert.assertEquals(new Long(3), lListChapters.get(2).getIdChapter());
		Assert.assertEquals("<p>Notes 3</p>", lListChapters.get(2).getNote());
		Assert.assertEquals(new Integer(3), lListChapters.get(2).getPosition());
		Assert.assertEquals("<p>Reason 3</p>", lListChapters.get(2).getReason());
		Assert.assertEquals(new Integer(2), lListChapters.get(2).getReasonTaskStatus());
		Assert.assertEquals("Chapter 3", lListChapters.get(2).getTitle());
		
		// SCENES
		
		Assert.assertEquals("Scene 1.1", lListScenes.get(0).getDescription());
		Assert.assertEquals(new Integer(1), lListScenes.get(0).getIdChapter());
		Assert.assertEquals(new Long(10), lListScenes.get(0).getIdScene());
		Assert.assertEquals(new Integer(1), lListScenes.get(0).getPosition());
		Assert.assertEquals(new Integer(0), lListScenes.get(0).getTaskStatus());
		
		Assert.assertEquals("Scene 1.2", lListScenes.get(1).getDescription());
		Assert.assertEquals(new Integer(1), lListScenes.get(1).getIdChapter());
		Assert.assertEquals(new Long(11), lListScenes.get(1).getIdScene());
		Assert.assertEquals(new Integer(2), lListScenes.get(1).getPosition());
		Assert.assertEquals(new Integer(1), lListScenes.get(1).getTaskStatus());
		
		Assert.assertEquals("Scene 1.3", lListScenes.get(2).getDescription());
		Assert.assertEquals(new Integer(1), lListScenes.get(2).getIdChapter());
		Assert.assertEquals(new Long(12), lListScenes.get(2).getIdScene());
		Assert.assertEquals(new Integer(3), lListScenes.get(2).getPosition());
		Assert.assertEquals(new Integer(2), lListScenes.get(2).getTaskStatus());
		
		
		// SCENE REVISIONS
		
		SimpleDateFormat lSimpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S");
		
		Assert.assertEquals(new Integer(20), lListSceneRevisions.get(0).getCharacters());
		Assert.assertEquals(new Integer(71), lListSceneRevisions.get(0).getIdLocation());
		Assert.assertEquals(new Integer(10), lListSceneRevisions.get(0).getIdScene());
		Assert.assertEquals(new Long(1), lListSceneRevisions.get(0).getIdSceneRevision());
		Assert.assertEquals(new Integer(0), lListSceneRevisions.get(0).getPointOfView());
		Assert.assertEquals(new Integer(67), lListSceneRevisions.get(0).getPointOfViewIdCharacter());
		Assert.assertEquals(new Integer(1), lListSceneRevisions.get(0).getRevisionNumber());
		Assert.assertEquals("<p>Scene 1.1 Revision 1</p>", lListSceneRevisions.get(0).getScene());
		Assert.assertEquals(lSimpleDateFormat.parse("1975-04-23 22:14:00.0"), lListSceneRevisions.get(0).getSceneDate());
		Assert.assertEquals("Y", lListSceneRevisions.get(0).getSelected());
		Assert.assertNull(lListSceneRevisions.get(0).getTense());
		Assert.assertEquals(new Integer(3), lListSceneRevisions.get(0).getWords());
		
		Assert.assertEquals(new Integer(20), lListSceneRevisions.get(1).getCharacters());
		Assert.assertEquals(new Integer(72), lListSceneRevisions.get(1).getIdLocation());
		Assert.assertEquals(new Integer(11), lListSceneRevisions.get(1).getIdScene());
		Assert.assertEquals(new Long(2), lListSceneRevisions.get(1).getIdSceneRevision());
		Assert.assertEquals(new Integer(1), lListSceneRevisions.get(1).getPointOfView());
		Assert.assertEquals(new Integer(68), lListSceneRevisions.get(1).getPointOfViewIdCharacter());
		Assert.assertEquals(new Integer(1), lListSceneRevisions.get(1).getRevisionNumber());
		Assert.assertEquals("<p>Scene 1.2 Revision 1</p>", lListSceneRevisions.get(1).getScene());
		Assert.assertEquals(lSimpleDateFormat.parse("1976-10-22 14:25:00.0"), lListSceneRevisions.get(1).getSceneDate());
		Assert.assertEquals("N", lListSceneRevisions.get(1).getSelected());
		Assert.assertNull(lListSceneRevisions.get(1).getTense());
		Assert.assertEquals(new Integer(5), lListSceneRevisions.get(1).getWords());
		
		Assert.assertEquals(new Integer(20), lListSceneRevisions.get(2).getCharacters());
		Assert.assertEquals(new Integer(72), lListSceneRevisions.get(2).getIdLocation());
		Assert.assertEquals(new Integer(11), lListSceneRevisions.get(2).getIdScene());
		Assert.assertEquals(new Long(4), lListSceneRevisions.get(2).getIdSceneRevision());
		Assert.assertEquals(new Integer(1), lListSceneRevisions.get(2).getPointOfView());
		Assert.assertEquals(new Integer(68), lListSceneRevisions.get(2).getPointOfViewIdCharacter());
		Assert.assertEquals(new Integer(2), lListSceneRevisions.get(2).getRevisionNumber());
		Assert.assertEquals("<p>Scene 1.2 Revision 2</p>", lListSceneRevisions.get(2).getScene());
		Assert.assertEquals(lSimpleDateFormat.parse("1976-10-22 14:25:00.0"), lListSceneRevisions.get(2).getSceneDate());
		Assert.assertEquals("Y", lListSceneRevisions.get(2).getSelected());
		Assert.assertNull(lListSceneRevisions.get(2).getTense());
		Assert.assertEquals(new Integer(5), lListSceneRevisions.get(2).getWords());
		
		Assert.assertEquals(new Integer(20), lListSceneRevisions.get(3).getCharacters());
		Assert.assertNull(lListSceneRevisions.get(3).getIdLocation());
		Assert.assertEquals(new Integer(12), lListSceneRevisions.get(3).getIdScene());
		Assert.assertEquals(new Long(3), lListSceneRevisions.get(3).getIdSceneRevision());
		Assert.assertNull(lListSceneRevisions.get(3).getPointOfView());
		Assert.assertNull(lListSceneRevisions.get(3).getPointOfViewIdCharacter());
		Assert.assertEquals(new Integer(1), lListSceneRevisions.get(3).getRevisionNumber());
		Assert.assertEquals("<p>Scene 1.3 Revision 1</p>", lListSceneRevisions.get(3).getScene());
		Assert.assertNull(lListSceneRevisions.get(3).getSceneDate());
		Assert.assertEquals("N", lListSceneRevisions.get(3).getSelected());
		Assert.assertNull(lListSceneRevisions.get(3).getTense());
		Assert.assertEquals(new Integer(5), lListSceneRevisions.get(3).getWords());
		
		Assert.assertEquals(new Integer(20), lListSceneRevisions.get(4).getCharacters());
		Assert.assertNull(lListSceneRevisions.get(4).getIdLocation());
		Assert.assertEquals(new Integer(12), lListSceneRevisions.get(4).getIdScene());
		Assert.assertEquals(new Long(5), lListSceneRevisions.get(4).getIdSceneRevision());
		Assert.assertNull(lListSceneRevisions.get(4).getPointOfView());
		Assert.assertNull(lListSceneRevisions.get(4).getPointOfViewIdCharacter());
		Assert.assertEquals(new Integer(2), lListSceneRevisions.get(4).getRevisionNumber());
		Assert.assertEquals("<p>Scene 1.3 Revision 2</p>", lListSceneRevisions.get(4).getScene());
		Assert.assertNull(lListSceneRevisions.get(4).getSceneDate());
		Assert.assertEquals("N", lListSceneRevisions.get(4).getSelected());
		Assert.assertNull(lListSceneRevisions.get(4).getTense());
		Assert.assertEquals(new Integer(5), lListSceneRevisions.get(4).getWords());
		
		Assert.assertEquals(new Integer(20), lListSceneRevisions.get(5).getCharacters());
		Assert.assertEquals(new Integer(73), lListSceneRevisions.get(5).getIdLocation());
		Assert.assertEquals(new Integer(12), lListSceneRevisions.get(5).getIdScene());
		Assert.assertEquals(new Long(6), lListSceneRevisions.get(5).getIdSceneRevision());
		Assert.assertEquals(new Integer(3), lListSceneRevisions.get(5).getPointOfView());
		Assert.assertNull(lListSceneRevisions.get(5).getPointOfViewIdCharacter());
		Assert.assertEquals(new Integer(3), lListSceneRevisions.get(5).getRevisionNumber());
		Assert.assertEquals("<p>Scene 1.3 Revision 3</p>", lListSceneRevisions.get(5).getScene());
		Assert.assertEquals(lSimpleDateFormat.parse("2004-01-01 09:17:00.0"), lListSceneRevisions.get(5).getSceneDate());
		Assert.assertEquals("Y", lListSceneRevisions.get(5).getSelected());
		Assert.assertNull(lListSceneRevisions.get(5).getTense());
		Assert.assertEquals(new Integer(5), lListSceneRevisions.get(5).getWords());
		
		// SCENE REVISION CHARACTERS
		
		Assert.assertEquals(new Integer(1), lListRevisionCharactersKeys.get(0).getIdSceneRevision());
		Assert.assertEquals(new Integer(67), lListRevisionCharactersKeys.get(0).getIdCharacter());
		Assert.assertEquals(new Integer(2), lListRevisionCharactersKeys.get(1).getIdSceneRevision());
		Assert.assertEquals(new Integer(67), lListRevisionCharactersKeys.get(1).getIdCharacter());
		Assert.assertEquals(new Integer(2), lListRevisionCharactersKeys.get(2).getIdSceneRevision());
		Assert.assertEquals(new Integer(68), lListRevisionCharactersKeys.get(2).getIdCharacter());
		Assert.assertEquals(new Integer(6), lListRevisionCharactersKeys.get(3).getIdSceneRevision());
		Assert.assertEquals(new Integer(67), lListRevisionCharactersKeys.get(3).getIdCharacter());
		Assert.assertEquals(new Integer(6), lListRevisionCharactersKeys.get(4).getIdSceneRevision());
		Assert.assertEquals(new Integer(68), lListRevisionCharactersKeys.get(4).getIdCharacter());
		Assert.assertEquals(new Integer(6), lListRevisionCharactersKeys.get(5).getIdSceneRevision());
		Assert.assertEquals(new Integer(69), lListRevisionCharactersKeys.get(5).getIdCharacter());
		
		// SCENE REVISION STRANDS
		
		Assert.assertEquals(new Integer(1), lListRevisionStrandsKeys.get(0).getIdSceneRevision());
		Assert.assertEquals(new Integer(15), lListRevisionStrandsKeys.get(0).getIdStrand());
		Assert.assertEquals(new Integer(2), lListRevisionStrandsKeys.get(1).getIdSceneRevision());
		Assert.assertEquals(new Integer(15), lListRevisionStrandsKeys.get(1).getIdStrand());
		Assert.assertEquals(new Integer(2), lListRevisionStrandsKeys.get(2).getIdSceneRevision());
		Assert.assertEquals(new Integer(16), lListRevisionStrandsKeys.get(2).getIdStrand());
		Assert.assertEquals(new Integer(6), lListRevisionStrandsKeys.get(3).getIdSceneRevision());
		Assert.assertEquals(new Integer(15), lListRevisionStrandsKeys.get(3).getIdStrand());
		Assert.assertEquals(new Integer(6), lListRevisionStrandsKeys.get(4).getIdSceneRevision());
		Assert.assertEquals(new Integer(16), lListRevisionStrandsKeys.get(4).getIdStrand());
		Assert.assertEquals(new Integer(6), lListRevisionStrandsKeys.get(5).getIdSceneRevision());
		Assert.assertEquals(new Integer(17), lListRevisionStrandsKeys.get(5).getIdStrand());
				
	}


	public void checkTestProjectDBStrands() throws IOException, ParseException {
			
		List<Strands> lListStrands;
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT_ID);
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			
			StrandsMapper lStrandsMapper = lSqlSession.getMapper(StrandsMapper.class);
			StrandsExample lStrandsExample = new StrandsExample();
			lStrandsExample.setOrderByClause("id_strand");
			lListStrands = lStrandsMapper.selectByExampleWithBLOBs(lStrandsExample);
			
		} finally {
			lSqlSession.close();
		}	
			
		// STRANDS
		
		Assert.assertEquals("<p>Strand 1</p>", lListStrands.get(0).getDescription());
		Assert.assertEquals(new Long(15), lListStrands.get(0).getIdStrand());
		Assert.assertEquals("Strand 1", lListStrands.get(0).getName());
		Assert.assertEquals(new Integer(1), lListStrands.get(0).getPosition());
		Assert.assertEquals(new Integer(0), lListStrands.get(0).getTaskStatus());
		
		Assert.assertEquals("<p>Strand 2</p>", lListStrands.get(1).getDescription());
		Assert.assertEquals(new Long(16), lListStrands.get(1).getIdStrand());
		Assert.assertEquals("Strand 2", lListStrands.get(1).getName());
		Assert.assertEquals(new Integer(2), lListStrands.get(1).getPosition());
		Assert.assertEquals(new Integer(1), lListStrands.get(1).getTaskStatus());
		
		Assert.assertEquals("<p>Strand 3</p>", lListStrands.get(2).getDescription());
		Assert.assertEquals(new Long(17), lListStrands.get(2).getIdStrand());
		Assert.assertEquals("Strand 3", lListStrands.get(2).getName());
		Assert.assertEquals(new Integer(3), lListStrands.get(2).getPosition());
		Assert.assertEquals(new Integer(2), lListStrands.get(2).getTaskStatus());
	}

	
	public void checkTestProjectDBLocations() throws IOException, ParseException {
			
		List<Locations> lListLocations;
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT_ID);
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			
			LocationsMapper lLocationsMapper = lSqlSession.getMapper(LocationsMapper.class);
			LocationsExample lLocationsExample = new LocationsExample();
			lLocationsExample.setOrderByClause("position");
			lListLocations = lLocationsMapper.selectByExampleWithBLOBs(lLocationsExample);
			
		} finally {
			lSqlSession.close();
		}	
		
		// LOCATIONS
		
		Assert.assertEquals("City 1", lListLocations.get(0).getCity());
		Assert.assertEquals("<p>Location 1</p>", lListLocations.get(0).getDescription());
		Assert.assertEquals(new Long(71), lListLocations.get(0).getIdLocation());
		Assert.assertEquals("Location's name 1", lListLocations.get(0).getName());
		Assert.assertEquals("Nation 1", lListLocations.get(0).getNation());
		Assert.assertEquals(new Integer(1), lListLocations.get(0).getPosition());
		Assert.assertEquals("State 1", lListLocations.get(0).getState());
		Assert.assertEquals(new Integer(0), lListLocations.get(0).getTaskStatus());
		
		Assert.assertEquals("City 2", lListLocations.get(1).getCity());
		Assert.assertEquals("<p>Location 2</p>", lListLocations.get(1).getDescription());
		Assert.assertEquals(new Long(72), lListLocations.get(1).getIdLocation());
		Assert.assertEquals("Location's name 2", lListLocations.get(1).getName());
		Assert.assertEquals("Nation 2", lListLocations.get(1).getNation());
		Assert.assertEquals(new Integer(2), lListLocations.get(1).getPosition());
		Assert.assertEquals("State 2", lListLocations.get(1).getState());
		Assert.assertEquals(new Integer(1), lListLocations.get(1).getTaskStatus());
		
		Assert.assertEquals("City 3", lListLocations.get(2).getCity());
		Assert.assertEquals("<p>Location 3</p>", lListLocations.get(2).getDescription());
		Assert.assertEquals(new Long(73), lListLocations.get(2).getIdLocation());
		Assert.assertEquals("Location's name 3", lListLocations.get(2).getName());
		Assert.assertEquals("Nation 3", lListLocations.get(2).getNation());
		Assert.assertEquals(new Integer(3), lListLocations.get(2).getPosition());
		Assert.assertEquals("State 3", lListLocations.get(2).getState());
		Assert.assertEquals(new Integer(2), lListLocations.get(2).getTaskStatus());		
	}

	
	public void checkTestProjectDBCharacters() throws IOException, ParseException {
			
		List<CharactersWithBLOBs> lListMainCharacters;
		List<CharactersWithBLOBs> lListSecondaryCharacters;
		List<CharacterInfos> lListCharacterInfosMainCharacter1;
		List<CharacterInfos> lListCharacterInfosMainCharacter2;
		List<CharacterInfos> lListCharacterInfosMainCharacter3;
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT_ID);
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {

			CharactersMapper lCharactersMapper = lSqlSession.getMapper(CharactersMapper.class);
			CharactersExample lMainCharactersExample = new CharactersExample();
			lMainCharactersExample.createCriteria().andMainCharacterEqualTo("Y");
			lMainCharactersExample.setOrderByClause("position");
			lListMainCharacters = lCharactersMapper.selectByExampleWithBLOBs(lMainCharactersExample);
			
			CharactersExample lSecondaryCharactersExample = new CharactersExample();
			lSecondaryCharactersExample.createCriteria().andMainCharacterEqualTo("N");
			lSecondaryCharactersExample.setOrderByClause("position");
			lListSecondaryCharacters = lCharactersMapper.selectByExampleWithBLOBs(lSecondaryCharactersExample);
			
			CharacterInfosMapper lCharacterInfosMapper = lSqlSession.getMapper(CharacterInfosMapper.class);
			CharacterInfosExample lCharacterInfosExample = new CharacterInfosExample();
			lCharacterInfosExample.createCriteria().andIdCharacterEqualTo(67);
			lCharacterInfosExample.setOrderByClause("character_info_type, question");
			lListCharacterInfosMainCharacter1 = lCharacterInfosMapper.selectByExampleWithBLOBs(lCharacterInfosExample);
			
			lCharacterInfosExample = new CharacterInfosExample();
			lCharacterInfosExample.createCriteria().andIdCharacterEqualTo(68);
			lCharacterInfosExample.setOrderByClause("character_info_type, question");
			lListCharacterInfosMainCharacter2 = lCharacterInfosMapper.selectByExampleWithBLOBs(lCharacterInfosExample);
			
			lCharacterInfosExample = new CharacterInfosExample();
			lCharacterInfosExample.createCriteria().andIdCharacterEqualTo(69);
			lCharacterInfosExample.setOrderByClause("character_info_type, question");
			lListCharacterInfosMainCharacter3 = lCharacterInfosMapper.selectByExampleWithBLOBs(lCharacterInfosExample);
			
		} finally {
			lSqlSession.close();
		}	
					
		// CHARACTERS
		
		Assert.assertEquals("<p>Behaviors, attitudes free text</p>", lListMainCharacters.get(0).getBehaviorsFreeText());
		Assert.assertEquals("Y", lListMainCharacters.get(0).getBehaviorsInterview());
		Assert.assertEquals(new Integer(0), lListMainCharacters.get(0).getBehaviorsTaskStatus());
		Assert.assertEquals("<p>Conflict</p>", lListMainCharacters.get(0).getConflict());
		Assert.assertEquals(new Integer(0), lListMainCharacters.get(0).getConflictTaskStatus());
		Assert.assertEquals("<p>Evolution</p>", lListMainCharacters.get(0).getEvolutionduringthestory());
		Assert.assertEquals(new Long(67), lListMainCharacters.get(0).getIdCharacter());
		Assert.assertEquals("<p>Ideas and passions free text</p>", lListMainCharacters.get(0).getIdeasFreeText());
		Assert.assertEquals("Y", lListMainCharacters.get(0).getIdeasInterview());
		Assert.assertEquals(new Integer(0), lListMainCharacters.get(0).getIdeasTaskStatus());
		Assert.assertEquals("<p>Life before the story&#39;s beginning</p>", lListMainCharacters.get(0).getLifebeforestorybeginning());
		Assert.assertEquals(new Integer(0), lListMainCharacters.get(0).getLifebeforestorybeginningTaskStatus());
		Assert.assertEquals("Y", lListMainCharacters.get(0).getMainCharacter());
		Assert.assertEquals("Main character 1", lListMainCharacters.get(0).getName());
		Assert.assertEquals("<p>Personal data free text</p>", lListMainCharacters.get(0).getPersonalDataFreeText());
		Assert.assertEquals("Y", lListMainCharacters.get(0).getPersonalDataInterview());
		Assert.assertEquals(new Integer(0), lListMainCharacters.get(0).getPersonalDataTaskStatus());
		Assert.assertEquals("<p>Physical features free text</p>", lListMainCharacters.get(0).getPhysionomyFreeText());
		Assert.assertEquals("Y", lListMainCharacters.get(0).getPhysionomyInterview());
		Assert.assertEquals(new Integer(0), lListMainCharacters.get(0).getPhysionomyTaskStatus());
		Assert.assertEquals(new Integer(1), lListMainCharacters.get(0).getPosition());
		Assert.assertEquals("<p>Psychology free text</p>", lListMainCharacters.get(0).getPsychologyFreeText());
		Assert.assertEquals("Y", lListMainCharacters.get(0).getPsychologyInterview());
		Assert.assertEquals(new Integer(0), lListMainCharacters.get(0).getPsychologyTaskStatus());
		Assert.assertNull(lListMainCharacters.get(0).getSecondaryCharacterDescription());
		Assert.assertEquals(new Integer(0), lListMainCharacters.get(0).getSecondaryCharacterDescriptionTaskStatus());
		Assert.assertEquals("<p>Sociology free text</p>", lListMainCharacters.get(0).getSociologyFreeText());
		Assert.assertEquals("Y", lListMainCharacters.get(0).getSociologyInterview());
		Assert.assertEquals(new Integer(0), lListMainCharacters.get(0).getSociologyTaskStatus());
		
		Assert.assertNull(lListMainCharacters.get(1).getBehaviorsFreeText());
		Assert.assertEquals("Y", lListMainCharacters.get(1).getBehaviorsInterview());
		Assert.assertEquals(new Integer(0), lListMainCharacters.get(1).getBehaviorsTaskStatus());
		Assert.assertNull(lListMainCharacters.get(1).getConflict());
		Assert.assertEquals(new Integer(0), lListMainCharacters.get(1).getConflictTaskStatus());
		Assert.assertNull(lListMainCharacters.get(1).getEvolutionduringthestory());
		Assert.assertEquals(new Long(68), lListMainCharacters.get(1).getIdCharacter());
		Assert.assertNull(lListMainCharacters.get(1).getIdeasFreeText());
		Assert.assertEquals("Y", lListMainCharacters.get(1).getIdeasInterview());
		Assert.assertEquals(new Integer(0), lListMainCharacters.get(1).getIdeasTaskStatus());
		Assert.assertNull(lListMainCharacters.get(1).getLifebeforestorybeginning());
		Assert.assertEquals(new Integer(0), lListMainCharacters.get(1).getLifebeforestorybeginningTaskStatus());
		Assert.assertEquals("Y", lListMainCharacters.get(1).getMainCharacter());
		Assert.assertEquals("Main character 2", lListMainCharacters.get(1).getName());
		Assert.assertNull(lListMainCharacters.get(1).getPersonalDataFreeText());
		Assert.assertEquals("Y", lListMainCharacters.get(1).getPersonalDataInterview());
		Assert.assertEquals(new Integer(1), lListMainCharacters.get(1).getPersonalDataTaskStatus());
		Assert.assertNull(lListMainCharacters.get(1).getPhysionomyFreeText());
		Assert.assertEquals("Y", lListMainCharacters.get(1).getPhysionomyInterview());
		Assert.assertEquals(new Integer(0), lListMainCharacters.get(1).getPhysionomyTaskStatus());
		Assert.assertEquals(new Integer(2), lListMainCharacters.get(1).getPosition());
		Assert.assertNull(lListMainCharacters.get(1).getPsychologyFreeText());
		Assert.assertEquals("Y", lListMainCharacters.get(1).getPsychologyInterview());
		Assert.assertEquals(new Integer(0), lListMainCharacters.get(1).getPsychologyTaskStatus());
		Assert.assertNull(lListMainCharacters.get(1).getSecondaryCharacterDescription());
		Assert.assertEquals(new Integer(0), lListMainCharacters.get(1).getSecondaryCharacterDescriptionTaskStatus());
		Assert.assertNull(lListMainCharacters.get(1).getSociologyFreeText());
		Assert.assertEquals("Y", lListMainCharacters.get(1).getSociologyInterview());
		Assert.assertEquals(new Integer(0), lListMainCharacters.get(1).getSociologyTaskStatus());
		
		Assert.assertNull(lListMainCharacters.get(2).getBehaviorsFreeText());
		Assert.assertEquals("Y", lListMainCharacters.get(2).getBehaviorsInterview());
		Assert.assertEquals(new Integer(2), lListMainCharacters.get(2).getBehaviorsTaskStatus());
		Assert.assertNull(lListMainCharacters.get(2).getConflict());
		Assert.assertEquals(new Integer(2), lListMainCharacters.get(2).getConflictTaskStatus());
		Assert.assertNull(lListMainCharacters.get(2).getEvolutionduringthestory());
		Assert.assertEquals(new Long(69), lListMainCharacters.get(2).getIdCharacter());
		Assert.assertNull(lListMainCharacters.get(2).getIdeasFreeText());
		Assert.assertEquals("Y", lListMainCharacters.get(2).getIdeasInterview());
		Assert.assertEquals(new Integer(2), lListMainCharacters.get(2).getIdeasTaskStatus());
		Assert.assertNull(lListMainCharacters.get(2).getLifebeforestorybeginning());
		Assert.assertEquals(new Integer(2), lListMainCharacters.get(2).getLifebeforestorybeginningTaskStatus());
		Assert.assertEquals("Y", lListMainCharacters.get(2).getMainCharacter());
		Assert.assertEquals("Main character 3", lListMainCharacters.get(2).getName());
		Assert.assertNull(lListMainCharacters.get(2).getPersonalDataFreeText());
		Assert.assertEquals("Y", lListMainCharacters.get(2).getPersonalDataInterview());
		Assert.assertEquals(new Integer(2), lListMainCharacters.get(2).getPersonalDataTaskStatus());
		Assert.assertNull(lListMainCharacters.get(2).getPhysionomyFreeText());
		Assert.assertEquals("Y", lListMainCharacters.get(2).getPhysionomyInterview());
		Assert.assertEquals(new Integer(2), lListMainCharacters.get(2).getPhysionomyTaskStatus());
		Assert.assertEquals(new Integer(3), lListMainCharacters.get(2).getPosition());
		Assert.assertNull(lListMainCharacters.get(2).getPsychologyFreeText());
		Assert.assertEquals("Y", lListMainCharacters.get(2).getPsychologyInterview());
		Assert.assertEquals(new Integer(2), lListMainCharacters.get(2).getPsychologyTaskStatus());
		Assert.assertNull(lListMainCharacters.get(2).getSecondaryCharacterDescription());
		Assert.assertEquals(new Integer(0), lListMainCharacters.get(2).getSecondaryCharacterDescriptionTaskStatus());
		Assert.assertNull(lListMainCharacters.get(2).getSociologyFreeText());
		Assert.assertEquals("Y", lListMainCharacters.get(2).getSociologyInterview());
		Assert.assertEquals(new Integer(2), lListMainCharacters.get(2).getSociologyTaskStatus());
		
		Assert.assertNull(lListSecondaryCharacters.get(0).getBehaviorsFreeText());
		Assert.assertEquals("Y", lListSecondaryCharacters.get(0).getBehaviorsInterview());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(0).getBehaviorsTaskStatus());
		Assert.assertNull(lListSecondaryCharacters.get(0).getConflict());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(0).getConflictTaskStatus());
		Assert.assertNull(lListSecondaryCharacters.get(0).getEvolutionduringthestory());
		Assert.assertEquals(new Long(70), lListSecondaryCharacters.get(0).getIdCharacter());
		Assert.assertNull(lListSecondaryCharacters.get(0).getIdeasFreeText());
		Assert.assertEquals("Y", lListSecondaryCharacters.get(0).getIdeasInterview());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(0).getIdeasTaskStatus());
		Assert.assertNull(lListSecondaryCharacters.get(0).getLifebeforestorybeginning());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(0).getLifebeforestorybeginningTaskStatus());
		Assert.assertEquals("N", lListSecondaryCharacters.get(0).getMainCharacter());
		Assert.assertEquals("Secondary character 1", lListSecondaryCharacters.get(0).getName());
		Assert.assertNull(lListSecondaryCharacters.get(0).getPersonalDataFreeText());
		Assert.assertEquals("Y", lListSecondaryCharacters.get(0).getPersonalDataInterview());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(0).getPersonalDataTaskStatus());
		Assert.assertNull(lListSecondaryCharacters.get(0).getPhysionomyFreeText());
		Assert.assertEquals("Y", lListSecondaryCharacters.get(0).getPhysionomyInterview());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(0).getPhysionomyTaskStatus());
		Assert.assertEquals(new Integer(1), lListSecondaryCharacters.get(0).getPosition());
		Assert.assertNull(lListSecondaryCharacters.get(0).getPsychologyFreeText());
		Assert.assertEquals("Y", lListSecondaryCharacters.get(0).getPsychologyInterview());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(0).getPsychologyTaskStatus());
		Assert.assertEquals("<p>Secondary character 1</p>", lListSecondaryCharacters.get(0).getSecondaryCharacterDescription());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(0).getSecondaryCharacterDescriptionTaskStatus());
		Assert.assertNull(lListSecondaryCharacters.get(0).getSociologyFreeText());
		Assert.assertEquals("Y", lListSecondaryCharacters.get(0).getSociologyInterview());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(0).getSociologyTaskStatus());
		
		Assert.assertNull(lListSecondaryCharacters.get(1).getBehaviorsFreeText());
		Assert.assertEquals("Y", lListSecondaryCharacters.get(1).getBehaviorsInterview());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(1).getBehaviorsTaskStatus());
		Assert.assertNull(lListSecondaryCharacters.get(1).getConflict());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(1).getConflictTaskStatus());
		Assert.assertNull(lListSecondaryCharacters.get(1).getEvolutionduringthestory());
		Assert.assertEquals(new Long(71), lListSecondaryCharacters.get(1).getIdCharacter());
		Assert.assertNull(lListSecondaryCharacters.get(0).getIdeasFreeText());
		Assert.assertEquals("Y", lListSecondaryCharacters.get(1).getIdeasInterview());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(1).getIdeasTaskStatus());
		Assert.assertNull(lListSecondaryCharacters.get(1).getLifebeforestorybeginning());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(1).getLifebeforestorybeginningTaskStatus());
		Assert.assertEquals("N", lListSecondaryCharacters.get(1).getMainCharacter());
		Assert.assertEquals("Secondary character 2", lListSecondaryCharacters.get(1).getName());
		Assert.assertNull(lListSecondaryCharacters.get(1).getPersonalDataFreeText());
		Assert.assertEquals("Y", lListSecondaryCharacters.get(1).getPersonalDataInterview());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(1).getPersonalDataTaskStatus());
		Assert.assertNull(lListSecondaryCharacters.get(1).getPhysionomyFreeText());
		Assert.assertEquals("Y", lListSecondaryCharacters.get(1).getPhysionomyInterview());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(1).getPhysionomyTaskStatus());
		Assert.assertEquals(new Integer(2), lListSecondaryCharacters.get(1).getPosition());
		Assert.assertNull(lListSecondaryCharacters.get(1).getPsychologyFreeText());
		Assert.assertEquals("Y", lListSecondaryCharacters.get(1).getPsychologyInterview());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(1).getPsychologyTaskStatus());
		Assert.assertEquals("<p>Secondary character 2</p>", lListSecondaryCharacters.get(1).getSecondaryCharacterDescription());
		Assert.assertEquals(new Integer(1), lListSecondaryCharacters.get(1).getSecondaryCharacterDescriptionTaskStatus());
		Assert.assertNull(lListSecondaryCharacters.get(1).getSociologyFreeText());
		Assert.assertEquals("Y", lListSecondaryCharacters.get(1).getSociologyInterview());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(1).getSociologyTaskStatus());
		
		Assert.assertNull(lListSecondaryCharacters.get(2).getBehaviorsFreeText());
		Assert.assertEquals("Y", lListSecondaryCharacters.get(2).getBehaviorsInterview());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(2).getBehaviorsTaskStatus());
		Assert.assertNull(lListSecondaryCharacters.get(2).getConflict());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(2).getConflictTaskStatus());
		Assert.assertNull(lListSecondaryCharacters.get(2).getEvolutionduringthestory());
		Assert.assertEquals(new Long(72), lListSecondaryCharacters.get(2).getIdCharacter());
		Assert.assertNull(lListSecondaryCharacters.get(0).getIdeasFreeText());
		Assert.assertEquals("Y", lListSecondaryCharacters.get(2).getIdeasInterview());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(2).getIdeasTaskStatus());
		Assert.assertNull(lListSecondaryCharacters.get(2).getLifebeforestorybeginning());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(2).getLifebeforestorybeginningTaskStatus());
		Assert.assertEquals("N", lListSecondaryCharacters.get(2).getMainCharacter());
		Assert.assertEquals("Secondary character 3", lListSecondaryCharacters.get(2).getName());
		Assert.assertNull(lListSecondaryCharacters.get(2).getPersonalDataFreeText());
		Assert.assertEquals("Y", lListSecondaryCharacters.get(2).getPersonalDataInterview());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(2).getPersonalDataTaskStatus());
		Assert.assertNull(lListSecondaryCharacters.get(2).getPhysionomyFreeText());
		Assert.assertEquals("Y", lListSecondaryCharacters.get(2).getPhysionomyInterview());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(2).getPhysionomyTaskStatus());
		Assert.assertEquals(new Integer(3), lListSecondaryCharacters.get(2).getPosition());
		Assert.assertNull(lListSecondaryCharacters.get(2).getPsychologyFreeText());
		Assert.assertEquals("Y", lListSecondaryCharacters.get(2).getPsychologyInterview());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(2).getPsychologyTaskStatus());
		Assert.assertEquals("<p>Secondary character 3</p>", lListSecondaryCharacters.get(2).getSecondaryCharacterDescription());
		Assert.assertEquals(new Integer(2), lListSecondaryCharacters.get(2).getSecondaryCharacterDescriptionTaskStatus());
		Assert.assertNull(lListSecondaryCharacters.get(2).getSociologyFreeText());
		Assert.assertEquals("Y", lListSecondaryCharacters.get(2).getSociologyInterview());
		Assert.assertEquals(new Integer(0), lListSecondaryCharacters.get(2).getSociologyTaskStatus());
		
		// CHARACTER INFO
		
		int lIntBehaviorsStart = 0;
		int lIntBehaviorsEnd = CharacterInfoQuestions.BEHAVIORS.getTotalQuestions();
		int lIntIdeasStart = lIntBehaviorsEnd;
		int lIntIdeasEnd = lIntIdeasStart + CharacterInfoQuestions.IDEAS.getTotalQuestions();
		int lIntPersonalDataStart = lIntIdeasEnd;
		int lIntPersonalDataEnd = lIntPersonalDataStart + CharacterInfoQuestions.PERSONAL_DATA.getTotalQuestions();
		int lIntPhysionomyStart = lIntPersonalDataEnd;
		int lIntPhysionomyEnd = lIntPhysionomyStart + CharacterInfoQuestions.PHYSIONOMY.getTotalQuestions();
		int lIntPhychologyStart = lIntPhysionomyEnd;
		int lIntPhychologyEnd = lIntPhychologyStart + CharacterInfoQuestions.PSYCHOLOGY.getTotalQuestions();
		int lIntSociologyStart = lIntPhychologyEnd;
		int lIntSociologyEnd = lIntSociologyStart + CharacterInfoQuestions.SOCIOLOGY.getTotalQuestions();
		
		for (int i = 0; i < lListCharacterInfosMainCharacter1.size(); i++) {
			if (i>=lIntBehaviorsStart && i<lIntBehaviorsEnd) {
				Assert.assertEquals(new Integer(i+1), lListCharacterInfosMainCharacter1.get(i).getQuestion());
				Assert.assertEquals(CharacterInfoQuestions.BEHAVIORS.name(), lListCharacterInfosMainCharacter1.get(i).getCharacterInfoType());
				Assert.assertEquals("<p>Behaviors, attitudes "+(i+1)+"</p>", lListCharacterInfosMainCharacter1.get(i).getInfo());
			}
			
			else if (i>=lIntIdeasStart && i<lIntIdeasEnd) {
				Assert.assertEquals(new Integer(i+1-lIntIdeasStart), lListCharacterInfosMainCharacter1.get(i).getQuestion());
				Assert.assertEquals(CharacterInfoQuestions.IDEAS.name(), lListCharacterInfosMainCharacter1.get(i).getCharacterInfoType());
				Assert.assertEquals("<p>Ideas and passions "+(i+1-lIntIdeasStart)+"</p>", lListCharacterInfosMainCharacter1.get(i).getInfo());
			}
			
			else if (i>=lIntPersonalDataStart && i<lIntPersonalDataEnd) {
				Assert.assertEquals(new Integer(i+1-lIntPersonalDataStart), lListCharacterInfosMainCharacter1.get(i).getQuestion());
				Assert.assertEquals(CharacterInfoQuestions.PERSONAL_DATA.name(), lListCharacterInfosMainCharacter1.get(i).getCharacterInfoType());
				Assert.assertEquals("<p>Personal data "+(i+1-lIntPersonalDataStart)+"</p>", lListCharacterInfosMainCharacter1.get(i).getInfo());
			}
			
			else if (i>=lIntPhysionomyStart && i<lIntPhysionomyEnd) {
				Assert.assertEquals(new Integer(i+1-lIntPhysionomyStart), lListCharacterInfosMainCharacter1.get(i).getQuestion());
				Assert.assertEquals(CharacterInfoQuestions.PHYSIONOMY.name(), lListCharacterInfosMainCharacter1.get(i).getCharacterInfoType());
				Assert.assertEquals("<p>Physical features "+(i+1-lIntPhysionomyStart)+"</p>", lListCharacterInfosMainCharacter1.get(i).getInfo());
			}
			
			else if (i>=lIntPhychologyStart && i<lIntPhychologyEnd) {
				Assert.assertEquals(new Integer(i+1-lIntPhychologyStart), lListCharacterInfosMainCharacter1.get(i).getQuestion());
				Assert.assertEquals(CharacterInfoQuestions.PSYCHOLOGY.name(), lListCharacterInfosMainCharacter1.get(i).getCharacterInfoType());
				Assert.assertEquals("<p>Psychology "+(i+1-lIntPhychologyStart)+"</p>", lListCharacterInfosMainCharacter1.get(i).getInfo());
			}
			
			else if (i>=lIntSociologyStart && i<lIntSociologyEnd) {
				Assert.assertEquals(new Integer(i+1-lIntSociologyStart), lListCharacterInfosMainCharacter1.get(i).getQuestion());
				Assert.assertEquals(CharacterInfoQuestions.SOCIOLOGY.name(), lListCharacterInfosMainCharacter1.get(i).getCharacterInfoType());
				Assert.assertEquals("<p>Sociology "+(i+1-lIntSociologyStart)+"</p>", lListCharacterInfosMainCharacter1.get(i).getInfo());
			}
		}
		
		for (int i = 0; i < lListCharacterInfosMainCharacter2.size(); i++) {
			if (i>=lIntBehaviorsStart && i<lIntBehaviorsEnd) {
				Assert.assertEquals(new Integer(i+1), lListCharacterInfosMainCharacter2.get(i).getQuestion());
				Assert.assertEquals(CharacterInfoQuestions.BEHAVIORS.name(), lListCharacterInfosMainCharacter2.get(i).getCharacterInfoType());
				Assert.assertNull(lListCharacterInfosMainCharacter2.get(i).getInfo());
			}
			
			else if (i>=lIntIdeasStart && i<lIntIdeasEnd) {
				Assert.assertEquals(new Integer(i+1-lIntIdeasStart), lListCharacterInfosMainCharacter2.get(i).getQuestion());
				Assert.assertEquals(CharacterInfoQuestions.IDEAS.name(), lListCharacterInfosMainCharacter2.get(i).getCharacterInfoType());
				Assert.assertNull(lListCharacterInfosMainCharacter2.get(i).getInfo());
			}
			
			else if (i>=lIntPersonalDataStart && i<lIntPersonalDataEnd) {
				Assert.assertEquals(new Integer(i+1-lIntPersonalDataStart), lListCharacterInfosMainCharacter2.get(i).getQuestion());
				Assert.assertEquals(CharacterInfoQuestions.PERSONAL_DATA.name(), lListCharacterInfosMainCharacter2.get(i).getCharacterInfoType());
				Assert.assertNull(lListCharacterInfosMainCharacter2.get(i).getInfo());
			}
			
			else if (i>=lIntPhysionomyStart && i<lIntPhysionomyEnd) {
				Assert.assertEquals(new Integer(i+1-lIntPhysionomyStart), lListCharacterInfosMainCharacter2.get(i).getQuestion());
				Assert.assertEquals(CharacterInfoQuestions.PHYSIONOMY.name(), lListCharacterInfosMainCharacter2.get(i).getCharacterInfoType());
				Assert.assertNull(lListCharacterInfosMainCharacter2.get(i).getInfo());
			}
			
			else if (i>=lIntPhychologyStart && i<lIntPhychologyEnd) {
				Assert.assertEquals(new Integer(i+1-lIntPhychologyStart), lListCharacterInfosMainCharacter2.get(i).getQuestion());
				Assert.assertEquals(CharacterInfoQuestions.PSYCHOLOGY.name(), lListCharacterInfosMainCharacter2.get(i).getCharacterInfoType());
				Assert.assertNull(lListCharacterInfosMainCharacter2.get(i).getInfo());
			}
			
			else if (i>=lIntSociologyStart && i<lIntSociologyEnd) {
				Assert.assertEquals(new Integer(i+1-lIntSociologyStart), lListCharacterInfosMainCharacter2.get(i).getQuestion());
				Assert.assertEquals(CharacterInfoQuestions.SOCIOLOGY.name(), lListCharacterInfosMainCharacter2.get(i).getCharacterInfoType());
				Assert.assertNull(lListCharacterInfosMainCharacter2.get(i).getInfo());
			}
		}
		
		for (int i = 0; i < lListCharacterInfosMainCharacter3.size(); i++) {
			if (i>=lIntBehaviorsStart && i<lIntBehaviorsEnd) {
				Assert.assertEquals(new Integer(i+1), lListCharacterInfosMainCharacter3.get(i).getQuestion());
				Assert.assertEquals(CharacterInfoQuestions.BEHAVIORS.name(), lListCharacterInfosMainCharacter3.get(i).getCharacterInfoType());
				Assert.assertNull(lListCharacterInfosMainCharacter3.get(i).getInfo());
			}
			
			else if (i>=lIntIdeasStart && i<lIntIdeasEnd) {
				Assert.assertEquals(new Integer(i+1-lIntIdeasStart), lListCharacterInfosMainCharacter3.get(i).getQuestion());
				Assert.assertEquals(CharacterInfoQuestions.IDEAS.name(), lListCharacterInfosMainCharacter3.get(i).getCharacterInfoType());
				Assert.assertNull(lListCharacterInfosMainCharacter3.get(i).getInfo());
			}
			
			else if (i>=lIntPersonalDataStart && i<lIntPersonalDataEnd) {
				Assert.assertEquals(new Integer(i+1-lIntPersonalDataStart), lListCharacterInfosMainCharacter3.get(i).getQuestion());
				Assert.assertEquals(CharacterInfoQuestions.PERSONAL_DATA.name(), lListCharacterInfosMainCharacter3.get(i).getCharacterInfoType());
				Assert.assertNull(lListCharacterInfosMainCharacter3.get(i).getInfo());
			}
			
			else if (i>=lIntPhysionomyStart && i<lIntPhysionomyEnd) {
				Assert.assertEquals(new Integer(i+1-lIntPhysionomyStart), lListCharacterInfosMainCharacter3.get(i).getQuestion());
				Assert.assertEquals(CharacterInfoQuestions.PHYSIONOMY.name(), lListCharacterInfosMainCharacter3.get(i).getCharacterInfoType());
				Assert.assertNull(lListCharacterInfosMainCharacter3.get(i).getInfo());
			}
			
			else if (i>=lIntPhychologyStart && i<lIntPhychologyEnd) {
				Assert.assertEquals(new Integer(i+1-lIntPhychologyStart), lListCharacterInfosMainCharacter3.get(i).getQuestion());
				Assert.assertEquals(CharacterInfoQuestions.PSYCHOLOGY.name(), lListCharacterInfosMainCharacter3.get(i).getCharacterInfoType());
				Assert.assertNull(lListCharacterInfosMainCharacter3.get(i).getInfo());
			}
			
			else if (i>=lIntSociologyStart && i<lIntSociologyEnd) {
				Assert.assertEquals(new Integer(i+1-lIntSociologyStart), lListCharacterInfosMainCharacter3.get(i).getQuestion());
				Assert.assertEquals(CharacterInfoQuestions.SOCIOLOGY.name(), lListCharacterInfosMainCharacter3.get(i).getCharacterInfoType());
				Assert.assertNull(lListCharacterInfosMainCharacter3.get(i).getInfo());
			}
		}		
	}


	public void checkTestProjectDBProject() throws IOException, ParseException {
			
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		Projects lProjects;
		try {
			ProjectsMapper lProjectMapper = lSqlSession.getMapper(ProjectsMapper.class);
			lProjects = lProjectMapper.selectByPrimaryKey(AllTests.TEST_PROJECT_ID);
		} finally {
			lSqlSession.close();
		}	
		Assert.assertNotNull(lProjects);
		Assert.assertEquals(AllTests.TEST_PROJECT_ID, lProjects.getIdProject());
		Assert.assertEquals("Test", lProjects.getName());
		
		ProjectWithBLOBs lProject;
		
		lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT_ID);
		lSqlSession = lSqlSessionFactory.openSession();
		try {
			ProjectMapper lProjectMapper = lSqlSession.getMapper(ProjectMapper.class);
			lProject = lProjectMapper.selectByPrimaryKey(AllTests.TEST_PROJECT_ID);
				
		} finally {
			lSqlSession.close();
		}	
		
		// PROJECT
		
		Assert.assertEquals(AllTests.TEST_PROJECT_ID, lProject.getIdProject());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getFabulaTaskStatus());
		Assert.assertEquals("1.3.0", lProject.getBibiscoVersion());
		Assert.assertEquals("en_US", lProject.getLanguage());
		Assert.assertEquals("Test", lProject.getName());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getStrandTaskStatus());
		Assert.assertEquals("<p>Fabula</p>", lProject.getFabula());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getFabulaTaskStatus());
		Assert.assertEquals("<p>Premise</p>", lProject.getPremise());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getPremiseTaskStatus());
		Assert.assertEquals("<p>Setting</p>", lProject.getSetting());
		Assert.assertEquals(TaskStatus.TODO.getValue(), lProject.getSettingTaskStatus());		
	}
}
