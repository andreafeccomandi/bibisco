package com.bibisco;

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
