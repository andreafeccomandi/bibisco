package com.bibisco;


/**
 * This exception wrap all application exceptions
 * 
 * @author Andrea Feccomandi
 * 
 */
public class BibiscoException extends RuntimeException {

	public static final String FATAL = "bibiscoException.fatal";
	public static final String SQL_EXCEPTION = "bibiscoException.SQLException";
	public static final String IO_EXCEPTION = "bibiscoException.IOException";
	public static final String REFLECTION_EXCEPTION = "bibiscoException.ReflectionException";
	public static final String JETTY_EXCEPTION = "bibiscoException.JettyException";

	private static final long serialVersionUID = 1L;

	private String mStrResourceBundleKey;
	private String[] mStrArgs;

	public BibiscoException(String pStrResourceBundleKey, String... pStrArgs) {
		mStrResourceBundleKey = pStrResourceBundleKey;
		mStrArgs = pStrArgs;
	}

	public BibiscoException(Throwable pThrowable, String pStrResourceBundleKey, String... pStrArgs) {
		super(pThrowable);
		mStrResourceBundleKey = pStrResourceBundleKey;
		mStrArgs = pStrArgs;
	}

	public String getResourceBundleKey() {
		return mStrResourceBundleKey;
	}

	public String[] getArgs() {
		return mStrArgs;
	}

}
