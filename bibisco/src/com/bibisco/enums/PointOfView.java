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
package com.bibisco.enums;

/**
 * Enumeration of points of view
 * 
 * @author Andrea Feccomandi
 *
 */
public enum PointOfView {
	FIRST_ON_MAJOR(0), FIRST_ON_MINOR(1), THIRD_LIMITED(2), THIRD_OMNISCIENT(3), THIRD_OBJECTIVE(4), SECOND(5);
	
	private Integer mIntValue;
	
	private PointOfView(Integer pIntValue) {
		mIntValue = pIntValue;
	}


	public static PointOfView getPointOfViewFromValue(Integer pIntValue) {
		
		for (PointOfView lPointOfView : PointOfView.values()) {
			if (lPointOfView.getValue().equals(pIntValue)) {
				return lPointOfView;
			}
		}
		
		return null;
	}


	public Integer getValue() {
		return mIntValue;
	}

}
