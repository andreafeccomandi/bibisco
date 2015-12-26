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
import java.util.List;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.io.FileUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.bibisco.bean.ImageDTO;
import com.bibisco.dao.client.ImagesMapper;
import com.bibisco.dao.client.PropertiesMapper;
import com.bibisco.dao.model.Images;
import com.bibisco.dao.model.Properties;
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
		lImageDTO.setIdElement(67);
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
			Assert.assertEquals(new Integer(67), lImages.getIdElement());
			Assert.assertEquals(lImageDTO.getIdImage(), lImages.getIdImage());
			
		} finally {
			lSqlSession.close();
		}	
		
		
		AllTests.cleanTestProjectDB();
		FileUtils.forceDelete(lFileInserted);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testLoadImagesByElementWithNullIdElement() {
		ImageManager.loadImagesByElement(null, ElementType.CHARACTERS);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void testLoadImagesByElementWithNullElementType() {
		ImageManager.loadImagesByElement(67, null);
	}
	
	@Test
	public void testLoadImagesByElementForSecondaryCharacters() {
		
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT_ID);
		
		List<ImageDTO> lListImageDTO = ImageManager.loadImagesByElement(70, ElementType.CHARACTERS);
		Assert.assertEquals(3, lListImageDTO.size());
		
		Assert.assertEquals("Image4", lListImageDTO.get(0).getDescription());
		Assert.assertEquals(ElementType. CHARACTERS, lListImageDTO.get(0).getElementType());
		Assert.assertEquals(new Integer(70), lListImageDTO.get(0).getIdElement());
		Assert.assertEquals(new Integer(1), lListImageDTO.get(0).getIdImage());
		Assert.assertNull(lListImageDTO.get(0).getInputStream());
		Assert.assertNull(lListImageDTO.get(0).getSourceFileName());
		Assert.assertNull(lListImageDTO.get(0).getTargetFileName());
		
		Assert.assertEquals("Image5", lListImageDTO.get(1).getDescription());
		Assert.assertEquals(ElementType. CHARACTERS, lListImageDTO.get(1).getElementType());
		Assert.assertEquals(new Integer(70), lListImageDTO.get(1).getIdElement());
		Assert.assertEquals(new Integer(2), lListImageDTO.get(1).getIdImage());
		Assert.assertNull(lListImageDTO.get(1).getInputStream());
		Assert.assertNull(lListImageDTO.get(1).getSourceFileName());
		Assert.assertNull(lListImageDTO.get(1).getTargetFileName());
		
		Assert.assertEquals("Image6", lListImageDTO.get(2).getDescription());
		Assert.assertEquals(ElementType. CHARACTERS, lListImageDTO.get(2).getElementType());
		Assert.assertEquals(new Integer(70), lListImageDTO.get(2).getIdElement());
		Assert.assertEquals(new Integer(3), lListImageDTO.get(2).getIdImage());
		Assert.assertNull(lListImageDTO.get(2).getInputStream());
		Assert.assertNull(lListImageDTO.get(2).getSourceFileName());
		Assert.assertNull(lListImageDTO.get(2).getTargetFileName());
	}

	@Test
	public void testLoadImagesByElementForMainCharacters() {
		
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT_ID);
		
		List<ImageDTO> lListImageDTO = ImageManager.loadImagesByElement(67, ElementType. CHARACTERS);
		Assert.assertEquals(3, lListImageDTO.size());
		
		Assert.assertEquals("Image1", lListImageDTO.get(0).getDescription());
		Assert.assertEquals(ElementType. CHARACTERS, lListImageDTO.get(0).getElementType());
		Assert.assertEquals(new Integer(67), lListImageDTO.get(0).getIdElement());
		Assert.assertEquals(new Integer(1), lListImageDTO.get(0).getIdImage());
		Assert.assertNull(lListImageDTO.get(0).getInputStream());
		Assert.assertNull(lListImageDTO.get(0).getSourceFileName());
		Assert.assertNull(lListImageDTO.get(0).getTargetFileName());
		
		Assert.assertEquals("Image2", lListImageDTO.get(1).getDescription());
		Assert.assertEquals(ElementType. CHARACTERS, lListImageDTO.get(1).getElementType());
		Assert.assertEquals(new Integer(67), lListImageDTO.get(1).getIdElement());
		Assert.assertEquals(new Integer(2), lListImageDTO.get(1).getIdImage());
		Assert.assertNull(lListImageDTO.get(1).getInputStream());
		Assert.assertNull(lListImageDTO.get(1).getSourceFileName());
		Assert.assertNull(lListImageDTO.get(1).getTargetFileName());
		
		Assert.assertEquals("Image3", lListImageDTO.get(2).getDescription());
		Assert.assertEquals(ElementType. CHARACTERS, lListImageDTO.get(2).getElementType());
		Assert.assertEquals(new Integer(67), lListImageDTO.get(2).getIdElement());
		Assert.assertEquals(new Integer(3), lListImageDTO.get(2).getIdImage());
		Assert.assertNull(lListImageDTO.get(2).getInputStream());
		Assert.assertNull(lListImageDTO.get(2).getSourceFileName());
		Assert.assertNull(lListImageDTO.get(2).getTargetFileName());
	}
	
	@Test
	public void testLoadImagesByElementForLocations() {
		
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT_ID);
		
		List<ImageDTO> lListImageDTO = ImageManager.loadImagesByElement(71, ElementType.LOCATIONS);
		Assert.assertEquals(3, lListImageDTO.size());
		
		Assert.assertEquals("Image1", lListImageDTO.get(0).getDescription());
		Assert.assertEquals(ElementType. LOCATIONS, lListImageDTO.get(0).getElementType());
		Assert.assertEquals(new Integer(71), lListImageDTO.get(0).getIdElement());
		Assert.assertEquals(new Integer(7), lListImageDTO.get(0).getIdImage());
		Assert.assertNull(lListImageDTO.get(0).getInputStream());
		Assert.assertNull(lListImageDTO.get(0).getSourceFileName());
		Assert.assertNull(lListImageDTO.get(0).getTargetFileName());
		
		Assert.assertEquals("Image2", lListImageDTO.get(1).getDescription());
		Assert.assertEquals(ElementType. LOCATIONS, lListImageDTO.get(1).getElementType());
		Assert.assertEquals(new Integer(71), lListImageDTO.get(1).getIdElement());
		Assert.assertEquals(new Integer(8), lListImageDTO.get(1).getIdImage());
		Assert.assertNull(lListImageDTO.get(1).getInputStream());
		Assert.assertNull(lListImageDTO.get(1).getSourceFileName());
		Assert.assertNull(lListImageDTO.get(1).getTargetFileName());
		
		Assert.assertEquals("Image3", lListImageDTO.get(2).getDescription());
		Assert.assertEquals(ElementType. LOCATIONS, lListImageDTO.get(2).getElementType());
		Assert.assertEquals(new Integer(71), lListImageDTO.get(2).getIdElement());
		Assert.assertEquals(new Integer(9), lListImageDTO.get(2).getIdImage());
		Assert.assertNull(lListImageDTO.get(2).getInputStream());
		Assert.assertNull(lListImageDTO.get(2).getSourceFileName());
		Assert.assertNull(lListImageDTO.get(2).getTargetFileName());
	}
}
