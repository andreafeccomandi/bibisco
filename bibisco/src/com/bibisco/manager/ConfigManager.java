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
package com.bibisco.manager;

import java.util.List;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.HierarchicalConfiguration;
import org.apache.commons.configuration.XMLConfiguration;
import org.apache.commons.configuration.tree.xpath.XPathExpressionEngine;

import com.bibisco.BibiscoException;
import com.bibisco.log.Log;

/**
 * Manager of application's configuration read from bibiscoConfig.xml
 * 
 * @author Andrea Feccomandi
 *
 */
public final class ConfigManager {

	private static final String CONFIG_DIR = "";
	public static final String CONFIG_FILENAME = "bibiscoConfig.xml";
	private static final String ENCODING = "UTF-8";
	private static ConfigManager mConfigManager;
	private XMLConfiguration mXMLConfiguration;
	private Log mLog = Log.getInstance(ConfigManager.class);
	private boolean mBlnCache;

	public static ConfigManager getInstance() throws BibiscoException {
		if (mConfigManager == null) {
			mConfigManager = new ConfigManager();
		} else if (mConfigManager.mBlnCache == false) {
			mConfigManager.readConfiguration();
		}
		return mConfigManager;
	}
	private ConfigManager() {
		readConfiguration();
	}
	private void readConfiguration() {
		mXMLConfiguration = getXMLConfiguration();
		mBlnCache = getBooleanMandatoryAttribute(mXMLConfiguration, "@cacheEnabled", "config", "cacheEnabled");
		mLog.debug("Configuration read from file " + CONFIG_FILENAME);
	}

	public static ConfigManager getInstanceFromAbsolutFilePath(String pStrConfigurationFilePath) {
		if (mConfigManager == null) {
			mConfigManager = new ConfigManager(pStrConfigurationFilePath);
		}
 		return mConfigManager;
	}
	private ConfigManager(String pStrConfigurationFilePath) {
        mXMLConfiguration = new XMLConfiguration();
        mXMLConfiguration.setFileName(pStrConfigurationFilePath);
        mXMLConfiguration.setExpressionEngine(new XPathExpressionEngine());
		try {
			mXMLConfiguration.load();
		} catch (ConfigurationException e) {
			mLog.error(e,"Error while reading configuration from file ",CONFIG_FILENAME);
			throw new BibiscoException(e, "bibiscoException.configManager.errorWhileReadingConfiguration", e.getMessage());
		}
		mBlnCache = true;
		mLog.debug("ConfigManager initialized using file ", pStrConfigurationFilePath);
	}

	public Object clone() throws CloneNotSupportedException {
		throw new CloneNotSupportedException();
	}

	private XMLConfiguration getXMLConfiguration() {

		XMLConfiguration lXMLConfiguration = null;

		lXMLConfiguration = new XMLConfiguration();
		lXMLConfiguration.setEncoding(ENCODING);

		try {
			lXMLConfiguration.setBasePath(CONFIG_DIR);
			lXMLConfiguration.load(CONFIG_FILENAME);
			lXMLConfiguration.setExpressionEngine(new XPathExpressionEngine());
		} catch (ConfigurationException e) {
			mLog.error(e,"Error while reading configuration from file ",CONFIG_FILENAME);
			throw new BibiscoException(e, "bibiscoException.configManager.errorWhileReadingConfiguration", CONFIG_FILENAME, e.getMessage());
		}
		return lXMLConfiguration;
	}
	
	private String getMandatoryAttribute(HierarchicalConfiguration pHierarchicalConfiguration, String pStrPosition, String pStrAbsolutePosition4Log, String pStrAttributeName) throws BibiscoException {

		String lStrMandatoryAttributeValue;
		lStrMandatoryAttributeValue = pHierarchicalConfiguration.getString(pStrPosition);
		if (lStrMandatoryAttributeValue == null || lStrMandatoryAttributeValue.trim().equalsIgnoreCase("")) {
			mLog.error("Configuration error in file " + CONFIG_FILENAME + " at position "+pStrAbsolutePosition4Log+": attribute "+pStrAttributeName+" is mandatory");
			throw new BibiscoException("bibiscoException.configManager.getMandatoryAttribute", CONFIG_FILENAME, pStrAbsolutePosition4Log, pStrAttributeName);
		}

		return lStrMandatoryAttributeValue;
	}

