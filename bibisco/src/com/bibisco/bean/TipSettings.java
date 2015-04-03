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
package com.bibisco.bean;

import java.util.HashMap;
import java.util.Map;

/**
 * Tip settings bean.
 * 
 * @author Andrea Feccomandi
 *
 */
public class TipSettings {
	
	private boolean sceneTip= true;
	private boolean socialMediaTip = true;
	private boolean donationTip = true;
	private Map<String, Boolean> dndTipMap = new HashMap<String, Boolean>();
	
	public boolean isSceneTip() {
		return sceneTip;
	}
	public void setSceneTip(boolean sceneTip) {
		this.sceneTip = sceneTip;
	}
	public Map<String, Boolean> getDndTipMap() {
		return dndTipMap;
	}
	public void setDndTipMap(Map<String, Boolean> dndTipMap) {
		this.dndTipMap = dndTipMap;
	}
	public boolean isSocialMediaTip() {
		return socialMediaTip;
	}
	public void setSocialMediaTip(boolean socialMediaTip) {
		this.socialMediaTip = socialMediaTip;
	}
	public boolean isDonationTip() {
		return donationTip;
	}
	public void setDonationTip(boolean donationTip) {
		this.donationTip = donationTip;
	}
	

}
