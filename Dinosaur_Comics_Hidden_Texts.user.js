// ==UserScript==
// @name        Dinosaur Comics Hidden Texts
// @author      Tailszefox
// @namespace   localhost
// @description Shows Dinosaur Comics hidden texts
// @icon        https://i.imgur.com/zRYAVvw.png
// @include     http://www.qwantz.com/index.php?comic=*
// @include     http://www.qwantz.com/index.php
// @include     http://qwantz.com/index.php
// @include     http://qwantz.com/
// @version     1.0
// @grant       none
// ==/UserScript==

div = document.createElement("div");

pAlt = document.createElement("p");
pEmail = document.createElement("p");
pRss = document.createElement("p");

iAlt = document.createElement("i");
iEmail = document.createElement("i");
iRss = document.createElement("i");

pAlt.appendChild(iAlt);
pEmail.appendChild(iEmail);
pRss.appendChild(iRss);

iAlt.appendChild(document.createTextNode("Alt text: "));
iEmail.appendChild(document.createTextNode("Email subject: "));
iRss.appendChild(document.createTextNode("RSS title: "));

mailTo = document.querySelector(".topnav > li:nth-child(5) > a:nth-child(1)").getAttribute("href").replace("mailto:ryan@qwantz.com?subject=", "");
rssTitle = document.getElementsByTagName("table")[0].parentNode.nextSibling.data.replace(" <span class=\"rss-title\">", "").replace("</span>", "");

pAlt.appendChild(document.createTextNode(document.getElementsByClassName("comic")[0].getAttribute("title")));
pEmail.appendChild(document.createTextNode(mailTo));
pRss.appendChild(document.createTextNode(rssTitle));

headerText = document.querySelector("body > center");

div.appendChild(pAlt);
div.appendChild(pEmail);
div.appendChild(pRss);

headerText.appendChild(div);
