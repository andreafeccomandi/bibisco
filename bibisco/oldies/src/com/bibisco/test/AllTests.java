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

import java.io.File;
import java.io.IOException;
import java.io.Reader;
import java.util.Date;
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
		TipManagerTest.class, ProjectManagerTest.class, ImageManagerTest.class })
public class AllTests {

	public static final String CONFIG_DIR = "";
	public static final String CONFIG_FILENAME = "bibiscoConfig.xml";
	public static final String ENCODING = "UTF-8";
	public static final String DB_USERNAME = "root";
	public static final String DB_PASSWORD = "password";
	public static final String RESOURCE_FILE_NAME = "dbConfiguration.xml";
	public static final String SQL_SESSION_ENVIRONMENT_JUNIT_TEST = "junitTest";
	public static final String SQL_SESSION_ENVIRONMENT_STANDARD = "standard";
	public static final String BIBISCO_PROJECTS_DIR = "C:\\temp\\bibisco\\projects";
	public static final String BIBISCO_NEW_PROJECTS_DIR = "C:\\temp\\bibisco\\new_projects";
	public static final String BIBISCO_FORBIDDEN_PROJECTS_DIR = "C:\\temp\\bibisco\\forbidden_projects";
	public static final String BIBISCO_INTERNAL_PROJECTS_DIR = BIBISCO_PROJECTS_DIR + System.getProperty("file.separator") +"_internal_bibisco_projects_db_";
	public static final String BIBISCO_INTERNAL_PROJECTS_DIR_TO_DELETE = BIBISCO_PROJECTS_DIR + System.getProperty("file.separator") +"_internal_bibisco_projects_db_to_delete";
	public static final String BIBISCO_INTERNAL_PROJECTS_DIR_NEW_PROJECTS = BIBISCO_NEW_PROJECTS_DIR + System.getProperty("file.separator") +"_internal_bibisco_projects_db_";
	public static final String BIBISCO_EXPORT_PROJECT_DIR = "C:\\temp\\bibisco\\export";
	public static final String BIBISCO_FORBIDDEN_EXPORT_PROJECT_DIR = "C:\\temp\\bibisco\\forbidden_export";
	public static final String TEST_PROJECT_ID = "eee0acc0-0b59-4a41-84af-7a0d345d3d4c";
	public static final String TEST_PROJECT2_ID = "eee0acc0-0b59-4a41-84af-7a0d345d3d4d";
	public static final String TEST_PROJECT3_ID = "eee0acc0-0b59-4a41-84af-7a0d345d3d4e";
	public static final String TEST_PROJECT4_ID = "eee0acc0-0b59-4a41-84af-7a0d345d3d4f";
	public static final String TEST_PROJECT_ARCHIVE_NOT_PRESENT_ID = "fdcf96e8-f533-4b8e-af47-d31ec35ff3fc";
	public static final String TEST_PROJECT_ARCHIVE_FILE = "Test_archive_20151210090211.bibisco";
	public static final String TEST_PROJECT_ARCHIVE_NOT_PRESENT_FILE = "Testprojectnewarchive_archive_20151210225455.bibisco";
	public static final String TEST_PROJECT_IMAGE_1 = "d7f1d2bf-bebd-4c0f-a82f-798a39b2e190.jpg";
	public static final String TEST_PROJECT_IMAGE_2 = "aa6fb1ee-6235-4b9c-82b1-4a822c22194c.jpg";
	public static final String TEST_PROJECT_IMAGE_3 = "53722941-51f0-4bca-a7b2-cf8ab8f21b4b.jpg";
	public static final String TEST_PROJECT_IMAGE_4 = "8c82f96c-3c73-40c6-8c19-b52d7bfa42da.jpg";
	public static final String TEST_PROJECT_IMAGE_5 = "3a500f6c-a6b1-4364-b5cd-15d6054eec96.jpg";
	public static final String TEST_PROJECT_IMAGE_6 = "40c2ab94-ac20-41ea-87cf-20fff7b447e3.jpg";
	public static final String TEST_PROJECT_IMAGE_7 = "16e5f733-3a97-439c-a95c-321e6fbc737e.jpg";
	public static final String TEST_PROJECT_IMAGE_8 = "cb8c9b37-406b-436d-8eab-4d69a0fa2a7f.jpg";
	public static final String TEST_PROJECT_IMAGE_9 = "7b439448-db3c-48e3-868e-6ec4b3f1e97b.jpg";
	
	private static boolean mBlnEnvironmentInitialized = false;
	private static String mStrOS;
	private static String mStrAbsolutePath;
	private static String mStrPathSeparator = System.getProperty("file.separator");
	private static String mStrTestBibiscoDBFilePath;
	private static String mStrTestProjectDBFilePath;
	private static String mStrTestProjectArchiveFilePath;
	private static String mStrTestProject2DBFilePath;
	private static String mStrTestProject3DBFilePath;
	private static String mStrTestProjectArchiveNotPresentFilePath;
	
