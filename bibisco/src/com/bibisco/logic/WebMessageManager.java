package com.bibisco.logic;

import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.bibisco.BibiscoException;
import com.bibisco.ContextManager;
import com.bibisco.LocaleManager;
import com.bibisco.VersionManager;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.MessagesMapper;
import com.bibisco.dao.model.Messages;
import com.bibisco.log.Log;
import com.google.gson.Gson;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;

public class WebMessageManager {

	private static Log mLog = Log.getInstance(WebMessageManager.class);
	
	public static WebMessage getMessage() {
		
		WebMessage lWebMessage = null;
		
		mLog.debug("Start getMessage()");
		
		String lStrJson = getMessagesFromWeb();
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
		
	   mLog.debug("End getMessage() return: ", lWebMessage != null ? lWebMessage.getMessage() : "null" );
	   
		return lWebMessage;
	}
	
	private static String getMessagesFromWeb() {
		
		String lStrJsonMessages = null;
		
		mLog.debug("Start getMessagesFromWeb()");
		
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
	    
	    mLog.debug("End getMessagesFromWeb()");
	    
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
