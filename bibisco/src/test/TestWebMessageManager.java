package test;

import com.bibisco.logic.WebMessage;
import com.bibisco.logic.WebMessageManager;

public class TestWebMessageManager {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		WebMessage lWebMessage = WebMessageManager.getMessage();
		System.out.println(lWebMessage.getIdMessage() + " - " + lWebMessage.getTitle());
	}

}
