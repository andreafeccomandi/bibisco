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
package com.bibisco.manager;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.Validate;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.bibisco.BibiscoException;
import com.bibisco.bean.ImageDTO;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.ImagesMapper;
import com.bibisco.dao.model.Images;
import com.bibisco.dao.model.ImagesExample;
import com.bibisco.enums.ElementType;
import com.bibisco.log.Log;

/**
 * Image manager.
 * 
 * @author Andrea Feccomandi
 *
 */
public class ImageManager {

	private static Log mLog = Log.getInstance(ImageManager.class);

	public static ImageDTO insert(ImageDTO pImageDTO) {
		
		mLog.debug("Start insert(ImageDTO)");
		
		// validate preconditions
		Validate.notNull(pImageDTO, "argument ImageDTO cannot be null");
		Validate.notNull(pImageDTO.getIdElement(), "argument ImageDTO.idElement cannot be null");
		Validate.notNull(pImageDTO.getElementType(), "argument ImageDTO.elementType cannot be null");
		Validate.notNull(pImageDTO.getInputStream(), "argument ImageDTO.inputStream cannot be null");
		Validate.notEmpty(pImageDTO.getSourceFileName(), "argument ImageDTO.sourceFileName cannot be empty");
		Validate.notEmpty(pImageDTO.getDescription(), "argument ImageDTO.description cannot be empty");
		
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    		// write file to file system
    		String lStrFileName = writeFile(pImageDTO);
    		
    		Images lImages = new Images();
    		lImages.setDescription(pImageDTO.getDescription());
    		lImages.setIdElement(pImageDTO.getIdElement());
    		lImages.setElementType(pImageDTO.getElementType().getValue());
    		lImages.setFileName(lStrFileName);
			
			ImagesMapper lImagesMapper = lSqlSession.getMapper(ImagesMapper.class);
			lImagesMapper.insert(lImages);
			
			pImageDTO.setIdImage(lImages.getIdImage().intValue());
			pImageDTO.setTargetFileName(lStrFileName);

			lSqlSession.commit();
			
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
    	mLog.debug("Start insert(ImageDTO)");

		return pImageDTO;

	}
	
	private static String writeFile(ImageDTO pImageDTO) {

		String lStrFileName = null;

		mLog.debug("Start writeFile(ImageDTO)");

		String lStrFileItemFileName = pImageDTO.getSourceFileName();

		// build file name
		StringBuilder lStringBuilderFileName = new StringBuilder();
		lStringBuilderFileName.append(UUID.randomUUID().toString());
		lStringBuilderFileName.append(".");
		lStringBuilderFileName.append(FilenameUtils.getExtension(lStrFileItemFileName));
		lStrFileName = lStringBuilderFileName.toString();

		// get file path
		String lStrFilePath = getFilePath(lStrFileName);

		// write file to disk
		InputStream lInputStream = pImageDTO.getInputStream();

		try {

			File lFile = new File(lStrFilePath);
			FileOutputStream lFileOutputStream = new FileOutputStream(lFile);

			int lIntRead = 0;
			byte[] lBytes = new byte[1024];
			while ((lIntRead = lInputStream.read(lBytes)) != -1) {
				lFileOutputStream.write(lBytes, 0, lIntRead);
			}
			lInputStream.close();
			lFileOutputStream.close();

		} catch (Throwable t) {
			mLog.error(
					t,
					"insert() Error writing file: lFile="
							+ pImageDTO.getSourceFileName());
			throw new BibiscoException(BibiscoException.IO_EXCEPTION);
		}

		mLog.debug("End writeFile(ImageDTO): return ", lStrFileName);

		return lStrFileName;
	}

	private static String getFilePath(String pStrFileName) {
		// build file path
		StringBuilder lStringBuilderFilePath = new StringBuilder();
		lStringBuilderFilePath.append(ProjectManager.getDBProjectDirectory(ContextManager.getInstance().getIdProject()));
		lStringBuilderFilePath.append(System.getProperty("file.separator"));
		lStringBuilderFilePath.append(pStrFileName);
		String lStrFilePath = lStringBuilderFilePath.toString();
		return lStrFilePath;
	}
	
	private static void deleteFile(String pStrFileName) {

		mLog.debug("Start deleteFile("+pStrFileName+")");

		// get file path
		String lStrFilePath = getFilePath(pStrFileName);
		
		// delete file
		File lFile = new File(lStrFilePath);
		lFile.delete();
		
		mLog.debug("End deleteFile("+pStrFileName+")");
	}
	
