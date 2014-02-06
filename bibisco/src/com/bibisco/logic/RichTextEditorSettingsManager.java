package com.bibisco.logic;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.bibisco.BibiscoException;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.PropertiesMapper;
import com.bibisco.dao.model.Properties;
import com.bibisco.log.Log;
import com.bibisco.ui.bean.RichTextEditorSettings;

public class RichTextEditorSettingsManager {

	private static Log mLog = Log.getInstance(RichTextEditorSettingsManager.class);

	public static RichTextEditorSettings load() {

		RichTextEditorSettings lRichTextEditorSettings;

		mLog.debug("Start load()");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
    		lRichTextEditorSettings = new RichTextEditorSettings();
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			
			// font
			Properties lProperties = lPropertiesMapper.selectByPrimaryKey("font");
			lRichTextEditorSettings.setFont(lProperties.getValue());
			
			// font size
			lProperties = lPropertiesMapper.selectByPrimaryKey("font-size");
			lRichTextEditorSettings.setSize(lProperties.getValue());
			
			// font size
			lProperties = lPropertiesMapper.selectByPrimaryKey("spellCheckEnabled");
			lRichTextEditorSettings.setSpellCheckEnabled(Boolean.valueOf(lProperties.getValue()));
			
    	} catch(Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End load()");
		
		return lRichTextEditorSettings;
	}

	public static void save(RichTextEditorSettings pRichTextEditorSettings) {

		mLog.debug("Start save()");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryBibisco();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			PropertiesMapper lPropertiesMapper = lSqlSession.getMapper(PropertiesMapper.class);
			
			// font
			Properties lProperties = new Properties();
			lProperties.setProperty("font");
			lProperties.setValue(pRichTextEditorSettings.getFont());
			lPropertiesMapper.updateByPrimaryKey(lProperties);

			// font size
			lProperties = new Properties();
			lProperties.setProperty("font-size");
			lProperties.setValue(pRichTextEditorSettings.getSize());
			lPropertiesMapper.updateByPrimaryKey(lProperties);
			
			// spell check enabled
			lProperties = new Properties();
			lProperties.setProperty("spellCheckEnabled");
			lProperties.setValue(String.valueOf(pRichTextEditorSettings.isSpellCheckEnabled()));
			lPropertiesMapper.updateByPrimaryKey(lProperties);
			
			lSqlSession.commit();
			
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End save()");
	}
}
