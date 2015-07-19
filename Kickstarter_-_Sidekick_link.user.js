// ==UserScript==
// @name        Kickstarter - Sidekick link
// @namespace   localhost
// @description Adds a Sidekick link to Kickstarter projects
// @include     https://www.kickstarter.com/projects/*
// @version     1
// @grant       none
// ==/UserScript==

window.addEventListener("load", function(){
        // If the project is live
        if(document.querySelector("#main_content").className.indexOf("Project-state-live") > -1)
        {
            var projectId = document.querySelector("#main_content").className.match(/Project([0-9]+)/);

            var div = document.createElement("div");
            var link = document.createElement("a");
            div.appendChild(link);

            link.appendChild(document.createTextNode("View Sidekick page"));
            link.href = "http://sidekick.epfl.ch/campaign/" + projectId[1] +  "-project";
            div.style.marginBottom = "40px";

            document.querySelector(".NS_projects__deadline_copy").parentNode.insertBefore(div, document.querySelector(".NS_projects__deadline_copy"));
        }
});