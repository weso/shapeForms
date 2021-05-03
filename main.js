const shexParser = require("./src/ShExParser.js");

function shexToForm(shex) {
    return shexParser.parseShExToForm(shex);
}

module.exports = {
    shexToForm
}