package com.bibisco;

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
