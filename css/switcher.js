/* Allow contrast changing to reduce the contrast for extended reading. */

var fromCookie = getFromCookie("contrast");
var contrast = fromCookie && fromCookie != "" ? fromCookie : "default";

function getFromCookie(key) {
	var value = document.cookie.match('[\s]*' + key + '=([^;]*)');
	return value && value[1] ? decodeURIComponent(value[1]) : "";
}

function changeContrast() {
	setContrast(contrast && contrast == "default" ? "dark" : "default");
}

/* stylesheet tags: <link rel="[alternate ]stylesheet" href="" title=""> */
function setContrast(mode) {
	var link = document.getElementsByTagName("link");

	for (var i = 0; i < link.length; i++)
		if (link[i].rel.indexOf("stylesheet") != -1 && link[i].title) {
			link[i].rel = (link[i].title == mode ? "" : "alternate ") + "stylesheet";
			link[i].disabled = (link[i].title == mode ? false : true);
		}

	setInCookie("contrast", mode, 7 /* ttl days */);
	contrast = mode;
	setHoverText();
}

function setInCookie(key, value, ttl) {
	var cookieString = "", fromNow = new Date();
	fromNow.setTime(fromNow.getTime() + 1000 * 60 * 60 * 24 * ttl);

	cookieString = key + "=" + encodeURIComponent(value) + "; ";
	cookieString += "domain=" + document.domain + "; path=/; ";
	cookieString += "expires=" + fromNow.toGMTString();

	document.cookie = cookieString;
}

function setHoverText() {
	var links = document.getElementsByTagName("a");
	for (var i = 0; i < links.length; i++) {
		if (links[i].className != "onright")
			continue;

		var imgs = links[i].getElementsByTagName("img");
		for (var j = 0; j < imgs.length; j++)
			if (imgs[j].title.endsWith("contrast"))
				if (contrast == "dark")
					imgs[j].title = "Increase contrast";
				else
					imgs[j].title = "Reduce contrast";
	}
}
