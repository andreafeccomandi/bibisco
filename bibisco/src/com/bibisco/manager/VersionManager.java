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
package com.bibisco.manager;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.bibisco.log.Log;

/**
 * Application's version manager.
 * 
 * @author Andrea Feccomandi
 *
 */
public class VersionManager {
	
	private static VersionManager mVersionManager = null;
	private static Log mLog = Log.getInstance(VersionManager.class);
	
	private String mStrVersion;
	
	private VersionManager() {
		mStrVersion = PropertiesManager.getInstance().getProperty("version");
	}

	public synchronized static VersionManager getInstance() {
		if (mVersionManager == null) {
			mVersionManager = new VersionManager();
		}
		
		return mVersionManager;
	}
	
	public String getVersion() {
		return mStrVersion;
	}

	public static int compare(String pStrVersion1, String pStrVersion2) {
		
		// check version numbers
		if (!checkVersion(pStrVersion1)) {
			mLog.error("First parameter is not a valid version: " + pStrVersion1);
			throw new IllegalArgumentException("First parameter is not a valid version: " + pStrVersion1);
		}
		if (!checkVersion(pStrVersion2)) {
			mLog.error("Second parameter is not a valid version: " + pStrVersion2);
			throw new IllegalArgumentException("Second parameter is not a valid version: " + pStrVersion2);
		}
		
		int[] lIntVersion1Array = createVersionArray(pStrVersion1); 
		int[] lIntVersion2Array = createVersionArray(pStrVersion2); 
		
		// compare
		if (lIntVersion1Array[0] < lIntVersion2Array[0]) {
			return -1;
		} else if (lIntVersion1Array[0] > lIntVersion2Array[0]) {
			return 1;
		} else {
			if (lIntVersion1Array[1] < lIntVersion2Array[1]) {
				return -1;
			} else if (lIntVersion1Array[1] > lIntVersion2Array[1]) {
				return 1;
			} else {
				if (lIntVersion1Array[2] < lIntVersion2Array[2]) {
					return -1;
				} else if (lIntVersion1Array[2] > lIntVersion2Array[2]) {
					return 1;
				} else {
					return 0;
				}
			}
		}
	}


	private static int[] createVersionArray(String pStrVersion) {
		
		String[] lStrVersion1Array = pStrVersion.split("\\.");
		
		int[] lIntVersionArray = new int[3];
		for (int i = 0; i < lStrVersion1Array.length; i++) {
			lIntVersionArray[i] = Integer.parseInt(lStrVersion1Array[i]);
		}
		
		return lIntVersionArray;
	}
	
	private static boolean checkVersion(String pStrVersion) {
	    String lStrRegex = "([1-9]\\d*)\\.(\\d+)\\.(\\d+)";
	    Pattern lPattern = Pattern.compile(lStrRegex);
	    Matcher lMatcher = lPattern.matcher(pStrVersion);
	    
	    return lMatcher.matches();
	}
}
