package com.bibisco.ui.bean;

import org.apache.commons.lang.StringUtils;

import com.bibisco.PointOfView;
import com.bibisco.ResourceBundleManager;

public class PointOfView4AnalysisDTO implements IAnalysisChapterPresenceItem {
	
	private String idPointOfView4Analysis;
	private PointOfView pointOfView;
	private Integer idCharacter;
	private String characterName;
	
	public String getAnalysisChapterPresenceItemId() {
		return idPointOfView4Analysis;
	}
	public String getAnalysisChapterPresenceItemDescription() {
		
		StringBuilder lStringBuilder = new StringBuilder();
		lStringBuilder.append(ResourceBundleManager.getString("com.bibisco.PointOfView."+pointOfView.name()));
		if (StringUtils.isNotBlank(characterName)) {
			lStringBuilder.append(": ");
			lStringBuilder.append(characterName);
		}
		
		return lStringBuilder.toString();
	}
	public String getIdPointOfView4Analysis() {
		return idPointOfView4Analysis;
	}
	public void setIdPointOfView4Analysis(String idPointOfView4Analysis) {
		this.idPointOfView4Analysis = idPointOfView4Analysis;
	}
	public PointOfView getPointOfView() {
		return pointOfView;
	}
	public void setPointOfView(PointOfView pointOfView) {
		this.pointOfView = pointOfView;
	}
	public Integer getIdCharacter() {
		return idCharacter;
	}
	public void setIdCharacter(Integer idCharacter) {
		this.idCharacter = idCharacter;
	}
	public String getCharacterName() {
		return characterName;
	}
	public void setCharacterName(String characterName) {
		this.characterName = characterName;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((idPointOfView4Analysis == null) ? 0 : idPointOfView4Analysis.hashCode());
		return result;
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		PointOfView4AnalysisDTO other = (PointOfView4AnalysisDTO) obj;
		if (idPointOfView4Analysis == null) {
			if (other.idPointOfView4Analysis != null)
				return false;
		} else if (!idPointOfView4Analysis.equals(other.idPointOfView4Analysis))
			return false;
		return true;
	}
}
