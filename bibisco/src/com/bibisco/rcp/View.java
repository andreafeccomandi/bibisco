/*
 * Copyright (C) 2014-2016 Andrea Feccomandi
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
import java.util.Date;

import org.apache.commons.lang.ArrayUtils;
import org.eclipse.core.runtime.jobs.IJobManager;
import org.eclipse.core.runtime.jobs.Job;
import org.eclipse.swt.SWT;
import org.eclipse.swt.browser.Browser;
import org.eclipse.swt.browser.BrowserFunction;
import org.eclipse.swt.events.MenuDetectEvent;
import org.eclipse.swt.events.MenuDetectListener;
import org.eclipse.swt.graphics.Rectangle;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.DirectoryDialog;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Monitor;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.ui.PlatformUI;
import org.eclipse.ui.part.ViewPart;

import com.bibisco.BibiscoException;
import com.bibisco.Constants;
import com.bibisco.log.Log;
import com.bibisco.manager.ContextManager;
import com.bibisco.manager.HttpManager;
import com.bibisco.manager.JettyManager;

/**
 * Main view of application.
 * 
 * @author Andrea Feccomandi
 *
 */
public class View extends ViewPart {
	public static final String ID = "bibisco.view";
	private Browser mBrowser;
	private Log mLog = Log.getInstance(View.class);
	
	@Override
	public void createPartControl(Composite pCmpParent) {

		// cancel Workbench Auto-Save Job: without workspace cause bibisco crash!
		cancelWorkbenchAutoSaveJob();
		
		// calculate dev pixels per px
		String lStrDevPixelsPerPx = calculateDevPixelsPerPx();
		
		// set dev pixels per px 
		setDevPixelsPerPx(lStrDevPixelsPerPx);
		
    	// create MOZILLA browser
		mBrowser = new Browser(pCmpParent, SWT.MOZILLA);
    	
		// enable javascript
		mBrowser.setJavascriptEnabled(true);
		
		// browser context menu disabled
		mBrowser.addMenuDetectListener(new MenuDetectListener() {
			
			@Override
			public void menuDetected(MenuDetectEvent e) {
				e.doit = false;
			}
		});
		
		// waiting until Jetty is started
		while(!JettyManager.getInstance().isStarted()) {
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				mLog.error(e);
				throw new BibiscoException(e, BibiscoException.JETTY_EXCEPTION);
			}
		}
		
		// add bibiscoOpenDirectoryDialog js function
		new BibiscoOpenDirectoryDialog(mBrowser, "bibiscoOpenDirectoryDialog", pCmpParent.getShell());
		
		StringBuilder lStringBuilder = new StringBuilder();
		lStringBuilder.append("http://localhost:");
		lStringBuilder.append(JettyManager.getInstance().getUsedPort());
		lStringBuilder.append(Constants.WEB_UI_CONTEXT_PATH);
		lStringBuilder.append(Constants.LOADING_PAGE);
		lStringBuilder.append("?version=");
		lStringBuilder.append((new Date()).getTime());
		
		// precompile index.jsp to avoid delay on startup
		HttpManager.precompileLoadingPage(lStringBuilder.toString());
		
		mBrowser.setUrl(lStringBuilder.toString(), null, new String[] { "Cache-Control: no-cache" });
	}

	@Override
	public void setFocus() {
		if (mBrowser != null && !mBrowser.isDisposed()) {
			mBrowser.setFocus();
		}
	}
	
	private void cancelWorkbenchAutoSaveJob() {
		
		IJobManager lJobManager= Job.getJobManager();
		Job[] lJobs= lJobManager.find(null);
		
		for (int i= 0; i < lJobs.length; i++) {
			if ("Workbench Auto-Save Job".equals(lJobs[i].getName())) {
				lJobs[i].cancel();
				break;
			}
		}
	}
	
	private Rectangle getMonitorDimensions() {
				
		Rectangle lRectangleResult = null;
		
		final Display lDisplay = PlatformUI.getWorkbench().getDisplay();
		Monitor[] lMonitors = lDisplay.getMonitors();
		mLog.info("*** Monitor Found : " + lMonitors.length);
		
		if (ArrayUtils.isEmpty(lMonitors)) {
			mLog.info("*** bibisco wasn't able to get monitor informations!");
		} 
		
		else {			
			Rectangle lRectangle = null;
			for (int i = 0; i < lMonitors.length; i++) {
				lRectangle = lMonitors[i].getClientArea();
				mLog.info("*** Monitor " + (i+1) + " dimensions - width: " + lRectangle.width + ", height: " + lRectangle.height);
				if (lRectangleResult==null || lRectangle.width < lRectangleResult.width) {
					lRectangleResult = lRectangle;
				}
			}
		}
		
		return lRectangleResult;
	}
		
	private String calculateDevPixelsPerPx() {
		
		String lStrDevPixelsPerPx = "1.0";
		
		Rectangle lRectangle = getMonitorDimensions();
		if (lRectangle != null && lRectangle.width > 2500) {
			return "2.0";
		} 
		
		mLog.info("*** Dev Pixels Per Px: " + lStrDevPixelsPerPx);
		
		return lStrDevPixelsPerPx;
	}
	
	
	private void setDevPixelsPerPx(String pStrDevPixelsPerPx) {

		String lStrXulRunnerAppDataDirectoryPath = ContextManager.getInstance()
				.getXulRunnerAppDataDirectoryPath();
		try {
			File lFileAppData = new File(lStrXulRunnerAppDataDirectoryPath);
			if (!lFileAppData.exists()) {
				lFileAppData.mkdir();
			}
			File lFileUserPrefs = new File(lStrXulRunnerAppDataDirectoryPath
					+ File.separator + "user.js");
			FileWriter lFileWriter = new FileWriter(lFileUserPrefs);
			BufferedWriter lBufferedWriter = new BufferedWriter(lFileWriter);
			lBufferedWriter.write("user_pref(\"layout.css.devPixelsPerPx\", \""+pStrDevPixelsPerPx+"\");");
			lBufferedWriter.newLine();
			lBufferedWriter.close();

		} catch (Exception e) {
			// suffocated exception: bibisco start with default dev pixels per px.
			mLog.error(e);
		}
	}
}

class BibiscoOpenDirectoryDialog extends BrowserFunction {

	Shell mShell;

	BibiscoOpenDirectoryDialog(Browser pBrowser, String pStrName, Shell pShell) {
		super(pBrowser, pStrName);
		mShell = pShell;
	}

	public Object function(Object[] arguments) {
		DirectoryDialog dialog = new DirectoryDialog(mShell, SWT.OPEN);
		return dialog.open();
	}
}
