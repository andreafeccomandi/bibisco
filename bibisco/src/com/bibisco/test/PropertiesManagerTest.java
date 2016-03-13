/*
 * Copyright (C) 2014-2016 Andrea Feccomandi
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
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.bibisco.dao.client.PropertiesMapper;
import com.bibisco.dao.model.Properties;
import com.bibisco.manager.PropertiesManager;

public class PropertiesManagerTest {
		
	@Test
	public void testUpdateProperty() throws ConfigurationException, IOException {

		PropertiesManager.getInstance().updateProperty("projectsDirectory", "C:\\Users\\AndreaDocuments\\");		
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	Properties lProperties;
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			lProperties = lPropertiesMapper.selectByPrimaryKey("projectsDirectory");
    	} finally {
			lSqlSession.close();
		}
    	
    	Assert.assertEquals(lProperties.getValue(), "C:\\Users\\AndreaDocuments\\");
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testUpdatePropertyWithNullProperty() {
		PropertiesManager.getInstance().updateProperty(null, null);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testUpdatePropertyWithEmptyProperty() {
		PropertiesManager.getInstance().updateProperty("", null);
	}
	
	@Test
	public void testGetProperty() {
		Assert.assertEquals(PropertiesManager.getInstance().getProperty("projectsDirectory"), "");
	}
	
	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_ALL_TARGETS_DANGEROUS")
	public void testUpdatePropertiesWithNullMap() {
		PropertiesManager.getInstance().updateProperties(null);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testUpdatePropertiesWithEmptyMap() {
		PropertiesManager.getInstance().updateProperties(new HashMap<String, String>());
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
			lProperties.setValue("");
			lPropertiesMapper.updateByPrimaryKey(lProperties);
			
			lProperties = new Properties();
			lProperties.setProperty("socialMediaTip");
			lProperties.setValue("true");
			lPropertiesMapper.updateByPrimaryKey(lProperties);
			
			lProperties = new Properties();
			lProperties.setProperty("locationsdndTip");
			lProperties.setValue("true");
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
	public void testUpdateProperties() throws ConfigurationException, IOException {
		
		Map<String, String> lMapProperties = new HashMap<String, String>();
		lMapProperties.put("socialMediaTip", "false");
		lMapProperties.put("locationsdndTip", "false");
		PropertiesManager.getInstance().updateProperties(lMapProperties);
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	Properties lProperties;
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			lProperties = lPropertiesMapper.selectByPrimaryKey("socialMediaTip");
    	} finally {
			lSqlSession.close();
		}
    	Assert.assertEquals(lProperties.getValue(), "false");
		
    	lSqlSession = lSqlSessionFactory.openSession();
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			lProperties = lPropertiesMapper.selectByPrimaryKey("locationsdndTip");
    	} finally {
			lSqlSession.close();
		}
    	Assert.assertEquals(lProperties.getValue(), "false");
	}
}
