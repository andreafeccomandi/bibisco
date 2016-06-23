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

import com.bibisco.bean.RichTextEditorSettings;
import com.bibisco.dao.client.PropertiesMapper;
import com.bibisco.dao.model.Properties;
import com.bibisco.manager.PropertiesManager;
import com.bibisco.manager.RichTextEditorSettingsManager;

public class RichTextEditorSettingsManagerTest {
	
	
	@Test
	public void testLoadSettings() {
	
		RichTextEditorSettings lRichTextEditorSettings = RichTextEditorSettingsManager.load();
		Assert.assertEquals(lRichTextEditorSettings.getFont(), "courier");
		Assert.assertEquals(lRichTextEditorSettings.getSize(), "medium");
		Assert.assertEquals(lRichTextEditorSettings.isIndentParagraphEnabled(), true);
		Assert.assertEquals(lRichTextEditorSettings.isSpellCheckEnabled(), true);	
		Assert.assertEquals(lRichTextEditorSettings.isAutoSaveEnabled(), true);
	}
	
	@Test
	public void testSaveSettings() {
		
		RichTextEditorSettings lRichTextEditorSettings = new RichTextEditorSettings();
		lRichTextEditorSettings.setFont("arial");
		lRichTextEditorSettings.setSize("small");
		lRichTextEditorSettings.setIndentParagraphEnabled(false);
		lRichTextEditorSettings.setSpellCheckEnabled(false);
		lRichTextEditorSettings.setAutoSaveEnabled(false);
		RichTextEditorSettingsManager.save(lRichTextEditorSettings);
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	Properties lProperties;
    	String lStrFont;
    	String lStrFontSize;
    	String lStrIndentParagraphEnabled;
    	String lStrSpellCheckEnabled;
    	String lStrAutoSaveEnabled;
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			lProperties = lPropertiesMapper.selectByPrimaryKey("font");
			lStrFont = lProperties.getValue();
			lProperties = lPropertiesMapper.selectByPrimaryKey("font-size");
			lStrFontSize = lProperties.getValue();
			lProperties = lPropertiesMapper.selectByPrimaryKey("indentParagraphEnabled");
			lStrIndentParagraphEnabled = lProperties.getValue();
			lProperties = lPropertiesMapper.selectByPrimaryKey("spellCheckEnabled");
			lStrSpellCheckEnabled = lProperties.getValue();
			lProperties = lPropertiesMapper.selectByPrimaryKey("autoSaveEnabled");
			lStrAutoSaveEnabled = lProperties.getValue();
    	} finally {
			lSqlSession.close();
		}
    	