	private static String mStrImage1FilePath;
	private static String mStrImage2FilePath;
	private static String mStrImage3FilePath;
	private static String mStrImage4FilePath;
	private static String mStrImage5FilePath;
	private static String mStrImage6FilePath;
	
	private static String mStrTestProject4DBFilePath;
	private static String mStrCleanDBFilePath;
	private static String mStrDBFilePath;
	private static String mStrBibiscoDBUrl;
	
	@BeforeClass
	public static void cleanProjectsDirectory() throws IOException, ConfigurationException, InterruptedException {
		
		if (!mBlnEnvironmentInitialized) {
			init();
		}
		
		System.out.println("*************** cleanProjectsDirectory() ***********************");
		String lStrTimestamp = String.valueOf((new Date()).getTime());
		File lFileRenameTo = new File(BIBISCO_INTERNAL_PROJECTS_DIR_TO_DELETE + "_" + lStrTimestamp);
		(new File(BIBISCO_INTERNAL_PROJECTS_DIR)).renameTo(lFileRenameTo);
		
		new File(BIBISCO_INTERNAL_PROJECTS_DIR).mkdir();
		FileUtils.copyFile(new File(mStrTestBibiscoDBFilePath), new File(mStrDBFilePath));
		
		FileUtils.copyDirectoryToDirectory(new File(mStrTestProjectDBFilePath), new File(BIBISCO_INTERNAL_PROJECTS_DIR));
		FileUtils.copyDirectoryToDirectory(new File(mStrTestProject2DBFilePath), new File(BIBISCO_INTERNAL_PROJECTS_DIR));
		FileUtils.copyDirectoryToDirectory(new File(mStrTestProject3DBFilePath), new File(BIBISCO_INTERNAL_PROJECTS_DIR));
	}
	
	public static void cleanTestProjectDB() throws IOException {
		FileUtils.copyFile(new File(mStrTestBibiscoDBFilePath), new File(mStrDBFilePath));
		FileUtils.copyDirectoryToDirectory(new File(mStrTestProjectDBFilePath), new File(BIBISCO_INTERNAL_PROJECTS_DIR));
	}
	
	@AfterClass
	public static void setCleanDB() throws IOException, ConfigurationException {		
		FileUtils.copyFile(new File(mStrCleanDBFilePath), new File(mStrDBFilePath));
	}
	
