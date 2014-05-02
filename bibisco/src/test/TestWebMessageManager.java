package test;

import com.bibisco.bean.WebMessage;
import com.bibisco.manager.HttpManager;

public class TestWebMessageManager {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		WebMessage lWebMessage = HttpManager.getMessageFromBibiscoWebSite();
		System.out.println(lWebMessage.getIdMessage() + " - " + lWebMessage.getTitle());
	}

}
