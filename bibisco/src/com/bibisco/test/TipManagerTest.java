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

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.lang.time.DateUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.bibisco.bean.TipSettings;
import com.bibisco.dao.client.PropertiesMapper;
import com.bibisco.dao.model.Properties;
import com.bibisco.manager.PropertiesManager;
import com.bibisco.manager.TipManager;

public class TipManagerTest {
	
	private static final String DATE_FORMAT = "yyyyMMdd";
	
	@Test
	public void testLoadTip() {
				
		TipSettings lTipSettings = TipManager.load();		
		Assert.assertEquals(lTipSettings.isSceneTip(), true);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("chaptersdndTip"), true);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("scenesdndTip"), true);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("locationsdndTip"), true);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("charactersdndTip"), true);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("strandsdndTip"), true);
		Assert.assertEquals(lTipSettings.isSocialMediaTip(), true);
	}
	
	@Test
	public void testDisableTip() {
				
		TipManager.disableTip("sceneTip");
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	Properties lProperties;
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			lProperties = lPropertiesMapper.selectByPrimaryKey("sceneTip");
    	} finally {
			lSqlSession.close();
		}
    	
    	Assert.assertEquals(lProperties.getValue(), "false");
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testDisableEmptyTip() {	
		TipManager.disableTip("");
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testDisableNullTip() {	
		TipManager.disableTip(null);
	}
	
	
	@Test
	public void testDonationTip29DaysFromNow() {
		
		DateFormat lDateFormat = new SimpleDateFormat(DATE_FORMAT);		
		Date lDate29DaysFromNow = DateUtils.addDays(new Date(), -29);
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			Properties lProperties = new Properties();
			lProperties.setProperty("donationTip");
			lProperties.setValue(lDateFormat.format(lDate29DaysFromNow));
			lPropertiesMapper.updateByPrimaryKey(lProperties);	
			lSqlSession.commit();
    	} catch (Throwable t) {	
			lSqlSession.rollback();
    	} finally {
			lSqlSession.close();
		}
    	PropertiesManager.getInstance().reload();
		TipSettings lTipSettings = TipManager.load();
		Assert.assertEquals(lTipSettings.isDonationTip(), false);
	}
	
	@Test
	public void testDonationTip30DaysFromNow() {
		
		DateFormat lDateFormat = new SimpleDateFormat(DATE_FORMAT);		
		Date lDate29DaysFromNow = DateUtils.addDays(new Date(), -30);
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			Properties lProperties = new Properties();
			lProperties.setProperty("donationTip");
			lProperties.setValue(lDateFormat.format(lDate29DaysFromNow));
			lPropertiesMapper.updateByPrimaryKey(lProperties);	
			lSqlSession.commit();
    	} catch (Throwable t) {	
			lSqlSession.rollback();
    	} finally {
			lSqlSession.close();
		}
    	PropertiesManager.getInstance().reload();
		TipSettings lTipSettings = TipManager.load();
		Assert.assertEquals(lTipSettings.isDonationTip(), true);
	}
	
	@Test
	public void testDndTips() {
		TipSettings lTipSettings = TipManager.load();		
		Assert.assertEquals(lTipSettings.getDndTipMap().get("chaptersdndTip"), true);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("scenesdndTip"), true);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("locationsdndTip"), true);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("charactersdndTip"), true);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("strandsdndTip"), true);
		
		TipManager.disableTip("chaptersdndTip");
		TipManager.disableTip("scenesdndTip");
		TipManager.disableTip("locationsdndTip");
		TipManager.disableTip("charactersdndTip");
		TipManager.disableTip("strandsdndTip");
		
		lTipSettings = TipManager.load();
		Assert.assertEquals(lTipSettings.getDndTipMap().get("chaptersdndTip"), false);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("scenesdndTip"), false);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("locationsdndTip"), false);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("charactersdndTip"), false);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("strandsdndTip"), false);
	}
	
	@Before 
	@After
	public void init() {
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			
			Properties lProperties = new Properties();
			lProperties.setProperty("sceneTip");
			lProperties.setValue("true");
			lPropertiesMapper.updateByPrimaryKey(lProperties);
			
			lProperties = new Properties();
			lProperties.setProperty("donationTip");
			lProperties.setValue("");
			lPropertiesMapper.updateByPrimaryKey(lProperties);
			
			lProperties = new Properties();
			lProperties.setProperty("chaptersdndTip");
			lProperties.setValue("true");
			lPropertiesMapper.updateByPrimaryKey(lProperties);
			
			lProperties = new Properties();
			lProperties.setProperty("scenesdndTip");
			lProperties.setValue("true");
			lPropertiesMapper.updateByPrimaryKey(lProperties);
			
			lProperties = new Properties();
			lProperties.setProperty("locationsdndTip");
			lProperties.setValue("true");
			lPropertiesMapper.updateByPrimaryKey(lProperties);
			
			lProperties = new Properties();
			lProperties.setProperty("charactersdndTip");
			lProperties.setValue("true");
			lPropertiesMapper.updateByPrimaryKey(lProperties);
			
			lProperties = new Properties();
			lProperties.setProperty("strandsdndTip");
			lProperties.setValue("true");
			lPropertiesMapper.updateByPrimaryKey(lProperties);
			
			lProperties = new Properties();
			lProperties.setProperty("socialMediaTip");
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
}
