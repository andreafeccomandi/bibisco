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
package com.bibisco.bean;

/**
 * Rich text editor settings bean.
 * 
 * @author Andrea Feccomandi
 *
 */
public class RichTextEditorSettings {
	
	private String font;
	private String size;
	private boolean spellCheckEnabled;
	
	public String getFont() {
		return font;
	}
	public void setFont(String font) {
		this.font = font;
	}
	public String getSize() {
		return size;
	}
	public void setSize(String size) {
		this.size = size;
	}
	public boolean isSpellCheckEnabled() {
		return spellCheckEnabled;
	}
	public void setSpellCheckEnabled(boolean spellCheckEnabled) {
		this.spellCheckEnabled = spellCheckEnabled;
	}
}
