class InputGenerator {

    getParameters(id, ve, ans, min, max) {
        this.id = id;
        this.label = id;
        if(id.includes("-a")) {
            this.label = "a";
        }
        this.readonly = "";
        this.size = "";
        if(ans) {
            if(ans.label !== "") {
                this.label = ans.label;
            }
            this.readonly = ans.readonly;
            this.size = ans.size;
        }

        this.type = this.determineType(ve);
        this.facetas = this.getFacets(ve);
        this.required = "required";
        if(min === 0) {
            this.required="";
        }
        this.idDiv = "container-" + id;
        this.button = this.getAddButton(max);

    }

    /* 
    * id, ve (Value Expression/RefShape), ans (Annotations)
    */
    buildBasicInput(id, ve, ans, min, max) {

        this.getParameters(id, ve, ans, min, max);
        
        return `<label for="${this.id}">${this.label}:</label>` +
				`<div id="${this.idDiv}">
                <input type="${this.type}" id="${this.id}" name="${this.id}" 
                ${this.readonly} ${this.required} ${this.facetas} ${this.size}>
                ${this.button}</div>`;
			
    }

    buildSelectInput(id, ve, ans, min, max) {

        this.getParameters(id, ve, ans, min, max);

        let select = `<label for="${this.id}">${this.label}:</label>
                        <div id="${this.idDiv}">
                        <select id="${this.id}" name="${this.id}" ${this.required} ${this.size}>
                        <option></option>`;
        for(let i = 0; i < ve.values.length; i++) {
            let valor = ve.values[i].value ? ve.values[i].value : this.getPrefixedTerm(ve.values[i]);
            select += `<option value="${valor}">${valor}</option>`;
        }
        select += `</select>${this.button}</div>`;
        return select;
			
    }

    buildLangStringInput(id, ve, ans, min, max) {

        this.getParameters(id, ve, ans, min, max);
        
        return `<label for="${this.id}">${this.label}:</label>` +
                `<div id="${this.idDiv}" class="langstring-div">
                <div id="${this.id}">
                <input type="text" name="${this.id}" class="langstring-st" ${this.readonly} ${this.required} ${this.facetas}/>
                <input type="text" name="${this.id}-lg" value="en" class="langstring-lg" pattern="^[a-zA-Z]+(\-[a-zA-Z]+)?"></input>
                </div>
                ${this.button}</div>`;
			
    }

    determineType(ve) {
		if(ve.nodeKind === "iri") {
			return "url";
		}
		if(ve.datatype === "http://www.w3.org/2001/XMLSchema#integer" || ve.datatype === "http://www.w3.org/2001/XMLSchema#int") {
			return "number";
		}
		return "text";
	}
	
	getFacets(ve) {
		let fcs = "";
		if(ve.minlength) {
			fcs += `minlength=${ve.minlength}`
		}
		if(ve.maxlength) {
			fcs += ` maxlength=${ve.maxlength}`
		}
		if(ve.length) {
			fcs += ` minlength=${ve.length} maxlength=${ve.length}`
		}
		if(ve.minexclusive) {
			let mex = ve.minexclusive + 1;
			fcs += ` min=${mex}`
		}
		if(ve.mininclusive) {
			fcs += ` min=${ve.mininclusive}`
		}
		if(ve.maxexclusive) {
			let mex = ve.maxexclusive - 1;
			fcs += ` max=${mex}`
		}
		if(ve.maxinclusive) {
			fcs += ` max=${ve.maxinclusive}`
		}
		if(ve.pattern) {
			fcs += ` pattern=${ve.pattern}`
		}
		return fcs;
	}
	
	getAddButton(max) {
		if(!max || max === 1) {
			return "";
		}
		let button = `<a class="button newButton">+</a>`;
		return button;
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
module.exports = new InputGenerator();