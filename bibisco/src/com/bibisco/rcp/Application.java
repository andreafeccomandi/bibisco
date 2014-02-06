package com.bibisco.rcp;

import java.util.Locale;
import java.util.ResourceBundle;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.eclipse.equinox.app.IApplication;
import org.eclipse.equinox.app.IApplicationContext;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.ui.IWorkbench;
import org.eclipse.ui.PlatformUI;

import com.bibisco.JettyManager;
import com.bibisco.dao.SqlSessionFactoryManager;

/**
 * This class controls all aspects of the application's execution
 */
public class Application implements IApplication {


	public Object start(IApplicationContext context) throws Exception {
				
		Display display = PlatformUI.createDisplay();
		
		if (anotherBibiscoInstanceIsRunning()) {
			// use default locale, because I can't read Locale from db: is locked!!
			ResourceBundle lResourceBundle = ResourceBundle.getBundle("ApplicationResources", Locale.getDefault());
			MessageDialog.openError(new Shell(display), 
					lResourceBundle.getString("Application.anotherBibiscoInstanceIsRunning.title"),
            		lResourceBundle.getString("Application.anotherBibiscoInstanceIsRunning.text"));
            
            return IApplication.EXIT_OK;
            
        } else {
        
        	JettyManager.getInstance().start();
    	
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

	private boolean anotherBibiscoInstanceIsRunning() {

		boolean lBlnResult = false;
		
		try {
			SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
			SqlSession lSqlSession = lSqlSessionFactory.openSession();
			lSqlSession.close();
		} catch (Throwable t) {
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
