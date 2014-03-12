<%@ page import="com.bibisco.manager.LocaleManager"%>
<%@ taglib prefix="fmt" uri="/jstl/fmt"%>
<fmt:setLocale value="<%=LocaleManager.getInstance().getLocale().toString()%>"/>

<!-- CONSTANTS -->
jsBibiscoRichTextEditorWidth = 770;

<!-- LABELS & MESSAGES -->

jsBibiscoAlertOk = "<fmt:message key="js.bibisco.alert.ok"/>"; 
jsBibiscoConfirmOk = "<fmt:message key="js.bibisco.confirm.ok"/>"; 
jsBibiscoConfirmCancel = "<fmt:message key="js.bibisco.confirm.cancel"/>"; 
jsBibiscoLoadingStart  = "<fmt:message key="js.bibisco.loading.start"/>";
jsBibiscoLoadingEndSuccess  = "<fmt:message key="js.bibisco.loading.end.success"/>";
jsBibiscoLoadingEndError  = "<fmt:message key="js.bibisco.loading.end.error"/>";
jsCommonMessageConfirmExitWithoutSave = "<fmt:message key="js.common.message.confirmExitWithoutSave"/>";

jsmsgConfirmTitleDeletePart = "<fmt:message key="js.confirm.title.delete.part"/>"; 
jsmsgConfirmTitleDeleteChapter = "<fmt:message key="js.confirm.title.delete.chapter"/>";
jsmsgConfirmTitleDeleteScene = "<fmt:message key="js.confirm.title.delete.scene"/>";

jsBibiscoTaskStatusTodo = "<fmt:message key="tag.bibiscothumbnail.taskstatus.todo" />";
jsBibiscoTaskStatusToComplete = "<fmt:message key="tag.bibiscothumbnail.taskstatus.tocomplete" />";
jsBibiscoTaskStatusCompleted = "<fmt:message key="tag.bibiscothumbnail.taskstatus.completed" />";

jsBibiscoTaskStatusTodoDescription = "<fmt:message key="tag.bibiscothumbnail.taskstatus.todo.description" />";
jsBibiscoTaskStatusToCompleteDescription = "<fmt:message key="tag.bibiscothumbnail.taskstatus.tocomplete.description" />";
jsBibiscoTaskStatusCompletedDescription = "<fmt:message key="tag.bibiscothumbnail.taskstatus.completed.description"/>";

jsPluginBibiscospellCkeditor = "<fmt:message key="js.plugin.bibiscospell.ckeditor" />";

