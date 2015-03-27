/* Make get parameters accessible in JavaScript. */
// var paramStr = window.location.search.substr(1);
// var pairArray = paramStr.split("&");
// var param = {};

// for (var i = 0; i < pairArray.length; i++) {
// 	var pair = pairArray[i].split("=");
// 	param[pair[0]] = pair[1] ? pair[1] : "";
// }

/* Make page i18n aware */
var languages = {
	"en": "English", "fr-ca": "Français canadien"
};

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
				var text = title != null ? title.replace(/ /g, '-') : "";

				if (text != "")
					link.value = "../" + locale + "/" + text;
				link.innerHTML = languages[locale.toLowerCase()];

			//	span.childNodes[i].setAttribute("onchange", function(){alert(this.value);} );
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
		i18n(meta[i].getAttribute("lang").toLowerCase(), ""); // no link for orig lang
		i18n(meta[i].getAttribute("translation"), meta[i].getAttribute("title"));
	}

if (translationCount == 0) // If no translations available, populate defaults
	for (var locale in languages)
		i18n(locale, "");



/* Fix up footnote divider */

var ie = -1;
if (navigator.appName == "Microsoft Internet Explorer") {
	var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	if (re.exec(navigator.userAgent) != null)
		ie = parseFloat(RegExp.$1);
}

var divs = document.getElementsByTagName("div");
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
