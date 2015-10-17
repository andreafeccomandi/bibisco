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
package com.bibisco.dao;

import java.io.IOException;
import java.io.Reader;
import java.util.Properties;

import org.apache.commons.lang.Validate;
import org.apache.ibatis.datasource.pooled.PooledDataSource;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import com.bibisco.BibiscoException;
import com.bibisco.log.Log;
import com.bibisco.manager.ContextManager;
import com.bibisco.manager.ProjectManager;

/**
 * SqlSessionFactory manager.
 * 
 * @author Andrea Feccomandi
 *
 */
public class SqlSessionFactoryManager { 
		
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
	
	
	private static String getBibiscoDBURL() {
		
		StringBuilder lStringBuilder = new StringBuilder();
		lStringBuilder.append("jdbc:h2:file:");		
		lStringBuilder.append(ContextManager.getPathSeparator());
		lStringBuilder.append(ContextManager.getInstance().getDbDirectoryPath());
		lStringBuilder.append("bibisco");
		
		return lStringBuilder.toString();

	}
	
	private static String getProjectDBURL(String pStrIdProject) {

		StringBuilder lStringBuilder = new StringBuilder();
		lStringBuilder.append("jdbc:h2:file:");

		lStringBuilder.append(ContextManager.getPathSeparator());
		lStringBuilder.append(ProjectManager.getDBProjectDirectory(pStrIdProject));
		lStringBuilder.append(pStrIdProject);

		return lStringBuilder.toString();

	}

	public SqlSessionFactory getSqlSessionFactoryBibisco() {
		
		if (mSqlSessionFactoryBibisco == null) {
			mSqlSessionFactoryBibisco = buildSqlSessionFactory(getBibiscoDBURL());
		}
		
		return mSqlSessionFactoryBibisco;
	}

	public SqlSessionFactory getSqlSessionFactoryProject() {
		
		Validate.notEmpty(ContextManager.getInstance().getIdProject(), "There is no project in context");
		if (mSqlSessionFactoryProject == null) {
			mSqlSessionFactoryProject = buildSqlSessionFactory(getProjectDBURL(ContextManager.getInstance().getIdProject()));
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