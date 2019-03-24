// ==UserScript==
// @name        archive.is - Add link to original URL
// @author      Tailszefox
// @namespace   localhost
// @description Add a direct link to the page saved
// @icon        https://i.imgur.com/7Gtrgrz.png
// @include     https://archive.is/*
// @version     1.0
// @grant       none
// ==/UserScript==

var toolsList = document.querySelector("#HEADER > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(1)");
var url = document.getElementsByName("q")[0].value;
var link = document.createElement("a");

link.appendChild(document.createTextNode("Direct link"));
link.href = url;
link.style.cssText = toolsList.firstChild.style.cssText;
link.style.marginRight = "5px";

toolsList.insertBefore(link, toolsList.firstChild);
