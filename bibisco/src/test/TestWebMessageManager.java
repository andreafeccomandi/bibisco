package test;

import com.bibisco.bean.WebMessage;
import com.bibisco.manager.WebMessageManager;

public class TestWebMessageManager {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		WebMessage lWebMessage = WebMessageManager.getMessage();
		System.out.println(lWebMessage.getIdMessage() + " - " + lWebMessage.getTitle());
	}

}
