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

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.bibisco.dao.client.PropertiesMapper;
import com.bibisco.dao.model.Properties;
import com.bibisco.manager.PropertiesManager;
import com.bibisco.manager.VersionManager;

public class VersionManagerTest {
	
	@Test
	public void testGetVersion() {
		Assert.assertEquals(VersionManager.getInstance().getVersion(), "1.3.0");
	}
	
	@Test
	public void testCompare() {
		Assert.assertEquals(VersionManager.compare("1.0.0", "1.0.1"), -1);
		Assert.assertEquals(VersionManager.compare("1.0.1", "1.0.2"), -1);
		Assert.assertEquals(VersionManager.compare("1.0.2", "1.1.0"), -1);
		Assert.assertEquals(VersionManager.compare("1.1.0", "1.1.1"), -1);
		Assert.assertEquals(VersionManager.compare("1.1.1", "1.2.0"), -1);
		Assert.assertEquals(VersionManager.compare("1.2.0", "2.0.0"), -1);
		Assert.assertEquals(VersionManager.compare("1.2.0", "1.3.0"), -1);
		Assert.assertEquals(VersionManager.compare("1.2.1", "1.3.0"), -1);
		
		Assert.assertEquals(VersionManager.compare("1.3.0", "1.3.0"), 0);
		
		Assert.assertEquals(VersionManager.compare("1.0.1", "1.0.0"), 1);
		Assert.assertEquals(VersionManager.compare("1.0.2", "1.0.1"), 1);
		Assert.assertEquals(VersionManager.compare("1.1.0", "1.0.2"), 1);
		Assert.assertEquals(VersionManager.compare("1.1.1", "1.1.0"), 1);
		Assert.assertEquals(VersionManager.compare("1.2.0", "1.1.1"), 1);
		Assert.assertEquals(VersionManager.compare("2.0.0", "1.2.0"), 1);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testWrongFirstArgument() {
		VersionManager.compare("1.0.a", "1.0.1");
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testWrongSecondArgument() {
		VersionManager.compare("1.0.0", "1.0");
	}
	
	@Before 
	@After
	public void init() {
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			
			Properties lProperties = new Properties();
			lProperties.setProperty("version");
			lProperties.setValue("1.3.0");
			lPropertiesMapper.updateByPrimaryKey(lProperties);
			
			lSqlSession.commit();
    	} catch (Throwable t) {	
			lSqlSession.rollback();
    	} finally {
			lSqlSession.close();
		}
    	
    	PropertiesManager.getInstance().reload();
	}
	
}
