package com.bibisco;

import java.awt.Toolkit;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.DataFlavor;
import java.awt.datatransfer.StringSelection;
import java.awt.datatransfer.Transferable;

import com.bibisco.log.Log;

/**
 * This class manage the clipboard
 * 
 * @author Andrea Feccomandi
 *
 */
public class ClipboardManager {

	private static Log mLog = Log.getInstance(ClipboardManager.class);
	
	public static void putContentToClipboard(String pStrContent) {
		
		mLog.debug("Start putContentToClipboard(String): ", pStrContent);
		
		Clipboard lClipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
		StringSelection lStringSelection = new StringSelection(pStrContent);
		lClipboard.setContents(lStringSelection,null);
		
		mLog.debug("End putContentToClipboard(String)");
	}

	public static String getContentFromClipboard() {
		
		String lStrContent = null;
		
		mLog.debug("Start getContentFromClipboard()");
		
		try {
			Clipboard lClipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
			Transferable lTransferable = lClipboard.getContents(null);
			if(lTransferable != null && lTransferable.isDataFlavorSupported(DataFlavor.stringFlavor)) {
				lStrContent = (String) lTransferable.getTransferData(DataFlavor.stringFlavor);
			}
		} catch (Exception e) {
			mLog.error(e);
			throw new BibiscoException(e, BibiscoException.IO_EXCEPTION);
		}
		
        mLog.debug("End getContentFromClipboard(): return ", lStrContent);
        
        return lStrContent;
      
	}
}
