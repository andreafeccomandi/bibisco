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

import java.util.Locale;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.Validate;

import com.bibisco.log.Log;

/**
 * Application's locale manager.
 * 
 * @author Andrea Feccomandi
 *
 */
public class LocaleManager {
	
	private static LocaleManager mLocaleManager = null;
	private static Log mLog = Log.getInstance(LocaleManager.class);
	
	private Locale mLocale;
	
	private LocaleManager() {
		mLocale = initLocale();
	}

	public synchronized static LocaleManager getInstance() {
		if (mLocaleManager == null) {
			mLocaleManager = new LocaleManager();
		}
		
		return mLocaleManager;
	}
	
	public Locale getLocale() {
		return mLocale;
	}

	private Locale initLocale() {

		Locale lLocale = null;
		
		mLog.debug("Start initLocale()");
		
		PropertiesManager lPropertiesManager = PropertiesManager.getInstance();
		String lStrLocale = lPropertiesManager.getProperty("locale");
				
		if (StringUtils.isNotBlank(lStrLocale)) {
			String[] lStrLocaleSplit = lStrLocale.split("_");
			lLocale = new Locale(lStrLocaleSplit[0], lStrLocaleSplit[1]);
			
		} else {
			lLocale = Locale.getDefault();
			lPropertiesManager.updateProperty("locale", lLocale.toString());
		}
		
    	mLog.debug("End initLocale()");
    	
    	return lLocale;
	}

	public void saveLocale(String pStrLocale) {

		mLog.debug("Start saveLocale(",pStrLocale,")");
		
		Validate.notEmpty(pStrLocale, "locale cannot be empty");
		
		String[] lStrLocaleSplit = pStrLocale.split("_");
		if (lStrLocaleSplit.length != 2) {
			throw new IllegalArgumentException("Not a valid locale");
		}
		
		PropertiesManager.getInstance().updateProperty("locale", pStrLocale);
		mLocale = new Locale(lStrLocaleSplit[0], lStrLocaleSplit[1]);

		mLog.debug("End saveLocale(String)");
	}
}
