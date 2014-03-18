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

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StreamTokenizer;
import java.io.UnsupportedEncodingException;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.bibisco.BibiscoException;
import com.bibisco.log.Log;
import com.bibisco.manager.ContextManager;

/**
 * 
 * Handling of "file upload requests", aka forms with file(s) to be
 * uploaded.
 * Handling multipart-content requests (RFC 1867)
 * 
 * @author Andrea Feccomandi
 *
 */
public final class FileFilter implements Filter {

	private static Log mLog = Log.getInstance(FileFilter.class);

	// CONFIGURABLE FIELDS
	/**
	 * Upload is denied above this quota (in bytes)
	 */
	private int mIntRejectThreshold = 5001;
	
	/**
	 * File is temporary trasferred to disk if above this quota (in bytes),
	 * to avoid memory waste. 
	 * 
	 * <p>Various Tricks with this value: 
	 * <il>Big values (megabytes) can avoid disk writes if used carefully.
	 * <il>When {@see mIntDiskThreshold} and  {@mIntRejectThreshold} 
	 * collapse to the same value, you get a more interesing scenario: 
	 * files under quota get loaded in memory, 
	 * otherwise the upload is denied: no writes to disk!
	 */
	private int mIntDiskThreshold = 5001;
	
	/**
	 * Where the tmp files go
	 */
	private String mStrTmpDir;
	
	/**
	 * Controls the request wrapping modes. 
	 * 
	 * <p>When <code>false</code>, this filter wraps <b>ALWAYS</b> the request, even
	 * if it's not multipart. 
	 * Thus standardizing the output: next filter receives
	 * the same object-type <b>ALWAYS</b>.
	 * 
	 * <p>When <code>true</code>, this filter works as follows:
	 * <li>if request is multipart, it got wrapped for next filter.
	 * <li>if request is not-multipart, it pass unwrapped.
	 */
	private boolean mBlnWrapperOnlyIfNeeded = true;

	//internal fields
	private MultipartWrapper mMultipartWrapper;

	public void doFilter(ServletRequest pRequest, ServletResponse pResponse, FilterChain pChain) throws IOException, ServletException {
		mLog.debug("doFilter start");
		boolean lBlnWrapAlways = !mBlnWrapperOnlyIfNeeded;
		
		boolean lBlnIsMultipart = ServletFileUpload.isMultipartContent((HttpServletRequest)pRequest);
		
		if (lBlnWrapAlways || lBlnIsMultipart) {
			mLog.debug("elaborating the request");
			mMultipartWrapper = new MultipartWrapper(pRequest);
			try { handleIt(pRequest); } 
			catch (FileUploadException e) {
				mLog.error(e, "FileUploadException raised in FileFilter.");
				throw new BibiscoException(e,BibiscoException.IO_EXCEPTION);
			}
			pChain.doFilter(mMultipartWrapper, pResponse); //notice the use of wrapper.
		} else 
			pChain.doFilter(pRequest, pResponse);
		mLog.debug("doFilter finish");
	}

	/**
	 * Handling of requests in multipart-encoded format.
	 * 
	 * <p>Decodes MIME payload and extracts each field and file.
	 * 
	 * @param pRequest
	 * @throws FileUploadException: see Jakarta commons FileUpload library
	 * @throws IOException
	 */
	@SuppressWarnings("unchecked")
	private void handleIt(ServletRequest pRequest) throws FileUploadException, IOException {
		DiskFileItemFactory lDiskFileItemFactory = new DiskFileItemFactory();
		lDiskFileItemFactory.setSizeThreshold(mIntDiskThreshold);
		lDiskFileItemFactory.setRepository(new File(mStrTmpDir));
		ServletFileUpload lServletFileUpload = new ServletFileUpload(lDiskFileItemFactory);
		lServletFileUpload.setSizeMax(mIntRejectThreshold);

		List<FileItem> lListFileItem = lServletFileUpload.parseRequest((HttpServletRequest)pRequest);
		for (FileItem lFileItem : lListFileItem)
			if (!lFileItem.isFormField()) { // file detected
				mLog.info("elaborating file ", lFileItem.getName());
				processUploadedFile(lFileItem, pRequest);
			} else // regular form field
				processRegularFormField(lFileItem,pRequest);
	}
	
	/**
	 * Processing classic form fields.
	 *<p>They are decoded and transferred to wrapper's map,
	 * which will substitute the original request-object later 
	 * (@see dpFilter }
	 * @param pField
	 */
	protected void processRegularFormField(FileItem pField, ServletRequest pRequest) {
		String name = pField.getFieldName();
		try {
			String lStrValue = pField.getString(pRequest.getCharacterEncoding());
			mMultipartWrapper.addParameter(name, lStrValue);
		} catch (UnsupportedEncodingException e) {
			mLog.error(e, "Fatal error decoding parameter ", name);
		}
	}

	/**
	 * Example of how to get useful things with the uploaded file structure.
     * Generally speaking, this method should be overrided by framework's users.
	 * 
	 * <p>Here we demostrate how to extract useful infos 
	 * (<code>name, value, isInMemory, size, etc) </code>)
	 * plus how to deal with memory- or disk-persisted cases.
	 * 
	 * <li><p>We pass the whole <code>FileItem</code> structure
	 * to the next <code>jsp</code> page, which gains the ability to extract 
	 * infos as well: via Request, under name: "file-" + fieldname
	 * 
	 * <li><p>The file content can be retrieved here or later, <code>FileItem</code>
	 * object can use its data-getters in <code>.jsp</code>s! 
	 * <p>In this code, we retrieve file content and pass it in Request 
	 * for next uses under the a general format of 
	 * array of bytes (<code>byte []</code>);  with name equal to "file-" + fieldname.  
	 *  
	 * @param pItem
	 * @throws IOException
	 */
	protected void processUploadedFile(FileItem pItem, ServletRequest pRequest) throws IOException {
		String name = pItem.getFieldName();
		boolean isInMemory = pItem.isInMemory();
		pRequest.setAttribute("file-"+name, pItem);

		if (isInMemory) {
			mLog.debug("the file ",name, " is in memory under the request attribute file-content-",name);
			byte[] data = pItem.get();
			pRequest.setAttribute("file-content-"+name, data);
		} else {
			mLog.debug("the file ",name, " is in the file system and under the request attribute file-content-",name);
			InputStream uploadedStream = pItem.getInputStream();
			byte[] data = (new StreamTokenizer(new BufferedReader(new InputStreamReader(uploadedStream)))).toString().getBytes();
			uploadedStream.close();
			pRequest.setAttribute("file-content-"+name, data);
		}
	}
	
	public void init(FilterConfig pFilterConfig) throws ServletException {
		mLog.debug("FileFilter initialized!!");
		
		mIntRejectThreshold = Integer.parseInt(pFilterConfig.getInitParameter("REJECT_THRESHOLD"));
		mIntDiskThreshold = Integer.parseInt(pFilterConfig.getInitParameter("DISK_THRESHOLD"));
		mStrTmpDir = ContextManager.getInstance().getTempDirectoryPath();
		mBlnWrapperOnlyIfNeeded = true;
	}

	public void destroy() {
		mLog.debug("FileFilter destroy!!");
	}

}
