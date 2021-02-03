# shapeForms
Creating UI forms from ShEx

Shape Start is required.

Initial Trial Shape:
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
  (   foaf:name xsd:string MinLength 2
    | foaf:givenName xsd:string ;
      foaf:familyName xsd:string
  )? ;
  vc:telephone IRI /^tel:\+?[0-9.-]/ ? ;
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
  vc:country-name @<#vcard_country-name> ?
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
