// ==UserScript==
// @name        archive.is - Add link to original URL
// @author      Tailszefox
// @namespace   localhost
// @description Add a direct link to the page saved
// @icon        https://i.imgur.com/7Gtrgrz.png
// @include     https://archive.is/*
// @version     1
// @grant       none
// ==/UserScript==

var toolsList = document.getElementById("DIVSHARE").parentNode;
var url = document.getElementsByName("q")[0].value;
var link = document.createElement("a");

link.appendChild(document.createTextNode("Direct link"));
link.href = url;
link.style.cssText = toolsList.firstChild.style.cssText;
link.style.marginRight = "5px";

toolsList.insertBefore(link, toolsList.firstChild);
