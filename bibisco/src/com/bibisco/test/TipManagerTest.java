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

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.lang.time.DateUtils;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.bibisco.bean.TipSettings;
import com.bibisco.manager.PropertiesManager;
import com.bibisco.manager.TipManager;

public class TipManagerTest {
	
	private static final String DATE_FORMAT = "yyyyMMdd";
	
	@Before 
	public void initEnvironment() {		
		setInitialState();
	}
	
	@Test
	public void testSceneTip() {
				
		TipSettings lTipSettings = TipManager.load();		
		Assert.assertEquals(lTipSettings.isSceneTip(), true);
		
		TipManager.disableTip("sceneTip");
		lTipSettings = TipManager.load();
		Assert.assertEquals(lTipSettings.isSceneTip(), false);
	}
	
	@Test
	public void testSocialMediaTip() {
				
		TipSettings lTipSettings = TipManager.load();		
		Assert.assertEquals(lTipSettings.isSocialMediaTip(), true);
		
		TipManager.disableTip("socialMediaTip");
		lTipSettings = TipManager.load();
		Assert.assertEquals(lTipSettings.isSocialMediaTip(), false);
		
	}
	
	
	@Test
	public void testDonationTip() {
		
		DateFormat lDateFormat = new SimpleDateFormat(DATE_FORMAT);
		Date lDateNow = new Date();
		
		PropertiesManager lPropertiesManager = PropertiesManager.getInstance();
		lPropertiesManager.updateProperty("donationTip", "");
		
		TipSettings lTipSettings = TipManager.load();		
		String lStrDonationTipDate = lPropertiesManager.getProperty("donationTip");
		Assert.assertEquals(lStrDonationTipDate, lDateFormat.format(lDateNow));
		Assert.assertEquals(lTipSettings.isDonationTip(), false);
		
		Date lDate29DaysFromNow = DateUtils.addDays(lDateNow, -29);
		lPropertiesManager.updateProperty("donationTip", lDateFormat.format(lDate29DaysFromNow));
		lTipSettings = TipManager.load();
		Assert.assertEquals(lTipSettings.isDonationTip(), false);
		
		Date lDate30DaysFromNow = DateUtils.addDays(lDateNow, -30);
		lPropertiesManager.updateProperty("donationTip", lDateFormat.format(lDate30DaysFromNow));
		lTipSettings = TipManager.load();
		Assert.assertEquals(lTipSettings.isDonationTip(), true);
		
		TipManager.disableTip("donationTip");
		lTipSettings = TipManager.load();
		Assert.assertEquals(lTipSettings.isDonationTip(), false);
	}
	
	@Test
	public void testDndTips() {
		TipSettings lTipSettings = TipManager.load();		
		Assert.assertEquals(lTipSettings.getDndTipMap().get("chaptersdndTip"), true);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("scenesdndTip"), true);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("locationsdndTip"), true);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("charactersdndTip"), true);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("strandsdndTip"), true);
		
		TipManager.disableTip("chaptersdndTip");
		TipManager.disableTip("scenesdndTip");
		TipManager.disableTip("locationsdndTip");
		TipManager.disableTip("charactersdndTip");
		TipManager.disableTip("strandsdndTip");
		
		lTipSettings = TipManager.load();
		Assert.assertEquals(lTipSettings.getDndTipMap().get("chaptersdndTip"), false);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("scenesdndTip"), false);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("locationsdndTip"), false);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("charactersdndTip"), false);
		Assert.assertEquals(lTipSettings.getDndTipMap().get("strandsdndTip"), false);
	}
	
	@After 
	public void restoreEnvironment() {		
		setInitialState();
	}
	
	private void setInitialState() {
		PropertiesManager lPropertiesManager = PropertiesManager.getInstance();
		lPropertiesManager.updateProperty("sceneTip", "true");
		lPropertiesManager.updateProperty("donationTip", "");
		lPropertiesManager.updateProperty("chaptersdndTip", "true");
		lPropertiesManager.updateProperty("scenesdndTip", "true");
		lPropertiesManager.updateProperty("locationsdndTip", "true");
		lPropertiesManager.updateProperty("charactersdndTip", "true");
		lPropertiesManager.updateProperty("strandsdndTip", "true");
		lPropertiesManager.updateProperty("socialMediaTip", "true");
	}
}
