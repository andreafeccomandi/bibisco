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
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * 
 */
package com.bibisco.enums;

/**
 * Enumeration of export types
 * 
 * @author Andrea Feccomandi
 *
 */
public enum ExportType {
	PDF(".pdf"), WORD(".rtf"), ARCHIVE(".bibisco");

	String mStrExtension;

	public String getExtension() {
		return mStrExtension;
	}

	private ExportType(String pStrExtension) {
		mStrExtension = pStrExtension;
	}
}
