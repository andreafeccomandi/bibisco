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
package com.bibisco.enums;

import java.util.ArrayList;
import java.util.List;

import com.bibisco.manager.ResourceBundleManager;

/**
 * Enumeration of character info with questions.
 * 
 * @author Andrea Feccomandi
 *
 */
public enum CharacterInfoQuestions {
	
	PERSONAL_DATA(12), PHYSIONOMY(23), PSYCHOLOGY(62), BEHAVIORS(12), SOCIOLOGY(10), IDEAS(18);

	private static final String RESOURCE_BUNDLE_PREFIX = "characterInfo.question.";
	private int mIntTotalQuestions;
	
	public List<String> getQuestionList() {
		
		List<String >lListQuestions = new ArrayList<String>();
		for (int i = 0; i < mIntTotalQuestions; i++) {
			StringBuilder lStringBuilder = new StringBuilder();
			lStringBuilder.append("(");
			lStringBuilder.append(i+1);
			lStringBuilder.append("/");
			lStringBuilder.append(mIntTotalQuestions);
			lStringBuilder.append("): ");
			lStringBuilder.append(ResourceBundleManager.getString(RESOURCE_BUNDLE_PREFIX+name()+"."+i));
			
			lListQuestions.add(lStringBuilder.toString());
		}
		
		return lListQuestions;
	}
	

	public int getTotalQuestions() {
		return mIntTotalQuestions;
	}
	
	public String getFreeTextDescription() {
		return ResourceBundleManager.getString(RESOURCE_BUNDLE_PREFIX+name()+".freeText");
	}
	
	private CharacterInfoQuestions(int pIntTotalQuestions) {
		mIntTotalQuestions = pIntTotalQuestions;
	}
}
