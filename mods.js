// 1. Increase side margins of the "home" post's <div>.
var divs = document.getElementsByTagName("div");
for (var i = 0, post = divs[0]; i < divs.length; post = divs[++i])
	if (post.className == "post page") {
		var meta = post.getElementsByTagName("meta");

		for (var j = 0; j < meta.length; j++)
			if (meta[j] && meta[j].getAttribute("post") == "home") {
				var home = meta[j].parentNode.parentNode;
				if (home.className.toLowerCase() == "post page")
					home.className = "post home";
			}
	}


// 2 (a). Tag all <pre> tags with a className for google code prettify.
var blocks = document.getElementsByTagName("pre");
for (var i = 0; i < blocks.length; i++)
	if (blocks[i].className.indexOf("prettyprint") == -1)
		if (blocks[i].className.length == 0)
			blocks[i].className = "prettyprint";
		else
			blocks[i].className = "prettyprint " + blocks[i].className;
prettyPrint();


// 2 (b). Add mode=display to the type attribute in <script> tags generated by
//  kramdown from '$$'-surrounded math to show displaymath within paragraphs.
var scripts = document.getElementsByTagName("script");
for (var i = 0; i < scripts.length; i++)
	if (scripts[i].type && scripts[i].type === "math/tex")
		scripts[i].type = "math/tex; mode=display";


// 3. Rename title of Home/Math "posts", scripted so browser titles remain the same
var titles = document.getElementsByTagName("h3");
for (var i = 0; i < titles.length; i++)
	if (titles[i].innerHTML == "Home" || titles[i].innerHTML == "Accueil") {
		if (titles[i].innerHTML == "Home")
			titles[i].innerHTML = "Hi there,";
		else if (node.innerHTML == "Accueil")
			titles[i].innerHTML = "Bienvenue";
	} else if (titles[i].innerHTML == "Math") {
		titles[i].innerHTML = "Mathematics Research Project";
	} else if (titles[i].innerHTML == "Contact") { // remove syntax highlighting
		node = titles[i].parentNode.getElementsByTagName("pre");
		for (var j = 0; j < node.length; j++)
			if (node[j]) {
				node[j].className = "inline-block";
				node[j].style.padding = "5px 15px";

				var code = node[j].getElementsByTagName("code");
				if (code) {
					span = code[0].getElementsByTagName("span");

					for (var j = 0; j < span.length; j++)
						span[j].className = "";
				}
			}
	}


// 4. Move "Continue reading..." links above their footnotes
var links = document.getElementsByTagName("p");
for (var i = 0; i < links.length; i++)
	if (links[i].className)
		if (links[i].className.toLowerCase() == "read-more") {
			var toMove = links[i];
			var divs = toMove.parentNode.getElementsByTagName("div");
			for (var j = 0; j < divs.length; j++)
				if (divs[j].className && divs[j].className == "footnotes") {
					toMove.parentNode.removeChild(toMove);
					divs[j].parentNode.insertBefore(toMove, divs[j]);
					toMove.style.paddingTop = "15px";
				}
		}