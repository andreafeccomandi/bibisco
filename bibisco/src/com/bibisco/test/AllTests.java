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

import java.io.File;
import java.io.IOException;
import java.io.Reader;
import java.util.Properties;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.XMLConfiguration;
import org.apache.commons.configuration.tree.xpath.XPathExpressionEngine;
import org.apache.commons.io.FileUtils;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;


@RunWith(Suite.class)
@SuiteClasses({ PropertiesManagerTest.class, LocaleManagerTest.class, RichTextEditorSettingsManagerTest.class, VersionManagerTest.class,
		TipManagerTest.class, ProjectManagerTest.class })
public class AllTests {

	public static final String CONFIG_DIR = "";
	public static final String CONFIG_FILENAME = "bibiscoConfig.xml";
	public static final String ENCODING = "UTF-8";
	public static final String DB_USERNAME = "root";
	public static final String DB_PASSWORD = "password";
	public static final String RESOURCE_FILE_NAME = "dbConfiguration.xml";
	public static final String BIBISCO_INTERNAL_PROJECTS_DIR = "C:/temp/bibisco/projects/_internal_bibisco_projects_db_";
	public static final String TEST_PROJECT_ID = "eee0acc0-0b59-4a41-84af-7a0d345d3d4c";
	
	private static boolean mBlnEnvironmentInitialized = false;
	private static String mStrOS;
	private static String mStrAbsolutePath;
	private static String mStrPathSeparator = System.getProperty("file.separator");
	private static String mStrTestBibiscoDBFilePath;
	private static String mStrTestProjectDBFilePath;
	private static String mStrCleanDBFilePath;
	private static String mStrDBFilePath;
	private static String mStrBibiscoDBUrl;
	private static String mStrTestProjectDBUrl;
	
	@BeforeClass
	public static void cleanProjectsDirectory() throws IOException, ConfigurationException {
		FileUtils.copyFile(new File(mStrTestBibiscoDBFilePath), new File(mStrDBFilePath));
		FileUtils.cleanDirectory(new File(BIBISCO_INTERNAL_PROJECTS_DIR));
		FileUtils.copyDirectoryToDirectory(new File(mStrTestProjectDBFilePath), new File(BIBISCO_INTERNAL_PROJECTS_DIR));

	}
	
	@AfterClass
	public static void setCleanDB() throws IOException, ConfigurationException {		
		FileUtils.copyFile(new File(mStrCleanDBFilePath), new File(mStrDBFilePath));
	}
	
	@BeforeClass
	public static void init() throws ConfigurationException, IOException {
		
		XMLConfiguration lXMLConfiguration = getXMLConfiguration();
		mStrOS = lXMLConfiguration.getString("os/@value");
		mStrAbsolutePath = lXMLConfiguration.getString("test/"+mStrOS+"/@basePath");
		
		// test bibisco db file path
		StringBuilder lStringBuilderTestDBFilePath = new StringBuilder();
		lStringBuilderTestDBFilePath.append(mStrAbsolutePath);
		lStringBuilderTestDBFilePath.append("db");
		lStringBuilderTestDBFilePath.append(mStrPathSeparator);
		lStringBuilderTestDBFilePath.append("test");
		lStringBuilderTestDBFilePath.append(mStrPathSeparator);
		lStringBuilderTestDBFilePath.append("bibisco.h2.db");
		mStrTestBibiscoDBFilePath = lStringBuilderTestDBFilePath.toString();
		
		// test project db file path
		StringBuilder lStringBuilderTestProjectDBFilePath = new StringBuilder();
		lStringBuilderTestProjectDBFilePath.append(mStrAbsolutePath);
		lStringBuilderTestProjectDBFilePath.append("db");
		lStringBuilderTestProjectDBFilePath.append(mStrPathSeparator);
		lStringBuilderTestProjectDBFilePath.append("test");
		lStringBuilderTestProjectDBFilePath.append(mStrPathSeparator);
		lStringBuilderTestProjectDBFilePath.append("eee0acc0-0b59-4a41-84af-7a0d345d3d4c");
		mStrTestProjectDBFilePath = lStringBuilderTestProjectDBFilePath.toString();
		
		// clean db file path
		StringBuilder lStringBuilderCleanDBFilePath = new StringBuilder();
		lStringBuilderCleanDBFilePath.append(mStrAbsolutePath);
		lStringBuilderCleanDBFilePath.append("db");
		lStringBuilderCleanDBFilePath.append(mStrPathSeparator);
		lStringBuilderCleanDBFilePath.append("clean");
		lStringBuilderCleanDBFilePath.append(mStrPathSeparator);
		lStringBuilderCleanDBFilePath.append("bibisco.h2.db");
		mStrCleanDBFilePath = lStringBuilderCleanDBFilePath.toString();
				
		// db file path
		StringBuilder lStringBuilderDBFilePath = new StringBuilder();
		lStringBuilderDBFilePath.append(mStrAbsolutePath);
		lStringBuilderDBFilePath.append("db");
		lStringBuilderDBFilePath.append(mStrPathSeparator);
		lStringBuilderDBFilePath.append("bibisco.h2.db");
		mStrDBFilePath = lStringBuilderDBFilePath.toString();
		
		// bibisco db URL
		StringBuilder lStringBuilderBibiscoDBUrl = new StringBuilder();
		lStringBuilderBibiscoDBUrl.append("jdbc:h2:file:");
		lStringBuilderBibiscoDBUrl.append(mStrPathSeparator);
		lStringBuilderBibiscoDBUrl.append(mStrAbsolutePath);
		lStringBuilderBibiscoDBUrl.append("db");
		lStringBuilderBibiscoDBUrl.append(mStrPathSeparator);
		lStringBuilderBibiscoDBUrl.append("bibisco");
		mStrBibiscoDBUrl = lStringBuilderBibiscoDBUrl.toString();
		
		// test project db url
		StringBuilder lStringBuilderTestProjectDBUrl = new StringBuilder();
		lStringBuilderTestProjectDBUrl.append("jdbc:h2:file:");
		lStringBuilderTestProjectDBUrl.append(mStrPathSeparator);
		lStringBuilderTestProjectDBUrl.append(BIBISCO_INTERNAL_PROJECTS_DIR);
		lStringBuilderTestProjectDBUrl.append(mStrPathSeparator);
		lStringBuilderTestProjectDBUrl.append(TEST_PROJECT_ID);
		lStringBuilderTestProjectDBUrl.append(mStrPathSeparator);
		lStringBuilderTestProjectDBUrl.append(TEST_PROJECT_ID);
		mStrTestProjectDBUrl = lStringBuilderTestProjectDBUrl.toString();
		
		cleanProjectsDirectory();
		
		mBlnEnvironmentInitialized = true;
	}
	
