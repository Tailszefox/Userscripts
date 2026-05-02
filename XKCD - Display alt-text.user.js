// ==UserScript==
// @name           XKCD - Display alt-text
// @author         Tailszefox
// @description    Shows the alt-text and adds a link to explainxkcd
// @version        1.1
// @match          https://xkcd.com/*
// @match          https://www.xkcd.com/*
// @grant          none
// ==/UserScript==

window.setTimeout(() => {
    let divComic = document.getElementById("comic");
    let img = divComic.querySelector("img");

    let alt = img.title;
    let p = document.createElement("p");
    p.appendChild(document.createTextNode(alt));

    divComic.parentNode.insertBefore(p, divComic.nextSibling.nextSibling);

    let titleDiv = document.getElementById('ctitle');

    let comicNumber = document.querySelector('#middleContainer a[href*="https://xkcd.com/"]').attributes.href.textContent.split("/").slice(-1)[0];

    let aExplain = document.createElement("a");
    aExplain.href = "http://www.explainxkcd.com/wiki/index.php/" + comicNumber;
    aExplain.appendChild(document.createTextNode("(Explain)"));

    titleDiv.appendChild(document.createTextNode(" "));
    titleDiv.appendChild(aExplain);
}, 1000);