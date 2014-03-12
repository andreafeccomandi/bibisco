/*
 * Copyright (C) 2014 Andrea Feccomandi
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
package com.bibisco.filters;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import com.bibisco.log.Log;

/**
 * Charset filter
 * 
 * @author Andrea Feccomandi
 *
 */
public final class CharsetFilter implements Filter {

	private static Log mLog = Log.getInstance(CharsetFilter.class);
	private static final String ENCODING="encoding";
	private String mEncoding = "UTF-8";

	public void doFilter(ServletRequest pServletRequest, ServletResponse pServletResponse, FilterChain pFilterChain) throws IOException, ServletException {
		pServletRequest.setCharacterEncoding(mEncoding);
		pFilterChain.doFilter( pServletRequest, pServletResponse );
	}

	public void init(FilterConfig pFilterConfig) throws ServletException {
		mLog.debug("init");
		String lEncoding = pFilterConfig.getInitParameter(ENCODING);
		if(mEncoding!=null && !mEncoding.trim().equalsIgnoreCase(""))
			mEncoding = lEncoding;
		mLog.info("Incoming requests expected encoding = " + mEncoding);
	}

	public void destroy() {
		mLog.debug("destroy");
	}
}
