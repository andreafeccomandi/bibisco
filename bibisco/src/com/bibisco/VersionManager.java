package com.bibisco;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.PropertiesMapper;
import com.bibisco.dao.model.Properties;
import com.bibisco.log.Log;

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
