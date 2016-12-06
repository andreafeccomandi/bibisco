package com.bibisco.bean;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.bibisco.BibiscoException;
import com.bibisco.log.Log;

public class ProjectFromSceneLocationDTO extends LocationDTO {
	
	private static Log mLog = Log.getInstance(ProjectFromSceneLocationDTO.class);
	List<ImageDTO> imageDTOList;

	public List<ImageDTO> getImageDTOList() {
		return imageDTOList;
	}

	public void setImageDTOList(List<ImageDTO> imageDTOList) {
		this.imageDTOList = imageDTOList;
	}
	
	public JSONObject toJSONObject() {

		JSONObject lJSONObject;
	
		lJSONObject = super.toJSONObject();
		
		try {
		// images
		if (imageDTOList != null) {
			JSONArray lJSONArrayImages = new JSONArray();
			for (ImageDTO lImageDTO : imageDTOList) {
				JSONObject lJsonObjectImage = new JSONObject();
				lJsonObjectImage.put("idImage", lImageDTO.getIdImage());
				lJsonObjectImage.put("description", lImageDTO.getDescription());
				lJSONArrayImages.put(lJsonObjectImage);
			}
			lJSONObject.put("images", lJSONArrayImages);
		}
		} catch (JSONException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.FATAL);
		}
		
		return lJSONObject;
	}
}
