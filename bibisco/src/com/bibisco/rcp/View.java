package com.bibisco.rcp;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.lang.reflect.Method;

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
		
		// enable clipboard operation
		enableClipboardOperationOnXulrunner();
		
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
            lBufferedWriter.close();
						
		} catch (Exception e) {
			// suffocated exception: bibisco start with clipboard capabilities disabled.
			mLog.error(e);
		} 
	}
}