		Assert.assertEquals(lStrFont, "arial");
		Assert.assertEquals(lStrFontSize, "small");
		Assert.assertEquals(lStrIndentParagraphEnabled, "false");
		Assert.assertEquals(lStrSpellCheckEnabled, "false");
		Assert.assertEquals(lStrAutoSaveEnabled, "false");
	}
		
	@Before 
	@After
	public void init() {
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			
			Properties lProperties = new Properties();
			lProperties.setProperty("font");
			lProperties.setValue("courier");
			lPropertiesMapper.updateByPrimaryKey(lProperties);
			
			lProperties = new Properties();
			lProperties.setProperty("font-size");
			lProperties.setValue("medium");
			lPropertiesMapper.updateByPrimaryKey(lProperties);
			
			lProperties = new Properties();
			lProperties.setProperty("indentParagraphEnabled");
			lProperties.setValue("true");
			lPropertiesMapper.updateByPrimaryKey(lProperties);
			
			lProperties = new Properties();
			lProperties.setProperty("spellCheckEnabled");
			lProperties.setValue("true");
			lPropertiesMapper.updateByPrimaryKey(lProperties);
			
			lProperties = new Properties();
			lProperties.setProperty("autoSaveEnabled");
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

	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
	public void testSaveSettingsWithNullRichTextEditorSettings() {
		RichTextEditorSettingsManager.save(null);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testSaveSettingsWithNullFont() {
		RichTextEditorSettings lRichTextEditorSettings = new RichTextEditorSettings();
		lRichTextEditorSettings.setSize("small");
		lRichTextEditorSettings.setIndentParagraphEnabled(false);
		lRichTextEditorSettings.setSpellCheckEnabled(false);
		lRichTextEditorSettings.setAutoSaveEnabled(false);
		RichTextEditorSettingsManager.save(lRichTextEditorSettings);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testSaveSettingsWithWrongFontValue() {
		RichTextEditorSettings lRichTextEditorSettings = new RichTextEditorSettings();
		lRichTextEditorSettings.setFont("small");
		lRichTextEditorSettings.setSize("small");
		lRichTextEditorSettings.setIndentParagraphEnabled(false);
		lRichTextEditorSettings.setSpellCheckEnabled(false);
		RichTextEditorSettingsManager.save(lRichTextEditorSettings);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testSaveSettingsWithNullFontSize() {
		RichTextEditorSettings lRichTextEditorSettings = new RichTextEditorSettings();
		lRichTextEditorSettings.setFont("arial");
		lRichTextEditorSettings.setIndentParagraphEnabled(false);
		lRichTextEditorSettings.setSpellCheckEnabled(false);
		lRichTextEditorSettings.setAutoSaveEnabled(false);
		RichTextEditorSettingsManager.save(lRichTextEditorSettings);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testSaveSettingsWithWrongFontSizeValue() {
		RichTextEditorSettings lRichTextEditorSettings = new RichTextEditorSettings();
		lRichTextEditorSettings.setFont("arial");
		lRichTextEditorSettings.setSize("arial");
		lRichTextEditorSettings.setIndentParagraphEnabled(false);
		lRichTextEditorSettings.setSpellCheckEnabled(false);
		lRichTextEditorSettings.setAutoSaveEnabled(false);
		RichTextEditorSettingsManager.save(lRichTextEditorSettings);
	}
	
	@Test
	public void testSaveSettingsWithoutIndentParagraphEnabled() {
		RichTextEditorSettings lRichTextEditorSettings = new RichTextEditorSettings();
		lRichTextEditorSettings.setFont("arial");
		lRichTextEditorSettings.setSize("small");
		lRichTextEditorSettings.setIndentParagraphEnabled(false);
		lRichTextEditorSettings.setSpellCheckEnabled(true);
		lRichTextEditorSettings.setAutoSaveEnabled(true);
		RichTextEditorSettingsManager.save(lRichTextEditorSettings);
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	Properties lProperties;
    	String lStrIndentParagraphEnabled;
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			lProperties = lPropertiesMapper.selectByPrimaryKey("indentParagraphEnabled");
			lStrIndentParagraphEnabled = lProperties.getValue();
    	} finally {
			lSqlSession.close();
		}
    	
    	Assert.assertEquals(lStrIndentParagraphEnabled, "false");
	}
	
	@Test
	public void testSaveSettingsWithoutSpellCheckEnabled() {
		RichTextEditorSettings lRichTextEditorSettings = new RichTextEditorSettings();
		lRichTextEditorSettings.setFont("arial");
		lRichTextEditorSettings.setSize("small");
		lRichTextEditorSettings.setIndentParagraphEnabled(true);
		lRichTextEditorSettings.setSpellCheckEnabled(false);
		lRichTextEditorSettings.setAutoSaveEnabled(true);
		RichTextEditorSettingsManager.save(lRichTextEditorSettings);
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	Properties lProperties;
    	String lStrSpellCheckEnabled;
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			lProperties = lPropertiesMapper.selectByPrimaryKey("spellCheckEnabled");
			lStrSpellCheckEnabled = lProperties.getValue();
    	} finally {
			lSqlSession.close();
		}
    	
    	Assert.assertEquals(lStrSpellCheckEnabled, "false");
	}
	
	@Test
	public void testSaveSettingsWithoutAutoSaveEnabled() {
		RichTextEditorSettings lRichTextEditorSettings = new RichTextEditorSettings();
		lRichTextEditorSettings.setFont("arial");
		lRichTextEditorSettings.setSize("small");
		lRichTextEditorSettings.setIndentParagraphEnabled(true);
		lRichTextEditorSettings.setSpellCheckEnabled(true);
		lRichTextEditorSettings.setAutoSaveEnabled(false);
		RichTextEditorSettingsManager.save(lRichTextEditorSettings);
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	Properties lProperties;
    	String lStrAutoSaveEnabled;
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			lProperties = lPropertiesMapper.selectByPrimaryKey("autoSaveEnabled");
			lStrAutoSaveEnabled = lProperties.getValue();
    	} finally {
			lSqlSession.close();
		}
    	
    	Assert.assertEquals(lStrAutoSaveEnabled, "false");
	}
}
