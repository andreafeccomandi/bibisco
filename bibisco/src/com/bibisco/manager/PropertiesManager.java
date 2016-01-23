/*
 * Copyright (C) 2014-2016 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.gnu.org/licenses/gpl-2.0.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY. 
 * See the GNU General Public License for more details.
 * 
 */
package com.bibisco.manager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.Validate;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.bibisco.BibiscoException;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.PropertiesMapper;
import com.bibisco.dao.model.Properties;
import com.bibisco.dao.model.PropertiesExample;
import com.bibisco.log.Log;

/**
 * Properties manager: manage properties stored on bibisco db
 * 
 * @author Andrea Feccomandi
 *
 */
public class PropertiesManager {
	
	private static Log mLog = Log.getInstance(PropertiesManager.class);
	private static PropertiesManager mPropertiesManager;
	private Map<String, String> mMapProperties;
	
	public synchronized static PropertiesManager getInstance() {
		if (mPropertiesManager == null) {
			mPropertiesManager = new PropertiesManager();
		}
		return mPropertiesManager;
	}
	
	private PropertiesManager() {
		initPropertiesMap();
	}
	
	public Object clone() throws CloneNotSupportedException {
		throw new CloneNotSupportedException();
	}
	
	public void reload() {
		initPropertiesMap();
	}
	
	private void initPropertiesMap() {
		
		mLog.debug("Start initPropertiesMap()");
		
		mMapProperties = new HashMap<String, String>();
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			List<Properties> lListProperties = lPropertiesMapper.selectByExample(new PropertiesExample());
			for (Properties lProperties : lListProperties) {				
				mMapProperties.put(lProperties.getProperty(), lProperties.getValue());
			}
			
    	} catch(Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End initPropertiesMap()");
	}	
	
	
	public void updateProperties(Map<String, String> pMapProperties) {
		
		mLog.debug("Start updateProperties(Map<String, String>)");
		
		Validate.notEmpty(pMapProperties, "Properties map cannot be empty");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	
    	try {
    		
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			for (String lStrProperty : pMapProperties.keySet()) {	
				Properties lProperties = new Properties();
				lProperties.setProperty(lStrProperty);
				lProperties.setValue(pMapProperties.get(lStrProperty));
				lPropertiesMapper.updateByPrimaryKey(lProperties);
				mMapProperties.put(lStrProperty, pMapProperties.get(lStrProperty));
			}
						
			lSqlSession.commit();
			
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End updateProperties()");
	}
	
	public String getProperty(String pStrProperty) {
		return mMapProperties.get(pStrProperty);
	}
	
	public void updateProperty(String pStrProperty, String pStrValue) {

		mLog.debug("Start updateProperty(", pStrProperty, ",", pStrValue, ")");
		
		Validate.notEmpty(pStrProperty, "Property cannot be empty");
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			
    		PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			Properties lProperties = new Properties();
			lProperties.setProperty(pStrProperty);
			lProperties.setValue(pStrValue);
			lPropertiesMapper.updateByPrimaryKey(lProperties);
			mMapProperties.put(pStrProperty, pStrValue);
			
			lSqlSession.commit();
			
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}

    	mLog.debug("End updateProperty(", pStrProperty, ",", pStrValue, ")");
	}
}
