/*
 * Copyright (C) 2014 Andrea Feccomandi
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

import java.io.File;
import java.net.URI;

import javax.ws.rs.core.UriBuilder;

import org.apache.commons.io.FilenameUtils;
import org.eclipse.core.runtime.Platform;

import com.bibisco.log.Log;


/**
 * Application's context manager.
 * 
 * @author Andrea Feccomandi
 *
 */
public class ContextManager {
	
	private static Log mLog = Log.getInstance(ContextManager.class);
	private static ContextManager mContextManager;
	
	private boolean mBlnTest;
	private String mStrAbsolutePath;
	private String mStrDbDirectoryPath;
	private String mStrExportDirectoryPath;
	private String mStrTempDirectoryPath;
	private String mStrTemplateDbDirectoryPath;
	private String mStrXulRunnerDirectoryPath;
	private String mStrPathSeparator;
	private String mStrOS;
	private String mStrIdProject;
	private String mStrProjectLanguage;
	private URI mURIWeb;


	public String getProjectLanguage() {
		return mStrProjectLanguage;
	}

	public void setProjectLanguage(String mStrProjectLanguage) {
		this.mStrProjectLanguage = mStrProjectLanguage;
	}

	public synchronized static ContextManager getInstance() {
		if (mContextManager == null) {
			mContextManager = new ContextManager();
		}
		return mContextManager;
	}
	
	private ContextManager() {
		ConfigManager lConfigManager = ConfigManager.getInstance();
		
		// os
		mStrOS = calculateOSName();

		// test or production
		String lStrTestEnabled = lConfigManager.getMandatoryProperty("test/@enabled");
		mBlnTest = "Y".equalsIgnoreCase(lStrTestEnabled);
		
		// absolute path
		if (mBlnTest) {			
			mStrAbsolutePath = lConfigManager.getProperty("test/"+mStrOS+"/@basePath");
		} else {
			String lStrPath = Platform.getInstallLocation().getURL().getPath();
			if ("win".equalsIgnoreCase(mStrOS)) {
				// remove the first slash to have the correct path on windows
				lStrPath = lStrPath.substring(1);
			}
			mStrAbsolutePath = FilenameUtils.separatorsToSystem(lStrPath);
		}
				
		// web URI
		mURIWeb = UriBuilder.fromUri(lConfigManager.getMandatoryProperty("web/@uri")).build();
		
		// file separator
		mStrPathSeparator = getPathSeparator();
		
		StringBuilder lStringBuilder = new StringBuilder();
		
		// db directory path
		lStringBuilder = new StringBuilder();
		lStringBuilder.append(mStrAbsolutePath);
		lStringBuilder.append("db");
		lStringBuilder.append(mStrPathSeparator);		
		mStrDbDirectoryPath = lStringBuilder.toString();

		// temp directory path
		lStringBuilder = new StringBuilder();
		lStringBuilder.append(mStrAbsolutePath);
		lStringBuilder.append("temp");
		lStringBuilder.append(mStrPathSeparator);		
		mStrTempDirectoryPath = lStringBuilder.toString();
		
		// export directory path
		lStringBuilder = new StringBuilder();
		lStringBuilder.append(mStrAbsolutePath);	
		lStringBuilder.append("export");
		lStringBuilder.append(mStrPathSeparator);
		mStrExportDirectoryPath = lStringBuilder.toString();
		
		// template db directory path
		lStringBuilder = new StringBuilder();
		lStringBuilder.append(mStrAbsolutePath);
		lStringBuilder.append("db");
		lStringBuilder.append(mStrPathSeparator);
		lStringBuilder.append("template");
		lStringBuilder.append(mStrPathSeparator);
		mStrTemplateDbDirectoryPath = lStringBuilder.toString();
		
		// xulrunner directory path
		lStringBuilder = new StringBuilder();
		lStringBuilder.append(mStrAbsolutePath);
		lStringBuilder.append("xulrunner");
		lStringBuilder.append(mStrPathSeparator);
		lStringBuilder.append(mStrOS);
		mStrXulRunnerDirectoryPath = lStringBuilder.toString();
				
		mLog.info("*** OS: ", mStrOS);		
		mLog.info("*** Absolute path: ", mStrAbsolutePath);
		mLog.info("*** db: ", mStrDbDirectoryPath);
		mLog.info("*** export: ", mStrExportDirectoryPath);
		mLog.info("*** temp: ", mStrTempDirectoryPath);
		mLog.info("*** Template db directory path: ", mStrTemplateDbDirectoryPath);
		mLog.info("*** Xulrunner directory path: ", mStrXulRunnerDirectoryPath);
	}
	
	public String getOS() {
		return mStrOS;
	}

	public static String calculateOSName() {
		String lStrOS = System.getProperty("os.name").toLowerCase();
		if (lStrOS.indexOf("win") >= 0) {
			return "win";
		}
		if (lStrOS.indexOf("mac") >= 0) {
			return "mac";
		}
		if (lStrOS.indexOf("nix") >= 0 || lStrOS.indexOf("nux") >= 0) {
			return "linux";
		}
		return null;
	}

	public Object clone() throws CloneNotSupportedException {
		throw new CloneNotSupportedException();
	}

	public String getAbsolutePath() {
		return mStrAbsolutePath;
	}

	public boolean isTest() {
		return mBlnTest;
	}

	public static String getPathSeparator() {
		return System.getProperty("file.separator");
	}
	
	public String getIdProject() {
		return mStrIdProject;
	}

	public void setIdProject(String pStrIdProject) {
		mStrIdProject = pStrIdProject;
	}

	public URI getURIWeb() {
		return mURIWeb;
	}

	public String getDbDirectoryPath() {
		File lFileDbDirectory = new File(mStrDbDirectoryPath);
		if (!lFileDbDirectory.exists()) {
			lFileDbDirectory.mkdirs();
		}
		return mStrDbDirectoryPath;
	}
	
	public String getExportDirectoryPath() {
		File lFileExportDirectory = new File(mStrExportDirectoryPath);
		if (!lFileExportDirectory.exists()) {
			lFileExportDirectory.mkdirs();
		}
		return mStrExportDirectoryPath;
	}

	public String getTempDirectoryPath() {
		File lFileTempDirectory = new File(mStrTempDirectoryPath);
		if (!lFileTempDirectory.exists()) {
			lFileTempDirectory.mkdirs();
		}
		return mStrTempDirectoryPath;
	}

	public String getTemplateDbDirectoryPath() {
		return mStrTemplateDbDirectoryPath;
	}

	public String getXulRunnerDirectoryPath() {
		return mStrXulRunnerDirectoryPath;
	}
	
		
}
