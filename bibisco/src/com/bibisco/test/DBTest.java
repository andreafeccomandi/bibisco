package com.bibisco.test;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.bibisco.BibiscoException;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.ChaptersMapper;
import com.bibisco.dao.model.Chapters;
import com.bibisco.dao.model.ChaptersExample;
import com.bibisco.dao.model.ChaptersWithBLOBs;
import com.bibisco.log.Log;

public class DBTest {
	
	private static Log mLog = Log.getInstance(DBTest.class);
 
	public static void main(String[] args) {
		
		mLog.debug("Start action");
    	SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			ChaptersMapper mapper = lSqlSession.getMapper(ChaptersMapper.class);

			ChaptersExample example = new ChaptersExample();
			example.createCriteria().andIdChapterIsNotNull();
			List<ChaptersWithBLOBs> lListChapters = mapper.selectByExampleWithBLOBs(example);
			for (Chapters chapter : lListChapters) {
				mLog.debug(chapter.getIdChapter() + ":" + chapter.getTitle());
			}
    	} catch(Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
    	
		mLog.debug("End action");
	}
}
