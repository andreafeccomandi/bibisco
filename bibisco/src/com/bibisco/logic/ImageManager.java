package com.bibisco.logic;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.io.FilenameUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.bibisco.BibiscoException;
import com.bibisco.ContextManager;
import com.bibisco.ElementType;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.ImagesMapper;
import com.bibisco.dao.model.Images;
import com.bibisco.dao.model.ImagesExample;
import com.bibisco.log.Log;
import com.bibisco.ui.bean.ImageDTO;

public class ImageManager {

	private static Log mLog = Log.getInstance(ImageManager.class);

	public static ImageDTO insert(ImageDTO pImageDTO) {
		
		mLog.debug("Start insert(ImageDTO)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    		// write file to file system
    		String lStrFileName = writeFile(pImageDTO.getFileItem());
    		
    		Images lImages = new Images();
    		lImages.setDescription(pImageDTO.getDescription());
    		lImages.setIdElement(pImageDTO.getIdElement());
    		lImages.setElementType(pImageDTO.getElementType().getValue());
    		lImages.setFileName(lStrFileName);
			
			ImagesMapper lImagesMapper = lSqlSession.getMapper(ImagesMapper.class);
			lImagesMapper.insert(lImages);
			
			pImageDTO.setIdImage(lImages.getIdImage().intValue());

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
	
	private static String writeFile(FileItem pFileItem) {

		String lStrFileName = null;
		
		mLog.debug("Start writeFile(FileItem, String)");

		String lStrFileItemFileName = pFileItem.getName();
		if (lStrFileItemFileName == null) {
			mLog.error("File name is null");
			throw new BibiscoException(BibiscoException.IO_EXCEPTION);
		}
		
		// build file name
		StringBuilder lStringBuilderFileName = new StringBuilder();
		lStringBuilderFileName.append(UUID.randomUUID().toString());
		lStringBuilderFileName.append(".");
		lStringBuilderFileName.append(FilenameUtils.getExtension(lStrFileItemFileName));
		lStrFileName = lStringBuilderFileName.toString();

		// get file path
		String lStrFilePath = getFilePath(lStrFileName);
		
		// write file to disk
		File lFile = new File(lStrFilePath);
		try {
			pFileItem.write(lFile);
		} catch (Throwable t) {
			mLog.error(t, "insert() Error writing file: lFile=" + lFile);
			throw new BibiscoException(BibiscoException.IO_EXCEPTION);
		}
		
		mLog.debug("End writeFile(FileItem): return ", lStrFileName);

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
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    		
			ImagesMapper lImagesMapper = lSqlSession.getMapper(ImagesMapper.class);
			Images lImages = lImagesMapper.selectByPrimaryKey(pIntIdImage.longValue());
			
			lStrFileName = lImages.getFileName();

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
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
		
    	try {
    		ImagesExample lImagesExample = new ImagesExample();
    		lImagesExample.createCriteria().andIdElementEqualTo(pIntIdElement)
    			.andElementTypeEqualTo(pElementType.getValue());
			
			ImagesMapper lImagesMapper = lSqlSession.getMapper(ImagesMapper.class);
			List<Images> lListImages = lImagesMapper.selectByExample(lImagesExample);
			
			for (Images lImages : lListImages) {
				ImageDTO lImageDTO = new ImageDTO();
				lImageDTO.setIdImage(lImages.getIdImage().intValue());
				lImageDTO.setDescription(lImages.getDescription());
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
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    		ImagesMapper lImagesMapper = lSqlSession.getMapper(ImagesMapper.class);
    		
    		// load image to delete
    		Images lImages = lImagesMapper.selectByPrimaryKey(pIntIdImage.longValue());
    		
    		// delete image file on disk
    		deleteFile(lImages.getFileName());
    		
    		// delete image on db
			lImagesMapper.deleteByPrimaryKey(pIntIdImage.longValue());

			lSqlSession.commit();
			
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
    	
    	mLog.debug("End delete(Integer)");
	}

	public static void deleteImagesByElement(SqlSession lSqlSession, Integer pIntIdElement, ElementType pElementType) {
		
		mLog.debug("Start deleteImagesByElement(SqlSession, Integer, ElementType)");
		
    	try {
    		ImagesExample lImagesExample = new ImagesExample();
    		lImagesExample.createCriteria().andIdElementEqualTo(pIntIdElement)
    			.andElementTypeEqualTo(pElementType.getValue());
 
			ImagesMapper lImagesMapper = lSqlSession.getMapper(ImagesMapper.class);
			
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
