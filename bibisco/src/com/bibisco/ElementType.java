package com.bibisco;

//task status
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
