<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<script type="text/javascript">
	//         
	$(function() {
		$('#bibiscoMainDivChapters').hide();
		$('#bibiscoMainDivCharacters').hide();
		$('#bibiscoMainDivLocations').hide();
	});
			
	//
</script>


<div id="bibiscoMainDivArchitecture"><%@ include file="architecture.jsp" %></div>
<div id="bibiscoMainDivChapters"><%@ include file="chapters.jsp" %></div>
<div id="bibiscoMainDivCharacters"><%@ include file="characters.jsp" %></div>
<div id="bibiscoMainDivLocations"><%@ include file="locations.jsp" %></div>
