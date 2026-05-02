// ==UserScript==
// @name             Reddit - Redirect from French
// @author           Tailszefox
// @match            https://www.reddit.com/r/*/comments/*?tl=fr
// @match            https://www.reddit.com/r/*/comments/*/fr/
// @version          1.0
// ==/UserScript==

// Function to remove the 'tl=fr' query string from the URL
function removeTlFrQuery() {
  const url = new URL(window.location.href);
  if (url.searchParams.has('tl') && url.searchParams.get('tl') === 'fr') {
    url.searchParams.delete('tl');
    window.location.replace(url.href);
  }
}

// Function to remove '/fr/' from the end of the URL path
function removeFrPath() {
  const url = new URL(window.location.href);
  const path = url.pathname;
  if (path.endsWith('/fr/')) {
    url.pathname = path.slice(0, -4); // Remove the last 4 characters
    window.location.replace(url.href);
  }
}

// Execute the functions
removeTlFrQuery();
removeFrPath();