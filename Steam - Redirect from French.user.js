// ==UserScript==
// @name        Steam - Redirect from French
// @author      Tailszefox
// @description Redirect to page without language on Steam
// @match       https://store.steampowered.com/app/*/?l=french
// @match       https://store.steampowered.com/app/*/?l=french&cc=pl
// @match       https://store.steampowered.com/app/*/?l=french&curator_clanid=*
// @version     1.0
// ==/UserScript==

function removeParamAndRedirect(paramToRemove) {
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);

    params.delete(paramToRemove);

    url.search = params.toString();

    // Redirect to the new URL
    window.location.href = url.toString();
}

// Usage
removeParamAndRedirect('l');