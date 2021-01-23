
class FormGenerator {

    constructor () {

    }
	
	createForm(shape, shName, prefixes) {
		let mainLabel = null;
		if(shape.annotations) {
			for(let i = 0; i < shape.annotations.length; i++) {
				if(shape.annotations[i].predicate === "http://www.w3.org/ns/ui#label") {
					mainLabel = shape.annotations[i].object.value;
				}
			}
		}
		if(!mainLabel) {
			mainLabel = this.getPrefixedTerm(shName, prefixes);
		}
		let form = `<h3>${mainLabel}</h3>`;
		
		return form;
	}

    clear() {
    }
	
	getPrefixedTerm(iri, prefixes) {
		for (const [key, value] of prefixes.entries()) {
			if(iri.includes(key)) {
				if(value !== "base") {
					return value + ":" + iri.replace(key, "");
				}
                else {
					let term = iri.replace(key, "");
					return `&lt;${term}&gt;`
				}
            }
		}
    }

    /**
     * Devuelve el último fragmento de una IRI
     * @param baseiri   Fragmento base - se elimina-
     * @param iri       IRI a tratar
     * @returns {*}
     */
    lastOfIRI(baseiri, iri) {
        return iri.replace(baseiri, "");
    }

}
module.exports = FormGenerator;