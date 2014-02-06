package com.bibisco;

// task status
public enum TaskStatus {TODO(0), TOCOMPLETE(1), COMPLETED(2), DISABLE(-1);

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