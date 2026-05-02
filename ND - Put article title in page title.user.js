// ==UserScript==
// @name             ND - Put article title in page title
// @match            https://www.nintendo-difference.com/news/*
// @match            https://www.nintendo-difference.com/test/*
// @version          1.0
// @author           Tailszefox
// ==/UserScript==

let articleTitle = document.querySelector("h1.title-news").textContent;

if (articleTitle.length > 100) {
    let lastSpace = articleTitle.substring(0, 100).lastIndexOf(" ");
    articleTitle = articleTitle.substring(0, lastSpace) + "...";
}

document.title = articleTitle + " - " + document.title;