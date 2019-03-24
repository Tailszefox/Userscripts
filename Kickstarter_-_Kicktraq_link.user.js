// ==UserScript==
// @name        Kickstarter - Kicktraq link
// @author      Tailszefox
// @namespace   localhost
// @description Adds a Kicktraq link to Kickstarter projects
// @icon        https://i.imgur.com/cK0HSWf.png
// @include     https://www.kickstarter.com/projects/*
// @version     1.0
// @grant       none
// ==/UserScript==

window.addEventListener("load", function(){
    window.setTimeout(function(){
        // If the project is live
        if( document.querySelector("#main_content").className == "Campaign-state-live" )
        {
            var projectUrl = encodeURIComponent(window.location.href);

            var div = document.createElement("div");
            var link = document.createElement("a");
            div.appendChild(link);

            link.appendChild(document.createTextNode("View Kicktraq page"));
            link.href = "https://www.kicktraq.com/search/?find=" + projectUrl;
            div.style.marginTop = "20px";

            document.querySelectorAll("#react-project-header > div > div > div > div > div")[5].parentNode.insertBefore(div, null);
        }
    }, 5000);
});
