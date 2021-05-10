const shexParser = require("./src/ShExParser.js");
const $ = require('jquery');

var id = 0;

function getID() {
	return id++;
}

function shexToForm(shex) {
    return shexParser.parseShExToForm(shex);
}

function postProcess() {
    $( ".newButton" ).each(function(index) {
		$(this).on("click", function(){
			let id = $(this).prev().attr("id").replace(":", "\\:");
			let copy = $(this).prev().clone();
			let copyIDn = getID();
			let copyID = "copy" + copyIDn;
			$("#container-" + id).after(`<div id="${copyID}"></div>`);
			$("#" + copyID).append(copy);
			$("#" + copyID).append("<a class='button delButton'>×</a>");
			$(`#${copyID} input`).attr("id", $(`#${copyID} input`).attr("id") + copyIDn);
		
			$(`#${copyID} .delButton`).on("click", function() {
				$(`#${copyID}`).remove();
			})
		});

        $("#checkbtn").click(function() {
            if(! $("#shexgform")[0].checkValidity()) {
                $("#shexgform").find(':submit').click();
            }
        });
    });
}

module.exports = {
    shexToForm,
    postProcess
}