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

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.bibisco.manager.ProjectManager;
import com.bibisco.manager.PropertiesManager;

public class ProjectManagerTest {

	@Before 
	public void initEnvironment() {		
		setInitialState();
	}
	
	@Test
	public void testIsProjectsDirectoryEmpty() {
		Assert.assertEquals(ProjectManager.isProjectsDirectoryEmpty(), true);
	}
	
	@Test
	public void testSetProjectsDirectory() {
		ProjectManager.setProjectsDirectory("C:/Users/Andrea/bibisco/projects");
		Assert.assertEquals(ProjectManager.isProjectsDirectoryEmpty(), false);
		Assert.assertEquals(ProjectManager.getProjectsDirectory(), "C:/Users/Andrea/bibisco/projects");
	}
	
	@After 
	public void restoreEnvironment() {		
		setInitialState();
	}
	
	private void setInitialState() {
		PropertiesManager lPropertiesManager = PropertiesManager.getInstance();
		lPropertiesManager.updateProperty("projectsDirectory", "");		
	}
}
