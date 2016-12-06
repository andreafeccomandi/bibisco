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
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * 
 */
package com.bibisco.manager;

import java.text.MessageFormat;
import java.util.MissingResourceException;
import java.util.ResourceBundle;

import com.bibisco.BibiscoException;
import com.bibisco.log.Log;

/**
 * Resource bundle manager
 * 
 * @author Andrea Feccomandi
 *
 */
public class ResourceBundleManager {
	private static Log mLog = Log.getInstance(ResourceBundleManager.class);
	private static final String BUNDLE_NAME = "ApplicationResources"; //$NON-NLS-1$
	
	private ResourceBundleManager() {
	}

	public static String getString(String pStrKey) {
		
		String lStrBundle = null;
		
		try {
			ResourceBundle lResourceBundle = ResourceBundle.getBundle(BUNDLE_NAME, LocaleManager.getInstance().getLocale());
			lStrBundle = lResourceBundle.getString(pStrKey);
		} catch (MissingResourceException e) {
			mLog.error(e, "Can't find resource for key ",pStrKey);
			throw new BibiscoException("bibiscoException.resourceBundleManager.missingResource",pStrKey);
		}
		
		return lStrBundle;
		
	}
	
	public static String getString(String pStrKey, String[] pStrArgs) {
		
		MessageFormat lMessageFormat;
		String lStringWithArgs;
		String lStrResult;
		
		lStringWithArgs = getString(pStrKey);
		lMessageFormat = new MessageFormat(lStringWithArgs, LocaleManager.getInstance().getLocale());
		lStrResult = lMessageFormat.format(pStrArgs);
		
		return lStrResult;
	}
	
	
	public static String getString(BibiscoException pBibiscoException) {
		return getString(pBibiscoException.getResourceBundleKey(), pBibiscoException.getArgs());
	}
	
}
