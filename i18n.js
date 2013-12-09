var ie = -1;
if (navigator.appName == "Microsoft Internet Explorer") {
	var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	if (re.exec(navigator.userAgent) != null)
		ie = parseFloat(RegExp.$1);
}

var divs = document.getElementsByTagName("div");
for (var i = 0; i < divs.length; i++)
	if (divs[i].className && divs[i].className == "leftdate")
		divs[i].style.visibility = "visible";

function l10n(chosen) { /* choose an available translation */
	var selected = chosen.options[chosen.selectedIndex];
	if (!selected.value)
		return;
			
	if (selected.value.toLowerCase() != "en" && selected.value != "English")
		alert("Certaines sections de ce site, y compris cette page, sont disponibles en anglais seulement.");
		
	for (var i = 0; i < chosen.options.length; i++)
		if (chosen.options[i].innerHTML == "English")
			break;
	chosen.selectedIndex = i;
		
	/*
	if value
		goto url
	else
		show message
	*/
}
	
function i18n(locale, title) { /* add translation to selection bar */
	var span = document.getElementById("translator");
		
	if (!span)
		return;
			
	for (var i = 0; i < span.childNodes.length; i++)
		if (span.childNodes[i].tagName)
			if (span.childNodes[i].tagName.toLowerCase() == "select") {
				var link = document.createElement("option");
				var text = title != null ? title.replace(/ /g, "_") : "";
	
				link.innerHTML = L[locale.toLowerCase()];
				if (text != "")
					link.value = "../" + locale + "/" + text;
					
/*			span.childNodes[i].setAttribute("onchange", function(){alert(this.value);} );*/
				span.childNodes[i].appendChild(link);
			}
}
	
/* Check meta tags for available translations and call i18n() */
	
var html = document.getElementsByTagName("html")[0];
var meta = document.getElementsByTagName("meta"), translationCount = 0;
	
for (var i = 0; i < meta.length; i++)
	if (meta[i].getAttribute("lang") && meta[i].getAttribute("translation")) {
		translationCount++;
			
		if (html)
			html.lang = meta[i].getAttribute("lang").toLowerCase();
				
		if (meta[i].getAttribute("type"))
			if (meta[i].getAttribute("type") == "feed") {
				var span = document.getElementById("translator");
	
				for (var j = 0; span && j < span.childNodes.length; j++) {
					if (!span.childNodes[j].tagName)
						continue;
					if (span.childNodes[j].tagName.toLowerCase() == "select")
						while (span.childNodes[j].firstChild)
							span.childNodes[j].innerHTML = "";
				}
			}
			
		i18n(meta[i].getAttribute("lang").toLowerCase(), "");
		i18n(meta[i].getAttribute("translation"), meta[i].getAttribute("title"));
	}
	
if (translationCount == 0)
	for (var locale in L)
		i18n(locale, "");

/* Make get parameters accessible in JavaScript. */
var paramStr = window.location.search.substr(1);
var pairArray = paramStr.split("&");
var param = {};

for (var i = 0; i < pairArray.length; i++) {
	var pair = pairArray[i].split("=");
	param[pair[0]] = pair[1] ? pair[1] : "";
}

/* Support separate "home" page. */
var homepageMode = true;
if (param.blog != undefined) {
	if (param.blog != "false" && param.blog != "hide" && param.blog != "no")
		homepageMode = false;
}

/* find "home" post */
var post, home, foundHome = false, parent, footer, keepHidden;

for (var i = 0, post = divs[0]; i < divs.length; post = divs[++i])
	if (post.className == "post single" || post.className == "post permalink") {
		var meta = post.getElementsByTagName("meta");
		
		for (var j = 0; j < meta.length; j++)
			if (meta[j] && meta[j].getAttribute("post") == "home") {
				home = meta[j].parentNode.parentNode.parentNode;
				if (home.className.toLowerCase() == "post single")
					foundHome = true;
				else if (home.className.toLowerCase() == "post permalink")
					foundHome = true;
			}
	}

if (foundHome)
	if (!homepageMode)
		home.parentNode.removeChild(home);
	else {
		parent = home.parentNode;
		
		while (parent.hasChildNodes()) {
			if (parent.firstChild.tagName && parent.firstChild.id == "footer")
				footer = parent.firstChild;
			
			parent.removeChild(parent.firstChild);
		}
		
		parent.appendChild(home);
		parent.appendChild(footer);
		
		/* Remove date of "home" */
		var divs = home.getElementsByTagName("div");
		for (var i = 0; i < divs.length; i++)
			if (divs[i].className && divs[i].className == "leftdate")
				divs[i].parentNode.removeChild(divs[i]);
		
		/* Center the "home" div */
		home.className = "post home";

		// remove div classes
		for (var i = 0; i < divs.length; i++)
			if (divs[i].className && divs[i].className == "wrapper")
				divs[i].className = "";
	}

/* Remove "Home" entry from Archive */

var titles = document.getElementsByTagName("h3");

for (var i = 0; i < titles.length; i++) {
	/* Remove heading of "home" post */
	for (var j = 0; j < titles[i].childNodes.length; j++) {
		var node = titles[i].childNodes[j];
		if (node && node.tagName && node.tagName.toLowerCase() == "a")
			if (node.innerHTML == "Home" || node.innerHTML == "Accueil") {
				if (node.innerHTML == "Home")
					node.parentNode.innerHTML = "Hi there,";
				else if (node.innerHTML == "Accueil")
					node.parentNode.innerHTML = "Bienvenue";
				
				var entry = titles[i].childNodes[j];
			}
	}
	
	/* Remove formatting from "Contact" page */
	if (titles[i].innerHTML == "Math")
		titles[i].innerHTML = "Mathematics Research Project";
	else if (titles[i].innerHTML == "Contact") {
		node = titles[i].parentNode.getElementsByTagName("pre");
		for (var j = 0; j < node.length; j++)
			if (node[j]) {
				node[j].className = "inline-block";
				node[j].style.padding = "5px 15px";
				
				var code = node[j].getElementsByTagName("code");
				if (code) { // remove syntax highlighting
					span = code[0].getElementsByTagName("span");
	
					for (var j = 0; j < span.length; j++)
						span[j].className = "";
				}
			}
	}
}

