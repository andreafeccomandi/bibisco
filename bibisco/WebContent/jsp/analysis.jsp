<script type="text/javascript">
$(function() {
	
	// important note
	$('#bibiscoAnalysisAImportantNote').click(function() {
		bibiscoAlert("<fmt:message key="jsp.analysis.importantNote.alert.text" />");	
	});
});


</script>

<div class="row-fluid">
	<div class="span12">
		<div class="row-fluid  page-header">
			<div class="span8">
    			<h1><fmt:message key="jsp.analysis.h1"/></h1>
    		</div>
    		<div class="span4" style="text-align: right;">
    			<a id="bibiscoAnalysisAImportantNote" class="btn btn-primary" style="margin-top: 2px;" href="#"><i class="icon-exclamation-sign icon-white"></i><fmt:message key="jsp.analysis.a.readme" /></a>
    		</div>
    	</div>
    	<section>
    	<div class="row-fluid">
			<div class="span3">
				<tags:bibiscoThumbnail 
					description="jsp.analysis.thumbnail.charactersChapters.description" 
					title="jsp.analysis.thumbnail.charactersChapters.title" 
					type="analysisCharactersChapters" taskStatus="DISABLE"
					id="CHARACTERS_CHAPTERS"
					width="980" height="window.innerHeight - 75" positionTop="25" />
			</div>
			<div class="span3">
				<tags:bibiscoThumbnail 
					description="jsp.analysis.thumbnail.charactersScene.description" 
					title="jsp.analysis.thumbnail.charactersScene.title" 
					type="analysisCharacterScene" taskStatus="DISABLE"
					id="CHARACTERS_SCENE"
					width="980" height="window.innerHeight - 75" positionTop="25" />
			</div>
			<div class="span3">
				<tags:bibiscoThumbnail 
					description="jsp.analysis.thumbnail.locationsChapters.description" 
					title="jsp.analysis.thumbnail.locationsChapters.title" 
					type="analysisLocationsChapters" taskStatus="DISABLE"
					id="LOCATIONS_CHAPTERS"
					width="980" height="window.innerHeight - 75" positionTop="25" />
			</div>
			<div class="span3">
				<tags:bibiscoThumbnail 
					description="jsp.analysis.thumbnail.strandsChapters.description" 
					title="jsp.analysis.thumbnail.strandsChapters.title" 
					type="analysisStrandsChapters" taskStatus="DISABLE"
					id="STRANDS_CHAPTERS"
					width="980" height="window.innerHeight - 75" positionTop="25" />
			</div>
		</div>
		</section>
		<section>
		<div class="row-fluid">
			<div class="span3">
				<tags:bibiscoThumbnail 
					description="jsp.analysis.thumbnail.pointOfViewsChapters.description" 
					title="jsp.analysis.thumbnail.pointOfViewsChapters.title" 
					type="analysisPointOfViewsChapters" taskStatus="DISABLE"
					id="POINT_OF_VIEWS_CHAPTERS"
					width="980" height="window.innerHeight - 75" positionTop="25" />
			</div>
		</div>
		</section>
	</div>
</div>


			
		