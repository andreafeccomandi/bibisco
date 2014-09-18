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

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.bibisco.BibiscoException;
import com.bibisco.bean.TipSettings;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.PropertiesMapper;
import com.bibisco.dao.model.Properties;
import com.bibisco.dao.model.PropertiesExample;
import com.bibisco.log.Log;

/**
 * Tip manager
 * 
 * @author Andrea Feccomandi
 *
 */
public class TipManager {

	private static Log mLog = Log.getInstance(TipManager.class);

	public static TipSettings load() {

		TipSettings lTipSettings = null;

		mLog.debug("Start loadTipSettings()");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			List<Properties> lListProperties = lPropertiesMapper.selectByExample(new PropertiesExample());
			
			lTipSettings = new TipSettings();
			for (Properties lProperties : lListProperties) {
				if (lProperties.getProperty().equalsIgnoreCase("sceneTip")) {
					lTipSettings.setSceneTip(Boolean.parseBoolean(lProperties.getValue()));
					continue;
				} else if (lProperties.getProperty().equalsIgnoreCase("chaptersdndTip")) {
					lTipSettings.setChaptersdndTip(Boolean.parseBoolean(lProperties.getValue()));
					continue;
				} else if (lProperties.getProperty().equalsIgnoreCase("scenesdndTip")) {
					lTipSettings.setScenesdndTip(Boolean.parseBoolean(lProperties.getValue()));
					continue;
				} else if (lProperties.getProperty().equalsIgnoreCase("locationsdndTip")) {
					lTipSettings.setLocationsdndTip(Boolean.parseBoolean(lProperties.getValue()));
					continue;
				} else if (lProperties.getProperty().equalsIgnoreCase("charactersdndTip")) {
					lTipSettings.setCharactersdndTip(Boolean.parseBoolean(lProperties.getValue()));
					continue;
				} else if (lProperties.getProperty().equalsIgnoreCase("stransdndTip")) {
					lTipSettings.setStransdndTip(Boolean.parseBoolean(lProperties.getValue()));
					continue;
				}
			}
			
    	} catch(Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
    	mLog.debug("End loadTipSettings()");
		
		return lTipSettings;
	}

	public static void disableTip(String pStrTipCode) {

		mLog.debug("Start disableTip("+pStrTipCode+")");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			
			Properties lProperties = new Properties();
			lProperties.setProperty(pStrTipCode);
			lProperties.setValue("false");
			lPropertiesMapper.updateByPrimaryKey(lProperties);
			
			lSqlSession.commit();
			
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
    	mLog.debug("End disableTip("+pStrTipCode+")");
	}
}