	public static String load(Integer pIntIdImage) {
		
		String lStrFileName = null;
		
		mLog.debug("Start load(ImageDTO)");
		
		// validate preconditions
		Validate.notNull(pIntIdImage, "argument idImage cannot be null");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    		
			ImagesMapper lImagesMapper = lSqlSession.getMapper(ImagesMapper.class);
			Images lImages = lImagesMapper.selectByPrimaryKey(pIntIdImage.longValue());
			if (lImages != null) {				
				lStrFileName = lImages.getFileName();
			}

    	} catch(Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
    	mLog.debug("End load(ImageDTO)");

		return lStrFileName;

	}
	
	public static List<ImageDTO> loadImagesByElement(Integer pIntIdElement, ElementType pElementType) {
		
		List<ImageDTO> lListImageDTO = new ArrayList<ImageDTO>();
		
		mLog.debug("Start loadImagesByElement(Integer, ElementType");
		
		// validate preconditions
		Validate.notNull(pIntIdElement, "argument idElement cannot be null");
		Validate.notNull(pElementType, "argument ElementType cannot be null");
		
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
		
    	try {
    		ImagesExample lImagesExample = new ImagesExample();
    		lImagesExample.createCriteria().andIdElementEqualTo(pIntIdElement)
    			.andElementTypeEqualTo(pElementType.getValue());
    		lImagesExample.setOrderByClause("id_image");
			
			ImagesMapper lImagesMapper = lSqlSession.getMapper(ImagesMapper.class);
			List<Images> lListImages = lImagesMapper.selectByExample(lImagesExample);
			
			for (Images lImages : lListImages) {
				ImageDTO lImageDTO = new ImageDTO();
				lImageDTO.setIdImage(lImages.getIdImage().intValue());
				lImageDTO.setDescription(lImages.getDescription());
				lImageDTO.setElementType(pElementType);
				lImageDTO.setIdElement(pIntIdElement);
				lListImageDTO.add(lImageDTO);
			}

    	} catch(Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		 
		
    	mLog.debug("End loadImagesByElement(ImageDTO");

		return lListImageDTO;

	}

	public static void delete(Integer pIntIdImage) {
		
		mLog.debug("Start delete(Integer)");
		
		// validate preconditions
		Validate.notNull(pIntIdImage, "argument idImage cannot be null");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    		ImagesMapper lImagesMapper = lSqlSession.getMapper(ImagesMapper.class);
    		
    		// load image to delete
    		Images lImages = lImagesMapper.selectByPrimaryKey(pIntIdImage.longValue());
    		
    		if (lImages != null) {    			
    			// delete image file on disk
    			deleteFile(lImages.getFileName());
    			
    			// delete image on db
    			lImagesMapper.deleteByPrimaryKey(pIntIdImage.longValue());

    			lSqlSession.commit();
    		}
    					
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
    	
    	mLog.debug("End delete(Integer)");
	}

	public static void deleteImagesByElement(SqlSession pSqlSession, Integer pIntIdElement, ElementType pElementType) {
		
		mLog.debug("Start deleteImagesByElement(SqlSession, Integer, ElementType)");
		
		// validate preconditions
		Validate.notNull(pSqlSession, "argument SqlSession cannot be null");
		Validate.notNull(pIntIdElement, "argument idElement cannot be null");
		Validate.notNull(pElementType, "argument ElementType cannot be null");
		
    	try {
    		ImagesExample lImagesExample = new ImagesExample();
    		lImagesExample.createCriteria().andIdElementEqualTo(pIntIdElement)
    			.andElementTypeEqualTo(pElementType.getValue());
 
			ImagesMapper lImagesMapper = pSqlSession.getMapper(ImagesMapper.class);
			
			// load images to delete
			List<Images> lListImages = lImagesMapper.selectByExample(lImagesExample);
			
			// delete image files on disk
			for (Images lImages : lListImages) {
				deleteFile(lImages.getFileName());
			}
			
			// delete images on db
			lImagesMapper.deleteByExample(lImagesExample);
			
    	} catch(Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} 
		
    	mLog.debug("End deleteImagesByElement(SqlSession, Integer, ElementType)");
	}
}
