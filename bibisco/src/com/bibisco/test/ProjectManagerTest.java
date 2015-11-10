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
package com.bibisco.test;

import java.io.IOException;
import java.util.List;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.json.JSONException;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.bibisco.bean.ProjectDTO;
import com.bibisco.dao.client.ProjectMapper;
import com.bibisco.dao.client.ProjectsMapper;
import com.bibisco.dao.client.PropertiesMapper;
import com.bibisco.dao.model.Project;
import com.bibisco.dao.model.ProjectExample;
import com.bibisco.dao.model.Projects;
import com.bibisco.dao.model.ProjectsExample;
import com.bibisco.dao.model.Properties;
import com.bibisco.enums.TaskStatus;
import com.bibisco.manager.LocaleManager;
import com.bibisco.manager.ProjectManager;
import com.bibisco.manager.PropertiesManager;
import com.bibisco.manager.VersionManager;

public class ProjectManagerTest {

	@Test
	public void testIsProjectsDirectoryEmpty() {
		emptyProjectsDirectory();
		Assert.assertEquals(ProjectManager.isProjectsDirectoryEmpty(), true);
	}
	
	@Test
	public void testProjectsDirectoryExistsWithProjectsDirectoryEmpty() {
		emptyProjectsDirectory();
		Assert.assertEquals(ProjectManager.projectsDirectoryExists(), false);
	}
	
	@Test
	public void testProjectsDirectoryExistsWithWrongProjectsDirectory() {
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
	
	@Test(expected = IllegalArgumentException.class)
	public void testInsertProjectAndProjectsDirectroryNotExists() {
		
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
		
		ProjectDTO lProjectDTO = new ProjectDTO();
		lProjectDTO.setName("Test Insert");
		lProjectDTO.setLanguage(LocaleManager.getInstance().getLocale().getLanguage());
		lProjectDTO.setBibiscoVersion(VersionManager.getInstance().getVersion());
		lProjectDTO = ProjectManager.insert(lProjectDTO);
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
	
	@Test(expected = IllegalArgumentException.class)
	public void testImportProjectsFromProjectsDirectoryWithEmptyProjectsDirectory() {
		emptyProjectsDirectory();
		ProjectManager.importProjectsFromProjectsDirectory();
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testImportProjectsFromProjectsDirectoryWithWrongProjectsDirectory() {
		
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
		
		ProjectManager.importProjectsFromProjectsDirectory();
	}
	
	@Test
	public void testImportProjectsFromProjectsDirectory() throws ConfigurationException, IOException {
		
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
		
		lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT_ID);
		lSqlSession = lSqlSessionFactory.openSession();
		Project lProject;
		try {
			ProjectMapper lProjectMapper = lSqlSession.getMapper(ProjectMapper.class);
			lProject = lProjectMapper.selectByPrimaryKey(AllTests.TEST_PROJECT_ID);
    	} finally {
			lSqlSession.close();
		}	
		Assert.assertEquals("1.3.0", lProject.getBibiscoVersion());
		
		lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT2_ID);
		lSqlSession = lSqlSessionFactory.openSession();
		try {
			ProjectMapper lProjectMapper = lSqlSession.getMapper(ProjectMapper.class);
			lProject = lProjectMapper.selectByPrimaryKey(AllTests.TEST_PROJECT2_ID);
    	} finally {
			lSqlSession.close();
		}	
		Assert.assertEquals("1.3.0", lProject.getBibiscoVersion());
		
		lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT3_ID);
		lSqlSession = lSqlSessionFactory.openSession();
		try {
			ProjectMapper lProjectMapper = lSqlSession.getMapper(ProjectMapper.class);
			lProject = lProjectMapper.selectByPrimaryKey(AllTests.TEST_PROJECT3_ID);
    	} finally {
			lSqlSession.close();
		}	
		Assert.assertEquals("1.3.0", lProject.getBibiscoVersion());
		
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
		Assert.assertEquals(new Integer(49), (Integer) lProjectDTO.getChapterList().get(0).getWordCountTaskStatusAsJSONObject().get("characterCount"));
		Assert.assertEquals(0, lProjectDTO.getChapterList().get(0).getSceneList().size());
		Assert.assertEquals(TaskStatus.TOCOMPLETE, lProjectDTO.getChapterList().get(0).getTaskStatus());
		Assert.assertEquals(new Integer(13), lProjectDTO.getChapterList().get(0).getWordCount());
		Assert.assertEquals(new Integer(49), lProjectDTO.getChapterList().get(0).getCharacterCount());
		
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
}
