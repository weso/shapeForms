
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
			mainLabel = this.getAnnotations(shape.annotations).label;
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
				let id = this.current + "-a";
				let label = "a";
				let res = this.getAnnotations(exp.annotations);
				if(res.label !== "") {
					label = res.label;
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
			let id = this.getPrefixedTerm(exp.predicate);
			let label = id;
			let readonly = "";
			if(exp.annotations) {
				let res = this.getAnnotations(exp.annotations);
				if(res.label !== "") {
					label = res.label;
				}
				readonly = res.readonly;
			}
			if(exp.valueExpr.values) {	// [...]
				if(exp.valueExpr.values.length === 1) return "";
				let select = `<label for="${id}">${label}:</label><select name="${id}">`;
				for(let i = 0; i < exp.valueExpr.values.length; i++) {
					let valor = exp.valueExpr.values[i].value ? exp.valueExpr.values[i].value : this.getPrefixedTerm(exp.valueExpr.values[i]);
					select += `<option value="${valor}">${valor}</option>`;
				}
				select += '</select>';
				return select;
			}
			else {
				let type = this.determineType(exp.valueExpr);
				return `<label for="${id}">${label}:</label>` +
						`<input type="${type}" id="${id}" name="${id}" ${readonly}>`;
			}
			
		}
		else if(exp.valueExpr && exp.valueExpr.type === "ShapeRef") {
			let div = "";
			let refShape = this.shapes[exp.valueExpr.reference];
			if(refShape.type === "NodeConstraint") {
				let id = this.getPrefixedTerm(exp.predicate);
				let label = id;
				let res = this.getAnnotations(exp.annotations);
				if(res.label !== "") { label = res.label; }
				div = `<label for="${id}">${label}:</label><select name="${id}">`;
				for(let i = 0; i < refShape.values.length; i++) {
					let valor = refShape.values[i].value ? refShape.values[i].value : this.getPrefixedTerm(refShape.values[i]);
					div += `<option value="${valor}">${valor}</option>`;
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
		else if(!exp.valueExpr) {	// . ;
			let id = this.getPrefixedTerm(exp.predicate);
			let label = id;
			let readonly = "";
			if(exp.annotations) {
				let res = this.getAnnotations(exp.annotations);
				if(res.label !== "") { label = res.label; }
				readonly = res.readonly;
			}
			return `<label for="${id}">${label}:</label>` +
					`<input type="text" id="${id}" name="${id}" ${readonly}>`;
		}
	}
	
	getAnnotations(ans) {
		let label = "";
		let readonly = "";
		for(let i = 0; i < ans.length; i++) {
			if(ans[i].predicate === "http://www.w3.org/ns/ui#label") {
				label = ans[i].object.value;
			}
			else if(ans[i].predicate === "http://janeirodigital.com/layout#readonly") {
				readonly = `readonly=${ans[i].object.value}`;
			}
		}
		return {
			label: label,
			readonly: readonly
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