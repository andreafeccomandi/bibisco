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

import com.bibisco.manager.ContextManager;


@RunWith(Suite.class)
@SuiteClasses({ ContextManagerTest.class, PropertiesManagerTest.class, LocaleManagerTest.class, RichTextEditorSettingsManagerTest.class, VersionManagerTest.class,
		TipManagerTest.class, ProjectManagerTest.class })
public class AllTests {

	public static final String CONFIG_DIR = "";
	public static final String CONFIG_FILENAME = "bibiscoConfig.xml";
	public static final String ENCODING = "UTF-8";
	public static final String DB_USERNAME = "root";
	public static final String DB_PASSWORD = "password";
	public static final String RESOURCE_FILE_NAME = "dbConfiguration.xml";
	public static final String SQL_SESSION_ENVIRONMENT_JUNIT_TEST = "junitTest";
	public static final String SQL_SESSION_ENVIRONMENT_STANDARD = "standard";
	public static final String BIBISCO_INTERNAL_PROJECTS_DIR = "C:/temp/bibisco/projects"+ System.getProperty("file.separator") +"_internal_bibisco_projects_db_";
	public static final String TEST_PROJECT_ID = "eee0acc0-0b59-4a41-84af-7a0d345d3d4c";
	public static final String TEST_PROJECT2_ID = "eee0acc0-0b59-4a41-84af-7a0d345d3d4d";
	public static final String TEST_PROJECT3_ID = "eee0acc0-0b59-4a41-84af-7a0d345d3d4e";
	public static final String TEST_PROJECT4_ID = "eee0acc0-0b59-4a41-84af-7a0d345d3d4f";
	
	private static boolean mBlnEnvironmentInitialized = false;
	private static String mStrOS;
	private static String mStrAbsolutePath;
	private static String mStrPathSeparator = System.getProperty("file.separator");
	private static String mStrTestBibiscoDBFilePath;
	private static String mStrTestProjectDBFilePath;
	private static String mStrTestProject2DBFilePath;
	private static String mStrTestProject3DBFilePath;
	private static String mStrTestProject4DBFilePath;
	private static String mStrCleanDBFilePath;
	private static String mStrDBFilePath;
	private static String mStrBibiscoDBUrl;
	
	@BeforeClass
	public static void cleanProjectsDirectory() throws IOException, ConfigurationException {
		
		FileUtils.copyFile(new File(mStrTestBibiscoDBFilePath), new File(mStrDBFilePath));
		FileUtils.cleanDirectory(new File(BIBISCO_INTERNAL_PROJECTS_DIR));
		FileUtils.copyDirectoryToDirectory(new File(mStrTestProjectDBFilePath), new File(BIBISCO_INTERNAL_PROJECTS_DIR));
		FileUtils.copyDirectoryToDirectory(new File(mStrTestProject2DBFilePath), new File(BIBISCO_INTERNAL_PROJECTS_DIR));
		FileUtils.copyDirectoryToDirectory(new File(mStrTestProject3DBFilePath), new File(BIBISCO_INTERNAL_PROJECTS_DIR));
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
		mStrTestBibiscoDBFilePath = lStringBuilderTestDBFilePath.toString() + ("bibisco.h2.db");

		// test project 1 db file path
		StringBuilder lStringBuilderTestProjectDBFilePath = new StringBuilder();
		lStringBuilderTestProjectDBFilePath.append(mStrAbsolutePath);
		lStringBuilderTestProjectDBFilePath.append("db");
		lStringBuilderTestProjectDBFilePath.append(mStrPathSeparator);
		lStringBuilderTestProjectDBFilePath.append("test");
		lStringBuilderTestProjectDBFilePath.append(mStrPathSeparator);
		lStringBuilderTestProjectDBFilePath.append(TEST_PROJECT_ID);
		mStrTestProjectDBFilePath = lStringBuilderTestProjectDBFilePath.toString();
				
		// test project 2 db file path
		StringBuilder lStringBuilderTestProject2DBFilePath = new StringBuilder();
		lStringBuilderTestProject2DBFilePath.append(mStrAbsolutePath);
		lStringBuilderTestProject2DBFilePath.append("db");
		lStringBuilderTestProject2DBFilePath.append(mStrPathSeparator);
		lStringBuilderTestProject2DBFilePath.append("test");
		lStringBuilderTestProject2DBFilePath.append(mStrPathSeparator);
		lStringBuilderTestProject2DBFilePath.append(TEST_PROJECT2_ID);
		mStrTestProject2DBFilePath = lStringBuilderTestProject2DBFilePath.toString();
				
		// test project 3 db file path
		StringBuilder lStringBuilderTestProject3DBFilePath = new StringBuilder();
		lStringBuilderTestProject3DBFilePath.append(mStrAbsolutePath);
		lStringBuilderTestProject3DBFilePath.append("db");
		lStringBuilderTestProject3DBFilePath.append(mStrPathSeparator);
		lStringBuilderTestProject3DBFilePath.append("test");
		lStringBuilderTestProject3DBFilePath.append(mStrPathSeparator);
		lStringBuilderTestProject3DBFilePath.append(TEST_PROJECT3_ID);
		mStrTestProject3DBFilePath = lStringBuilderTestProject3DBFilePath.toString();
		
		// test project 4 db file path
		StringBuilder lStringBuilderTestProject4DBFilePath = new StringBuilder();
		lStringBuilderTestProject4DBFilePath.append(mStrAbsolutePath);
		lStringBuilderTestProject4DBFilePath.append("db");
		lStringBuilderTestProject4DBFilePath.append(mStrPathSeparator);
		lStringBuilderTestProject4DBFilePath.append("test");
		lStringBuilderTestProject4DBFilePath.append(mStrPathSeparator);
		lStringBuilderTestProject4DBFilePath.append(TEST_PROJECT4_ID);
		mStrTestProject4DBFilePath = lStringBuilderTestProject4DBFilePath.toString();
		
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
		
		cleanProjectsDirectory();
		
		// set junit test running
		ContextManager.getInstance().setJunitTestRunning(true);
		
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

			mSqlSessionFactory = new SqlSessionFactoryBuilder().build(lReader, SQL_SESSION_ENVIRONMENT_JUNIT_TEST, lProperties);
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

	public static String getCleanDBFilePath() {
		return mStrCleanDBFilePath;
	}

	public static String getPathSeparator() {
		return mStrPathSeparator;
	}

	public static String getAbsolutePath() {
		return mStrAbsolutePath;
	}

	public static String getTempPath() {
		return mStrAbsolutePath + mStrPathSeparator + "temp";
	}
	
	public static String getExportPath() {
		return mStrAbsolutePath + mStrPathSeparator + "export";
	}
	
	public static String getTestProjectDBFilePath() {
		return mStrTestProjectDBFilePath;
	}
	
	public static String getTestProject2DBFilePath() {
		return mStrTestProject2DBFilePath;
	}
	
	public static String getTestProject3DBFilePath() {
		return mStrTestProject3DBFilePath;
	}
	
	public static String getTestProject4DBFilePath() {
		return mStrTestProject4DBFilePath;
	}
}
