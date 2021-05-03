const $ = require('jquery');
const ShexParser = require ("../../src/ShExParser.js");

let shExEditor;

/**
 * Creamos el editor de ShEx
 */
if(document.getElementById("shextext") !== null) {
    shExEditor = CodeMirror.fromTextArea(document.getElementById("shextext"), {
        mode: "shex",
        lineNumbers: true
    });
    let theme = sessionStorage.getItem("theme");
    shExEditor.setOption("theme", "ayu-mirage");
}

let shxtx = $('#shextoform');

shxtx.click(shExToForm);

function shExToForm() {
	let text = shExEditor.getValue();
	
	let html = ShexParser.parseShExToForm(text);
	
	$("#resultform").html(html);
	
	$("#editorcontainer").css("display", "none");
	$("#back").css("display", "inherit");
	$("#resultform").css("display", "inherit");
	
	$( ".newButton" ).each(function(index) {
    $(this).on("click", function(){
		let id = $(this).prev().attr("id").replace(":", "\\:");
		$(this).prev().clone().insertAfter("#container-" + id);
    });

	$("#checkbtn").click(function() {
		if(! $("#shexgform")[0].checkValidity()) {
			$("#shexgform").find(':submit').click();
		}
	});
});

}

$("#back").click(backToEditor);

function backToEditor() {
	$("#editorcontainer").css("display", "inherit");
	$("#back").css("display", "none");
	$("#resultform").css("display", "none");
}



