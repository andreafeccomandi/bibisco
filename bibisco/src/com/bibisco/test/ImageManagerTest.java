/*
 * Copyright (C) 2014-2015 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.gnu.org/licenses/gpl-2.0.html
 *
 * but WITHOUT ANY WARRANTY. 
 * See the GNU General Public License for more details.
 * 
 */
package com.bibisco.test;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.io.FileUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.bibisco.bean.ImageDTO;
import com.bibisco.dao.client.ChaptersMapper;
import com.bibisco.dao.client.ImagesMapper;
import com.bibisco.dao.client.PropertiesMapper;
import com.bibisco.dao.client.SceneRevisionCharactersMapper;
import com.bibisco.dao.client.SceneRevisionStrandsMapper;
import com.bibisco.dao.client.SceneRevisionsMapper;
import com.bibisco.dao.client.ScenesMapper;
import com.bibisco.dao.model.ChaptersExample;
import com.bibisco.dao.model.Images;
import com.bibisco.dao.model.Properties;
import com.bibisco.dao.model.SceneRevisionCharactersExample;
import com.bibisco.dao.model.SceneRevisionStrandsExample;
import com.bibisco.dao.model.SceneRevisionsExample;
import com.bibisco.dao.model.ScenesExample;
import com.bibisco.enums.ElementType;
import com.bibisco.manager.ContextManager;
import com.bibisco.manager.ImageManager;
import com.bibisco.manager.PropertiesManager;

public class ImageManagerTest {

	@Before 
	@After
	public void init() throws ConfigurationException, IOException {
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getBibiscoSqlSessionFactory();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			Properties lProperties = new Properties();
			lProperties.setProperty("projectsDirectory");
			lProperties.setValue("C:/temp/bibisco/projects");
			lPropertiesMapper.updateByPrimaryKey(lProperties);	
			lSqlSession.commit();
    	} catch (Throwable t) {	
			lSqlSession.rollback();
    	} finally {
			lSqlSession.close();
		}
    	
    	PropertiesManager.getInstance().reload();	
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testInsertImageWithNullImageDTO() {
		ImageManager.insert(null);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testInsertImageWithNullDescription() throws FileNotFoundException {
		
		File lFile = new File(AllTests.getImage1FilePath());
		ImageDTO lImageDTO = new ImageDTO();
		lImageDTO.setInputStream(new FileInputStream(lFile));
		lImageDTO.setSourceFileName(lFile.getName());
		lImageDTO.setDescription(null);
		lImageDTO.setElementType(ElementType.CHARACTERS);
		lImageDTO.setIdElement(1);
		ImageManager.insert(lImageDTO);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testInsertImageWithNullElementType() throws FileNotFoundException {
		
		File lFile = new File(AllTests.getImage1FilePath());
		ImageDTO lImageDTO = new ImageDTO();
		lImageDTO.setInputStream(new FileInputStream(lFile));
		lImageDTO.setSourceFileName(lFile.getName());
		lImageDTO.setDescription("description");
		lImageDTO.setElementType(null);
		lImageDTO.setIdElement(1);
		ImageManager.insert(lImageDTO);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testInsertImageWithNullSourceFileName() throws FileNotFoundException {
		
		File lFile = new File(AllTests.getImage1FilePath());
		ImageDTO lImageDTO = new ImageDTO();
		lImageDTO.setInputStream(new FileInputStream(lFile));
		lImageDTO.setSourceFileName(null);
		lImageDTO.setDescription("description");
		lImageDTO.setElementType(ElementType.CHARACTERS);
		lImageDTO.setIdElement(1);
		ImageManager.insert(lImageDTO);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testInsertImageWithNullInputStream() throws FileNotFoundException {
		
		File lFile = new File(AllTests.getImage1FilePath());
		ImageDTO lImageDTO = new ImageDTO();
		lImageDTO.setInputStream(null);
		lImageDTO.setSourceFileName(lFile.getName());
		lImageDTO.setDescription("description");
		lImageDTO.setElementType(ElementType.CHARACTERS);
		lImageDTO.setIdElement(1);
		ImageManager.insert(lImageDTO);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testInsertImageWithNullIdElement() throws FileNotFoundException {
		
		File lFile = new File(AllTests.getImage1FilePath());
		ImageDTO lImageDTO = new ImageDTO();
		lImageDTO.setInputStream(new FileInputStream(lFile));
		lImageDTO.setSourceFileName(lFile.getName());
		lImageDTO.setDescription("description");
		lImageDTO.setElementType(ElementType.CHARACTERS);
		lImageDTO.setIdElement(null);
		ImageManager.insert(lImageDTO);
	}
	
	@Test
	public void testInsertImage() throws IOException {
		
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT_ID);
		
		File lFile = new File(AllTests.getImage1FilePath());
		ImageDTO lImageDTO = new ImageDTO();
		lImageDTO.setInputStream(new FileInputStream(lFile));
		lImageDTO.setSourceFileName(lFile.getName());
		lImageDTO.setDescription("description");
		lImageDTO.setElementType(ElementType.CHARACTERS);
		lImageDTO.setIdElement(1);
		lImageDTO = ImageManager.insert(lImageDTO);
		
		File lFileInserted = new File(AllTests.BIBISCO_INTERNAL_PROJECTS_DIR + 
				AllTests.getPathSeparator() + AllTests.TEST_PROJECT_ID +
				AllTests.getPathSeparator() + lImageDTO.getTargetFileName());
		Assert.assertTrue(lFileInserted.exists());
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT_ID);
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			ImagesMapper lImagesMapper = lSqlSession.getMapper(ImagesMapper.class);
			Images lImages = lImagesMapper.selectByPrimaryKey(new Long(lImageDTO.getIdImage()));
			Assert.assertEquals("description", lImages.getDescription());
			Assert.assertEquals(ElementType.CHARACTERS.getValue(), lImages.getElementType());
			Assert.assertEquals(lImageDTO.getTargetFileName(), lImages.getFileName());
			Assert.assertEquals(new Integer(1), lImages.getIdElement());
			Assert.assertEquals(new Long(1), lImages.getIdImage());
			
		} finally {
			lSqlSession.close();
		}	
		
		
		AllTests.cleanTestProjectDB();
		FileUtils.forceDelete(lFileInserted);
	}
}