	@BeforeClass
	public static void init() throws ConfigurationException, IOException, InterruptedException {
		
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
		
		// test project 1 archive path
		StringBuilder lStringBuilderTestProjectArchiveFilePath = new StringBuilder();
		lStringBuilderTestProjectArchiveFilePath.append(mStrAbsolutePath);
		lStringBuilderTestProjectArchiveFilePath.append("db");
		lStringBuilderTestProjectArchiveFilePath.append(mStrPathSeparator);
		lStringBuilderTestProjectArchiveFilePath.append("test");
		lStringBuilderTestProjectArchiveFilePath.append(mStrPathSeparator);
		lStringBuilderTestProjectArchiveFilePath.append(TEST_PROJECT_ARCHIVE_FILE);
		mStrTestProjectArchiveFilePath = lStringBuilderTestProjectArchiveFilePath.toString();
				
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
		
		// test project 1 archive path
		StringBuilder lStringBuilderTestProjectArchiveNotPresentFilePath = new StringBuilder();
		lStringBuilderTestProjectArchiveNotPresentFilePath.append(mStrAbsolutePath);
		lStringBuilderTestProjectArchiveNotPresentFilePath.append("db");
		lStringBuilderTestProjectArchiveNotPresentFilePath.append(mStrPathSeparator);
		lStringBuilderTestProjectArchiveNotPresentFilePath.append("test");
		lStringBuilderTestProjectArchiveNotPresentFilePath.append(mStrPathSeparator);
		lStringBuilderTestProjectArchiveNotPresentFilePath.append(TEST_PROJECT_ARCHIVE_NOT_PRESENT_FILE);
		mStrTestProjectArchiveNotPresentFilePath = lStringBuilderTestProjectArchiveNotPresentFilePath.toString();
		
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
		
		// image1 file path
		StringBuilder lStringBuilderImage1FilePath = new StringBuilder();
		lStringBuilderImage1FilePath.append(mStrAbsolutePath);
		lStringBuilderImage1FilePath.append("db");
		lStringBuilderImage1FilePath.append(mStrPathSeparator);
		lStringBuilderImage1FilePath.append("test");
		lStringBuilderImage1FilePath.append(mStrPathSeparator);
		lStringBuilderImage1FilePath.append("image1.jpg");
		mStrImage1FilePath = lStringBuilderImage1FilePath.toString();
		
		// image2 file path
		StringBuilder lStringBuilderImage2FilePath = new StringBuilder();
		lStringBuilderImage2FilePath.append(mStrAbsolutePath);
		lStringBuilderImage2FilePath.append("db");
		lStringBuilderImage2FilePath.append(mStrPathSeparator);
		lStringBuilderImage2FilePath.append("test");
		lStringBuilderImage2FilePath.append(mStrPathSeparator);
		lStringBuilderImage2FilePath.append("image2.jpg");
		mStrImage2FilePath = lStringBuilderImage2FilePath.toString();
		
		// image3 file path
		StringBuilder lStringBuilderImage3FilePath = new StringBuilder();
		lStringBuilderImage3FilePath.append(mStrAbsolutePath);
		lStringBuilderImage3FilePath.append("db");
		lStringBuilderImage3FilePath.append(mStrPathSeparator);
		lStringBuilderImage3FilePath.append("test");
		lStringBuilderImage3FilePath.append(mStrPathSeparator);
		lStringBuilderImage3FilePath.append("image3.jpg");
		mStrImage3FilePath = lStringBuilderImage3FilePath.toString();
		
		// image4 file path
		StringBuilder lStringBuilderImage4FilePath = new StringBuilder();
		lStringBuilderImage4FilePath.append(mStrAbsolutePath);
		lStringBuilderImage4FilePath.append("db");
		lStringBuilderImage4FilePath.append(mStrPathSeparator);
		lStringBuilderImage4FilePath.append("test");
		lStringBuilderImage4FilePath.append(mStrPathSeparator);
		lStringBuilderImage4FilePath.append("image4.jpg");
		mStrImage4FilePath = lStringBuilderImage4FilePath.toString();
		
		// image5 file path
		StringBuilder lStringBuilderImage5FilePath = new StringBuilder();
		lStringBuilderImage5FilePath.append(mStrAbsolutePath);
		lStringBuilderImage5FilePath.append("db");
		lStringBuilderImage5FilePath.append(mStrPathSeparator);
		lStringBuilderImage5FilePath.append("test");
		lStringBuilderImage5FilePath.append(mStrPathSeparator);
		lStringBuilderImage5FilePath.append("image5.jpg");
		mStrImage5FilePath = lStringBuilderImage5FilePath.toString();
		
		// image6 file path
		StringBuilder lStringBuilderImage6FilePath = new StringBuilder();
		lStringBuilderImage6FilePath.append(mStrAbsolutePath);
		lStringBuilderImage6FilePath.append("db");
		lStringBuilderImage6FilePath.append(mStrPathSeparator);
		lStringBuilderImage6FilePath.append("test");
		lStringBuilderImage6FilePath.append(mStrPathSeparator);
		lStringBuilderImage6FilePath.append("image6.jpg");
		mStrImage6FilePath = lStringBuilderImage6FilePath.toString();
		
		FileUtils.cleanDirectory(new File(BIBISCO_PROJECTS_DIR));
		new File(BIBISCO_INTERNAL_PROJECTS_DIR).mkdir();
		FileUtils.copyFile(new File(mStrTestBibiscoDBFilePath), new File(mStrDBFilePath));
		FileUtils.copyDirectoryToDirectory(new File(mStrTestProjectDBFilePath), new File(BIBISCO_INTERNAL_PROJECTS_DIR));
		FileUtils.copyDirectoryToDirectory(new File(mStrTestProject2DBFilePath), new File(BIBISCO_INTERNAL_PROJECTS_DIR));
		FileUtils.copyDirectoryToDirectory(new File(mStrTestProject3DBFilePath), new File(BIBISCO_INTERNAL_PROJECTS_DIR));
		
		// set junit test running
		ContextManager.getInstance().setJunitTestRunning(true);
		
		mBlnEnvironmentInitialized = true;
	}
	
	public static String getTestProjectArchiveFilePath() {
		return mStrTestProjectArchiveFilePath;
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
	
	public static String getTestProjectArchiveNotPresentFilePath() {
		return mStrTestProjectArchiveNotPresentFilePath;
	}
	
	public static String getImage1FilePath() {
		return mStrImage1FilePath;
	}

	public static String getImage2FilePath() {
		return mStrImage2FilePath;
	}

	public static String getImage3FilePath() {
		return mStrImage3FilePath;
	}

	public static String getImage4FilePath() {
		return mStrImage4FilePath;
	}

	public static String getImage5FilePath() {
		return mStrImage5FilePath;
	}

	public static String getImage6FilePath() {
		return mStrImage6FilePath;
	}
}
