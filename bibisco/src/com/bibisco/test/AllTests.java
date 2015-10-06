package com.bibisco.test;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

@RunWith(Suite.class)
@SuiteClasses({ PropertiesManagerTest.class, LocaleManagerTest.class, RichTextEditorSettingsManagerTest.class, VersionManagerTest.class,
		TipManagerTest.class })
public class AllTests {

}
