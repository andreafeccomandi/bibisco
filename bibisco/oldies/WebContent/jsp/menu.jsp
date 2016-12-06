<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="tags" tagdir="/WEB-INF/tags"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<%@ taglib prefix="c" uri="/jstl/core"%>
<%@ taglib prefix="fn" uri="/jstl/functions"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<div class="navbar navbar-fixed-top bibiscoMenu">
     <div class="navbar-inner">
       <div class="container">
         <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
           <span class="icon-bar"></span>
           <span class="icon-bar"></span>
           <span class="icon-bar"></span>
         </a>
         <a class="brand" href="#"><img src="img/bibisco-brand-menu.png"></img></a>
         <div class="nav-collapse">
           <ul id="bibiscoMenuUl" class="nav">
             <li id="bibiscoMenuLiProject" class="active" data-div="Project"><a href="javascript: bibiscoSelectTopMenuItem('Project');"><fmt:message key="jsp.menu.project" /></a></li>
             <li id="bibiscoMenuLiArchitecture" data-div="Architecture"><a href="javascript: bibiscoSelectTopMenuItem('Architecture');"><fmt:message key="jsp.menu.architecture" /></a></li>
             <li id="bibiscoMenuLiCharacters" data-div="Characters"><a href="javascript: bibiscoSelectTopMenuItem('Characters');"><fmt:message key="jsp.menu.characters" /></a></li>
             <li id="bibiscoMenuLiLocations" data-div="Locations"><a href="javascript: bibiscoSelectTopMenuItem('Locations');"><fmt:message key="jsp.menu.locations" /></a></li>
             <li id="bibiscoMenuLiChapters" data-div="Chapters"><a href="javascript: bibiscoSelectTopMenuItem('Chapters');"><fmt:message key="jsp.menu.chapters" /></a></li>
			 <li id="bibiscoMenuLiAnalysis" data-div="Analysis"><a href="javascript: bibiscoSelectTopMenuItem('Analysis');"><fmt:message key="jsp.menu.analysis" /></a></li>
			 <li id="bibiscoMenuLiExport" data-div="Export"><a href="javascript: bibiscoSelectTopMenuItem('Export');"><fmt:message key="jsp.menu.export" /></a></li> 	
             <li id="bibiscoMenuLiSettings" data-div="Settings"><a href="javascript: bibiscoSelectTopMenuItem('Settings');"><fmt:message key="jsp.menu.settings" /></a></li>
             <li id="bibiscoMenuLiInfo" data-div="Info"><a href="javascript: bibiscoSelectTopMenuItem('Info');"><fmt:message key="jsp.menu.info" /></a></li>
             <li id="bibiscoMenuLiSuggestedReadings" data-div="SuggestedReadings"><a href="javascript: bibiscoSelectTopMenuItem('SuggestedReadings');"><fmt:message key="jsp.menu.suggestedReadings" /></a></li>
           </ul>
         </div><!--/.nav-collapse -->
       </div>
     </div>
</div>