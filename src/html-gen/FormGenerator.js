const ig = require("./InputGenerator");

class FormGenerator {

    constructor () {
		this.prefixes = null;
		this.shapes = null;
		this.current = "";
		this.main = "";
		this.recursividad = 0;
    }
	
	createForm(shape, shName, pred, label) {
		this.recursividad++;
		if(this.recursividad > 4) return "";	
		let mainLabel = null;
		this.current = shName;
		//Nombre del formulario
		if(shape.annotations) {
			mainLabel = this.getAnnotations(shape.annotations).label;
		}
		if(label) {
			mainLabel = label;
		}
		if(!mainLabel) {
			let predicate = pred ? this.getPrefixedTerm(pred) + " (" : "";
			let closure = pred ? ")" : "";
			mainLabel = predicate + this.getPrefixedTerm(shName) + closure;
		}
		let form = `<h3>${mainLabel}</h3>`;
		
		
		if(shape.expression && shape.expression.expressions) {
			for(let i = 0; i < shape.expression.expressions.length; i++) {
				form += this.checkExpression(shape.expression.expressions[i]);
			}
		}
		else if (shape.expression) {
			form += this.checkExpression(shape.expression);
		}
		
		return form;
	}
	
	checkExpression(exp) {
		if(exp.type === "TripleConstraint") {
			return this.checkTripleConstraint(exp);
		}
		else if(exp.type === "OneOf") {
			let div = '<div class="orform">';
			for(let i = 0; i < exp.expressions.length; i++) {
					if(i > 0) {
						div += "<h3>OR</h3>";
					}
					div += this.checkExpression(exp.expressions[i]);
			}
			div += '</div>';
			return div;
		}
		else if(exp.type === "EachOf") {
			let tcs = "";
			for(let i = 0; i < exp.expressions.length; i++) {
					tcs += this.checkExpression(exp.expressions[i]);
			}
			return tcs;
		}
	}
	
	checkTripleConstraint(exp) {
		if(exp.predicate === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
			if(exp.valueExpr.values.length <= 1) {
				return "";
			}
			else {	
				return ig.buildSelectInput(id, exp.valueExpr, ans, exp.min, exp.max);
			}
		}
		else if(exp.valueExpr && exp.valueExpr.type === "NodeConstraint") {
			let ans = null;
			if(exp.annotations) {
				ans = this.getAnnotations(exp.annotations);
			}
			let id = this.getPrefixedTerm(pr)
			if(exp.valueExpr.values) {	// [...]
				return ig.buildSelectInput(id, exp.valueExpr, ans, exp.min, exp.max);
			}
			else if(exp.valueExpr.datatype && 
					exp.valueExpr.datatype === "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString") { //LANGSTRING
				return ig.buildLangStringInput(id, exp.valueExpr, ans, exp.min, exp.max);
			}
			else {
				return ig.buildBasicInput(id, exp.valueExpr, ans, exp.min, exp.max);
			}
			
		}
		else if(exp.valueExpr && exp.valueExpr.type === "ShapeRef") {
			let refShape = this.shapes[exp.valueExpr.reference];
			let ans = this.getAnnotations(exp.annotations);
			if(refShape.type === "NodeConstraint") {
				let id = this.getPrefixedTerm(exp.predicate);
				let nodekind = refShape.nodeKind;
				if(nodekind) { 		//:Work IRI
					return ig.buildBasicInput(id, refShape, ans, exp.min, exp.max);
				}
				else { // <#vcard_country-name> ["Afghanistan", ...]	  
					return ig.buildSelectInput(id, refShape, ans, exp.min, exp.max);
				}
				
			}
			else {  //SHAPEREF "compleja"
				if(this.current === exp.valueExpr.reference) return "";
				//Guardamos la shape actual
				let prev = this.current;
				div = '<div class="innerform">';
				div += this.createForm(refShape, exp.valueExpr.reference, exp.predicate, label);
				//Recuperamos el valor
				this.current = prev;
				this.recursividad--;
				div += '</div>';
			}
			return div;
		}
		else if(!exp.valueExpr) {	// . ;
			return ig.buildBasicInput(exp.predicate, null, ans, exp.min, exp.max);
		}
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