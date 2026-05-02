// ==UserScript==
// @name           Oglaf - Display alt-text
// @author         Tailszefox
// @description    Shows the alt-text
// @version        1.0
// @match          https://www.oglaf.com/*
// @grant          none
// ==/UserScript==

window.setTimeout(() => {
    let img = document.getElementById("strip");

    let alt = img.title;
    let p = document.createElement("p");

    p.style.margin = "0px";
    p.style.backgroundColor = "#ccc";
    p.style.paddingLeft = "15px";
    p.style.paddingTop = "10px";
    p.appendChild(document.createTextNode(alt));

    img.parentNode.parentNode.nextElementSibling.appendChild(p);
}, 1000);