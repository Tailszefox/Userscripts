// ==UserScript==
// @name             Webtoons - Fix comics
// @author           Tailszefox
// @match            https://www.webtoons.com/en/*/*/*/viewer?*
// @version          1.0
// ==/UserScript==

document.querySelectorAll("div#_imageList img").forEach((image) => {
    image.src = image.attributes["data-url"].value;
});

// Allow scrolling

// Select the node that will be observed for mutations
var targetNode = document.querySelector('body');

// Options for the observer (which mutations to observe)
var config = { attributes: true, attributeFilter: ['style'] };

// Callback function to execute when mutations are observed
var callback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'attributes') {
            if (targetNode.style.overflow === 'hidden') {
                targetNode.style.overflow = 'visible';
                document.getElementById("cmpwrapper").remove();
            }
        }
    }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);