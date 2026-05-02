// ==UserScript==
// @name        Dinosaur Comics - Hidden Texts + Dark Mode
// @author      Tailszefox
// @description Shows Dinosaur Comics hidden texts
// @match       https://www.qwantz.com/index.php?comic=*
// @match       https://www.qwantz.com/index.php
// @match       https://www.qwantz.com/
// @match       https://qwantz.com/index.php?comic=*
// @match       https://qwantz.com/index.php
// @match       https://qwantz.com/
// @version     1.0
// ==/UserScript==

let div = document.createElement("div");

let pAlt = document.createElement("p");
let pEmail = document.createElement("p");
let pRss = document.createElement("p");

let iAlt = document.createElement("i");
let iEmail = document.createElement("i");
let iRss = document.createElement("i");

pAlt.appendChild(iAlt);
pEmail.appendChild(iEmail);
pRss.appendChild(iRss);

iAlt.appendChild(document.createTextNode("Alt text: "));
iEmail.appendChild(document.createTextNode("Email subject: "));
iRss.appendChild(document.createTextNode("RSS title: "));

let mailTo = document.querySelector(".topnav > li:nth-child(5) > a:nth-child(1)").getAttribute("href").replace("mailto:ryan@qwantz.com?subject=", "");
let rssTitle = document.getElementsByTagName("table")[0].parentNode.nextSibling.data.replace(" <span class=\"rss-title\">", "").replace("</span>", "");

pAlt.appendChild(document.createTextNode(document.getElementsByClassName("comic")[0].getAttribute("title")));
pEmail.appendChild(document.createTextNode(mailTo));
pRss.appendChild(document.createTextNode(rssTitle));

let headerText = document.querySelector("body > center");

div.appendChild(pAlt);
div.appendChild(pEmail);
div.appendChild(pRss);

div.style.margin = "20px 50px 250px 50px";

headerText.appendChild(div);

function comicDarkMode(comic) {
    let canvas = document.createElement('canvas');
    canvas.setAttribute('width', comic.width);
    canvas.setAttribute('height', comic.height);

    comic.parentNode.insertBefore(canvas, comic);

    let context = canvas.getContext('2d');
    context.drawImage(comic, 0, 0);

    let imageData = context.getImageData(0, 0, comic.width, comic.height);
    let colorDiff = 60;

    for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i] <= colorDiff && imageData.data[i + 1] <= colorDiff && imageData.data[i + 2] <= colorDiff) {
            imageData.data[i] = 217 - imageData.data[i];
            imageData.data[i + 1] = 217 - imageData.data[i + 1];
            imageData.data[i + 2] = 217 - imageData.data[i + 2];
        } else if (imageData.data[i] >= (255 - colorDiff) && imageData.data[i + 1] >= (255 - colorDiff) && imageData.data[i + 2] >= (255 - colorDiff)) {
            imageData.data[i] = (255 - imageData.data[i]) + 26;
            imageData.data[i + 1] = (255 - imageData.data[i + 1]) + 26;
            imageData.data[i + 2] = (255 - imageData.data[i + 2]) + 26;
        }
    }

    context.putImageData(imageData, 0, 0);

    comic.style.display = "none";
    canvas.style.cursor = "pointer";

    canvas.addEventListener("click", function() {
        canvas.style.display = "none";
        comic.style.display = "";
    });

    comic.addEventListener("click", function() {
        canvas.style.display = "";
        comic.style.display = "none";
    });
}

let comic = document.querySelector("img.comic");

if (comic.complete) {
    comicDarkMode(comic);
} else {
    comic.addEventListener("load", function() {
        comicDarkMode(comic);
    });
}