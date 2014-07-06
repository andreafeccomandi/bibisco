<!DOCTYPE html>
<html lang="en">
<head>
<title>bibisco</title>
<%@ taglib prefix="c" uri="/jstl/core"%>
<c:set var="version" value="<%=new java.util.Date().getTime()%>" scope="request"/>
<script type="text/javascript" src="js/jquery-1.7.2.min.js?version=${version}"></script>
<link rel="stylesheet" href="js/bootstrap/css/bootstrap.css?version=${version}" type="text/css" media="print, projection, screen" />

<script type="text/javascript">
$(function() {
    
	setInterval(function() {
		var progress = parseInt($('#bibiscoDivProgessBar').data('progress')) + 1;
		$('#bibiscoDivProgessBar').attr('style', 'height: 50px; width: ' + progress + '%;');
		$('#bibiscoDivProgessBar').data('progress',progress);
		
	},100);
	
	// the ajax call is used to ask Jetty to compile jsp
	// on success call to get start page
	$.ajax({
        type: 'GET',
        url : 'jsp/index.jsp',
        success:function(data){
        	window.location.href='BibiscoServlet?action=start';
        },
        error:function(){
           
        }
  });
	
});

</script>


</head>

<body>
<div style="margin-top: 300px; margin-left: 150px; margin-right: 150px;">
<div class="progress" style="height: 50px;  border-radius: 20px;">
  <div id="bibiscoDivProgessBar" class="bar" style="height: 50px; width: 0%;" data-progress="0"></div>
</div>
</div>
</body>
</html>
