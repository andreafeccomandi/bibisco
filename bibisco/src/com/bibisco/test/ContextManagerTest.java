package com.bibisco.test;

import org.junit.Assert;
import org.junit.Test;

import com.bibisco.manager.ContextManager;

public class ContextManagerTest {
	
	@Test
	public void testGetPathSeparator() {
		Assert.assertEquals(System.getProperty("file.separator"), ContextManager.getPathSeparator());
	}
	
	;
}
