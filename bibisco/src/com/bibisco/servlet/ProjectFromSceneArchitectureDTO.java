package com.bibisco.servlet;

import java.util.List;

import com.bibisco.bean.StrandDTO;

public class ProjectFromSceneArchitectureDTO {
	
	String premise;
	String fabula;
	String setting;
	List<StrandDTO> strandList;
	
	public String getPremise() {
		return premise;
	}
	public void setPremise(String premise) {
		this.premise = premise;
	}
	public String getFabula() {
		return fabula;
	}
	public void setFabula(String fabula) {
		this.fabula = fabula;
	}
	public String getSetting() {
		return setting;
	}
	public void setSetting(String setting) {
		this.setting = setting;
	}
	public List<StrandDTO> getStrandList() {
		return strandList;
	}
	public void setStrandList(List<StrandDTO> strandList) {
		this.strandList = strandList;
	}
}
