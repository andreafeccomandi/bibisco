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
package com.bibisco.export;

/**
 * Text formatting handler
 * 
 * @author Andrea Feccomandi
 *
 */
public class TextFormatting implements Cloneable {
	
	public boolean bold = false;
	public boolean italic = false;
	public boolean underline = false;
	public boolean strike = false;

	public TextFormatting clone() {

		TextFormatting lTextFormatting = new TextFormatting();
		lTextFormatting.bold = bold;
		lTextFormatting.italic = italic;
		lTextFormatting.underline = underline;
		lTextFormatting.strike = strike;

		return lTextFormatting;
	}
}