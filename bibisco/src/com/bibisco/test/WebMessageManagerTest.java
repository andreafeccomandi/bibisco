package com.bibisco.test;

import com.bibisco.bean.WebMessage;
import com.bibisco.manager.HttpManager;

public class WebMessageManagerTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		WebMessage lWebMessage = HttpManager.getMessageFromBibiscoWebSite();
		System.out.println(lWebMessage.getIdMessage() + " - " + lWebMessage.getTitle());
	}

}
