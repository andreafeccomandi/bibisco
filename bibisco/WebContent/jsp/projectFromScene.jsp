<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
//<![CDATA[
            
    <!-- INIT DIALOG CALLBACK -->
    function bibiscoProjectFromSceneInitCallback(ajaxDialog, idCaller, dialogWidth) {
    	$('#bibiscoProjectFromSceneULMainMenu a').click(function (e) {
   		  e.preventDefault();
   		  $(this).tab('show');
   		});
    	
    	var selectWidth = dialogWidth - 150;
    	$("#bibiscoProjectFromSceneSelectArchitecture").css("width", selectWidth);
    	$("#bibiscoProjectFromSceneSelectChapter").css("width", selectWidth);
    	
    	$("#bibiscoProjectFromSceneSelectArchitecture").select2({
            escapeMarkup: function(m) { return m; }
        });
    	$("#bibiscoProjectFromSceneSelectChapter").select2({
            escapeMarkup: function(m) { return m; }
        });
    }
    
    <!-- CLOSE DIALOG CALLBACK -->
    function bibiscoProjectFromSceneCloseCallback(ajaxDialog, idCaller) {
    
    }
    
    <!-- BEFORE DIALOG CALLBACK -->
    function bibiscoProjectFromSceneBeforeCloseCallback(ajaxDialog, idCaller) {
    	
    }
    
    
    
//]]>           
</script>
<div style="margin-top: 10px;">
	<ul id="bibiscoProjectFromSceneULMainMenu" class="nav nav-tabs">
	  <li class="active"><a href="#bibiscoProjectFromSceneTabLiArchitecture" data-toggle="tab">Architettura</a></li>
	  <li><a href="#bibiscoProjectFromSceneTabLiChapter" data-toggle="tab">Capitoli</a></li>
	  <li><a href="#messages" data-toggle="tab">Personaggi</a></li>
	  <li><a href="#settings" data-toggle="tab">Luoghi</a></li>
	</ul>
	<div class="tab-content">
	   <!-- ARCHITECTURE -->
	   <div style="margin-top: 10px;" class="tab-pane active" id="bibiscoProjectFromSceneTabLiArchitecture">
		   <select style="margin-left: 50px;" class="selectpicker" id="bibiscoProjectFromSceneSelectArchitecture">
		       <option>Premessa</option>
		       <option>Fabula</option>
		       <option>Ambientazione</option>  
		   </select>    
		   <hr/>
		   <div id="bibiscoProjectFromSceneDivArchitecture">
		   
		   </div>
	   </div>
	   
	   <div style="margin-top: 10px;" class="tab-pane" id="bibiscoProjectFromSceneTabLiChapter">
	       <select style="margin-left: 50px;" class="selectpicker" id="bibiscoProjectFromSceneSelectChapter">
		   <c:forEach items="${chapters}" var="chapter" varStatus="chapterNumber">
		      <c:choose>
			      <c:when test="${chapter.idChapter == idActualChapter}">
			         <option selected="selected">${chapter.title}</option>
			      </c:when>
			      <c:otherwise>
				     <option>${chapter.title}</option>
				  </c:otherwise>
			  </c:choose>
		   </c:forEach>	   
		   </select>
		   <hr/>
		   <div id="bibiscoProjectFromSceneDivChapterContent">
           
           </div>
	   </div>
	   
	   <div style="margin-top: 10px;" class="tab-pane" id="messages">Personaggi...</div>
	   <div style="margin-top: 10px;" class="tab-pane" id="settings">Luoghi...</div>
    </div>
</div>


<div class="bibiscoDialogFooter control-group">
    <table style="width: 100%">
        <tr>
            <td style="text-align: right;">
                <a id="bibiscoProjectFromSceneAClose" title="<fmt:message key="jsp.common.button.close" />" class="btn ajaxDialogCloseBtn" style="margin-left: 5px;" href="#">
                <i class="icon-remove"></i></a>
            </td>
        </tr>
    </table>
</div>