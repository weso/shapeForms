# shapeForms

This project can generate UI forms from [ShEx](http://shex.io) schemas. 

It takes annotations from the [UI ontology](http://www.w3.org/ns/ui#) which can, for example, customize labels.

## Functionality

Two functions are provided in order to build a form from a given Shape Expression.

### _shexToForm(shex)_
Takes as a parameter the Shape Expression to transform, as a String. Returns the HTML Form with the equivalent fields, as a String.

### _postProcess()_
Once the form HTML has been integrated in a page, this function looks for and assigns events to the elements which require it ("New", "Check" buttons)

A simple example of use:
```
let html = sf.shexToForm(text);
	
$("#resultform").html(html);

sf.postProcess();
```

## Adoption

The project has been deployed in [RDFShape](http://rdfshape.weso.es).

## Requirements/limitations

It is necessary to declare the start shape.

## Example

You can [try it in RDFShape](https://tinyurl.com/4dwwkctb)

```
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX vc: <http://www.w3.org/2006/vcard/ns#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX dc: <http://purl.org/dc/terms/>
PREFIX ui: <http://www.w3.org/ns/ui#>
PREFIX : <http://janeirodigital.com/layout#>
PREFIX solid: <http://www.w3.org/ns/solid/terms#>

start=@<#UserProfile>

<#UserProfile> {
  solid:webid IRI
    // ui:label "profile webid"
    // :readonly true ;
  vc:age xsd:int MinInclusive 18;
  :dni xsd:string Length 9;
  (   foaf:name xsd:string MinLength 2
    | foaf:givenName xsd:string ;
      foaf:familyName xsd:string
  )? ;
  vc:telephone IRI /^tel:\+?[0-9.-]/ + ;
  vc:hasAddress @<#vcard_street-address> * ;
  vc:organization-name xsd:string ?
    // ui:label "company" ;
  vc:someInt xsd:integer ;
} // ui:label "User Profile"

<#vcard_street-address> CLOSED {
  a [vc:Home vc:Postal] ?
    // ui:from vc:Type ;
  vc:street-address xsd:string ? // ui:label "street" ;
  (   vc:locality xsd:string ? ;
    | vc:region xsd:string ?
  ) ;
  vc:country-name @<#vcard_country-name>
    // ui:label "country" ;
  vc:postal-code xsd:string ?
} // ui:label "Address"

<#vcard_country-name> [
  "Afghanistan"
  "Belgium"
  "CR"
  "France"
  "日本"
  "United Kingdom"
  "United States"
  "Zimbabwe"
]
```
