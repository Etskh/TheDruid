

django.jQuery(document).ready( function() {
	
	var myCodeMirror = CodeMirror.fromTextArea( document.getElementById('id_shader'), {
		lineNumbers : true,
		mode:  "x-shader/x-fragment",
		matchBrackets: true,
		indentUnit : 4,
		indentWithTabs : true
	});
	
});
