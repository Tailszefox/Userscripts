// ==UserScript==
// @name        Twitter - Expand video
// @author      Tailszefox
// @namespace   localhost
// @description Ability to expand the current video on Twitter
// @include     https://twitter.com/*/status/*
// @version     1.0
// @grant       none
// @inject-into auto
// @run-at      document-idle
// ==/UserScript==

window.setTimeout(function() {
  console.log(document.querySelectorAll("video").length);
  if ( document.querySelectorAll("video").length > 0)
  {
    var buttonSpan = document.createElement("span");
    buttonSpan.style.cssText = "position: relative; top: 10px; cursor: pointer;";
    var buttonText = document.createTextNode("Expand");
    buttonSpan.append(buttonText);
    document.querySelector(".permalink-tweet").appendChild(buttonSpan);

    buttonSpan.addEventListener('click', function(e) {
      document.querySelector("#permalink-overlay-dialog").style.cssText = "left: 0%; margin-left: 0px; width: 100%;";
      document.querySelector(".permalink-container").style.width = "100%";
      document.querySelector(".is-video").style.cssText = "max-width: none; max-height: 900px;";
      document.querySelector(".AdaptiveMedia-video").style.cssText = "width: 100%;";
      document.querySelector(".PlayableMedia-reactWrapper").style.cssText = "height: 900px;";
    }, true);
  }
}, 5000);