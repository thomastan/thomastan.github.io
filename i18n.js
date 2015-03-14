var ie = -1;
if (navigator.appName == "Microsoft Internet Explorer") {
	var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	if (re.exec(navigator.userAgent) != null)
		ie = parseFloat(RegExp.$1);
}

/* Dates are hidden by CSS -- make all but the "Home" post's date visible */
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

/* Add translation to selection bar: option value is url, inner is language */
function i18n(locale, title) { // title used to generate url; no title, no link
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

/* Check meta tags for available translations and call function i18n() above */

var html = document.getElementsByTagName("html")[0];
var meta = document.getElementsByTagName("meta"), translationCount = 0;

/* When a translation is available: <meta lang="" translation="" title=""> */
for (var i = 0; i < meta.length; i++)
	if (meta[i].getAttribute("lang") && meta[i].getAttribute("translation")) {
		translationCount++;

		if (html)
			html.lang = meta[i].getAttribute("lang").toLowerCase();

		// Clear all <select> inners (options) from dropdown if page is a feed
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

		/* Generate translation options from meta tags */
		i18n(meta[i].getAttribute("lang").toLowerCase(), "");
		i18n(meta[i].getAttribute("translation"), meta[i].getAttribute("title"));
	}

if (translationCount == 0) // If no translations available, populate defaults
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
if (param.blog != undefined) { /* when in blog mode, not in homepage mode */
	if (param.blog != "false" && param.blog != "hide" && param.blog != "no")
		homepageMode = false;
}

/* find "home" post */
var post, home, foundHome = false;

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

// remove "home" post (if in blogroll mode) or every other post (homepage mode)
if (foundHome)
	if (!homepageMode)
		home.parentNode.removeChild(home); /* remove first post in blog roll */
	else {
		var parent = home.parentNode;
		var footer;

		while (parent.hasChildNodes()) { /* remove all posts, save footer */
			if (parent.firstChild.tagName && parent.firstChild.id == "footer")
				footer = parent.firstChild;

			parent.removeChild(parent.firstChild);
		}

		parent.appendChild(home);
		parent.appendChild(footer);

		/* Remove date of "home". */
		var divs = home.getElementsByTagName("div");
		for (var i = 0; i < divs.length; i++)
			if (divs[i].className && divs[i].className == "leftdate")
				divs[i].parentNode.removeChild(divs[i]);

		/* Center the "home" div. */
		home.className = "post home";

		// remove div class attributes within the home post ////////////////////
		for (var i = 0; i < divs.length; i++)
			if (divs[i].className && divs[i].className == "wrapper")
				divs[i].className = ""; ////////////////////////////////////////
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

	/* Remove formatting from "Contact" page while searching titles. */
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

if (entry) { // "entry" is the anchor tag (within a h3)
	var parent = entry.parentNode.parentNode.parentNode; // a <div> element
	if (parent.className == "content") // only in "Archive" listing
		if (parent.parentNode.className == "post archive") {
			var month = parent.parentNode;
			parent.parentNode.removeChild(parent); // remove "Home" single post
		}

	var count = 0;
	for (var i = 0; month && i < month.childNodes.length; i++)
		if (month.childNodes[i].tagName)
			if (month.childNodes[i].tagName.toLowerCase() == "div")
				count++;

	/* a single div within "post archive" div is Month subheading, remove it */
	if (count == 1 && month.className == "post archive")
		month.parentNode.removeChild(month);
}

/* Fix up pagination to first blog page. */
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

/* Allow to reduce the contrast for extended reading. */
var fromCookie = getFromCookie("contrast");
var contrast = fromCookie && fromCookie != "" ? fromCookie : "default";

function changeContrast() {
	contrast = contrast && contrast == "default" ? "dark" : "default";
	setContrast(contrast);
}

/* stylesheet tags: <link rel="[alternate ]stylesheet" href="" title=""> */
function setContrast(mode) {
	var link = document.getElementsByTagName("link");

	for (var i = 0; i < link.length; i++)
		if (link[i].rel.indexOf("stylesheet") != -1 && link[i].title)
			link[i].disabled = link[i].title == mode ? false : true;

	setInCookie("contrast", mode, 7 /* ttl days */, document.domain);
	contrast = mode;
}

function getFromCookie(key) {
	var value = document.cookie.match('[\s]*' + key + '=([^;]*)');
	return value && value[1] ? decodeURIComponent(value[1]) : "";
}

function setInCookie(key, value, ttl, domain) {
	var fromNow = new Date();
	fromNow.setTime(fromNow.getTime() + 1000 * 60 * 60 * 24 * ttl);

	cookieString = key + "=" + encodeURIComponent(value) + "; ";
	cookieString += "domain=" + domain + "; ";
	cookieString += "expires=" + fromNow.toGMTString();

	document.cookie = cookieString;
}

setContrast(contrast);
if (fromCookie === "dark")
	changeContrast(), changeContrast();


/* Keep some links local on thomastan.github.io */

var remote = "http://scriptogr.am/thomastan";
var local = "http://thomastan.github.io";
var tags = ["", "?blog"];
var paths = ["math", "compsci", "engineering", "skills", "contact"];
var paths2 = ["tag/code", "tag/math", "math#publication", "this-site"];

var links = document.getElementsByTagName("a");

for (var i = 0; i < links.length; i++) {
	for (var j = 0; j < paths.length; j++)
		if (links[i].href == remote + "/" + paths[j])
			links[i].href = local + "/" + paths[j];
	for (var j = 0; j < paths2.length; j++)
		if (links[i].href == remote + "/" + paths2[j])
			links[i].href = local + "/" + paths2[j];
	for (var j = 0; j < tags.length; j++)
		if (links[i].href == remote + tags[j])
			links[i].href = local + tags[j];
}
