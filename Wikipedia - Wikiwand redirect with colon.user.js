// ==UserScript==
// @name             Wikipedia - Wikiwand redirect with colon
// @author           Tailszefox
// @match            https://en.wikipedia.org/wiki/*:*
// @exclude          https://en.wikipedia.org/wiki/Special:Search?*
// @exclude          https://en.wikipedia.org/wiki/*?oldformat=true
// @match            https://fr.wikipedia.org/wiki/*:*
// @exclude          https://fr.wikipedia.org/wiki/Special:Search?*
// @exclude          https://fr.wikipedia.org/wiki/*?oldformat=true
// @version          1.0
// ==/UserScript==

function extractWikipediaInfo() {
    try {
        const urlObj = new URL(window.location.href);
        const hostnameParts = urlObj.hostname.split('.');

        // Extract language from the subdomain (first part of hostname)
        const language = hostnameParts[0];

        // Extract the page name from the pathname and encode it
        const pathParts = urlObj.pathname.split('/');
        const pageName = pathParts[pathParts.length - 1].replace(":", "%3A");

        // Redirect to Wikiwand equivalent page
        const wikiwandUrl = `https://www.wikiwand.com/${language}/articles/${pageName}`;
        window.location.href = wikiwandUrl;

    } catch (error) {
        console.error('Invalid URL:', error);
        return null;
    }
}

// Example usage
extractWikipediaInfo();