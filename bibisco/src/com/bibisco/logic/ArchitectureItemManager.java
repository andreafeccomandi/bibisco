package com.bibisco.logic;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.bibisco.BibiscoException;
import com.bibisco.ContextManager;
import com.bibisco.TaskStatus;
import com.bibisco.dao.SqlSessionFactoryManager;
import com.bibisco.dao.client.ProjectMapper;
import com.bibisco.dao.model.ProjectWithBLOBs;
import com.bibisco.log.Log;
import com.bibisco.ui.bean.ArchitectureItem;

public class ArchitectureItemManager {

	private static Log mLog = Log.getInstance(ArchitectureItemManager.class);
	
	public enum ArchitectureItemType {FABULA, PREMISE, SETTING};
	
	public static ArchitectureItem load(ArchitectureItemType pArchitectureItemType) {
		
		ArchitectureItem lArchitectureItem = null;
		
		mLog.debug("Start load(ArchitectureItemType)");
		
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			ProjectMapper lProjectMapper = lSqlSession.getMapper(ProjectMapper.class);
			ProjectWithBLOBs lProjectWithBLOBs = lProjectMapper.selectByPrimaryKey(ContextManager.getInstance().getIdProject());
			
			if (lProjectWithBLOBs != null) {
				
				switch (pArchitectureItemType) {
				case FABULA:
					lArchitectureItem = new ArchitectureItem();
					lArchitectureItem.setTaskStatus(TaskStatus.getTaskStatusFromValue(lProjectWithBLOBs.getFabulaTaskStatus()));
					lArchitectureItem.setText(lProjectWithBLOBs.getFabula());
					break;

				case PREMISE:
					lArchitectureItem = new ArchitectureItem();
					lArchitectureItem.setTaskStatus(TaskStatus.getTaskStatusFromValue(lProjectWithBLOBs.getPremiseTaskStatus()));
					lArchitectureItem.setText(lProjectWithBLOBs.getPremise());
					break;

				case SETTING:
					lArchitectureItem = new ArchitectureItem();
					lArchitectureItem.setTaskStatus(TaskStatus.getTaskStatusFromValue(lProjectWithBLOBs.getSettingTaskStatus()));
					lArchitectureItem.setText(lProjectWithBLOBs.getSetting());
					break;
				default:
					break;
				}
			}
			
    	} catch(Throwable t) {
			mLog.error(t);
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
    	mLog.debug("End load(ArchitectureItemType)");
		
		return lArchitectureItem;
	}
	
	public static void save(ArchitectureItem pArchitectureItem, ArchitectureItemType pArchitectureItemType) {
				
		mLog.debug("Start save(ArchitectureItem, ArchitectureItemType)");
	
		SqlSessionFactory lSqlSessionFactory = SqlSessionFactoryManager.getInstance().getSqlSessionFactoryProject();
    	SqlSession lSqlSession = lSqlSessionFactory.openSession();
    	try {
			ProjectMapper lProjectMapper = lSqlSession.getMapper(ProjectMapper.class);
			ProjectWithBLOBs lProjectWithBLOBs = lProjectMapper.selectByPrimaryKey(ContextManager.getInstance().getIdProject());
			
			switch (pArchitectureItemType) {
			case FABULA:
				lProjectWithBLOBs.setFabulaTaskStatus(pArchitectureItem.getTaskStatus().getValue());
				lProjectWithBLOBs.setFabula(pArchitectureItem.getText());
				break;

			case PREMISE:
				lProjectWithBLOBs.setPremiseTaskStatus(pArchitectureItem.getTaskStatus().getValue());
				lProjectWithBLOBs.setPremise(pArchitectureItem.getText());
				break;

			case SETTING:
				lProjectWithBLOBs.setSettingTaskStatus(pArchitectureItem.getTaskStatus().getValue());
				lProjectWithBLOBs.setSetting(pArchitectureItem.getText());
				break;
			default:
				break;
			}
		
			lProjectMapper.updateByPrimaryKeyWithBLOBs(lProjectWithBLOBs);
			lSqlSession.commit();
			
    	} catch(Throwable t) {
			mLog.error(t);
			lSqlSession.rollback();
			throw new BibiscoException(t, BibiscoException.SQL_EXCEPTION);
		} finally {
			lSqlSession.close();
		}
		
		mLog.debug("End save(ArchitectureItem, ArchitectureItemType)");
		
	}
}
