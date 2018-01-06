// ==UserScript==
// @name        Kickstarter - Sidekick link
// @author      Tailszefox
// @namespace   localhost
// @description Adds a Sidekick link to Kickstarter projects
// @icon        https://i.imgur.com/cK0HSWf.png
// @include     https://www.kickstarter.com/projects/*
// @version     1
// @grant       none
// ==/UserScript==

window.addEventListener("load", function(){
    window.setTimeout(function(){
        // If the project is live
        if( document.querySelector("#main_content").className == "Campaign-state-live" )
        {
            var projectId = document.querySelector("data[itemprop='Project[comments_count]']").className.match(/Project([0-9]+)/);

            var div = document.createElement("div");
            var link = document.createElement("a");
            div.appendChild(link);

            link.appendChild(document.createTextNode("View Sidekick page"));
            link.href = "http://sidekick.epfl.ch/campaign/" + projectId[1] +  "-project";
            div.style.marginTop = "20px";

            document.querySelector(".NS_campaigns__stats").parentNode.insertBefore(div, null);
        }
    }, 5000);
});
