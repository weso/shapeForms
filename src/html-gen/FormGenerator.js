
class FormGenerator {

    constructor () {
		this.prefixes = null;
		this.shapes = null;
		this.current = "";
    }
	
	createForm(shape, shName) {
		let mainLabel = null;
		this.current = shName;
		//Nombre del formulario
		if(shape.annotations) {
			for(let i = 0; i < shape.annotations.length; i++) {
				if(shape.annotations[i].predicate === "http://www.w3.org/ns/ui#label") {
					mainLabel = shape.annotations[i].object.value;
				}
			}
		}
		if(!mainLabel) {
			mainLabel = this.getPrefixedTerm(shName);
		}
		let form = `<h3>${mainLabel}</h3>`;
		
		
		if(shape.expression.expressions) {
			for(let i = 0; i < shape.expression.expressions.length; i++) {
				form += this.checkExpression(shape.expression.expressions[i]);
			}
		}
		
		return form;
	}
	
	checkExpression(exp) {
		if(exp.type === "TripleConstraint") {
			return this.checkTripleConstraint(exp);
		}
		else if(exp.type === "OneOf") {
			return "";
		}
	}
	
	checkTripleConstraint(exp) {
		if(exp.predicate === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
			if(exp.valueExpr.values.length <= 1) {
				return "";
			}
			else {
				let id = this.current + "-a";
				let label = "a";
				for(let i = 0; i < exp.annotations.length; i++) {
					if(exp.annotations[i].predicate === "http://www.w3.org/ns/ui#label") {
						label = exp.annotations[i].object.value;
					}
				}
				let sel = `<label for="${id}">${label}:</label><select name="${id}">`;
				for(let i = 0; i < exp.valueExpr.values.length; i++) {
					let pValue = this.getPrefixedTerm(exp.valueExpr.values[i]);
					sel += `<option value="${pValue}">${pValue}</option>`;
				}
				sel += '</select>';
				return sel;
			}
		}
		else if(exp.valueExpr && exp.valueExpr.type === "NodeConstraint") {
			let type = this.determineType(exp.valueExpr);
			let id = this.getPrefixedTerm(exp.predicate);
			let label = id;
			let readonly = "";
			if(exp.annotations) {
				for(let i = 0; i < exp.annotations.length; i++) {
					if(exp.annotations[i].predicate === "http://www.w3.org/ns/ui#label") {
						label = exp.annotations[i].object.value;
					}
					else if(exp.annotations[i].predicate === "http://janeirodigital.com/layout#readonly") {
						readonly = `readonly=${exp.annotations[i].object.value}`;
					}
				}
		}
			return `<label for="${id}">${label}:</label>` +
					`<input type="${type}" id="${id}" name="${id}" ${readonly}>`;
		}
		else if(exp.valueExpr && exp.valueExpr.type === "ShapeRef") {
			let div = "";
			let refShape = this.shapes[exp.valueExpr.reference];
			if(refShape.type === "NodeConstraint") {
				let id = this.getPrefixedTerm(exp.predicate);
				let label = id;
				for(let i = 0; i < exp.annotations.length; i++) {
					if(exp.annotations[i].predicate === "http://www.w3.org/ns/ui#label") {
						label = exp.annotations[i].object.value;
					}
				}
				div = `<label for="${id}">${label}:</label><select name="${id}">`;
				for(let i = 0; i < refShape.values.length; i++) {
					div += `<option value="${refShape.values[i].value}">${refShape.values[i].value}</option>`;
				}
				div += '</select>';
			}
			else {
				div = '<div class="innerform">';
				div += this.createForm(refShape, exp.valueExpr.reference);
				div += '</div>';
			}
			return div;
		}
	}
	
	determineType(ve) {
		if(ve.nodeKind === "iri") {
			return "url";
		}
		if(ve.datatype === "http://www.w3.org/2001/XMLSchema#integer") {
			return "number";
		}
		return "text";
	}

    clear() {
    }
	
	getPrefixedTerm(iri) {
		for (const [key, value] of this.prefixes.entries()) {
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

}
module.exports = FormGenerator;