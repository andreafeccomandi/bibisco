package com.bibisco.ui.bean;

import java.util.List;

import com.bibisco.TaskStatus;

public class ArchitectureDTO {
	TaskStatus premiseTaskStatus;
	TaskStatus fabulaTaskStatus;
	TaskStatus strandsTaskStatus;
	TaskStatus settingTaskStatus;
	List<StrandDTO> strandList;
	
	public TaskStatus getPremiseTaskStatus() {
		return premiseTaskStatus;
	}
	public void setPremiseTaskStatus(TaskStatus premise) {
		this.premiseTaskStatus = premise;
	}
	public TaskStatus getFabulaTaskStatus() {
		return fabulaTaskStatus;
	}
	public void setFabulaTaskStatus(TaskStatus fabula) {
		this.fabulaTaskStatus = fabula;
	}
	public TaskStatus getStrandsTaskStatus() {
		return strandsTaskStatus;
	}
	public void setStrandsTaskStatus(TaskStatus strands) {
		this.strandsTaskStatus = strands;
	}
	public TaskStatus getSettingTaskStatus() {
		return settingTaskStatus;
	}
	public void setSettingTaskStatus(TaskStatus setting) {
		this.settingTaskStatus = setting;
	}
	public List<StrandDTO> getStrandList() {
		return strandList;
	}
	public void setStrandList(List<StrandDTO> strandList) {
		this.strandList = strandList;
	}
}
