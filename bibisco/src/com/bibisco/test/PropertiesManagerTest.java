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

import java.util.HashMap;
import java.util.Map;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.bibisco.manager.PropertiesManager;

public class PropertiesManagerTest {

	@Before 
	public void initEnvironment() {		
		setInitialState();
	}
	
	@Test
	public void testReadWriteProperty() {
		PropertiesManager lPropertiesManager = PropertiesManager.getInstance();
		Assert.assertEquals(lPropertiesManager.getProperty("projectsDirectory"), "");
		
		lPropertiesManager.updateProperty("projectsDirectory", "C:\\Users\\AndreaDocuments\\");		
		Assert.assertEquals(lPropertiesManager.getProperty("projectsDirectory"), "C:\\Users\\AndreaDocuments\\");
	}
	
	@Test
	public void testReadWritePropertiesMap() {
		PropertiesManager lPropertiesManager = PropertiesManager.getInstance();
		Assert.assertEquals(lPropertiesManager.getProperty("projectsDirectory"), "");
		
		Map<String, String> lMapProperties = new HashMap<String, String>();
		lMapProperties.put("socialMediaTip", "false");
		lMapProperties.put("locationsdndTip", "false");
		lPropertiesManager.updateProperties(lMapProperties);
		
		Assert.assertEquals(lPropertiesManager.getProperty("socialMediaTip"), "false");
		Assert.assertEquals(lPropertiesManager.getProperty("locationsdndTip"), "false");
	}
	
	@After 
	public void restoreEnvironment() {		
		setInitialState();
	}
	
	private void setInitialState() {
		PropertiesManager lPropertiesManager = PropertiesManager.getInstance();
		lPropertiesManager.updateProperty("projectsDirectory", "");		
		lPropertiesManager.updateProperty("socialMediaTip", "true");
		lPropertiesManager.updateProperty("locationsdndTip", "true");
	}
}
