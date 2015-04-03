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

import org.eclipse.swt.layout.FormAttachment;
import org.eclipse.swt.layout.FormData;
import org.eclipse.swt.layout.FormLayout;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Control;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.ui.application.IWorkbenchWindowConfigurer;
import org.eclipse.ui.application.WorkbenchWindowAdvisor;

import com.bibisco.Constants;

/**
 * @author Andrea Feccomandi
 *
 */
public class ApplicationWorkbenchWindowAdvisor extends WorkbenchWindowAdvisor {

    public ApplicationWorkbenchWindowAdvisor(final IWorkbenchWindowConfigurer configurer) {
        super(configurer);
    }
    
    public void preWindowOpen() {
        IWorkbenchWindowConfigurer lWorkbenchWindowConfigurer = getWindowConfigurer();
        lWorkbenchWindowConfigurer.setShowCoolBar(false);
        lWorkbenchWindowConfigurer.setShowStatusLine(false);
        lWorkbenchWindowConfigurer.setShowProgressIndicator(false);
        lWorkbenchWindowConfigurer.setTitle(Constants.APPLICATION_TITLE); 
        lWorkbenchWindowConfigurer.getWorkbenchConfigurer().setSaveAndRestore(true);     
    }
    
    
    
    @Override
	public void postWindowCreate() {
		super.postWindowCreate();
		if(getWindowConfigurer().getWindow().getShell() != null) {
			getWindowConfigurer().getWindow().getShell().setMaximized(true);
		}
	}
    
    
    @Override
    public void createWindowContents(final Shell shell) {
        
    	final IWorkbenchWindowConfigurer configurer = getWindowConfigurer();
        final FormLayout lFormLayout = new FormLayout();
        lFormLayout.marginWidth = 0;
        lFormLayout.marginHeight = 0;
        shell.setLayout(lFormLayout);             
        
        Control lControlPage = configurer.createPageComposite(shell);
        FormData lFormData = new FormData();
        lFormData.top = new FormAttachment(0, 0);
        lFormData.left = new FormAttachment(0, 0);
        lFormData.right = new FormAttachment(100, 0);
        lFormData.bottom = new FormAttachment(100,0);
        lControlPage.setLayoutData(lFormData);
        
        getWindowConfigurer().getWindow().getShell().layout(true);
        if (lControlPage != null) {
            ((Composite) lControlPage).layout(true);
        }
      }

   
}
