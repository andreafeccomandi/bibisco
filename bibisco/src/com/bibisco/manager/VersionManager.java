/*
 * Copyright (C) 2014 Andrea Feccomandi
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

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.bibisco.BibiscoException;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.PropertiesMapper;
import com.bibisco.dao.model.Properties;
import com.bibisco.log.Log;

/**
 * Application's version manager.
 * 
 * @author Andrea Feccomandi
 *
 */
public class VersionManager {
	
	private static VersionManager mVersionManager = null;
	private static Log mLog = Log.getInstance(VersionManager.class);
	
	private String mStrVersion;
	
	private VersionManager() {
		mStrVersion = initVersion();
	}

	public synchronized static VersionManager getInstance() {
		if (mVersionManager == null) {
			mVersionManager = new VersionManager();
		}
		
		return mVersionManager;
	}
	
	public String getVersion() {
		return mStrVersion;
	}

	private String initVersion() {

		String lStrVersion = null;
		
		mLog.debug("Start initVersion()");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    	
    		PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
    		Properties lProperties = lPropertiesMapper.selectByPrimaryKey("version");
    		
    		if (lProperties != null) {
    			lStrVersion = lProperties.getValue();
    		} 
    		
    	} catch(Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
    	
    	mLog.debug("End initVersion()");
    	
    	return lStrVersion;
	}
}
