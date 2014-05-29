
	<script type="text/javascript">
         
		$(function() {
			$('#bibiscoMainDivExport').hide();
			$('#bibiscoMainDivArchitecture').hide();
			$('#bibiscoMainDivChapters').hide();
			$('#bibiscoMainDivCharacters').hide();
			$('#bibiscoMainDivAnalysis').hide();
			$('#bibiscoMainDivLocations').hide();
			$('#bibiscoMainDivSettings').hide();
			$('#bibiscoMainDivInfo').hide();
						
			// set body height: this is necessary to avoid strange behaviours of dialog dragged outside body height
			$('body').css('height', window.innerHeight-50);
			
			// disable drag on all button, img, anchor elements
			$(document).on('dragstart', '.btn, img, a', function(event) { event.preventDefault(); });
		});
		
		
		//
	</script>

    <%@ include file="menu.jsp" %>
    <div class="container">
    	<div id="bibiscoMainDivProject"><%@ include file="project.jsp" %></div>
    	<div id="bibiscoMainDivExport"><%@ include file="export.jsp" %></div>
    	<div id="bibiscoMainDivArchitecture"><%@ include file="architecture.jsp" %></div>
    	<div id="bibiscoMainDivChapters"><%@ include file="chapters.jsp" %></div>
    	<div id="bibiscoMainDivAnalysis"><%@ include file="analysis.jsp" %></div>
    	<div id="bibiscoMainDivCharacters"><%@ include file="characters.jsp" %></div>
    	<div id="bibiscoMainDivLocations"><%@ include file="locations.jsp" %></div>
    	<div id="bibiscoMainDivSettings"><%@ include file="settings.jsp" %></div>
    	<div id="bibiscoMainDivInfo"><%@ include file="info.jsp" %></div>
	</div> <!-- /container -->
	