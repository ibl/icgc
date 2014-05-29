icgc={};

icgc.hello = function(){
	console.log('icgc :-)');
	return false
}

icgc.uid=function(x){
	if(!x){x='UID'};
	return x+Math.random().toString().slice(2)
}

icgc.removeEl=function(id){
	document.getElementById(id).parentNode.removeChild(document.getElementById(id))
}

icgc.getScript = function (url,cb,er){ // load script / JSON
	var s = document.createElement('script');
	s.src=url;
	s.id = this.uid();
	if(!!cb){s.onload=cb}
	if(!!er){s.onerror=er}
	document.head.appendChild(s);
	setTimeout('document.head.removeChild(document.getElementById("'+s.id+'"));',30000); // is the waiting still needed ?
	return s.id;
}

icgc.get = function(cmd,fun,parms){ // submit command cmd to icgc WebAPI and process it through callback function fun
	if(!cmd){cmd='releases'}; // see http://www.icgcportal.org/public-portal/web_api.jsp for list of comands
	if(!fun){fun=function(x){console.log(x)}};
	if(!icgc.get.callbacks){icgc.get.callbacks={}};
	if(!icgc.get.cache){icgc.get.cache={}};
	var uid = this.uid('get');
	if(!parms){
		var Qparms="";
	} else {
		var Qparms="&";
		Qparms+=icgc.parms(parms);
	}
	this.get.callbacks[uid]={ // maybe this can be used as a cache to avoid repeating calls
		cmd:cmd,
		fun:function(x){icgc.get.cache[cmd+Qparms]=x;return fun(x)},
		t:Date.now()
	}
	if(!this.get.cache[cmd+Qparms]){ // this is not in the cache already
		this.getScript('https://script.google.com/macros/s/AKfycbxjJBbr6dXXJGCLsJ-KZ_NacYsaNY-EsQv5HUMYvI_Fq13DNblq/exec?cmd='+cmd+'&callback=icgc.get.callbacks.'+uid+'.fun'+Qparms);
	} else {
		icgc.get.callbacks[uid].fun(this.get.cache[cmd+Qparms]);
	}

	// proxy code at https://script.google.com/a/macros/mathbiol.org/d/17o5B1sXjmUEWRHG_6vHQhmz3qTMPCgpOvlX1kNvDQCkVcrH5ANsi2NrY/edit
	return uid;
}

icgc.parms = function(x){ // converts JSON formated parameters into URL call query arguments
	var y = '';
	for (var f in x){
		if(Array.isArray(x[f])){ // then turn them into a comma delimited string
			var xx = x[f][0];
			for (var i = 1 ; i<x[f].length ; i++){
				xx += ',' + x[f][i];
			}
			x[f]=xx;
		}
		y+=f+'='+x[f]+'&';
	}
	return encodeURI(y.slice(0,y.length-1));
}
