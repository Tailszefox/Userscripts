// ==UserScript==
// @name             Allociné - Scroll to video
// @author           Tailszefox
// @match            https://www.allocine.fr/video/video-*/
// @version          1.0
// ==/UserScript==

function scrollToVideo() {
    window.scrollTo(0, 193);
}

window.setTimeout(scrollToVideo, 5000);