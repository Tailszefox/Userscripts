// ==UserScript==
// @name            Wikipedia - Highlight language
// @match           https://en.wikipedia.org/wiki/*
// @match           https://fr.wikipedia.org/wiki/*
// @match           https://en.wiktionary.org/wiki/*
// @match           https://fr.wiktionary.org/wiki/*
// @version         1.1
// ==/UserScript==

(function() {
    const targetLang = location.hostname.startsWith('fr.') ? 'en' : 'fr';

    function highlightItem(item) {
        if (item.dataset.langHighlighted) return;
        item.dataset.langHighlighted = '1';
        item.style.cssText += 'background:rgb(0, 25, 100);border-radius:4px;';
        item.parentElement.prepend(item);
    }

    function tryHighlight(root) {
        const selector = `li[data-language-code="${targetLang}"]`;
        if (root.matches?.(selector)) highlightItem(root);
        root.querySelectorAll?.(selector).forEach(highlightItem);
    }

    // The language panel (ULS rewrite) is rendered on demand and can be
    // reopened, so watch persistently and highlight matching items as they
    // appear. The language code lives on the <li>, not the <a>.
    tryHighlight(document.body);

    new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node instanceof Element) tryHighlight(node);
            }
        }
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();