/*
 * Copyright (C) 2014 Andrea Feccomandi
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
 * Tip settings bean.
 * 
 * @author Andrea Feccomandi
 *
 */
public class TipSettings {
	
	private boolean sceneTip= true;
	private boolean chaptersdndTip= true;
	private boolean scenesdndTip= true;
	private boolean locationsdndTip= true;
	private boolean charactersdndTip= true;
	private boolean stransdndTip= true;
	
	public boolean isSceneTip() {
		return sceneTip;
	}
	public void setSceneTip(boolean sceneTip) {
		this.sceneTip = sceneTip;
	}
	public boolean isChaptersdndTip() {
		return chaptersdndTip;
	}
	public void setChaptersdndTip(boolean chaptersdndTip) {
		this.chaptersdndTip = chaptersdndTip;
	}
	public boolean isScenesdndTip() {
		return scenesdndTip;
	}
	public void setScenesdndTip(boolean scenesdndTip) {
		this.scenesdndTip = scenesdndTip;
	}
	public boolean isLocationsdndTip() {
		return locationsdndTip;
	}
	public void setLocationsdndTip(boolean locationsdndTip) {
		this.locationsdndTip = locationsdndTip;
	}
	public boolean isCharactersdndTip() {
		return charactersdndTip;
	}
	public void setCharactersdndTip(boolean charactersdndTip) {
		this.charactersdndTip = charactersdndTip;
	}
	public boolean isStransdndTip() {
		return stransdndTip;
	}
	public void setStransdndTip(boolean stransdndTip) {
		this.stransdndTip = stransdndTip;
	}
	

}
