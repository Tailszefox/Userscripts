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
        if( document.querySelectorAll("#button-back-this-proj").length > 0 )
        {
            var projectId = document.querySelector("#watching-widget").children[0].className.match(/Project([0-9]+)/);

            var div = document.createElement("div");
            var link = document.createElement("a");
            div.appendChild(link);

            link.appendChild(document.createTextNode("View Sidekick page"));
            link.href = "http://sidekick.epfl.ch/campaign/" + projectId[1] +  "-project";
            div.style.marginTop = "20px";

            document.querySelector(".NS_campaigns__stats").parentNode.insertBefore(div, null);
        }
});