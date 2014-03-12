package test;

import java.util.List;
import java.util.Locale;

import com.bibisco.manager.SpellCheckManager;

public class HunspellTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		SpellCheckManager lSpellCheckManager = SpellCheckManager.getInstance(Locale.ITALY.toString());
		boolean lBlnResult = lSpellCheckManager.misspelled("daffar");
		System.out.println("Check: dall': result " + lBlnResult );
		List<String> lListSuggestions = lSpellCheckManager.getSuggestions("daffar");
		for (String string : lListSuggestions) {
			System.out.println(string);
		}
	}

}
