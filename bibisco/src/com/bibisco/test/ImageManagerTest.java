/*
 * Copyright (C) 2014-2016 Andrea Feccomandi
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
import com.bibisco.dao.model.ImagesExample;
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
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
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
			Assert.assertEquals(lImageDTO.getIdImage(), new Integer(lImages.getIdImage().intValue()));
			
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
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
	public void testLoadImagesByElementWithNullElementType() {
		ImageManager.loadImagesByElement(67, null);
	}
	
	@Test
	public void testLoadImagesByElementWithInexistentIdElement() {
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT_ID);
		List<ImageDTO> llistImageDTO = ImageManager.loadImagesByElement(1, ElementType.CHARACTERS);
		Assert.assertEquals(0, llistImageDTO.size());
	}
	
	@Test
	public void testLoadImagesByElementForSecondaryCharacters() {
		
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT_ID);
		
		List<ImageDTO> lListImageDTO = ImageManager.loadImagesByElement(70, ElementType.CHARACTERS);
		Assert.assertEquals(3, lListImageDTO.size());
		
		Assert.assertEquals("Image4", lListImageDTO.get(0).getDescription());
		Assert.assertEquals(ElementType. CHARACTERS, lListImageDTO.get(0).getElementType());
		Assert.assertEquals(new Integer(70), lListImageDTO.get(0).getIdElement());
		Assert.assertEquals(new Integer(4), lListImageDTO.get(0).getIdImage());
		Assert.assertNull(lListImageDTO.get(0).getInputStream());
		Assert.assertNull(lListImageDTO.get(0).getSourceFileName());
		Assert.assertNull(lListImageDTO.get(0).getTargetFileName());
		
		Assert.assertEquals("Image5", lListImageDTO.get(1).getDescription());
		Assert.assertEquals(ElementType. CHARACTERS, lListImageDTO.get(1).getElementType());
		Assert.assertEquals(new Integer(70), lListImageDTO.get(1).getIdElement());
		Assert.assertEquals(new Integer(5), lListImageDTO.get(1).getIdImage());
		Assert.assertNull(lListImageDTO.get(1).getInputStream());
		Assert.assertNull(lListImageDTO.get(1).getSourceFileName());
		Assert.assertNull(lListImageDTO.get(1).getTargetFileName());
		
		Assert.assertEquals("Image6", lListImageDTO.get(2).getDescription());
		Assert.assertEquals(ElementType. CHARACTERS, lListImageDTO.get(2).getElementType());
		Assert.assertEquals(new Integer(70), lListImageDTO.get(2).getIdElement());
		Assert.assertEquals(new Integer(6), lListImageDTO.get(2).getIdImage());
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
	public void testLoadImagesByElementForLocations() throws IOException {
		
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
	
	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
	public void testLoadWithNullIdImage() {
		ImageManager.load(null);
	}
	
	@Test
	public void testLoad() {
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT_ID);
		
		String lStrFileName = ImageManager.load(2);
		
		Assert.assertEquals(AllTests.TEST_PROJECT_IMAGE_2, lStrFileName);
	}
	
	@Test
	public void testLoadInexistentImage() {
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT_ID);		
		String lStrFileName = ImageManager.load(10);
		Assert.assertNull(lStrFileName);
	}
	
	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
	public void testDeleteWithNullIdImage() {
		ImageManager.delete(null);
	}
	
	@Test
	public void testDeleteWithInexistentIdImage() {
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT_ID);
		ImageManager.delete(10);
		
		List<Images> lListImages;
		SqlSessionFactory lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT_ID);
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			ImagesMapper lImagesMapper = lSqlSession.getMapper(ImagesMapper.class);
			lListImages = lImagesMapper.selectByExample(new ImagesExample());			
		} finally {
			lSqlSession.close();
		}
		
		Assert.assertEquals(9, lListImages.size());
	}
	
	@Test
	public void testDelete() throws IOException {
		
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT_ID);
		
		ImageManager.delete(2);
		
		List<Images> lListImages;
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT_ID);
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		try {
			ImagesMapper lImagesMapper = lSqlSession.getMapper(ImagesMapper.class);
			ImagesExample lImagesExample = new ImagesExample();
			lImagesExample.createCriteria().
			andIdElementEqualTo(new Integer(67)).
			andElementTypeEqualTo(ElementType.CHARACTERS.getValue());
			lListImages = lImagesMapper.selectByExample(lImagesExample);			
		} finally {
			lSqlSession.close();
		}	
		
		Assert.assertEquals(2, lListImages.size());
		Assert.assertEquals("Image1", lListImages.get(0).getDescription());
		Assert.assertEquals(ElementType.CHARACTERS.getValue(), lListImages.get(0).getElementType());
		Assert.assertEquals(AllTests.TEST_PROJECT_IMAGE_1, lListImages.get(0).getFileName());
		Assert.assertEquals(new Integer(67), lListImages.get(0).getIdElement());
		Assert.assertEquals(new Long(1), lListImages.get(0).getIdImage());
		Assert.assertEquals("Image3", lListImages.get(1).getDescription());
		Assert.assertEquals(ElementType.CHARACTERS.getValue(), lListImages.get(1).getElementType());
		Assert.assertEquals(AllTests.TEST_PROJECT_IMAGE_3, lListImages.get(1).getFileName());
		Assert.assertEquals(new Integer(67), lListImages.get(1).getIdElement());
		Assert.assertEquals(new Long(3), lListImages.get(1).getIdImage());
	
		AllTests.cleanTestProjectDB();
	}
	
	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
	public void testDeleteImagesByElementLocationWithNullSqlSession() {
		ImageManager.deleteImagesByElement(null, new Integer(71), ElementType. LOCATIONS);
	}
	
	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
	public void testDeleteImagesByElementLocationWithNullIdElement() {
		SqlSessionFactory lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT_ID);
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		ImageManager.deleteImagesByElement(lSqlSession, null, ElementType. LOCATIONS);
		lSqlSession.close();
	}
	
	@Test(expected = IllegalArgumentException.class)
	@edu.umd.cs.findbugs.annotations.SuppressWarnings("NP_NULL_PARAM_DEREF_NONVIRTUAL")
	public void testDeleteImagesByElementLocationWithNullElementType() {
		SqlSessionFactory lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT_ID);
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		ImageManager.deleteImagesByElement(lSqlSession, new Integer(71), null);
		lSqlSession.close();
	}
	
	@Test
	public void testDeleteImagesByElementLocation() throws IOException {
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT_ID);
		SqlSessionFactory lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT_ID);
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		ImageManager.deleteImagesByElement(lSqlSession, new Integer(71), ElementType.LOCATIONS);
		lSqlSession.commit();
		lSqlSession.close();
		
		List<Images> lListImages;
		lSqlSession = lSqlSessionFactory.openSession();
		try {
			ImagesMapper lImagesMapper = lSqlSession.getMapper(ImagesMapper.class);
			ImagesExample lImagesExample = new ImagesExample();
			lImagesExample.createCriteria().
			andIdElementEqualTo(new Integer(71)).
			andElementTypeEqualTo(ElementType.LOCATIONS.getValue());
			lListImages = lImagesMapper.selectByExample(lImagesExample);			
		} finally {
			lSqlSession.close();
		}	
		
		Assert.assertEquals(0, lListImages.size());
		String lStrImagesFolder = AllTests.BIBISCO_INTERNAL_PROJECTS_DIR + 
				AllTests.getPathSeparator() + AllTests.TEST_PROJECT_ID +
				AllTests.getPathSeparator();
		
		Assert.assertTrue((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_1)).exists());
		Assert.assertTrue((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_2)).exists());
		Assert.assertTrue((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_3)).exists());
		Assert.assertTrue((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_4)).exists());
		Assert.assertTrue((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_5)).exists());
		Assert.assertTrue((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_6)).exists());
		Assert.assertFalse((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_7)).exists());
		Assert.assertFalse((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_8)).exists());
		Assert.assertFalse((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_9)).exists());
		
		AllTests.cleanTestProjectDB();
	}
	
	
	@Test
	public void testDeleteImagesByElementMainCharactersWithInexistentIdCharacter() {

		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT_ID);
		
		SqlSessionFactory lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT_ID);
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		ImageManager.deleteImagesByElement(lSqlSession, new Integer(1), ElementType.CHARACTERS);
		lSqlSession.commit();
		lSqlSession.close();
		
		List<Images> lListImages;
		lSqlSession = lSqlSessionFactory.openSession();
		try {
			ImagesMapper lImagesMapper = lSqlSession.getMapper(ImagesMapper.class);
			lListImages = lImagesMapper.selectByExample(new ImagesExample());			
		} finally {
			lSqlSession.close();
		}	
		
		Assert.assertEquals(9, lListImages.size());
	}
	
	@Test
	public void testDeleteImagesByElementMainCharacters() throws IOException {
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT_ID);
		SqlSessionFactory lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT_ID);
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		ImageManager.deleteImagesByElement(lSqlSession, new Integer(67), ElementType.CHARACTERS);
		lSqlSession.commit();
		lSqlSession.close();
		
		List<Images> lListImages;
		lSqlSession = lSqlSessionFactory.openSession();
		try {
			ImagesMapper lImagesMapper = lSqlSession.getMapper(ImagesMapper.class);
			ImagesExample lImagesExample = new ImagesExample();
			lImagesExample.createCriteria().
			andIdElementEqualTo(new Integer(67)).
			andElementTypeEqualTo(ElementType.CHARACTERS.getValue());
			lListImages = lImagesMapper.selectByExample(lImagesExample);			
		} finally {
			lSqlSession.close();
		}	
		
		Assert.assertEquals(0, lListImages.size());
		String lStrImagesFolder = AllTests.BIBISCO_INTERNAL_PROJECTS_DIR + 
				AllTests.getPathSeparator() + AllTests.TEST_PROJECT_ID +
				AllTests.getPathSeparator();
		
		Assert.assertFalse((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_1)).exists());
		Assert.assertFalse((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_2)).exists());
		Assert.assertFalse((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_3)).exists());
		Assert.assertTrue((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_4)).exists());
		Assert.assertTrue((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_5)).exists());
		Assert.assertTrue((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_6)).exists());
		Assert.assertTrue((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_7)).exists());
		Assert.assertTrue((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_8)).exists());
		Assert.assertTrue((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_9)).exists());
		
		AllTests.cleanTestProjectDB();
	}

	@Test
	public void testDeleteImagesByElementSecondaryCharacters() throws IOException {
		ContextManager.getInstance().setIdProject(AllTests.TEST_PROJECT_ID);
		SqlSessionFactory lSqlSessionFactory = AllTests.getProjectSqlSessionFactoryById(AllTests.TEST_PROJECT_ID);
		SqlSession lSqlSession = lSqlSessionFactory.openSession();
		ImageManager.deleteImagesByElement(lSqlSession, new Integer(70), ElementType.CHARACTERS);
		lSqlSession.commit();
		lSqlSession.close();
		
		List<Images> lListImages;
		lSqlSession = lSqlSessionFactory.openSession();
		try {
			ImagesMapper lImagesMapper = lSqlSession.getMapper(ImagesMapper.class);
			ImagesExample lImagesExample = new ImagesExample();
			lImagesExample.createCriteria().
			andIdElementEqualTo(new Integer(70)).
			andElementTypeEqualTo(ElementType.CHARACTERS.getValue());
			lListImages = lImagesMapper.selectByExample(lImagesExample);			
		} finally {
			lSqlSession.close();
		}	
		
		Assert.assertEquals(0, lListImages.size());
		String lStrImagesFolder = AllTests.BIBISCO_INTERNAL_PROJECTS_DIR + 
				AllTests.getPathSeparator() + AllTests.TEST_PROJECT_ID +
				AllTests.getPathSeparator();
		
		Assert.assertTrue((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_1)).exists());
		Assert.assertTrue((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_2)).exists());
		Assert.assertTrue((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_3)).exists());
		Assert.assertFalse((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_4)).exists());
		Assert.assertFalse((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_5)).exists());
		Assert.assertFalse((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_6)).exists());
		Assert.assertTrue((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_7)).exists());
		Assert.assertTrue((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_8)).exists());
		Assert.assertTrue((new File(lStrImagesFolder + AllTests.TEST_PROJECT_IMAGE_9)).exists());
		
		AllTests.cleanTestProjectDB();
	}
}
