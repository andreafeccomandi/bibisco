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

import java.util.Locale;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.bibisco.dao.client.PropertiesMapper;
import com.bibisco.dao.model.Properties;
import com.bibisco.manager.LocaleManager;
import com.bibisco.manager.PropertiesManager;

public class LocaleManagerTest {
	
	@Test
	public void testDefaultLocale() {
		
		// test default locale
		Locale lLocaleDefault = Locale.getDefault();
		LocaleManager lLocaleManager = LocaleManager.getInstance();
		Locale lLocale = lLocaleManager.getLocale();
		Assert.assertEquals(lLocaleDefault, lLocale);
	}
	
	@Test
	public void testUpdateLocale() {
		
		//update locale
		Locale lLocaleCanada = new Locale(Locale.CANADA.getCountry(), Locale.CANADA.getLanguage());
		LocaleManager lLocaleManager = LocaleManager.getInstance();
		lLocaleManager.saveLocale(lLocaleCanada.toString());
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	Properties lProperties;
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			lProperties = lPropertiesMapper.selectByPrimaryKey("locale");
    	} finally {
			lSqlSession.close();
		}
    	
    	Assert.assertEquals(lProperties.getValue(), lLocaleCanada.toString());
	}
	
	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_ALL_TARGETS_DANGEROUS")
	public void testNullLocale() {
		
		//update locale with null value
		LocaleManager.getInstance().saveLocale(null);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testEmptyLocale() {
		//update locale with null value		
		LocaleManager.getInstance().saveLocale("");
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testWrongLocale3ElementsSplit() {
		
		//update locale with locale in wrong format
		LocaleManager.getInstance().saveLocale("it_it_it");
	}
	
	@Before 
	@After
	public void init() {
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			
			Properties lProperties = new Properties();
			lProperties.setProperty("locale");
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
}
