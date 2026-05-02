// ==UserScript==
// @name        Patreon - YouTube link
// @author      Tailszefox
// @description Adds a link to YouTube videos on Patreon posts
// @match       https://www.patreon.com/posts/*
// @version     1.0
// @grant       none
// ==/UserScript==

function addAttachedUrl() {
    // Get the JSON object from the script tag
    const nextDataScript = document.querySelector("script#__NEXT_DATA__");
    let jsonData;
    if (nextDataScript) {
        jsonData = JSON.parse(nextDataScript.textContent);
    }

    let attachedUrl = null;

    if (jsonData.props.pageProps.bootstrapEnvelope.pageBootstrap.post.data.attributes.embed) {
        // Embed available
        attachedUrl = jsonData.props.pageProps.bootstrapEnvelope.pageBootstrap.post.data.attributes.embed.url;
    } else if (jsonData.props.pageProps.bootstrapEnvelope.pageBootstrap.post.data.attributes.post_file) {
        // Attached file available
        attachedUrl = jsonData.props.pageProps.bootstrapEnvelope.pageBootstrap.post.data.attributes.post_file.url;
    }

    if (attachedUrl !== null) {
        let divLink = document.createElement("div");
        divLink.style.margin = "5px";

        let aLink = document.createElement("a");
        aLink.href = attachedUrl;

        let txtNode = document.createTextNode(attachedUrl);
        aLink.appendChild(txtNode);
        divLink.appendChild(aLink);

        let insertNode = document.querySelector("h1[data-tag='post-title']").parentElement.parentElement.parentElement.parentElement;
        insertNode.parentNode.insertBefore(divLink, insertNode);
    }
}

window.setTimeout(addAttachedUrl, 5000);