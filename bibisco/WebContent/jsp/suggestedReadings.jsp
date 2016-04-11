<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@page import="com.bibisco.manager.ConfigManager"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>
<c:set var="baseURL" value="<%=ConfigManager.getInstance().getMandatoryProperty("web/@uri")%>" scope="request"/>
<script type="text/javascript">
$(function() {
        
    $('.bibiscoSuggestedReadings a').click(function() {
        bibiscoOpenDefaultBrowser($(this).attr("href"));
    }); 
     
    $("#bibiscoSuggestedReadingsDiv").perfectScrollbar();  
            
});

</script>

<div class="row-fluid bibiscoNotSelectableText">
	<div class="span12">
		<div class="row-fluid  page-header">
			<div class="span8">
    			<h1><fmt:message key="jsp.suggestedReadings.h1.title"/></h1>
    		</div>
    	</div>
	</div>
</div>
<div id="bibiscoSuggestedReadingsDiv" class="row-fluid bibiscoSuggestedReadings bibiscoNotSelectableText bibiscoScrollable">
	<div class="row-fluid">
		<div class="span12">
	    	<div class="hero-unit bibiscoNotSelectableText bibiscoSuggestedReadingsMotivational">
					<h1><fmt:message key="jsp.suggestedReadings.h1.herounit" /></h1>
					<div>
					<p><fmt:message key="jsp.suggestedReadings.p.1" /></p>
					<p><fmt:message key="jsp.suggestedReadings.p.2" /></p>
					</div>
			</div>  	  	
	    </div>
    </div>
	<div class="row-fluid">	
		<div class="span1"></div>
		<div class="span2 text-center">
			<a target="_blank"  href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=9562915867&asin-it=8886350856&asin-fr=9562915867&asin-de=3932909585&asin-uk=9562915867&asin-ca=9562915867&asin-com=9562915867&asin=9562915867"><img border="0" src="img/suggestedReadings/egri.jpg" ></a>	
		</div>
		<div class="span8">	
			<h4><a target="_blank" href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=9562915867&asin-it=8886350856&asin-fr=9562915867&asin-de=3932909585&asin-uk=9562915867&asin-ca=9562915867&asin-com=9562915867&asin=9562915867">Art Of Dramatic Writing: Its Basis in the Creative Interpretation of Human Motives</a>
			</h4>
			<h5>by Lajos Egri </h5>
			<p>
				Learn the basic techniques every successful playwright knows Among the many "how-to" playwriting books that have appeared over the years, there have been few that attempt to analyze the mysteries of play construction. Lajos Egri's classic, The Art of Dramatic Writing, does just that, with instruction that can be applied equally well to a short story, novel, or screenplay. Examining a play from the inside out, Egri starts with the heart of any drama: its characters. All good dramatic writing hinges on people and their relationships, which serve to move the story forward and give it life, as well as an understanding of human motives -- why people act the way that they do. Using examples from everything from William Shakespeare's Romeo and Juliet to Henrik Ibsen's A Doll's House, Egri shows how it is essential for the author to have a basic premise -- a thesis, demonstrated in terms of human behavior -- and to develop the dramatic conflict on the basis of that behavior. Using Egri's ABCs of premise, character, and conflict, The Art of Dramatic Writing is a direct, jargon-free approach to the problem of achieving truth in writing.
			</p>				
			<a target="_blank"  href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=9562915867&asin-it=8886350856&asin-fr=9562915867&asin-de=3932909585&asin-uk=9562915867&asin-ca=9562915867&asin-com=9562915867&asin=9562915867">
				<img border="0" src="img/suggestedReadings/en/Amazon-Buy-it-button.png" style="width: 150px; height: 50px;" >
			</a>	
		</div>
	</div>	
	<div class="row-fluid">
		<div class="span1"></div>
		<div class="span10">
            <hr>     
		</div>
	</div>
	<div class="row-fluid">	
		<div class="span1"></div>
		<div class="span2">
			<a target="_blank" href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=B009OANA2M&asin-it=8875271259&asin-fr=1582343306&asin-de=1582343306&asin-uk=1582343306&asin-ca=1582343306&asin-com=1582343306&asin=1582343306"><img border="0" src="img/suggestedReadings/gotham.jpg" ></a>
		</div>
		<div class="span8">	
			<h4>
			<a target="_blank" href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=B009OANA2M&asin-it=8875271259&asin-fr=1582343306&asin-de=1582343306&asin-uk=1582343306&asin-ca=1582343306&asin-com=1582343306&asin=1582343306">Writing Fiction: The Practical Guide from New York's Acclaimed Creative Writing School</a>
			</h4>
			<h5>by Gotham Writers' Workshop</h5>
			<p>
				Gotham Writers' Workshop has mastered the art of teaching the craft of writing in a way that is practical, accessible, and entertaining. Now the techniques of this renowned school are available in this book.
				Here you'll find:
				1) The fundamental elements of fiction craft-character, plot, point of view, etc.-explained clearly and completely
				2) Key concepts illustrated with passages from great works of fiction
				3) The complete text of "Cathedral" by Raymond Carver-a masterpiece of contemporary short fiction that is analyzed throughout the book
				4) Exercises that let you immediately apply what you learn to your own writing
				Written by Gotham Writers' Workshop expert instructors and edited by Dean of Faculty Alexander Steele, Writing Fiction offers the same methods and exercises that have earned the school international acclaim.
				Once you've read-and written-your way through this book, you'll have a command of craft that will enable you to turn your ideas into effective short stories and novels.
				You will be a writer.
			</p>
			<a target="_blank"  href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=B009OANA2M&asin-it=8875271259&asin-fr=1582343306&asin-de=1582343306&asin-uk=1582343306&asin-ca=1582343306&asin-com=1582343306&asin=1582343306">
				<img border="0" src="img/suggestedReadings/en/Amazon-Buy-it-button.png" style="width: 150px; height: 50px;" >
			</a> 
		</div>
	</div>	
	<div class="row-fluid">
		<div class="span1"></div>
		<div class="span10">
            <hr>     
		</div>
	</div>
	<div class="row-fluid">	
		<div class="span1"></div>
		<div class="span2">
			<a target="_blank" href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=8495601516&asin-it=8875271917&asin-fr=2844811647&asin-de=193290736X&asin-uk=193290736X&asin-ca=193290736X&asin-com=193290736X&asin=193290736X"><img border="0" src="img/suggestedReadings/vogler.jpg" ></a>
		</div>
		<div class="span8">	
			<h4>
			<a target="_blank" href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=8495601516&asin-it=8875271917&asin-fr=2844811647&asin-de=193290736X&asin-uk=193290736X&asin-ca=193290736X&asin-com=193290736X&asin=193290736X">The Writers Journey: Mythic Structure for Writers, 3rd Edition</a>
			</h4>
			<h5>by Christopher Vogler (Author), Michele Montez (Illustrator) </h5>
			<p>The updated and revised third edition provides new insights and observations from Vogler's ongoing work on mythology's influence on stories, movies, and man himself. The previous two editons of this book have sold over 180,000 units, making this book a 'classic' for screenwriters, writers, and novelists.
			</p>
			<a target="_blank" href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=8495601516&asin-it=8875271917&asin-fr=2844811647&asin-de=193290736X&asin-uk=193290736X&asin-ca=193290736X&asin-com=193290736X&asin=193290736X" >
				<img border="0" src="img/suggestedReadings/en/Amazon-Buy-it-button.png" style="width: 150px; height: 50px;" >
			</a> 
		</div>
	</div>
	<div class="row-fluid">
		<div class="span1"></div>
		<div class="span10">
            <hr>     
		</div>
	</div>
	<div class="row-fluid">	
		<div class="span1"></div>
		<div class="span2">
			<a target="_blank" href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=1408109425&asin-it=887527018X&asin-fr=2844811671&asin-de=1408109425&asin-uk=1408109425&asin-ca=1408109425&asin-com=1408109425&asin=1408109425"><img border="0" src="img/suggestedReadings/marks.jpg" ></a>
		</div>
		<div class="span8">	
			<h4>
			<a target="_blank" href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=1408109425&asin-it=887527018X&asin-fr=2844811671&asin-de=1408109425&asin-uk=1408109425&asin-ca=1408109425&asin-com=1408109425&asin=1408109425">Inside story - The Power of the Transformational Arc</a>
			</h4>
			<h5>by Dara Marks</h5>
			<p>
				What is the secret to writing a great screenplay? Whether you're a beginning screenwriter or an A-list Academy Award winner, all writers struggle with the same thing: to get to the great script inside. Step by step, Inside Story: The Power of the Transformational Arc guides you through an extraordinary new process that helps identify your thematic intention-what your story is really about-and teaches you how to turn that intention into the driving force behind all your creative choices. The result is a profound relationship between the movement of the plot and the internal development of character, which is the foundation for the transformational arc. The transformational arc is the deeper line of structure found inside the story. Knowing how to work with the arc enhances your ability to: 1) Express your unique point of view 2) Give meaning and urgency to the line of action 3) Infuse your characters with richness, subtlety, and surprise 4) Develop a powerful emotional undercurrent 5) Make your stories stand out and get attention A strong transformational arc is the single most important element that makes the difference between a good screenplay and a great one. Inside Story delivers what the name implies: it's the real inside scoop on how to write a great screenplay with depth, dimension, and substance. It is a must-have for any serious screenwriter, playwright, or novelist.
			</p>
			<a target="_blank"  href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=1408109425&asin-it=887527018X&asin-fr=2844811671&asin-de=1408109425&asin-uk=1408109425&asin-ca=1408109425&asin-com=1408109425&asin=1408109425">
				<img border="0" src="img/suggestedReadings/en/Amazon-Buy-it-button.png" style="width: 150px; height: 50px;" >
			</a>
		</div>
	</div>
</div>
	
