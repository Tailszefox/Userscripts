// ==UserScript==
// @name           xkcd alt-text
// @namespace      localhost
// @description    Shows the alt-text and adds a link to explainxkcd
// @include        http://xkcd.com/
// @include        http://xkcd.com/*
// @include        https://xkcd.com/
// @include        https://xkcd.com/*
// @include        http://www.xkcd.com/
// @include        http://www.xkcd.com/*
// @include        https://www.xkcd.com/
// @include        https://www.xkcd.com/*
// @grant          none
// ==/UserScript==

var divComic = document.getElementById("comic");
var img = divComic.getElementsByTagName("img")[0];

alt = img.title;
var p = document.createElement("p");
p.appendChild(document.createTextNode(alt));

divComic.parentNode.insertBefore(p, divComic.nextSibling.nextSibling);

var titleDiv = document.getElementById('ctitle');

nmbr = document.getElementById('middleContainer');
start = nmbr.innerHTML.indexOf("Permanent link to this comic: https://xkcd.com/")+46;
end = nmbr.innerHTML.indexOf("Image URL (for hotlinking/embedding)")-6;
var comicNumber = nmbr.innerHTML.slice(start, end);

var aExplain = document.createElement("a");
aExplain.href = "http://www.explainxkcd.com/wiki/index.php" + comicNumber;
aExplain.appendChild(document.createTextNode("(Explain)"));

titleDiv.appendChild(document.createTextNode(" "));
titleDiv.appendChild(aExplain);