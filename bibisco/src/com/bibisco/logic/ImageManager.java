package com.bibisco.logic;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.bibisco.BibiscoException;
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
    		Images lImages = new Images();
    		lImages.setDescription(pImageDTO.getDescription());
    		lImages.setIdElement(pImageDTO.getIdElement());
    		lImages.setElementType(pImageDTO.getElementType().getValue());
			lImages.setImage(pImageDTO.getImage());
			
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
	
	public static byte[] load(Integer pIntIdImage) {
		
		byte[] lBytesImage = null;
		
		mLog.debug("Start load(ImageDTO)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    		
			ImagesMapper lImagesMapper = lSqlSession.getMapper(ImagesMapper.class);
			Images lImages = lImagesMapper.selectByPrimaryKey(pIntIdImage.longValue());
			
			lBytesImage = lImages.getImage();

    	} catch(Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
    	mLog.debug("End load(ImageDTO)");

		return lBytesImage;

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
		
		mLog.debug("Start deleteImagesByElement(ImageDTO");
		
    	try {
    		ImagesExample lImagesExample = new ImagesExample();
    		lImagesExample.createCriteria().andIdElementEqualTo(pIntIdElement)
    			.andElementTypeEqualTo(pElementType.getValue());
			
			ImagesMapper lImagesMapper = lSqlSession.getMapper(ImagesMapper.class);
			lImagesMapper.deleteByExample(lImagesExample);

    	} catch(Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} 
		
    	mLog.debug("End deleteImagesByElement(ImageDTO");
	}
}
