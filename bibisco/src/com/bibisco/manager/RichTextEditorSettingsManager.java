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
package com.bibisco.manager;

import java.util.HashMap;
import java.util.Map;

import com.bibisco.bean.RichTextEditorSettings;
import com.bibisco.log.Log;

/**
 * Rich text editor manager
 * 
 * @author Andrea Feccomandi
 *
 */
public class RichTextEditorSettingsManager {

	private static Log mLog = Log.getInstance(RichTextEditorSettingsManager.class);

	public static RichTextEditorSettings load() {

		mLog.debug("Start load()");
		
		RichTextEditorSettings lRichTextEditorSettings = new RichTextEditorSettings();
		
		PropertiesManager lPropertiesManager = PropertiesManager.getInstance();
		
		// font
		lRichTextEditorSettings.setFont(lPropertiesManager.getProperty("font"));

		// font size
		lRichTextEditorSettings.setSize(lPropertiesManager.getProperty("font-size"));
		
		// spell check enabled
		lRichTextEditorSettings.setSpellCheckEnabled(Boolean.valueOf(lPropertiesManager.getProperty("spellCheckEnabled")));
		
		mLog.debug("End load()");
		
		return lRichTextEditorSettings;
	}

	public static void save(RichTextEditorSettings pRichTextEditorSettings) {

		mLog.debug("Start save()");

		Map<String, String> lMapProperties = new HashMap<String, String>();
		lMapProperties.put("font", pRichTextEditorSettings.getFont());
		lMapProperties.put("font-size", pRichTextEditorSettings.getSize());
		lMapProperties.put("spellCheckEnabled", String.valueOf(pRichTextEditorSettings.isSpellCheckEnabled()));
		PropertiesManager.getInstance().updateProperties(lMapProperties);
		
		mLog.debug("End save()");
	}
}
