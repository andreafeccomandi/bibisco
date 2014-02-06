package com.bibisco;

import java.text.MessageFormat;
import java.util.MissingResourceException;
import java.util.ResourceBundle;

import com.bibisco.log.Log;

/**
 * This class manage the resource bundle.
 * 
 * @author Andrea Feccomandi
 *
 */
public class ResourceBundleManager {
	private static Log mLog = Log.getInstance(ResourceBundleManager.class);
	private static final String BUNDLE_NAME = "ApplicationResources"; //$NON-NLS-1$
	//private static final ResourceBundle mResourceBundle = ResourceBundle.getBundle(BUNDLE_NAME, LocaleManager.getInstance().getLocale());
	
	private ResourceBundleManager() {
	}

	/**
	 * Restituisce la stringa corrispondente alla chiave passata in input
	 * recuperandola dal resource bundle associato alla Locale
	 * dell'applicazione.
	 * 
	 * @param pStrKey
	 *            chiave della stringa da recuperare
	 * @return stringa corrispondente alla chiave passata in input recuperata
	 *         dal resource bundle associato alla Locale dell'applicazione.
	 */
	public static String getString(String pStrKey) {
		
		String lStrBundle = null;
		
		try {
			ResourceBundle lResourceBundle = ResourceBundle.getBundle(BUNDLE_NAME, LocaleManager.getInstance().getLocale());
			lStrBundle = lResourceBundle.getString(pStrKey);
		} catch (MissingResourceException e) {
			mLog.error(e, "Can't find resource for key ",pStrKey);
			throw new BibiscoException("bibiscoException.resourceBundleManager.missingResource",pStrKey);
		}
		
		return lStrBundle;
		
	}
	
	/**
	 * Restituisce la stringa corrispondente alla chiave passata in input
	 * recuperandola dal resource bundle associato alla Locale
	 * dell'applicazione.
	 * 
	 * @param pStrKey
	 *            chiave della stringa da recuperare
	 * @param pStrArgs
	 * 			  argomenti da sostituire nella stringa recuperata
	 * @return stringa corrispondente alla chiave passata in input recuperata
	 *         dal resource bundle associato alla Locale dell'applicazione.
	 */
	public static String getString(String pStrKey, String[] pStrArgs) {
		
		MessageFormat lMessageFormat;
		String lStringWithArgs;
		String lStrResult;
		
		lStringWithArgs = getString(pStrKey);
		lMessageFormat = new MessageFormat(lStringWithArgs, LocaleManager.getInstance().getLocale());
		lStrResult = lMessageFormat.format(pStrArgs);
		
		return lStrResult;
	}
	
	
	/**
	 * Restituisce la stringa corrispondente al messaggio di errore 
	 * associato alla BibiscoException passata in input.
	 * 
	 * @param pBibiscoException eccezione di cui si vuole ottenere
	 * il messaggio di errore associato
	 * 
	 * @return stringa corrispondente al messaggio di errore 
	 * associato alla BibiscoException passata in input.
	 */
	public static String getString(BibiscoException pBibiscoException) {
		return getString(pBibiscoException.getResourceBundleKey(), pBibiscoException.getArgs());
	}
	
}
