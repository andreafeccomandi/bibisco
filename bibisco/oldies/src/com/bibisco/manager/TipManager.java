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

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.Validate;
import org.apache.commons.lang.time.DateUtils;

import com.bibisco.bean.TipSettings;
import com.bibisco.log.Log;

/**
 * Tip manager
 * 
 * @author Andrea Feccomandi
 *
 */
public class TipManager {

	private static final String DATE_FORMAT = "yyyyMMdd";
	private static Log mLog = Log.getInstance(TipManager.class);

	public static TipSettings load() {

		mLog.debug("Start loadTipSettings()");

		PropertiesManager lPropertiesManager = PropertiesManager.getInstance();
		TipSettings lTipSettings = new TipSettings();
    	
		lTipSettings.setRichTextEditorTip(Boolean.parseBoolean(lPropertiesManager.getProperty("richTextEditorTip")));
    	lTipSettings.setSceneTip(Boolean.parseBoolean(lPropertiesManager.getProperty("sceneTip")));
    	lTipSettings.getDndTipMap().put("chaptersdndTip", Boolean.parseBoolean(lPropertiesManager.getProperty("chaptersdndTip")));
    	lTipSettings.getDndTipMap().put("scenesdndTip", Boolean.parseBoolean(lPropertiesManager.getProperty("scenesdndTip")));
    	lTipSettings.getDndTipMap().put("locationsdndTip", Boolean.parseBoolean(lPropertiesManager.getProperty("locationsdndTip")));
    	lTipSettings.getDndTipMap().put("charactersdndTip", Boolean.parseBoolean(lPropertiesManager.getProperty("charactersdndTip")));
    	lTipSettings.getDndTipMap().put("strandsdndTip", Boolean.parseBoolean(lPropertiesManager.getProperty("strandsdndTip")));
    	lTipSettings.setSocialMediaTip(Boolean.parseBoolean(lPropertiesManager.getProperty("socialMediaTip")));
    	lTipSettings.setDonationTip(getDonationTip());
    	    	
    	mLog.debug("End loadTipSettings()");
		
		return lTipSettings;
	}

	private static boolean getDonationTip() {
		
		PropertiesManager lPropertiesManager = PropertiesManager.getInstance();
		
		String lStrDonationTipValue = lPropertiesManager.getProperty("donationTip");
		if (lStrDonationTipValue.equals("false")) {
			return false;
		} 
		
		// it's first time...
		else if (StringUtils.isEmpty(lStrDonationTipValue)) {
			DateFormat lDateFormat = new SimpleDateFormat(DATE_FORMAT);
			String lStrDate = lDateFormat.format(new Date());
			lPropertiesManager.updateProperty("donationTip", lStrDate);
			return false;
		} 
		
		else {
			try {
				DateFormat lDateFormat = new SimpleDateFormat(DATE_FORMAT);
				Date lDate = lDateFormat.parse(lStrDonationTipValue);
				Date lDateNow = new Date();
				if (lDateNow.after(DateUtils.addDays(lDate, 30))) {
					return true;
				} else {
					return false;
				}
			} catch (ParseException e) {
				mLog.error(e);
				return false;
			}					
		}
	}
	
	public static void disableTip(String pStrTipCode) {

		mLog.debug("Start disableTip("+pStrTipCode+")");
		Validate.notEmpty(pStrTipCode, "tip code cannot be empty");
		
		PropertiesManager.getInstance().updateProperty(pStrTipCode, "false");
				
    	mLog.debug("End disableTip("+pStrTipCode+")");
	}
}
