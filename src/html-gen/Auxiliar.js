class Auxiliar {

    getPrefixedTerm(iri, prfx) {
		for (const [key, value] of prfx.entries()) {
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

    getAnnotations(ans) {
		let label = "";
		let readonly = "";
		let size = "";
		if(ans) {
			for(let i = 0; i < ans.length; i++) {
				if(ans[i].predicate === "http://www.w3.org/ns/ui#label") {
					label = ans[i].object.value;
				}
				else if(ans[i].predicate === "http://www.w3.org/ns/ui#size") {
					size = 'size="' + ans[i].object.value + '"';
				}
				else if(ans[i].predicate === "http://janeirodigital.com/layout#readonly") {
					readonly = `readonly=${ans[i].object.value}`;
				}
			}
		}
		
		return {
			label: label,
			readonly: readonly,
			size: size
		}
	}

}
module.exports = new Auxiliar();