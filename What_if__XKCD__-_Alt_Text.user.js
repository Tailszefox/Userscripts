// ==UserScript==
// @name        What if (XKCD) - Alt Text
// @author      Tailszefox
// @description Automatically shows alt-text for images on "What if?"
// @namespace   localhost
// @icon        https://i.imgur.com/Ls1FFQu.png
// @include     https://what-if.xkcd.com/*/
// @version     1
// @grant       none
// ==/UserScript==

for(i of document.getElementsByClassName("illustration"))
{
    var insertBeforeElement = i.nextSibling;
    var alt = i.title;

    var figure = document.createElement("figure");

    var caption = document.createElement("figcaption");
    caption.appendChild(document.createTextNode(alt));

    caption.style.width = "50%";
    caption.style.marginLeft = "auto";
    caption.style.marginRight = "auto";
    caption.style.fontSize = "smaller";
    caption.style.textAlign = "center";

    i.parentNode.insertBefore(figure, insertBeforeElement);
    figure.appendChild(i);
    figure.appendChild(caption);
}