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

import java.net.URI;

import javax.ws.rs.core.UriBuilder;

import org.apache.commons.io.FilenameUtils;
import org.eclipse.core.runtime.Platform;


/**
 * Application's context manager.
 * 
 * @author Andrea Feccomandi
 *
 */
public class ContextManager {
	
	private static ContextManager mContextManager;
	
	private boolean mBlnTest;
	private String mStrAbsolutePath;
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
		mStrPathSeparator = System.getProperty("file.separator");
		
	}
	
	public String getOS() {
		return mStrOS;
	}

	private String calculateOSName() {
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

	public String getPathSeparator() {
		return mStrPathSeparator;
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
}
