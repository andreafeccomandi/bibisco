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
 * Enumeration of task statuses
 * 
 * @author Andrea Feccomandi
 *
 */
public enum TaskStatus {TODO(0), TOCOMPLETE(1), COMPLETED(2), STATS(-2), DISABLE(-1);

	private Integer mIntValue;
	
	private TaskStatus(Integer pIntValue) {
		mIntValue = pIntValue;
	}


	public static TaskStatus getTaskStatusFromValue(Integer pIntValue) {
		
		for (TaskStatus lTaskStatus : TaskStatus.values()) {
			if (lTaskStatus.getValue().equals(pIntValue)) {
				return lTaskStatus;
			}
		}
		
		return null;
	}


	public Integer getValue() {
		return mIntValue;
	}

}