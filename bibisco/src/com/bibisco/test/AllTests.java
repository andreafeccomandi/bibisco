package com.bibisco.test;

import java.io.File;
import java.io.IOException;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.XMLConfiguration;
import org.apache.commons.configuration.tree.xpath.XPathExpressionEngine;
import org.apache.commons.io.FileUtils;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

@RunWith(Suite.class)
@SuiteClasses({ PropertiesManagerTest.class, LocaleManagerTest.class, RichTextEditorSettingsManagerTest.class, VersionManagerTest.class,
		TipManagerTest.class, ProjectManagerTest.class })
public class AllTests {

	private static final String CONFIG_DIR = "";
	private static final String CONFIG_FILENAME = "bibiscoConfig.xml";
	private static final String ENCODING = "UTF-8";
	
	@BeforeClass
	public static void setTestDB() throws IOException, ConfigurationException {
		
		XMLConfiguration lXMLConfiguration = getXMLConfiguration();
		String lStrOS = lXMLConfiguration.getString("os/@value");
		String lStrAbsolutePath = lXMLConfiguration.getString("test/"+lStrOS+"/@basePath");
		String lStrPathSeparator = System.getProperty("file.separator");;
		
		// test db file path
		StringBuilder lStringBuilderTestDBFilePath = new StringBuilder();
		lStringBuilderTestDBFilePath.append(lStrAbsolutePath);
		lStringBuilderTestDBFilePath.append("db");
		lStringBuilderTestDBFilePath.append(lStrPathSeparator);
		lStringBuilderTestDBFilePath.append("test");
		lStringBuilderTestDBFilePath.append(lStrPathSeparator);
		lStringBuilderTestDBFilePath.append("bibisco.h2.db");
				
		// db file path
		StringBuilder lStringBuilderDBFilePath = new StringBuilder();
		lStringBuilderDBFilePath.append(lStrAbsolutePath);
		lStringBuilderDBFilePath.append("db");
		lStringBuilderDBFilePath.append(lStrPathSeparator);
		lStringBuilderDBFilePath.append("bibisco.h2.db");
		
		FileUtils.copyFile(new File(lStringBuilderTestDBFilePath.toString()), new File(lStringBuilderDBFilePath.toString()));
	}
	
	@AfterClass
	public static void setCleanDB() throws IOException, ConfigurationException {
		
		XMLConfiguration lXMLConfiguration = getXMLConfiguration();
		String lStrOS = lXMLConfiguration.getString("os/@value");
		String lStrAbsolutePath = lXMLConfiguration.getString("test/"+lStrOS+"/@basePath");
		String lStrPathSeparator = System.getProperty("file.separator");;
		
		// test db file path
		StringBuilder lStringBuilderCleanDBFilePath = new StringBuilder();
		lStringBuilderCleanDBFilePath.append(lStrAbsolutePath);
		lStringBuilderCleanDBFilePath.append("db");
		lStringBuilderCleanDBFilePath.append(lStrPathSeparator);
		lStringBuilderCleanDBFilePath.append("clean");
		lStringBuilderCleanDBFilePath.append(lStrPathSeparator);
		lStringBuilderCleanDBFilePath.append("bibisco.h2.db");
				
		// db file path
		StringBuilder lStringBuilderDBFilePath = new StringBuilder();
		lStringBuilderDBFilePath.append(lStrAbsolutePath);
		lStringBuilderDBFilePath.append("db");
		lStringBuilderDBFilePath.append(lStrPathSeparator);
		lStringBuilderDBFilePath.append("bibisco.h2.db");
		
		FileUtils.copyFile(new File(lStringBuilderCleanDBFilePath.toString()), new File(lStringBuilderDBFilePath.toString()));
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
}
