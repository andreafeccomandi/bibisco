package com.bibisco.ui.bean;

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
