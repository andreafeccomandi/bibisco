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

import org.eclipse.core.runtime.IStatus;
import org.eclipse.core.runtime.MultiStatus;
import org.eclipse.core.runtime.Status;
import org.eclipse.jface.dialogs.ErrorDialog;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.ui.PlatformUI;
import org.eclipse.ui.application.IWorkbenchWindowConfigurer;
import org.eclipse.ui.application.WorkbenchAdvisor;
import org.eclipse.ui.application.WorkbenchWindowAdvisor;

import com.bibisco.BibiscoException;
import com.bibisco.Constants;
import com.bibisco.log.Log;
import com.bibisco.manager.ResourceBundleManager;

/**
 * @author Andrea Feccomandi
 *
 */
public class ApplicationWorkbenchAdvisor extends WorkbenchAdvisor {

	private static Log mLog = Log.getInstance(ApplicationWorkbenchAdvisor.class);

    public WorkbenchWindowAdvisor createWorkbenchWindowAdvisor(IWorkbenchWindowConfigurer configurer) {
		return new ApplicationWorkbenchWindowAdvisor(configurer);
	}

	public String getInitialWindowPerspectiveId() {
		return Constants.PERSPECTIVE_ID;
	}
	
	
	public void eventLoopException(Throwable t) {

		BibiscoException lBibiscoException;
		ErrorDialog lErrorDialog;
		
		if (t instanceof BibiscoException) {
			lBibiscoException = (BibiscoException) t;
			mLog.error("Caught BibiscoException"); 
		} else {
			lBibiscoException = new BibiscoException(t, "bibiscoException.errorFilter.unhandledException");
			mLog.error(t, "Caught Unhandled Exception");
		}

		lErrorDialog = new ErrorDialog(Activator.getDefault().getWorkbench().getActiveWorkbenchWindow().getShell(), 
				ResourceBundleManager.getString("ApplicationWorkbenchAdvisor.ErrorDialog.Title"), null, 
				getBibiscoExceptionErrorStatus(lBibiscoException), IStatus.ERROR);

		lErrorDialog.open();
	}

	
	private IStatus getBibiscoExceptionErrorStatus(BibiscoException pBibiscoException) {
		
		MultiStatus lMultiStatus;
		StackTraceElement[] lStackTraceElements;
		IStatus[] lStatuses;
		
		lStackTraceElements = pBibiscoException.getStackTrace();
		lStatuses = new IStatus[lStackTraceElements.length];
		for (int i=0; i<lStackTraceElements.length; i++) {
			lStatuses[i] = new Status(IStatus.ERROR, "ErrorStatusDetail",lStackTraceElements[i].toString());
	}

		lMultiStatus = new MultiStatus("MultiStatus",
				IStatus.OK,
				lStatuses,
				ResourceBundleManager.getString(pBibiscoException),
				pBibiscoException );
		
		return lMultiStatus;
	}
	
	public boolean preShutdown(){  
		  
		Shell lShell = PlatformUI.getWorkbench().getActiveWorkbenchWindow().getShell();  
		String lStrDialogBoxTitle = ResourceBundleManager.getString("com.bibisco.rcp.preShutdown.confirm.title");  
		String lStrQuestion = ResourceBundleManager.getString("com.bibisco.rcp.preShutdown.confirm.question");
		return MessageDialog.openQuestion(lShell, lStrDialogBoxTitle, lStrQuestion);  
		  
	}  
}
