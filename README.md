# IBL/icgc
====

All you need is

	<script src="https://ibl.github.io/icgc/icgc.js"></script>

Live at: [http://ibl.github.io/icgc/](http://ibl.github.io/icgc/)

---

Experimenting with the possibility of having the [Web API](https://dcc.icgc.org/docs/) of the International Cancer Genome Consortium as a client side JavaScript library. Since the API is not [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) enabled, a [Google Script](https://script.google.com/d/1QW3tDb8y7g5fDaVY8lHkLoSO5p_LTfdXtDw4SOUhhLKifsm2W8dTm4Gv/edit) was implemented as a middle layer. The basic idea is to mimic the query syntax with objects constructed as

<i>
icgc.\<path\>( callbackFunction , { argument<sub>i</sub> : value<sub>i</sub> , ... } );
</i>

Many thanks to [ICGC](http://www.icgc.org/)'s [Portal](https://dcc.icgc.org/docs/) team - this is a great public service !

---

As detailed in ICGC (API documentation)[https://dcc.icgc.org/docs/], the operation of the portal web service is described by two elements, 1) a command and 2) a set of parameters, which are composed as a URL call:

		<base URL> / <API version> / <COMMAND> ? <PARAMETERS>

		for example, for the list of pathways involving P53 this would be

		https://dcc.icgc.org:443/api/v1/genes/ENSG00000141510?field=pathways

## .get

The icgc.js client object mediates this exchange by processing an object where the <COOMAND> information is defined by a .path attribute and all other attributes describe the parameters, for example 

		icgc.get({path:"genes/ENSG00000141510",field:"pathways"})

		or illustrating the use of a filter

		icgc.get({path:"genes/ENSG00000141510",filters:{"mutation":{"functionalImpact":{is:["High"]}},"donor":{"projectId":{is:["MALY-DE"]}}, "tumourStageAtDiagnosis":{"is":["III"]}}})

## .portal

A careful inspection of ICGC's (API documentation)[https://dcc.icgc.org/docs/] and the (example queries)[https://dcc.icgc.org/] will identfy a query syntax hat uses JSON.stringify for the values of the attrubutes of the input object. The resulting string can also be passed to the portal, for example,

		icgc.portal({path:"genes/ENSG00000141510",filters:{"mutation":{"functionalImpact":{is:["High"]}},"donor":{"projectId":{is:["MALY-DE"]}}, "tumourStageAtDiagnosis":{"is":["III"]}}})

		note however that the portal search is only reacting to the filters. Accordingly, this command will generate the same result as

		icgc.portal({filters:{"mutation":{"functionalImpact":{is:["High"]}},"donor":{"projectId":{is:["MALY-DE"]}}, "tumourStageAtDiagnosis":{"is":["III"]}}})

		



