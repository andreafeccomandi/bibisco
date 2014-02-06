package com.bibisco.log;
/* Copyright 2005-2006 Tim Fennell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import org.apache.log4j.Level;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.apache.log4j.MDC;
import org.apache.log4j.xml.DOMConfigurator;

/**
 * <p>A <em>wafer thin</em> wrapper around Log4J logging that uses var-args to make it
 * much more efficient to call the logging methods Log4j without having to
 * surround every call site with calls to Log.isXXXEnabled().  All the methods on this
 * class take a variable length list of arguments and, only if logging is enabled for
 * the level and channel being logged to, will those arguments be toString()'d and
 * appended together.</p>
 *
 * @author Tim Fennell
 */
public final class Log {
	
    private org.apache.log4j.Logger realLog;

    /**
     * Private constructor to force getInstance.
     */
    private Log() {
    }

    /**
     * Private constructor which creates a new Log instance wrapping the commons Log instance
     * provided.  Only used by the static getInstance() method on this class.
     */
    private Log(org.apache.log4j.Logger realLog) {
        this.realLog = realLog;
    }

    /**
     * Get a Log instance to perform logging within the Class specified.  Returns an instance
     * of this class which wraps an instance of the commons logging Log class.
     * @param clazz the Class which is going to be doing the logging
     * @return a Log instance with which to log
     */
    public static Log getInstance(Class<?> clazz) {
        return new Log(Logger.getLogger(clazz));
    }

    /**
     * Get a Log instance to perform logging within the String specified.  Returns an instance
     * of this class which wraps an instance of the commons logging Log class.
     * @param clazz the Class which is going to be doing the logging
     * @return a Log instance with which to log
     */
    public static Log getInstance(String name) {
        return new Log(Logger.getLogger(name));
    }

    /**
     * Logs a Throwable and optional message parts at level error.
     * @param throwable an instance of Throwable that should be logged with stack trace
     * @param messageParts zero or more objects which should be combined, by calling toString()
     *        to form the log message.
     */
    public final void error(Throwable throwable, String... messageParts) {
        if (this.realLog.isEnabledFor(Level.ERROR)) {
            this.realLog.error(combineParts(messageParts), throwable);
        }
    }

    /**
     * Logs a Throwable and optional message parts at level info.
     * @param throwable an instance of Throwable that should be logged with stack trace
     * @param messageParts zero or more objects which should be combined, by calling toString()
     *        to form the log message.
     
    //TODO: per il momento lo nascondiamo! Ma direi di toglierlo!!
    private final void info(Throwable throwable, String... messageParts) {
        if (this.realLog.isInfoEnabled()) {
            this.realLog.info(combineParts(messageParts), throwable);
        }
    }*/

    /**
     * Logs a Throwable and optional message parts at level debug.
     * @param throwable an instance of Throwable that should be logged with stack trace
     * @param messageParts zero or more objects which should be combined, by calling toString()
     *        to form the log message.
     
    //TODO: per il momento lo nascondiamo! Ma direi di toglierlo!!
    private final void debug(Throwable throwable, String... messageParts) {
        if (this.realLog.isDebugEnabled()) {
            this.realLog.debug(combineParts(messageParts), throwable);
        }
    }*/

    /**
     * Logs a Throwable and optional message parts at level trace.
     * @param throwable an instance of Throwable that should be logged with stack trace
     * @param messageParts zero or more objects which should be combined, by calling toString()
     *        to form the log message.
     
    //TODO: per il momento lo nascondiamo! Ma direi di toglierlo!!
    private final void trace(Throwable throwable, String... messageParts) {
        if (this.realLog.isTraceEnabled()) {
            this.realLog.trace(combineParts(messageParts), throwable);
        }
    }*/

    // Similar methods, but without Throwables, follow

    /**
     * Logs one or more message parts at level error.
     * @param messageParts one or more objects which should be combined, by calling toString()
     *        to form the log message.
     */
    public final void error(String... messageParts) {
        if (this.realLog.isEnabledFor(Level.ERROR)) {
            this.realLog.error(combineParts(messageParts));
        }
    }

    /**
     * Logs one or more message parts at level info.
     * @param messageParts one or more objects which should be combined, by calling toString()
     *        to form the log message.
     */
    public final void info(String... messageParts) {
        if (this.realLog.isInfoEnabled()) {
            this.realLog.info(combineParts(messageParts));
        }
    }

    /**
     * Logs one or more message parts at level debug.
     * @param messageParts one or more objects which should be combined, by calling toString()
     *        to form the log message.
     */
    public final void debug(String... messageParts) {
        if (this.realLog.isDebugEnabled()) {
            this.realLog.debug(combineParts(messageParts));
        }
    }

    /**
     * Combines all the message parts handed in to the logger in order to pass them in to
     * the commons logging interface.
     */
    private String combineParts(String[] messageParts) {
        StringBuilder builder = new StringBuilder(128);
        for (String part : messageParts) {
            builder.append(part);
        }
        return builder.toString();
    }

	/**
	 * Restituisce il valore di un oggetto in forma di stringa per utilizzo nei
	 * log. In particolare:<br>
	 * 1) Se il campo è null restituisce NULL<br>
	 * 2) Se il campo è di tipo stringa restituisce il valore del campo tra
	 * apici singoli (') <br>
	 * 3) Se il campo è di altro tipo restituisce la rappresentazione in forma
	 * di stringa del campo ottenuta mediante la chiamata al metodo
	 * <tt>toString<tt>.
	 * 
	 * @param pObject valore del campo
	 * @return valore di un campo in forma di stringa per utilizzo nei log.
	 */
	public static String getValue4Log(Object pObject) {
		if (pObject == null) {
			return "NULL";
		} else if (pObject instanceof String) {
			return "'" + (String) pObject + "'";
		} else {
			return pObject.toString();
		}
	}
	
	
	public LoggingOutputStream getLoggingOutputStream()
	{
		return new LoggingOutputStream(realLog,org.apache.log4j.Level.DEBUG);
	}

	/**
	 * @return
	 * @see org.apache.log4j.Category#isDebugEnabled()
	 */
	public boolean isDebugEnabled() {
		return realLog.isDebugEnabled();
	}

	/**
	 * @return
	 * @see org.apache.log4j.Category#isInfoEnabled()
	 */
	public boolean isInfoEnabled() {
		return realLog.isInfoEnabled();
	}
	 
    public void reloadConfiguration(String pStrFilePath) {
    	info("start Configuration reset ");
    	LogManager.resetConfiguration();
    	DOMConfigurator.configure(pStrFilePath);
    	info("finish Configuration reset");
    }
    
    public static void mdcPut(String pStrKey, String pStrValue) {
    	MDC.put(pStrKey,pStrValue);
    }
    public static void mdcRemove(String pStrKey) {
    	MDC.remove(pStrKey);
    }
}
