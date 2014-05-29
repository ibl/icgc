# IBL/icgc
====

All you need is

	<script src="https://ibl.github.io/icgc/icgc.js"></script>

Live at: [http://ibl.github.io/icgc/](http://ibl.github.io/icgc/)

---

Experimenting with the possibility of having the [Web API](http://www.cbioportal.org/public-portal/web_api.jsp) of the International Cancer Genome Consortium as a client side JavaScript library. Since the API is not [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) enabled, a [Google Script](https://script.google.com/d/1QW3tDb8y7g5fDaVY8lHkLoSO5p_LTfdXtDw4SOUhhLKifsm2W8dTm4Gv/edit) was implemented as a middle layer. The basic idea is to mimic the query syntax with objects constructed as

<i>
cbio.\<cmd\>( callbackFunction , { argument<sub>i</sub> : value<sub>i</sub> , ... } );
</i>

Many thanks to [ICGC](http://www.mskcc.org/)'s [Portal](https://dcc.icgc.org/docs/) team - this is a great public service !

---
