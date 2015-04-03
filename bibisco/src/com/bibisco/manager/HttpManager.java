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

import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.bibisco.BibiscoException;
import com.bibisco.bean.WebMessage;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.MessagesMapper;
import com.bibisco.dao.model.Messages;
import com.bibisco.log.Log;
import com.google.gson.Gson;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;

/**
 * Manager of http messages.
 * 
 * @author Andrea Feccomandi
 *
 */
public class HttpManager {

	private static Log mLog = Log.getInstance(HttpManager.class);
	
	
	public static void precompileLoadingPage(String lStrURL) {
		
		mLog.debug("Start precompileLoadingPage()");
		
		try {
			ClientConfig lClientConfig = new DefaultClientConfig();
			Client lClient = Client.create(lClientConfig);
			WebResource lWebResource = lClient.resource(lStrURL);
			WebResource.Builder lBuilder = lWebResource.accept(MediaType.TEXT_HTML);
			lBuilder.get(String.class);
		} catch (Throwable t) {
			// Maybe we Jetty is not started...
			mLog.error(t);
		} 
		
		mLog.debug("End precompileLoadingPage()");
	}
	
	
	public static WebMessage getMessageFromBibiscoWebSite() {
		
		WebMessage lWebMessage = null;
		
		mLog.debug("Start getMessageFromBibiscoWebSite()");
		
		String lStrJson = getMessagesFromBibiscoWebSite();
		if (StringUtils.isNotEmpty(lStrJson)) {
			Gson lGson = new Gson();
			WebMessage[] lWebMessages = lGson.fromJson(lStrJson, WebMessage[].class);
			
			for (int i = 0; i < lWebMessages.length; i++) {
				mLog.debug(lWebMessages[i].getIdMessage() + " " + lWebMessages[i].getTitle());
				if (showMessage(lWebMessages[i])) {
					lWebMessage = lWebMessages[i];
					break;
				}
	 		}
		}
		
	   mLog.debug("End getMessageFromBibiscoWebSite() return: ", lWebMessage != null ? lWebMessage.getMessage() : "null" );
	   
		return lWebMessage;
	}
	
	private static String getMessagesFromBibiscoWebSite() {
		
		String lStrJsonMessages = null;
		
		mLog.debug("Start getMessagesFromBibiscoWebSite()");
		
		String lStrVersion = VersionManager.getInstance().getVersion();
		String lStrLanguage = LocaleManager.getInstance().getLocale().getLanguage();
		
		
		try {
			ClientConfig lClientConfig = new DefaultClientConfig();
			Client lClient = Client.create(lClientConfig);
			WebResource lWebResource = lClient.resource(ContextManager.getInstance().getURIWeb());
			WebResource.Builder lBuilder = lWebResource.path("rest").path("messages").path("get").path(lStrVersion).path(lStrLanguage).accept(MediaType.APPLICATION_JSON);
			lStrJsonMessages = lBuilder.get(String.class);
		} catch (Throwable t) {
			// Maybe we are offline...
			mLog.error(t);
		} 
	    
	    mLog.debug("End getMessagesFromBibiscoWebSite()");
	    
	    return lStrJsonMessages;
	}
	
	private static boolean showMessage(WebMessage pWebMessage) {
		
		boolean lBlnResult = false;
		
		mLog.debug("Start showMessage(WebMessage)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    	
    		MessagesMapper lMessagesMapper = lSqlSession.getMapper(MessagesMapper.class);
    		Messages lMessages = lMessagesMapper.selectByPrimaryKey(pWebMessage.getIdMessage());
    		
    		if (lMessages != null) {
    			// message already read: check if i can show another time
    			if (lMessages.getNumberOfViews() < pWebMessage.getNumberOfViewsAllowed()) {
    				lMessages.setNumberOfViews(lMessages.getNumberOfViews()+1);
    				lMessagesMapper.updateByPrimaryKey(lMessages);
    				lBlnResult = true;
    			} else {
    				lBlnResult = false;
    			}
    		} else {
    			// message not read
    			lMessages = new Messages();
    			lMessages.setIdMessage(pWebMessage.getIdMessage());
    			lMessages.setNumberOfViews(1);
				lMessagesMapper.insert(lMessages);
				lBlnResult = true;
    		} 
    		
    		lSqlSession.commit();
    		
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
    	mLog.debug("End showMessage(WebMessage)");
		
		return lBlnResult;
	}
}
