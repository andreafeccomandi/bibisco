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
			<a target="_blank"  href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=9562915867&asin-it=8886350856&asin-fr=9562915867&asin-de=3932909585&asin-uk=9562915867&asin-ca=9562915867&asin-com=9562915867&asin=9562915867"><img border="0" src="img/suggestedReadings/<fmt:message key="jsp.suggestedReadings.book.egri.image" />" ></a>	
		</div>
		<div class="span8">	
			<h4><a target="_blank" href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=9562915867&asin-it=8886350856&asin-fr=9562915867&asin-de=3932909585&asin-uk=9562915867&asin-ca=9562915867&asin-com=9562915867&asin=9562915867"><fmt:message key="jsp.suggestedReadings.book.egri.title" /></a>
			</h4>
			<h5><fmt:message key="jsp.suggestedReadings.book.egri.authors" /></h5>
			<p><fmt:message key="jsp.suggestedReadings.book.egri.description" /></p>				
			<a target="_blank"  href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=9562915867&asin-it=8886350856&asin-fr=9562915867&asin-de=3932909585&asin-uk=9562915867&asin-ca=9562915867&asin-com=9562915867&asin=9562915867">
				<img border="0" src="img/Amazon-Buy-it-button.png" >
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
			<a target="_blank" href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=B009OANA2M&asin-it=8875271259&asin-fr=1582343306&asin-de=1582343306&asin-uk=1582343306&asin-ca=1582343306&asin-com=1582343306&asin=1582343306"><img border="0" src="img/suggestedReadings/<fmt:message key="jsp.suggestedReadings.book.gotham.image" />" ></a>
		</div>
		<div class="span8">	
			<h4>
			<a target="_blank" href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=B009OANA2M&asin-it=8875271259&asin-fr=1582343306&asin-de=1582343306&asin-uk=1582343306&asin-ca=1582343306&asin-com=1582343306&asin=1582343306"><fmt:message key="jsp.suggestedReadings.book.gotham.title" /></a>
			</h4>
			<h5><fmt:message key="jsp.suggestedReadings.book.gotham.authors" /></h5>
			<p><fmt:message key="jsp.suggestedReadings.book.gotham.description" /></p>
			<a target="_blank"  href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=B009OANA2M&asin-it=8875271259&asin-fr=1582343306&asin-de=1582343306&asin-uk=1582343306&asin-ca=1582343306&asin-com=1582343306&asin=1582343306">
				<img border="0" src="img/Amazon-Buy-it-button.png" >
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
			<a target="_blank" href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=8495601516&asin-it=8875271917&asin-fr=2844811647&asin-de=193290736X&asin-uk=193290736X&asin-ca=193290736X&asin-com=193290736X&asin=193290736X">
				<img border="0" src="img/suggestedReadings/<fmt:message key="jsp.suggestedReadings.book.vogler.image" />" >
			</a>
		</div>
		<div class="span8">	
			<h4>
			<a target="_blank" href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=8495601516&asin-it=8875271917&asin-fr=2844811647&asin-de=193290736X&asin-uk=193290736X&asin-ca=193290736X&asin-com=193290736X&asin=193290736X">
				<fmt:message key="jsp.suggestedReadings.book.vogler.title" />
			</a>
			</h4>
			<h5><fmt:message key="jsp.suggestedReadings.book.vogler.authors" /></h5>
			<p><fmt:message key="jsp.suggestedReadings.book.vogler.description" /></p>
			<a target="_blank" href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=8495601516&asin-it=8875271917&asin-fr=2844811647&asin-de=193290736X&asin-uk=193290736X&asin-ca=193290736X&asin-com=193290736X&asin=193290736X" >
				<img border="0" src="img/Amazon-Buy-it-button.png" >
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
			<a target="_blank" href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=1408109425&asin-it=887527018X&asin-fr=2844811671&asin-de=1408109425&asin-uk=1408109425&asin-ca=1408109425&asin-com=1408109425&asin=1408109425">
				<img border="0" src="img/suggestedReadings/<fmt:message key="jsp.suggestedReadings.book.marks.image" />" >
			</a>
		</div>
		<div class="span8">	
			<h4>
			<a target="_blank" href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=1408109425&asin-it=887527018X&asin-fr=2844811671&asin-de=1408109425&asin-uk=1408109425&asin-ca=1408109425&asin-com=1408109425&asin=1408109425">
				<fmt:message key="jsp.suggestedReadings.book.marks.title" />
			</a>
			</h4>
			<h5><fmt:message key="jsp.suggestedReadings.book.marks.authors" /></h5>
			<p><fmt:message key="jsp.suggestedReadings.book.marks.description" /></p>
			<a target="_blank"  href="http://a-fwd.com/es=wwwbibiscoc07-21&it=bibisco-21&fr=wwwbibiscocom-21&de=wwwbibiscoc0b-21&uk=wwwbibiscoc00-21&ca=bibisco04-20&com=bibisco-20&asin-es=1408109425&asin-it=887527018X&asin-fr=2844811671&asin-de=1408109425&asin-uk=1408109425&asin-ca=1408109425&asin-com=1408109425&asin=1408109425">
				<img border="0" src="img/Amazon-Buy-it-button.png" >
			</a>
		</div>
	</div>
</div>
	
