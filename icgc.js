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

icgc.get = function(x,fun){ // submit command path to icgc WebAPI and process it through callback function fun
	if(!x){x={path:'releases'}};
	var path = x.path;
	delete x.path;
	if(!fun){fun=function(x){console.log(x)}};
	if(!icgc.get.callbacks){icgc.get.callbacks={}};
	if(!icgc.get.cache){icgc.get.cache={}};
	var uid = this.uid('get');
	var Qparms="&"+icgc.parms(x);
	this.get.callbacks[uid]={ // this can be used as a cache to avoid repeating calls
		path:path,
		fun:function(x){icgc.get.cache[path+Qparms]=x;return fun(x)},
		t:Date.now()
	}
	if(!this.get.cache[path+Qparms]){ // this is not in the cache already
		var url='https://script.google.com/macros/s/AKfycbxjJBbr6dXXJGCLsJ-KZ_NacYsaNY-EsQv5HUMYvI_Fq13DNblq/exec?path='+path+'&callback=icgc.get.callbacks.'+uid+'.fun'+Qparms;
		console.log(url);
		this.getScript(url);
	} else {
		icgc.get.callbacks[uid].fun(this.get.cache[path+Qparms]);
	}

	// proxy code at https://script.google.com/a/macros/mathbiol.org/d/17o5B1sXjmUEWRHG_6vHQhmz3qTMPCgpOvlX1kNvDQCkVcrH5ANsi2NrY/edit
	return uid;
}

icgc.parms = function(x){ // converts JSON formated parameters into URL call query arguments
	var y = '';
	for (var f in x){
		if(typeof(x[f])=="object"){x[f]=JSON.stringify(x[f])};
		y+=f+'='+x[f]+'&';
	}
	return encodeURI(y.slice(0,y.length-1));
}

icgc.getUrl=function(x){ // generates the URL to ICGC's service, the same used by the Google AppScript proxy
	if(!x){x={path:'releases'}};
	var path = x.path;
	delete x.path;
	queryString = icgc.parms(x);
	return "https://dcc.icgc.org/api/v1/"+path+"?"+queryString;
}

icgc.openUrl = function(url,op){
	switch(op){
	case undefined:
		break; // move on
	case 1: // open in a new window
		window.open(url);
		break;
	case 2: // open in new iframe 
		4
		break;
	default: // treating op as the parent DOM element
		if(typeof(op)=="object"){var parentEl = op}
		else { // op is the id of the parent DOM element
			var parentEl = document.getElementById(op);
			if(!parentEl){ // if not found create it and drop it in the body
				var parentEl = document.createElement('div');
				document.body.appendChild(parentEl);
			}
		}
		var div = document.createElement('div');
		div.id=icgc.uid();
		//div.innerHTML='<a href="'+url+'" target=_blank>Open</a> in new window; <button style="color:red" onclick="icgc.removeEl(\''+div.id+'\')">Remove</button>';
		div.innerHTML='<button onclick="window.open(\''+url+'\');" style="color:blue">Open</button> in new window; <button style="color:red" onclick="icgc.removeEl(\''+div.id+'\')">Remove</button>';
		parentEl.appendChild(div);
		var ifr = document.createElement('iframe');
		div.appendChild(ifr);ifr.width="100%";ifr.height="100%";
		ifr.src=url;
	}
	return false;
}

icgc.portal=function(x,id,s){ // open UI to icgc portal with filter, note s which can be "m" or "g" depending on the target representation being for genes or mutation
	if(!s){var s = ""} else { s="/"+s }
	if(!id){id=this.uid('portal')}
	var url = "https://dcc.icgc.org/search"+s+"?"+icgc.parms(x);
	if(!!id){
		icgc.openUrl(url,id);
	}
	return url;
}
