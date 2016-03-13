package com.bibisco.test;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.ProjectMapper;
import com.bibisco.dao.client.PropertiesMapper;
import com.bibisco.dao.model.Project;
import com.bibisco.dao.model.Properties;
import com.bibisco.manager.ContextManager;
import com.bibisco.manager.PropertiesManager;

public class SqlSessionFactoryManagerTest {
	
	@Test
	public void testGetSqlSessionFactoryBibisco() {
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	Properties lProperties;
		try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			lProperties = lPropertiesMapper.selectByPrimaryKey("projectsDirectory");	
    	} finally {
			lSqlSession.close();
		}
		
		
		Assert.assertEquals(lProperties.getValue(), "C:/temp/bibisco/projects");
	}
	
	@Test
	public void testGetSingleSqlSessionFactoryProject() {
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT_ID);
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		Project lProject;
    	try {
			ProjectMapper lProjectMapper = lSqlSession.getMapper(ProjectMapper.class);
			lProject = lProjectMapper.selectByPrimaryKey(AllTests.TEST_PROJECT_ID);
    	} finally {
			lSqlSession.close();
		}
		Assert.assertEquals(lProject.getIdProject(), AllTests.TEST_PROJECT_ID);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testGetSqlSessionFactoryProjectWithWrongProject() {
		ContextManager.getInstance().setIdProject("xxx");
		SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testGetSqlSessionFactoryWithNoProjectInContext() {
		ContextManager.getInstance().setIdProject(null);
		SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
	}
	
	@Before 
	@After
	public void init() {
		
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
	public void testGetMultipleSqlSessionFactoryProject() {
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT_ID);
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		Project lProject;
		try {
			ProjectMapper lProjectMapper = lSqlSession.getMapper(ProjectMapper.class);
			lProject = lProjectMapper.selectByPrimaryKey(AllTests.TEST_PROJECT_ID);
		} finally {
			lSqlSession.close();
		}
		Assert.assertEquals(lProject.getIdProject(), AllTests.TEST_PROJECT_ID);
		
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT2_ID);
		lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		lSqlSession = lSqlSessionFactory.openSession();
		try {
			ProjectMapper lProjectMapper = lSqlSession.getMapper(ProjectMapper.class);
			lProject = lProjectMapper.selectByPrimaryKey(AllTests.TEST_PROJECT2_ID);
		} finally {
			lSqlSession.close();
		}
		Assert.assertEquals(lProject.getIdProject(), AllTests.TEST_PROJECT2_ID);
		
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT3_ID);
		lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
		lSqlSession = lSqlSessionFactory.openSession();
		try {
			ProjectMapper lProjectMapper = lSqlSession.getMapper(ProjectMapper.class);
			lProject = lProjectMapper.selectByPrimaryKey(AllTests.TEST_PROJECT3_ID);
		} finally {
			lSqlSession.close();
		}
		Assert.assertEquals(lProject.getIdProject(), AllTests.TEST_PROJECT3_ID);
	}
}
