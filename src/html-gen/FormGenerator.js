const ig = require("./InputGenerator.js");
const aux = require("./Auxiliar.js");

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
			mainLabel = aux.getAnnotations(shape.annotations).label;
		}
		if(label) {
			mainLabel = label;
		}
		if(!mainLabel) {
			let predicate = pred ? aux.getPrefixedTerm(pred, this.prefixes) + " (" : "";
			let closure = pred ? ")" : "";
			mainLabel = predicate + aux.getPrefixedTerm(shName, this.prefixes) + closure;
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
		ig.prefixes = this.prefixes;
		let id = aux.getPrefixedTerm(exp.predicate, this.prefixes);
		let ans = null;
		if(exp.annotations) {
			ans = aux.getAnnotations(exp.annotations);
		}
		if(exp.predicate === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
			if(exp.valueExpr.values.length <= 1) {
				return "";
			}
			else {	
				let aid = this.current + "-a";
				return ig.buildSelectInput(aid, exp.valueExpr, ans, exp.min, exp.max);
			}
		}
		else if(exp.valueExpr && exp.valueExpr.type === "NodeConstraint") {
			
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
			if(refShape.type === "NodeConstraint") {
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
				let div = '<div class="innerform">';
				let label = "";
				if(ans) {
					label = ans.label;
				}
				div += this.createForm(refShape, exp.valueExpr.reference, exp.predicate, label);
				//Recuperamos el valor
				this.current = prev;
				this.recursividad--;
				div += '</div>';
				return div;
			}
		}
		else if(!exp.valueExpr) {	// . ;
			return ig.buildBasicInput(exp.predicate, null, ans, exp.min, exp.max);
		}
	}
	

}
module.exports = FormGenerator;