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

import com.bibisco.bean.RichTextEditorSettings;
import com.bibisco.manager.PropertiesManager;
import com.bibisco.manager.RichTextEditorSettingsManager;

public class RichTextEditorSettingsManagerTest {
	
	@Before 
	public void initEnvironment() {		
		setInitialState();
	}
	
	@Test
	public void testLoadAndSaveSettings() {
	
		RichTextEditorSettings lRichTextEditorSettings = RichTextEditorSettingsManager.load();
		Assert.assertEquals(lRichTextEditorSettings.getFont(), "courier");
		Assert.assertEquals(lRichTextEditorSettings.getSize(), "medium");
		Assert.assertEquals(lRichTextEditorSettings.isSpellCheckEnabled(), true);
		
		lRichTextEditorSettings.setFont("arial");
		lRichTextEditorSettings.setSize("small");
		lRichTextEditorSettings.setSpellCheckEnabled(false);
		RichTextEditorSettingsManager.save(lRichTextEditorSettings);
		
		RichTextEditorSettingsManager.load();
		Assert.assertEquals(lRichTextEditorSettings.getFont(), "arial");
		Assert.assertEquals(lRichTextEditorSettings.getSize(), "small");
		Assert.assertEquals(lRichTextEditorSettings.isSpellCheckEnabled(), false);
		
	}
		
	@After 
	public void restoreEnvironment() {		
		setInitialState();
	}
	
	private void setInitialState() {
		PropertiesManager lPropertiesManager = PropertiesManager.getInstance();
		lPropertiesManager.updateProperty("font", "courier");
		lPropertiesManager.updateProperty("font-size", "medium");
		lPropertiesManager.updateProperty("spellCheckEnabled", "true");		
	}
}