	private Boolean getBooleanMandatoryAttribute(HierarchicalConfiguration pHierarchicalConfiguration, String pStrPosition, String pStrAbsolutePosition4Log, String pStrAttributeName) throws BibiscoException {

		String lStrMandatoryAttributeValue;
		Boolean lBlnMandatoryAttributeValue;

		lStrMandatoryAttributeValue = getMandatoryAttribute(pHierarchicalConfiguration, pStrPosition, pStrAbsolutePosition4Log, pStrAttributeName);
		if (lStrMandatoryAttributeValue.equalsIgnoreCase(String.valueOf(Boolean.TRUE)) 
				|| lStrMandatoryAttributeValue.equalsIgnoreCase(String.valueOf(Boolean.FALSE)) ) {
			lBlnMandatoryAttributeValue = new Boolean(lStrMandatoryAttributeValue);
		} else {
			mLog.error("Error while reading configuration "+CONFIG_FILENAME+" at position "+pStrAbsolutePosition4Log+": attribute "+pStrAttributeName+" must be a boolean.");
			throw new BibiscoException("bibiscoException.configManager.getBooleanMandatoryAttribute", CONFIG_FILENAME, pStrAbsolutePosition4Log, pStrAttributeName);
		}
		
		return lBlnMandatoryAttributeValue;
	}


	public String getProperty(String pStrProperty){
		mLog.debug("Start to retrieve " + pStrProperty + " property");
		String lStrProperty = mXMLConfiguration.getString(pStrProperty);
		mLog.debug("Returning ",lStrProperty);
		return lStrProperty;
	}
	
	public List<String> getPropertyAsList(String pStrProperty){
		mLog.debug("Start to retrieve " + pStrProperty + " property");
		@SuppressWarnings("unchecked")
		List<String> lListProperties = mXMLConfiguration.getList(pStrProperty);
		if (lListProperties!=null && lListProperties.size()>0) {
			for (String lStrProperty : lListProperties) {
				mLog.debug("Returning ",lStrProperty);
			}
		}
		
		return lListProperties;
	}
	
	public String getMandatoryProperty(String pStrProperty){
		mLog.debug("Start to retrieve " + pStrProperty + " mandatory property");
		String lString = getProperty(pStrProperty);
		
		if (lString == null){
			mLog.error("Property " + pStrProperty + " not found");
			throw new BibiscoException("bibiscoException.configManager.getProperty.PropertyNotFound", CONFIG_FILENAME, pStrProperty);
		}
		mLog.debug("Returning ",lString);
		return lString;
	}
	
	@SuppressWarnings("unchecked")
	public int getNodeChildNumber(String pStrNodeParentPath){
		List<HierarchicalConfiguration> lListNodeChild;
		lListNodeChild = mXMLConfiguration.configurationsAt(pStrNodeParentPath);
		return lListNodeChild.size();
	}
	
	@SuppressWarnings("unchecked")
	public String[] getPropertyList(String pStrCondition, String pStrProperty) {
		List<HierarchicalConfiguration> lListNodeChild;
		String[] lStrProperties;
		int lIntPropertiesFound = 0;
		     
		mLog.debug("Start getPropertyList(String,String)");
		mLog.debug("condition=",pStrCondition);
		mLog.debug("property=",pStrProperty);
		lStrProperties = null;
		lListNodeChild = mXMLConfiguration.configurationsAt(pStrCondition);
		if (lListNodeChild!=null && lListNodeChild.size()>0) {
			lIntPropertiesFound = lListNodeChild.size();
			lStrProperties = new String[lIntPropertiesFound];
			for (int i = 0; i < lStrProperties.length; i++) {
				lStrProperties[i] = lListNodeChild.get(i).getString(pStrProperty);
			}
		} 
		mLog.debug("Found ",String.valueOf(lIntPropertiesFound)," properties.");
		mLog.debug("End getPropertyList(String,String)");
		
		return lStrProperties;
	}
	
	@SuppressWarnings("unchecked")
	public String getNodeChildName(String pStrNodeParentPath){
		mLog.debug("Start getNodeChildName");
		List<HierarchicalConfiguration> lListNodeChild = mXMLConfiguration.configurationsAt(pStrNodeParentPath+"/child::*");
		HierarchicalConfiguration lHierarchicalConfiguration = lListNodeChild.get(0);
		String lStrChildName = lHierarchicalConfiguration.getRootNode().getName();
		mLog.debug("Found "+lStrChildName+ " for parent "+ pStrNodeParentPath);
		return lStrChildName;
	}
}
