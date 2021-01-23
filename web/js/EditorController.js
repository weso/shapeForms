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
	
	$("#output").text(html);
	$("#resultform").html(html);

}