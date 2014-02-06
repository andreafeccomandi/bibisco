package com.bibisco;

import java.net.BindException;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.webapp.WebAppContext;

import com.bibisco.log.Log;

public class JettyManager {
	
	private static Log mLog = Log.getInstance(JettyManager.class);
	private static JettyManager mJettyManager;
	private JettyThread mJettyThread;
	
	public synchronized static JettyManager getInstance() {
		if (mJettyManager == null) {
			mJettyManager = new JettyManager();
		}
		return mJettyManager;
	}
	
	private JettyManager() {}
	
	public Object clone() throws CloneNotSupportedException {
		throw new CloneNotSupportedException();
	}

	public void start() {
		mLog.debug("Start start()");
		mJettyThread = new JettyThread();
		mJettyThread.start();
		mLog.debug("End start()");
	}
	
	public void stop() {
		
		mLog.debug("Start stop()");
		
		if (mJettyThread == null) {
			mLog.info("Jetty server not started");
		} else {
			mLog.info("Jetty server shutting down...");
			mJettyThread.shutdown();
			mLog.info("Jetty server shut down");
		}
		
		mLog.debug("End stop()");
	}
	
	public Integer getUsedPort() {
		
		Integer lIntPort = null;
		
		mLog.debug("Start getUsedPort()");
		
		if (mJettyThread == null) {
			mLog.info("Jetty server not started");
		} else {
			lIntPort = mJettyThread.getUsedPort();
		}
		
		mLog.debug("End getUsedPort()");
		
		return lIntPort;
	}
	
	public boolean isStarted() {
		if (mJettyThread != null && mJettyThread.isStarted()) {
			return true;
		} else {
			return false;
		}
	}

	
}

class JettyThread extends Thread {
	
	private static Log mLog = Log.getInstance(JettyThread.class);
	private Server mServer;
	private Integer mIntPort;
	private boolean mBlnStarted = false;
	private ContextManager mContextManager = ContextManager.getInstance();
	
	public JettyThread() {
	}
	
	@Override
	public void run() {
		
		mLog.debug("Start run()");
		mIntPort = getAvailablePort();
		mServer = new Server(mIntPort);

		WebAppContext lWebAppContext = new WebAppContext();
		lWebAppContext.setDescriptor(getWebAppContextDescriptor());
		lWebAppContext.setResourceBase(getWebAppResourceBase());
		lWebAppContext.setContextPath(Constants.WEB_UI_CONTEXT_PATH);
		lWebAppContext.setParentLoaderPriority(true);
		mServer.setHandler(lWebAppContext);
		
		try {
			mLog.info("Jetty server trying start on port ", String.valueOf(mIntPort));
			mServer.start();
			mLog.info("Jetty server started and listening");
			mBlnStarted = true;
			mServer.join();
		} catch (Exception e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.JETTY_EXCEPTION);
		}
		
		mLog.debug("End run()");
	}
	
	private String getWebAppContextDescriptor() {
		
		StringBuilder lStringBuilder = new StringBuilder();
		lStringBuilder.append(mContextManager.getAbsolutePath());
		lStringBuilder.append(mContextManager.getPathSeparator());
		lStringBuilder.append("WebContent");
		lStringBuilder.append(mContextManager.getPathSeparator());
		lStringBuilder.append("WEB-INF");
		lStringBuilder.append(mContextManager.getPathSeparator());
		lStringBuilder.append("web.xml");
		
		return lStringBuilder.toString();
	}

	private String getWebAppResourceBase() {
		
		StringBuilder lStringBuilder = new StringBuilder();
		lStringBuilder.append(mContextManager.getAbsolutePath());
		lStringBuilder.append(mContextManager.getPathSeparator());
		lStringBuilder.append("WebContent");
		
		return lStringBuilder.toString();
	}

	
	public void shutdown() {
		
		if (mServer == null) {
			return;
		}
		
		try {
			mServer.stop();
			mBlnStarted = false;
		} catch (Exception e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.JETTY_EXCEPTION);
		}
	}
	
	public Integer getUsedPort() {
		return mIntPort;
	}
	
	private Integer getAvailablePort() {
		
		mLog.debug("Start getAvailablePort()");
		
		boolean lBlnStarted = false;
		Integer lIntPort = 8085;
		Server lServer;
		
		while(!lBlnStarted) {
			try {
				mLog.info("Trying port ", String.valueOf(lIntPort));
				lServer = new Server(lIntPort);
				lServer.start();
				lBlnStarted = true;
				mLog.info("Port ", String.valueOf(lIntPort), " available!");
				lServer.stop();
				
			} catch (BindException e) {
				mLog.info("Port ", String.valueOf(lIntPort), " not available.");
				lIntPort++;
			} catch (Exception e) {
				mLog.error(e);
				throw new BibiscoException(e, BibiscoException.JETTY_EXCEPTION);
			} 
		}
		
		mLog.debug("End getAvailablePort()");
		
		return lIntPort;
	}

	public boolean isStarted() {
		return mBlnStarted;
	}
}