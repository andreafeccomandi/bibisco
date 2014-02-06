package com.bibisco.rcp;

import org.eclipse.swt.SWT;
import org.eclipse.swt.browser.Browser;
import org.eclipse.swt.events.MenuDetectEvent;
import org.eclipse.swt.events.MenuDetectListener;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.ui.part.ViewPart;

import com.bibisco.BibiscoException;
import com.bibisco.Constants;
import com.bibisco.ContextManager;
import com.bibisco.JettyManager;
import com.bibisco.log.Log;

public class View extends ViewPart {
	public static final String ID = "bibisco.view";
	private Browser mBrowser;
	private Log mLog = Log.getInstance(View.class);
	
	@Override
	public void createPartControl(Composite pCmpParent) {
		
		String lStrXulRunnerPath = getXulRunnerPath();
		mLog.info("XulRunnerPath = ", lStrXulRunnerPath);
		System.setProperty("org.eclipse.swt.browser.XULRunnerPath",lStrXulRunnerPath);
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
		lStringBuilder.append(Constants.SERVLET_BIBISCO);
				
		mBrowser.setUrl(lStringBuilder.toString(), null, new String[] { "Cache-Control: no-cache" });
	}

	@Override
	public void setFocus() {
		if (mBrowser != null && !mBrowser.isDisposed()) {
			mBrowser.setFocus();
		}
	}
	
private String getXulRunnerPath() {
		
		ContextManager lContextManager = ContextManager.getInstance();
		StringBuilder lStringBuilder = new StringBuilder(lContextManager.getAbsolutePath());
		lStringBuilder.append("xulrunner");
		lStringBuilder.append(lContextManager.getPathSeparator());
		lStringBuilder.append(lContextManager.getOS());
		
		return lStringBuilder.toString();
	}
}