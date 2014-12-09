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

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateUtils;
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
	private static DateFormat mDateFormat = new SimpleDateFormat("yyyyMMdd");

	public static TipSettings load() {

		TipSettings lTipSettings = null;
		List<Properties> lListProperties = null;

		mLog.debug("Start loadTipSettings()");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			lListProperties = lPropertiesMapper.selectByExample(new PropertiesExample());
    	} catch(Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
    	lTipSettings = new TipSettings();
		for (Properties lProperties : lListProperties) {
			if (lProperties.getProperty().equalsIgnoreCase("sceneTip")) {
				lTipSettings.setSceneTip(Boolean.parseBoolean(lProperties.getValue()));
				continue;
			} else if (lProperties.getProperty().equalsIgnoreCase("chaptersdndTip")) {
				lTipSettings.getDndTipMap().put(lProperties.getProperty(), Boolean.parseBoolean(lProperties.getValue()));
				continue;
			} else if (lProperties.getProperty().equalsIgnoreCase("scenesdndTip")) {
				lTipSettings.getDndTipMap().put(lProperties.getProperty(), Boolean.parseBoolean(lProperties.getValue()));
				continue;
			} else if (lProperties.getProperty().equalsIgnoreCase("locationsdndTip")) {
				lTipSettings.getDndTipMap().put(lProperties.getProperty(), Boolean.parseBoolean(lProperties.getValue()));
				continue;
			} else if (lProperties.getProperty().equalsIgnoreCase("charactersdndTip")) {
				lTipSettings.getDndTipMap().put(lProperties.getProperty(), Boolean.parseBoolean(lProperties.getValue()));
				continue;
			} else if (lProperties.getProperty().equalsIgnoreCase("strandsdndTip")) {
				lTipSettings.getDndTipMap().put(lProperties.getProperty(), Boolean.parseBoolean(lProperties.getValue()));
				continue;
			} else if (lProperties.getProperty().equalsIgnoreCase("socialMediaTip")) {
				lTipSettings.setSocialMediaTip(Boolean.parseBoolean(lProperties.getValue()));
				continue;
			} else if (lProperties.getProperty().equalsIgnoreCase("donationTip")) {
				lTipSettings.setDonationTip(getDonationTip(lProperties));
			}
		}
    	
    	mLog.debug("End loadTipSettings()");
		
		return lTipSettings;
	}

	private static boolean getDonationTip(Properties lProperties) {
		
		if (lProperties.getValue() == "false") {
			return false;
		} 
		
		// it's first time...
		else if (StringUtils.isEmpty(lProperties.getValue())) {
			String lStrDate = mDateFormat.format(new Date());
			SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
	    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
	    	try {
				PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
				Properties lPropertiesToInsert = new Properties();
				lPropertiesToInsert.setProperty("donationTip");
				lPropertiesToInsert.setValue(lStrDate);
				lPropertiesMapper.updateByPrimaryKey(lPropertiesToInsert);
				lSqlSession.commit();
	    	} catch(Throwable t) {
				mLog.error(t);
				lSqlSession.rollback();
				throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
			} finally {
				lSqlSession.close();
			}
	    	return false;
		} 
		
		else {
			try {
				Date lDate = mDateFormat.parse(lProperties.getValue());
				Date lDateNow = new Date();
				if (lDateNow.after(DateUtils.addDays(lDate, 30))) {
					return true;
				} else {
					return false;
				}
			} catch (ParseException e) {
				mLog.error(e);
				return false;
			}					
		}
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
