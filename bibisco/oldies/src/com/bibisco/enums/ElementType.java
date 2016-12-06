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
 * Enumeration of elemebt types
 * 
 * @author Andrea Feccomandi
 *
 */
public enum ElementType {
	
	CHARACTERS(0), LOCATIONS(1);

	private Integer mIntValue;
	
	private ElementType(Integer pIntValue) {
		mIntValue = pIntValue;
	}


	public static ElementType getElementTypeFromValue(Integer pIntValue) {
		
		for (ElementType lElementType : ElementType.values()) {
			if (lElementType.getValue().equals(pIntValue)) {
				return lElementType;
			}
		}
		
		return null;
	}


	public Integer getValue() {
		return mIntValue;
	}

}
