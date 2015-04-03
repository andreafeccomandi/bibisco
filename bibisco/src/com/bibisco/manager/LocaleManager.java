/*
 * Copyright (C) 2014-2015 Andrea Feccomandi
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

import java.util.Locale;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.bibisco.BibiscoException;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.PropertiesMapper;
import com.bibisco.dao.model.Properties;
import com.bibisco.log.Log;

/**
 * Application's locale manager.
 * 
 * @author Andrea Feccomandi
 *
 */
public class LocaleManager {
	
	private static LocaleManager mLocaleManager = null;
	private static Log mLog = Log.getInstance(LocaleManager.class);
	
	private Locale mLocale;
	
	private LocaleManager() {
		mLocale = initLocale();
	}

	public synchronized static LocaleManager getInstance() {
		if (mLocaleManager == null) {
			mLocaleManager = new LocaleManager();
		}
		
		return mLocaleManager;
	}
	
	public Locale getLocale() {
		return mLocale;
	}

	private Locale initLocale() {

		Locale lLocale = null;
		
		mLog.debug("Start initLocale()");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    	
    		PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
    		Properties lProperties = lPropertiesMapper.selectByPrimaryKey("locale");
    		
    		if (lProperties != null) {
    			String[] lStrLocaleSplit = lProperties.getValue().split("_");
    			lLocale = new Locale(lStrLocaleSplit[0], lStrLocaleSplit[1]);
    			
    		} else {
    			lLocale = Locale.getDefault();
    			
    			// save locale
    			lProperties = new Properties();
    			lProperties.setProperty("locale");
    			lProperties.setValue(lLocale.toString());
    			lPropertiesMapper.insert(lProperties);
    			
    			lSqlSession.commit();
    		}
			
    	} catch(Throwable t) {
    		lSqlSession.rollback();
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
    	
    	mLog.debug("End initLocale()");
    	
    	return lLocale;
	}

	public void saveLocale(String pStrLocale) {

		mLog.debug("Start saveLocale(String)");

		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {

			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			Properties lProperties = new Properties();
			lProperties.setProperty("locale");
			lProperties.setValue(pStrLocale);
			lPropertiesMapper.updateByPrimaryKey(lProperties);
			lSqlSession.commit();
		
			String[] lStrLocaleSplit = pStrLocale.split("_");
			mLocale = new Locale(lStrLocaleSplit[0], lStrLocaleSplit[1]);

		} catch (Throwable t) {
			lSqlSession.rollback();
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}

		mLog.debug("End saveLocale(String)");
	}
}
