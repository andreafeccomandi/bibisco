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

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.Validate;

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
		
		// indent paragraph
		lRichTextEditorSettings.setIndentParagraphEnabled(Boolean.valueOf(lPropertiesManager.getProperty("indentParagraphEnabled")));
		
		// spell check enabled: for mac is always false
		if (ContextManager.getInstance().getOS().equals("mac")) {
			lRichTextEditorSettings.setSpellCheckEnabled(false);
		} else {			
			lRichTextEditorSettings.setSpellCheckEnabled(Boolean.valueOf(lPropertiesManager.getProperty("spellCheckEnabled")));
		}
		
		// auto save enable
		lRichTextEditorSettings.setAutoSaveEnabled(Boolean.valueOf(lPropertiesManager.getProperty("autoSaveEnabled")));
		
		mLog.debug("End load()");
		
		return lRichTextEditorSettings;
	}

	public static void save(RichTextEditorSettings pRichTextEditorSettings) {

		mLog.debug("Start save()");

		Validate.notNull(pRichTextEditorSettings, "RichTextEditorSettings cannot be null");
		Validate.notEmpty(pRichTextEditorSettings.getFont(), "RichTextEditorSettings.font cannot be empty");
		Validate.notEmpty(pRichTextEditorSettings.getSize(), "RichTextEditorSettings.size cannot be empty");
		Validate.isTrue(pRichTextEditorSettings.getFont().equals("courier") || 
				pRichTextEditorSettings.getFont().equals("times") ||
				pRichTextEditorSettings.getFont().equals("arial"), "RichTextEditorSettings.size can be courier, times, arial");
		Validate.isTrue(pRichTextEditorSettings.getSize().equals("small") || 
				pRichTextEditorSettings.getSize().equals("medium") ||
				pRichTextEditorSettings.getSize().equals("big"), "RichTextEditorSettings.size can be small, medium, big");
		
		Map<String, String> lMapProperties = new HashMap<String, String>();
		lMapProperties.put("font", pRichTextEditorSettings.getFont());
		lMapProperties.put("font-size", pRichTextEditorSettings.getSize());
		lMapProperties.put("indentParagraphEnabled", String.valueOf(pRichTextEditorSettings.isIndentParagraphEnabled()));
		lMapProperties.put("spellCheckEnabled", String.valueOf(pRichTextEditorSettings.isSpellCheckEnabled()));
		lMapProperties.put("autoSaveEnabled", String.valueOf(pRichTextEditorSettings.isAutoSaveEnabled()));
		PropertiesManager.getInstance().updateProperties(lMapProperties);
		
		mLog.debug("End save()");
	}
}