	private static XMLConfiguration getXMLConfiguration() throws ConfigurationException {

		XMLConfiguration lXMLConfiguration = null;
		lXMLConfiguration = new XMLConfiguration();
		lXMLConfiguration.setEncoding(ENCODING);
		lXMLConfiguration.setBasePath(CONFIG_DIR);
		lXMLConfiguration.load(CONFIG_FILENAME);
		lXMLConfiguration.setExpressionEngine(new XPathExpressionEngine());

		return lXMLConfiguration;
	}
	
	public static SqlSessionFactory getBibiscoSqlSessionFactory()  {

		SqlSessionFactory mSqlSessionFactory;
		try {
			if (!mBlnEnvironmentInitialized) {
				init();
			}

			Reader lReader = Resources.getResourceAsReader(RESOURCE_FILE_NAME);
			Properties lProperties = new Properties();
			lProperties.setProperty("url", mStrBibiscoDBUrl);
			lProperties.setProperty("username", DB_USERNAME);
			lProperties.setProperty("password", DB_PASSWORD);

			mSqlSessionFactory = new SqlSessionFactoryBuilder().build(lReader, lProperties);
		} catch (Exception e) {
			throw new IllegalStateException(e);
		}

		return mSqlSessionFactory;
	}
	
	public static SqlSessionFactory getTestProjectSqlSessionFactory()  {

		SqlSessionFactory mSqlSessionFactory;
		try {
			if (!mBlnEnvironmentInitialized) {
				init();
			}
			Reader lReader = Resources.getResourceAsReader(RESOURCE_FILE_NAME);
			Properties lProperties = new Properties();
			lProperties.setProperty("url", mStrTestProjectDBUrl);
			lProperties.setProperty("username", DB_USERNAME);
			lProperties.setProperty("password", DB_PASSWORD);

			mSqlSessionFactory = new SqlSessionFactoryBuilder().build(lReader, lProperties);
		} catch (Exception e) {
			throw new IllegalStateException(e);
		}

		return mSqlSessionFactory;
	}
	
	public static SqlSessionFactory getProjectSqlSessionFactoryById(String pStrIdProject)  {

		SqlSessionFactory mSqlSessionFactory;
		try {
			if (!mBlnEnvironmentInitialized) {
				init();
			}
			Reader lReader = Resources.getResourceAsReader(RESOURCE_FILE_NAME);
			Properties lProperties = new Properties();
			StringBuilder lStringBuilderProjectDBUrl = new StringBuilder();
			lStringBuilderProjectDBUrl.append("jdbc:h2:file:");
			lStringBuilderProjectDBUrl.append(mStrPathSeparator);
			lStringBuilderProjectDBUrl.append(BIBISCO_INTERNAL_PROJECTS_DIR);
			lStringBuilderProjectDBUrl.append(mStrPathSeparator);
			lStringBuilderProjectDBUrl.append(pStrIdProject);
			lStringBuilderProjectDBUrl.append(mStrPathSeparator);
			lStringBuilderProjectDBUrl.append(pStrIdProject);
			
			lProperties.setProperty("url", lStringBuilderProjectDBUrl.toString());
			lProperties.setProperty("username", DB_USERNAME);
			lProperties.setProperty("password", DB_PASSWORD);

			mSqlSessionFactory = new SqlSessionFactoryBuilder().build(lReader, lProperties);
		} catch (Exception e) {
			throw new IllegalStateException(e);
		}

		return mSqlSessionFactory;
	}
}
