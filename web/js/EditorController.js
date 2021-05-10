const $ = require('jquery');
const sf = require ("../../main.js");

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
	
	let html = sf.shexToForm(text);
	
	$("#resultform").html(html);
	
	$("#editorcontainer").css("display", "none");
	$("#back").css("display", "inherit");
	$("#resultform").css("display", "inherit");

	sf.postProcess();

}

$("#back").click(backToEditor);

function backToEditor() {
	$("#editorcontainer").css("display", "inherit");
	$("#back").css("display", "none");
	$("#resultform").css("display", "none");
}




