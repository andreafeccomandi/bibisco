package com.bibisco.hunspell;

import com.sun.jna.Library;
import com.sun.jna.Pointer;
import com.sun.jna.ptr.PointerByReference;

/**
 * Functions from $hunspell/src/hunspell/hunspell.h
 *
 * The Hunspell java bindings are licensed under the same terms as Hunspell itself (GPL/LGPL/MPL tri-license),
 * see the file COPYING.txt in the root of the distribution for the exact terms.
 *
 * @author Flemming Frandsen (flfr at stibo dot com)
 */

public interface HunspellLibrary extends Library {

    /**
     * Create the hunspell instance
     * @param affpath The affix file
     * @param dpath The dictionary file
     * @return The hunspell object
     */
    public Pointer Hunspell_create(String affpath, String dpath);

    /**
     * Destroy him my robots...
     * @param pHunspell The Hunspell object returned by Hunspell_create
     */
    public void Hunspell_destroy(Pointer pHunspell);

    /**
     * spell(word) - spellcheck word
     * @param pHunspell The Hunspell object returned by Hunspell_create
     * @param word The word to spellcheck.
     * @return 0 = bad word, not 0 = good word
     */
    public int Hunspell_spell(Pointer pHunspell, byte[] word);

    /**
     * Get the dictionary encoding
     * @param pHunspell : The Hunspell object returned by Hunspell_create
     * @return The encoding name
     */
    public String Hunspell_get_dic_encoding(Pointer pHunspell);

    /**
     * Search suggestions
     * @param pHunspell The Hunspell object returned by Hunspell_create
     * @param slst  
     * input: pointer to an array of strings pointer and the (bad) word
     *   array of strings pointer (here *slst) may not be initialized
     * output: number of suggestions in string array, and suggestions in
     *   a newly allocated array of strings (*slts will be NULL when number
     *   of suggestion equals 0.)
     * @param word The word to offer suggestions for.
     */
    public int Hunspell_suggest(Pointer pHunspell, PointerByReference slst, byte[] word);

    /**
     * Free the memory used by the lists created as output from the other functions.
     * @param pHunspell the Hunspell object returned by {@link #Hunspell_create(String, String)}
     * @param slst the {@link PointerByReference} (<code>char***</code>) that is used for the suggestion lists
     * @param n
     */
    public void Hunspell_free_list(Pointer pHunspell, PointerByReference slst, int n);
    
}
