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

import java.util.Locale;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.bibisco.manager.LocaleManager;
import com.bibisco.manager.PropertiesManager;

public class LocaleManagerTest {
	
	@Before 
	public void initEnvironment() {		
		setInitialState();
	}
	
	@Test
	public void testDefaultLocale() {
		
		// test default locale
		Locale lLocaleDefault = Locale.getDefault();
		LocaleManager lLocaleManager = LocaleManager.getInstance();
		Locale lLocale = lLocaleManager.getLocale();
		Assert.assertEquals(lLocaleDefault, lLocale);
		
	}
	
	@Test
	public void testUpdateLocale() {
		
		//update locale
		Locale lLocaleCanada = new Locale(Locale.CANADA.getCountry(), Locale.CANADA.getLanguage());
		LocaleManager lLocaleManager = LocaleManager.getInstance();
		lLocaleManager.saveLocale(lLocaleCanada.toString());
		Assert.assertEquals(lLocaleCanada, lLocaleManager.getLocale());
		
		//restore default locale
		Locale lLocaleDefault = Locale.getDefault();
		lLocaleManager = LocaleManager.getInstance();
		lLocaleManager.saveLocale(lLocaleDefault.toString());
		Assert.assertEquals(lLocaleDefault, lLocaleManager.getLocale());
	}
	
	@Test
	public void testNullLocale() {
		
		//update locale with null value
		LocaleManager lLocaleManager = LocaleManager.getInstance();
		try {			
			lLocaleManager.saveLocale(null);
		} catch (Exception e) {
			Assert.assertEquals(e instanceof IllegalArgumentException, true);
		}
	}
	
	@Test
	public void testEmptyLocale() {
		
		//update locale with null value
		LocaleManager lLocaleManager = LocaleManager.getInstance();
		try {			
			lLocaleManager.saveLocale("");
		} catch (Exception e) {
			Assert.assertEquals(e instanceof IllegalArgumentException, true);
		}
	}
	
	@Test
	public void testWrongLocale3ElementsSplit() {
		
		//update locale with null value
		LocaleManager lLocaleManager = LocaleManager.getInstance();
		try {			
			lLocaleManager.saveLocale("it_it_it");
		} catch (Exception e) {
			Assert.assertEquals(e instanceof IllegalArgumentException, true);
		}
	}
	
	@After 
	public void restoreEnvironment() {		
		setInitialState();
	}
	
	private void setInitialState() {
		PropertiesManager lPropertiesManager = PropertiesManager.getInstance();
		lPropertiesManager.updateProperty("locale", "");		
	}
}
