<%@tag import="com.bibisco.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<script type="text/javascript">
//<![CDATA[   
function bibiscoTaskStatusSelectorInit(bibiscoTaskStatusSelectorConfig) {
	
	$('#bibiscoTagTaskStatusSelectorCompleted').click(function() {
		$('#bibiscoTagTaskStatusSelectorTodo span').removeClass('badge-important');
		$('#bibiscoTagTaskStatusSelectorToComplete span').removeClass('badge-warning');
		$('#bibiscoTagTaskStatusSelectorCompleted span').addClass('badge-success');
		bibiscoTaskStatusSelectorConfig.changeCallback();
	});
	$('#bibiscoTagTaskStatusSelectorToComplete').click(function() {
		$('#bibiscoTagTaskStatusSelectorTodo span').removeClass('badge-important');
		$('#bibiscoTagTaskStatusSelectorToComplete span').addClass('badge-warning');
		$('#bibiscoTagTaskStatusSelectorCompleted span').removeClass('badge-success');
		bibiscoTaskStatusSelectorConfig.changeCallback();
	});
	$('#bibiscoTagTaskStatusSelectorTodo').click(function() {
		$('#bibiscoTagTaskStatusSelectorTodo span').addClass('badge-important');
		$('#bibiscoTagTaskStatusSelectorToComplete span').removeClass('badge-warning');
		$('#bibiscoTagTaskStatusSelectorCompleted span').removeClass('badge-success');
		bibiscoTaskStatusSelectorConfig.changeCallback();
	});
	
	$('#bibiscoTagTaskStatusSelectorCompleted').tooltip();
	$('#bibiscoTagTaskStatusSelectorToComplete').tooltip();
	$('#bibiscoTagTaskStatusSelectorTodo').tooltip();
	
	
	if (bibiscoTaskStatusSelectorConfig.value == 'DISABLE')  {
		$('#bibiscoTagTaskStatusSelectorDiv').remove();
		return {
			getSelected: function() {
				return 'DISABLE';
			}
		}
	}
	
	else if(bibiscoTaskStatusSelectorConfig.value == 'COMPLETED') {
		$('#bibiscoTagTaskStatusSelectorCompleted span').addClass('badge-success');
		$('#bibiscoTagTaskStatusSelectorCompleted').addClass('active');
	}
	
	else if (bibiscoTaskStatusSelectorConfig.value == 'TODO') {
		$('#bibiscoTagTaskStatusSelectorTodo span').addClass('badge-important');
		$('#bibiscoTagTaskStatusSelectorTodo').addClass('active');
	}
	
	else if (bibiscoTaskStatusSelectorConfig.value == 'TOCOMPLETE')  {
		$('#bibiscoTagTaskStatusSelectorToComplete span').addClass('badge-warning');
		$('#bibiscoTagTaskStatusSelectorToComplete').addClass('active');
	}
	

	return {
		getSelected: function() {
			return $('#bibiscoTagTaskStatusSelectorDiv a.active').metadata().taskStatusValue;
		}
	}
}
//]]>
</script>
<div id="bibiscoTagTaskStatusSelectorDiv" class="btn-group" data-toggle="buttons-radio">
	<a id="bibiscoTagTaskStatusSelectorCompleted" title="<fmt:message key="tag.bibiscothumbnail.taskstatus.completed.description" />" class="{taskStatusValue: 'COMPLETED'} btn"><span class="badge"><fmt:message key="tag.bibiscothumbnail.taskstatus.completed" /></span></a>
	<a id="bibiscoTagTaskStatusSelectorToComplete" title="<fmt:message key="tag.bibiscothumbnail.taskstatus.tocomplete.description" />" class="{taskStatusValue: 'TOCOMPLETE'} btn"><span class="badge"><fmt:message key="tag.bibiscothumbnail.taskstatus.tocomplete" /></span></a>
	<a id="bibiscoTagTaskStatusSelectorTodo" title="<fmt:message key="tag.bibiscothumbnail.taskstatus.todo.description" />" class="{taskStatusValue: 'TODO'} btn"><span class="badge"><fmt:message key="tag.bibiscothumbnail.taskstatus.todo" /></span></a>
</div>