if (entry) {
	var parent = entry.parentNode.parentNode.parentNode;
	if (parent.className == "content")
		if (parent.parentNode.className == "post archive") {
			var month = parent.parentNode;
			parent.parentNode.removeChild(parent);
		}
		
	var count = 0;
	for (var i = 0; month && i < month.childNodes.length; i++)
		if (month.childNodes[i].tagName)
			if (month.childNodes[i].tagName.toLowerCase() == "div")
				count++;
				
	if (count == 1 && month.className == "post archive")
		month.parentNode.removeChild(month);
}

/* Fix up pagination to first blog page */
var divs = document.getElementsByTagName("div");
var bad = ["thomastan/1", "thomastan/"];

for (var i = 0; i < divs.length; i++)
	if (divs[i].className && divs[i].className == "pagination") {
		var links = divs[i].getElementsByTagName("a");
		for (var j = 0; j < links.length; j++) {
			var a = links[j].href;
			
			for (var k = 0; k < bad.length; k++)
				if (a.length - a.lastIndexOf(bad[k]) == bad[k].length)
 					links[j].href = a.replace(bad[k], "thomastan?blog");
		}
		
		var items = divs[i].getElementsByTagName("li");
		for (var j = 0; j < items.length; j++)
			if (items[j].className && items[j].className == "next") {
				var br = document.createElement("br");
				var all = document.createElement("a");
				
				all.href = "http://scriptogr.am/thomastan/archive";
				all.innerText = "View all";
			
				items[j].parentNode.appendChild(br);
				items[j].parentNode.appendChild(all);
			}
	}

/* Fix up footnote divider */
for (var i = 0; i < divs.length; i++)
	if (divs[i].className && divs[i].className == "footnotes") {
		divs[i].style.marginTop = "3ex";
		divs[i].style.paddingTop = "1em";
		divs[i].style.borderTop = "1px solid #eee";
		
		var toRemove = divs[i].getElementsByTagName("hr");
		for (var j = 0; j < toRemove.length; j++)
			divs[i].removeChild(toRemove[j]);
		
		var ol = divs[i].getElementsByTagName("ol");
		
		// IE6 italic bug fix (putting raised p's inside width-restricted div's)
		for (var j = 0; ie != -1 && ie <= 6.0 && j < ol.length; j++) {
			var li = ol[j].getElementsByTagName("li");
			
			for (var k = 0; k < li.length; k++) {
				var ps = li[k].getElementsByTagName("p");
				
				for (var l = 0; l < ps.length; l++) {
					var newNode = document.createElement("div");
					newNode.innerHTML = ps[l].outerHTML;
					newNode.className = "citation";
					
					ps[l].parentNode.replaceChild(newNode, ps[l]);
				}
			}
		}
		
	}

/* Allow to reduce the contrast for extended reading */
var fromCookie = getFromCookie("contrast");
var contrast = fromCookie && fromCookie != "" ? fromCookie : "default";

function setContrast(mode) {
	mode = mode ? mode : contrast == "default" ? "dark" : "default";
	
	var link = document.getElementsByTagName("link");
	
	/*
	if (mode == "dark" && link.length == 5) {
		for (var j = 0; j < link.length; j++) {
			str = (link[j].title ? link[j].title : "") + ": ";
			str += link[j].disabled == true ? "disabled" : "enabled";
			if (link[j].title && link[j].title != "");
				alert(str);
		}
	}
	var toEnable = new Array();
	for (var i = 0; i < link.length; i++)
		if (link[i].rel.indexOf("stylesheet") != -1 && link[i].title) {
			link[i].disabled = link[i].title != mode ? true : false;
			if (link[i].disabled == false)
				alert("LINK " + link[i].title + " ENABLED");
			if (link[i].title == mode) {
				toEnable.push(i);
				alert("to enable at " + i);
				j = i;	
			}
		}
	*/
	
// 	var toDisable = new Array();
// 	for (var i = 0; i < link.length; i++)
// 		if (link[i].rel.indexOf("stylesheet") != -1 && link[i].title) {
// 			link[i].disabled = /*link[i].title != mode ?*/ false;
// 			if (link[i].title != mode) {
// 				toDisable.push(i);
// 				alert(i + " to disable");
// 			} else
// 				alert(i + " to keep");
// 		}
// 	
// 	for (var i = 0; i < link.length; i++)
// 		for (j in toDisable)
// 			if (i == j)
// 				link[i].disabled = true;
	
	setInCookie("contrast", mode, 7, "scriptogr.am");
	contrast = mode;
}

function getFromCookie(key) {
	var value = document.cookie.match('[\s]*' + key + '=([^;]*)');
	return value && value[1] ? decodeURIComponent(value[1]) : "";
}

function setInCookie(key, value, ttl, domain) {
	var fromNow = new Date();
	fromNow.setTime(fromNow.getTime() + 1000 * 60 * 60 * 24 * 7);

	cookieString = key + "=" + encodeURIComponent(value) + "; ";
	cookieString += "expires=" + fromNow.toGMTString() + "; ";
	cookieString += "path=/; domain=" + domain;
	
	document.cookie = cookieString;
}

setContrast(contrast);