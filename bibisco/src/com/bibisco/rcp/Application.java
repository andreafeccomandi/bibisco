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
package com.bibisco.rcp;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Method;
import java.util.Locale;
import java.util.ResourceBundle;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.SystemUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.eclipse.equinox.app.IApplication;
import org.eclipse.equinox.app.IApplicationContext;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.ui.IWorkbench;
import org.eclipse.ui.PlatformUI;

import com.bibisco.BibiscoException;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.log.Log;
import com.bibisco.manager.ContextManager;
import com.bibisco.manager.JettyManager;
import com.bibisco.manager.LocaleManager;

/**
 * This class controls all aspects of the application's execution
 *
 * @author Andrea Feccomandi
 */
public class Application implements IApplication {

	Log mLog = Log.getInstance(Application.class);

	public Object start(IApplicationContext context) throws Exception {
				
		Display display = PlatformUI.createDisplay();
		
		// check if db exists and if db needs to be updated
		checkDB();
		
		if (anotherBibiscoInstanceIsRunning()) {
			// use default locale, because I can't read Locale from db: is locked!!
			ResourceBundle lResourceBundle = ResourceBundle.getBundle("ApplicationResources", Locale.getDefault());
			MessageDialog.openError(new Shell(display), 
					lResourceBundle.getString("Application.anotherBibiscoInstanceIsRunning.title"),
            		lResourceBundle.getString("Application.anotherBibiscoInstanceIsRunning.text"));
            
            return IApplication.EXIT_OK;
            
        } else {
        	
        	// start Jetty
        	JettyManager.getInstance().start();
    	
        	// init Locale
        	LocaleManager.getInstance();
        	
        	// init xulrunner path
    		String lStrXulRunnerPath = getXulRunnerPath();
    		mLog.info("XulRunnerPath = ", lStrXulRunnerPath);
    		System.setProperty("org.eclipse.swt.browser.XULRunnerPath",lStrXulRunnerPath);
    		
    		// enable clipboard operation
    		enableClipboardOperationOnXulrunner();
    		
    		// create and run workbench
    		try {
    			int returnCode = PlatformUI.createAndRunWorkbench(display, new ApplicationWorkbenchAdvisor());
    			if (returnCode == PlatformUI.RETURN_RESTART)
    				return IApplication.EXIT_RESTART;
    			else
    			return IApplication.EXIT_OK;
    		} finally {
    			display.dispose();
    		}
        }
		
	}
	
	private void checkDB() {
		
		mLog.debug("Start checkDB()");
		
		try {
			// check if bibisco db exists in user home
			if (getUserHomeBibiscoDbFile().exists()) {
				// check if db needs to be updated
				checkBibiscoVersion();
			} 
			// db doesn't exist: let'create!
			else {
				mLog.info("db doesn't exist: let'create at position: ", ContextManager.getUserHomeBibiscoDbDirectoryPath());
				FileUtils.copyFileToDirectory(getBibiscoDBFile(), new File(ContextManager.getUserHomeBibiscoDbDirectoryPath()));
			}
		} catch (IOException e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.IO_EXCEPTION);
		}
		
		mLog.debug("End checkDB()");
	}

	private void checkBibiscoVersion() {
		// TODO Auto-generated method stub
		
	}
	
	private File getUserHomeBibiscoDbFile() {
		
		mLog.debug("Start getUserHomeBibiscoDbFile()");
		
		StringBuilder lStringBuilder = new StringBuilder();
		lStringBuilder.append(ContextManager.getUserHomeBibiscoDbDirectoryPath());
		lStringBuilder.append(ContextManager.getInstance().getPathSeparator());
		lStringBuilder.append("bibisco.h2.db");
		
		mLog.debug("End getUserHomeBibiscoDbFile()");
		
		return new File(lStringBuilder.toString());
	}

	private File getBibiscoDBFile() {
		
		mLog.debug("Start getBibiscoDBFile()");
		
		ContextManager lContextManager = ContextManager.getInstance();
		StringBuilder lStringBuilder = new StringBuilder();
		lStringBuilder.append(lContextManager.getAbsolutePath());
		lStringBuilder.append(lContextManager.getPathSeparator());
		lStringBuilder.append("db");
		lStringBuilder.append(lContextManager.getPathSeparator());		
		lStringBuilder.append("install");
		lStringBuilder.append(lContextManager.getPathSeparator());
		lStringBuilder.append("bibisco.h2.db");
		
		mLog.debug("End getBibiscoDBFile(): ", lStringBuilder.toString());
		
		return new File(lStringBuilder.toString());
	}

	private boolean anotherBibiscoInstanceIsRunning() {

		boolean lBlnResult = false;
		
		try {
			SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
			SqlSession lSqlSession = lSqlSessionFactory.openSession();
			lSqlSession.close();
		} catch (Throwable t) {
			mLog.error(t);
			lBlnResult = true;
		} 
		
		return lBlnResult;
	}

	public void stop() {
		if (!PlatformUI.isWorkbenchRunning())
			return;
		
		JettyManager.getInstance().stop();
		
		final IWorkbench workbench = PlatformUI.getWorkbench();
		final Display display = workbench.getDisplay();
		display.syncExec(new Runnable() {
			public void run() {
				if (!display.isDisposed())
					workbench.close();
			}
		});
	}
	
	private String getXulRunnerPath() {
		
		ContextManager lContextManager = ContextManager.getInstance();
		StringBuilder lStringBuilder = new StringBuilder(lContextManager.getAbsolutePath());
		lStringBuilder.append("xulrunner");
		lStringBuilder.append(lContextManager.getPathSeparator());
		lStringBuilder.append(lContextManager.getOS());
		
		return lStringBuilder.toString();
	}
	
	private void enableClipboardOperationOnXulrunner() {
		try {
			Class<?> lClass = Activator.getDefault().getClass()
			        .getClassLoader()
			        .loadClass("org.eclipse.swt.browser.MozillaDelegate");
			Method lMethod = lClass.getDeclaredMethod("getProfilePath");
			lMethod.setAccessible(true);
			String lStrProfilePath = (String) lMethod.invoke(null);
			
			mLog.debug("Xulrunner prefs.js location: ", lStrProfilePath + File.separator + "prefs.js");
			File lFileUserPrefs = new File(lStrProfilePath + File.separator + "prefs.js");
			FileWriter lFileWriter = new FileWriter(lFileUserPrefs);
            BufferedWriter lBufferedWriter = new BufferedWriter(lFileWriter);
            lBufferedWriter.write("user_pref(\"capability.policy.policynames\", \"allowclipboard\");");
            lBufferedWriter.newLine();
            lBufferedWriter.write("user_pref(\"capability.policy.default.Clipboard.cutcopy\", \"allAccess\");");
            lBufferedWriter.newLine();
            lBufferedWriter.write("user_pref(\"capability.policy.default.Clipboard.paste\", \"allAccess\");");
            lBufferedWriter.newLine();
            lBufferedWriter.write("user_pref(\"browser.cache.disk.enable\", \"false\");");
            lBufferedWriter.close();
						
		} catch (Exception e) {
			// suffocated exception: bibisco start with clipboard capabilities disabled.
			mLog.error(e);
		} 
	}
}
