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
package com.bibisco.rcp;

import java.util.Locale;
import java.util.ResourceBundle;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.eclipse.core.runtime.Platform;
import org.eclipse.equinox.app.IApplication;
import org.eclipse.equinox.app.IApplicationContext;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.ui.IWorkbench;
import org.eclipse.ui.PlatformUI;

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

	Log mLog;

	public Object start(IApplicationContext context) throws Exception {
				
		Display display = PlatformUI.createDisplay();
		
		// init log directory path
		String lStrLogPath = Platform.getInstallLocation().getURL().getPath();
		System.setProperty("bibiscoLogDirectory",lStrLogPath);
		mLog = Log.getInstance(Application.class);
		mLog.info("log directory path = ", lStrLogPath);
		
		// check if db needs to be updated
		checkDB();
		
		// check if another instance of bibisco is running
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
        	
        	ContextManager lContextManager = ContextManager.getInstance();
        	
        	// if win or linux init xulrunner path and xurunner appdata path
        	if (lContextManager.getOS().equals("win") || lContextManager.getOS().equals("linux32")  || lContextManager.getOS().equals("linux64")) {
        		String lStrXulRunnerPath = lContextManager.getXulRunnerDirectoryPath();
        		mLog.info("XulRunnerPath = ", lStrXulRunnerPath);
        		System.setProperty("org.eclipse.swt.browser.XULRunnerPath",lStrXulRunnerPath);
        		
        		String lStrXulRunnerAppDataPath = lContextManager.getXulRunnerAppDataDirectoryPath();
        		mLog.info("XulRunnerAppDataPath = ", lStrXulRunnerAppDataPath);
        		System.setProperty("org.eclipse.swt.browser.MOZ_PROFILE_PATH",lStrXulRunnerAppDataPath);
        	}
    		
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
		
		checkBibiscoVersion();
		
		mLog.debug("End checkDB()");
	}

	private void checkBibiscoVersion() {
		// TODO Auto-generated method stub
		
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
}
