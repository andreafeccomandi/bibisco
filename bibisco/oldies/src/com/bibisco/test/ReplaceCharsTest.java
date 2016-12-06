package com.bibisco.test;

import org.apache.commons.lang.StringUtils;

public class ReplaceCharsTest {
	
	public static void main(String[] args) {
		String lStrNodeText = "«all'improvviso, ¡come se si [fosse] dest/ato dal sonno, si (chiese): ma ¿perchè? andarla! a {prendere}, afferrarla»";
		System.out.println(lStrNodeText);
		
		lStrNodeText = replaceCharInterval(lStrNodeText, 33, 38);
		lStrNodeText = replaceCharInterval(lStrNodeText, 40, 47);
		lStrNodeText = replaceCharInterval(lStrNodeText, 58, 64);
		lStrNodeText = replaceCharInterval(lStrNodeText, 91, 96);
		lStrNodeText = replaceCharInterval(lStrNodeText, 123, 126);
		lStrNodeText = replaceCharInterval(lStrNodeText, 161, 191);	

		System.out.println(lStrNodeText);
		
		for (int i = 0; i < 256; i++) {
			System.out.println(i+"="+(char)i);
		}
		for (int i = 8820; i < 8822; i++) {
			System.out.println(i+"="+(char)i);
		}
		
		System.out.println((int)'’');
		System.out.println((int)'”');
		
		
		
		
	}
		
	private static String replaceCharInterval(String pStr, int pIntFrom, int pIntTo) {
		
		for (int i = pIntFrom; i < pIntTo+1; i++) {
			char lChar = ((char)i);
			pStr = StringUtils.replaceChars(pStr, lChar, ' ');
		}
		
		return pStr;
	}
}








