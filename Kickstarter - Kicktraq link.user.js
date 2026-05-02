// ==UserScript==
// @name        Kickstarter - Kicktraq link
// @author      Tailszefox
// @description Adds a Kicktraq link to Kickstarter projects
// @match       https://www.kickstarter.com/projects/*
// @version     1.0
// @grant       none
// ==/UserScript==

window.setTimeout(function() {
    let projectUrl = encodeURIComponent(window.location.href);

    let div = document.createElement("div");
    let link = document.createElement("a");
    div.appendChild(link);

    link.appendChild(document.createTextNode("View Kicktraq page"));
    link.href = "https://www.kicktraq.com/search/?find=" + projectUrl;
    div.style.marginTop = "20px";

    // If the project is live
    if (document.querySelector("#main_content").className === "Campaign-state-live") {
        document.querySelectorAll("#react-project-header > div > div > div > div > div")[5].parentNode.insertBefore(div, null);
    }
    else {
        document.querySelectorAll(".project-profile__content > div > div > div > div > div")[6].parentNode.insertBefore(div, null);
    }
}, 5000);