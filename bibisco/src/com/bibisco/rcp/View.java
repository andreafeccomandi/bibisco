package com.bibisco.rcp;

import org.eclipse.core.runtime.jobs.IJobManager;
import org.eclipse.core.runtime.jobs.Job;
import org.eclipse.swt.SWT;
import org.eclipse.swt.browser.Browser;
import org.eclipse.swt.events.MenuDetectEvent;
import org.eclipse.swt.events.MenuDetectListener;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.ui.part.ViewPart;

import com.bibisco.BibiscoException;
import com.bibisco.Constants;
import com.bibisco.JettyManager;
import com.bibisco.log.Log;

public class View extends ViewPart {
	public static final String ID = "bibisco.view";
	private Browser mBrowser;
	private Log mLog = Log.getInstance(View.class);
	
	@Override
	public void createPartControl(Composite pCmpParent) {

		// cancel Workbench Auto-Save Job: without workspace cause bibisco crash!
		cancelWorkbenchAutoSaveJob();
		
		// create Browser instance
		mBrowser = new Browser(pCmpParent, SWT.MOZILLA);
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
		
		StringBuilder lStringBuilder = new StringBuilder();
		lStringBuilder.append("http://localhost:");
		lStringBuilder.append(JettyManager.getInstance().getUsedPort());
		lStringBuilder.append(Constants.WEB_UI_CONTEXT_PATH);
		lStringBuilder.append(Constants.INDEX_PAGE);
		
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
}