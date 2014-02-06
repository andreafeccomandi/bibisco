package com.bibisco.dao;

import java.io.IOException;
import java.io.Reader;
import java.util.Properties;

import org.apache.ibatis.datasource.pooled.PooledDataSource;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import com.bibisco.BibiscoException;
import com.bibisco.ContextManager;
import com.bibisco.log.Log;

/**
 * This class manages the creation of SqlSessionFactory.
 * 
 * @author Andrea Feccomandi
 *
 */
public class SqlSessionFactoryManager { 
	
	private static final String BIBISCO_DB_URL = "bibisco";
	
	private static final String DB_USERNAME = "root";
	private static final String DB_PASSWORD = "password";
	private static final String RESOURCE_FILE_NAME = "dbConfiguration.xml";
	
	private static Log mLog = Log.getInstance(SqlSessionFactoryManager.class);
	private SqlSessionFactory mSqlSessionFactoryBibisco; 
	private SqlSessionFactory mSqlSessionFactoryProject;
	private static SqlSessionFactoryManager mSqlSessionFactoryManager;

	public synchronized static SqlSessionFactoryManager getInstance() {

		if (mSqlSessionFactoryManager == null) {
			mSqlSessionFactoryManager = new SqlSessionFactoryManager();
		}

		return mSqlSessionFactoryManager;
	}
	
	private SqlSessionFactoryManager() {}
	
	public Object clone() throws CloneNotSupportedException {
		return new CloneNotSupportedException();
	}
	
	private SqlSessionFactory buildSqlSessionFactory(String pStrDBUrl) {
		
		SqlSessionFactory mSqlSessionFactory;
		
		mLog.debug("Start buildSqlSessionFactory(String)");
		mLog.debug("DB_URL: ",pStrDBUrl);
		
		try {
			Reader lReader = Resources.getResourceAsReader(RESOURCE_FILE_NAME);
			Properties lProperties = new Properties();
			lProperties.setProperty("url", pStrDBUrl);
			lProperties.setProperty("username", DB_USERNAME);
			lProperties.setProperty("password", DB_PASSWORD);
			
			mSqlSessionFactory = new SqlSessionFactoryBuilder().build(lReader,lProperties);
			mLog.debug("SqlSessionFactory built.");
			
		} catch (IOException e) {
			mLog.error(e);
			throw new BibiscoException(BibiscoException.IO_EXCEPTION);
		}
		
		mLog.debug("End buildSqlSessionFactory(String)");
		
		return mSqlSessionFactory;
	}
	
	
	private static String getDBURL(String pStrDBName) {
		
		ContextManager lContextManager = ContextManager.getInstance();
		StringBuilder lStringBuilder = new StringBuilder();
		lStringBuilder.append("jdbc:h2:file:");
		
		lStringBuilder.append(lContextManager.getPathSeparator());
		lStringBuilder.append(lContextManager.getAbsolutePath());
		lStringBuilder.append("db");
		lStringBuilder.append(lContextManager.getPathSeparator());
		
		if(pStrDBName.equalsIgnoreCase(BIBISCO_DB_URL)) {
			lStringBuilder.append("bibisco");
		} else {
			lStringBuilder.append(pStrDBName);
			lStringBuilder.append(lContextManager.getPathSeparator());
			lStringBuilder.append(pStrDBName);
		}
		
		return lStringBuilder.toString();

	}

	public SqlSessionFactory getSqlSessionFactoryBibisco() {
		
		if (mSqlSessionFactoryBibisco == null) {
			mSqlSessionFactoryBibisco = buildSqlSessionFactory(getDBURL(BIBISCO_DB_URL));
		}
		
		return mSqlSessionFactoryBibisco;
	}

	public SqlSessionFactory getSqlSessionFactoryProject() {
		
		if (mSqlSessionFactoryProject == null) {
			mSqlSessionFactoryProject = buildSqlSessionFactory(getDBURL(ContextManager.getInstance().getIdProject()));
		}
		
		return mSqlSessionFactoryProject;
	}
	
	public void cleanSqlSessionFactoryProject() {

		mLog.debug("Start cleanSqlSessionFactoryProject()");

		PooledDataSource lPooledDataSource = (PooledDataSource) mSqlSessionFactoryProject.getConfiguration().getEnvironment().getDataSource();
		lPooledDataSource.forceCloseAll();
		mSqlSessionFactoryProject = null;

		mLog.debug("End cleanSqlSessionFactoryProject()");
	}
}