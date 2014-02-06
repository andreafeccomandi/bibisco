package com.bibisco.filters;

import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Map;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

/**
 * To sobstitute the original ServletRequest when encoding = multipart,
 * for which parameterMap is empty (e.g: getParameter() returns null).
 * 
 * Provides a craftable parameterMap (you build it decoding form
 * fields which are multipart-encoded).
 * getParameter(), getParameterNames(), getParameterValues methods 
 * act on the crafted parameterMap.
 * 
 * ServletRequestWrapper mechanism ensures that all other methods 
 * invoked on this object are deferred to the wrapped object 
 * (e.g: the request)
 * 
 * @author tbinci
 *
 */
public final class MultipartWrapper extends HttpServletRequestWrapper {

	private Hashtable<String, String[]> decodedParameterMap = new Hashtable<String, String[]>();
	
	public MultipartWrapper(ServletRequest request) {
		super((HttpServletRequest)request);
	}

	public void addParameter(String key, String value) {
		String[] prevValues = decodedParameterMap.get(key);
		if (prevValues!=null) { //add to existant value-array
			 String[] newValues = new String[prevValues.length+1];
			 for (int i=0; i<prevValues.length; i++)
				 newValues[i] = prevValues[i];
			 newValues[newValues.length-1] = value;
			 prevValues = null;
			 decodedParameterMap.put(key, newValues);
		} else { //craft new one
			String[] valueArray = new String[1]; 
			valueArray[0] = value;
			decodedParameterMap.put(key, valueArray);
		}
	}
	
	public String[] getParameterValues(String name) {
		return decodedParameterMap.get(name);
	}

	public String getParameter(String name) {
		if (getParameterValues(name)!= null)
			return getParameterValues(name)[0];
		else return null;
	}
	
	public Map<String, String[]> getParameterMap() {
		return new Hashtable<String, String[]>(decodedParameterMap);
	}
	
	public Enumeration<String> getParameterNames() {
		return decodedParameterMap.keys();
	}
	
}
