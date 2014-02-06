package com.bibisco.logic.export;

public class TextFormatting {
	
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